import { getInstrument, roundToLot } from "./market-data";
import { buildEquity, computeStats } from "./stats";
import { computeIndicators, vectorSignals } from "./strategies";
import type {
  BacktestConfig,
  BacktestResult,
  Bar,
  DryRunSnapshot,
  EngineEvent,
  FillOn,
  Instrument,
  PositionSnap,
  SignalMark,
  Trade,
  WorkingOrder,
} from "./types";

type LiveOrder = {
  id: string;
  side: "BUY" | "SELL";
  type: "MARKET" | "LIMIT";
  qty: number;
  limitPrice?: number;
  status: "SUBMITTED" | "ACCEPTED" | "WORKING" | "FILLED" | "CANCELLED" | "REJECTED";
  reason: string;
  submittedAt: number;
  submitIndex: number;
};

/**
 * NautilusTrader-style event engine:
 * clock → bar → strategy intent → matching (next-open market, touch limits) →
 * portfolio mark-to-market. Same fill model for historical backtest and dry-run.
 */
export class NautilusEngine {
  readonly config: BacktestConfig;
  readonly bars: Bar[];
  readonly inst: Instrument;
  readonly book: ReturnType<typeof computeIndicators>;
  private readonly want: Int8Array;

  private i = -1;
  private cash: number;
  private qty = 0;
  private avg = 0;
  private realized = 0;
  private seq = 1;
  private evtSeq = 1;
  private orders: LiveOrder[] = [];
  private trades: Trade[] = [];
  private events: EngineEvent[] = [];
  private signals: SignalMark[] = [];
  private equity: Float64Array;
  private cashArr: Float64Array;
  private posArr: Float64Array;
  private autoStrategy: boolean;
  private t0 = 0;
  readonly fillOn: FillOn;

  constructor(config: BacktestConfig, bars: Bar[], opts?: { autoStrategy?: boolean }) {
    this.config = config;
    this.bars = bars;
    this.inst = getInstrument(config.instrumentId);
    this.book = computeIndicators(bars, config.strategyId, config.params);
    this.want = vectorSignals(bars, config.strategyId, config.params, this.book).want;
    this.cash = config.capital;
    this.autoStrategy = opts?.autoStrategy ?? true;
    this.fillOn = config.fillOn;
    this.equity = new Float64Array(bars.length);
    this.cashArr = new Float64Array(bars.length);
    this.posArr = new Float64Array(bars.length);
    this.t0 = performance.now();
    this.log(bars[0]?.t ?? 0, "AccountState", `Capital ${config.capital.toFixed(0)} armed.`, "info");
  }

  get index() {
    return this.i;
  }

  get done() {
    return this.i >= this.bars.length - 1;
  }

  submitMarket(side: "BUY" | "SELL", qty: number, reason: string) {
    const q = roundToLot(Math.abs(qty), this.inst.lotSize);
    if (q < this.inst.lotSize) {
      this.log(this.stamp(), "OrderRejected", "Qty below lot size.", "risk");
      return;
    }
    this.orders.push({
      id: `O-${this.seq++}`,
      side,
      type: "MARKET",
      qty: q,
      status: "SUBMITTED",
      reason,
      submittedAt: this.stamp(),
      submitIndex: Math.max(this.i, 0),
    });
    this.log(this.stamp(), "OrderSubmitted", `${side} MKT ${q} ${this.inst.symbol} · ${reason}`, "order");
  }

  submitLimit(side: "BUY" | "SELL", qty: number, limitPrice: number, reason: string) {
    const q = roundToLot(Math.abs(qty), this.inst.lotSize);
    if (q < this.inst.lotSize) return;
    this.orders.push({
      id: `O-${this.seq++}`,
      side,
      type: "LIMIT",
      qty: q,
      limitPrice,
      status: "WORKING",
      reason,
      submittedAt: this.stamp(),
      submitIndex: Math.max(this.i, 0),
    });
    this.log(
      this.stamp(),
      "OrderAccepted",
      `${side} LMT ${q} @ ${limitPrice} ${this.inst.symbol}`,
      "order",
    );
  }

  flattenNow(reason = "flatten") {
    if (Math.abs(this.qty) < this.inst.lotSize / 2) return;
    const idx = Math.max(this.i, 0);
    const bar = this.bars[idx];
    if (!bar) return;
    const side = this.qty > 0 ? "SELL" : "BUY";
    const o: LiveOrder = {
      id: `O-${this.seq++}`,
      side,
      type: "MARKET",
      qty: Math.abs(this.qty),
      status: "ACCEPTED",
      reason,
      submittedAt: bar.t,
      submitIndex: idx - 1,
    };
    const feeR = this.config.feeBps / 10_000;
    this.fill(o, bar.c, bar, feeR);
    this.mark(bar);
  }

  cancelAll() {
    for (const o of this.orders) {
      if (o.status === "WORKING" || o.status === "SUBMITTED" || o.status === "ACCEPTED") {
        o.status = "CANCELLED";
        this.log(this.stamp(), "OrderCancelled", o.id, "order");
      }
    }
  }

  step(): boolean {
    if (this.i >= this.bars.length - 1) return false;
    this.i += 1;
    const bar = this.bars[this.i]!;
    this.match(bar);
    if (this.autoStrategy) this.runStrategy(bar);
    this.mark(bar);
    return this.i < this.bars.length - 1;
  }

  runAll(): BacktestResult {
    while (this.step()) {
      /* clock */
    }
    if (Math.abs(this.qty) >= this.inst.lotSize / 2) {
      this.flattenNow("eod-flatten");
    }
    return this.toResult();
  }

  toResult(): BacktestResult {
    const used = this.i >= 0 ? this.i + 1 : 0;
    const bars = this.bars.slice(0, Math.max(used, 0));
    const equityPts = buildEquity(
      bars,
      this.equity.subarray(0, bars.length),
      this.cashArr.subarray(0, bars.length),
      this.posArr.subarray(0, bars.length),
    );
    const stats = computeStats(
      this.config.capital,
      this.inst,
      this.config.timeframe,
      bars,
      equityPts,
      this.trades,
    );
    return {
      engine: "nautilus",
      instrumentId: this.config.instrumentId,
      strategyId: this.config.strategyId,
      timeframe: this.config.timeframe,
      bars,
      equity: equityPts,
      trades: this.trades.slice(),
      events: this.events.slice(),
      stats,
      signals: this.signals.slice(),
      indicators: this.book,
      runtimeMs: performance.now() - this.t0,
      fillOn: this.config.fillOn,
    };
  }

  snapshot(): DryRunSnapshot {
    const bar = this.i >= 0 ? this.bars[this.i]! : null;
    const mark = bar?.c ?? 0;
    const unrealized = this.qty * (mark - this.avg);
    const used = this.i >= 0 ? this.i + 1 : 0;
    const bars = this.bars.slice(0, used);
    const equityPts = buildEquity(
      bars,
      this.equity.subarray(0, used),
      this.cashArr.subarray(0, used),
      this.posArr.subarray(0, used),
    );
    const stats =
      used > 2
        ? computeStats(this.config.capital, this.inst, this.config.timeframe, bars, equityPts, this.trades)
        : null;
    const orders: WorkingOrder[] = this.orders
      .filter((o) => o.status === "SUBMITTED" || o.status === "ACCEPTED" || o.status === "WORKING")
      .map((o) => ({
        id: o.id,
        side: o.side,
        type: o.type,
        qty: o.qty,
        limitPrice: o.limitPrice,
        status: o.status === "WORKING" ? "WORKING" : o.status === "ACCEPTED" ? "ACCEPTED" : "SUBMITTED",
        reason: o.reason,
        submittedAt: o.submittedAt,
      }));
    const position: PositionSnap = {
      qty: this.qty,
      avgPrice: this.avg,
      unrealized,
      realized: this.realized,
    };
    return {
      index: Math.max(this.i, 0),
      total: this.bars.length,
      bar,
      equity: this.cash + this.qty * mark,
      cash: this.cash,
      position,
      orders,
      trades: this.trades.slice(),
      events: this.events.slice(-80),
      equitySeries: equityPts,
      signals: this.signals.slice(),
      done: this.done,
      stats,
    };
  }

  private runStrategy(bar: Bar) {
    if (this.i < 1) return;
    const pending = this.orders.some(
      (o) => o.status === "SUBMITTED" || o.status === "ACCEPTED" || o.status === "WORKING",
    );
    if (pending) return;
    const w = this.want[this.i] ?? 0;
    const px = bar.c;
    const equity = Math.max(this.cash + this.qty * px, 0);
    const unit = roundToLot((equity * 0.98) / px, this.inst.lotSize);
    const target = w * unit;
    const delta = target - this.qty;
    if (Math.abs(delta) < this.inst.lotSize) return;
    const side = delta > 0 ? "BUY" : "SELL";
    const reason = w === 0 ? "strategy-flat" : Math.sign(this.qty) !== 0 && Math.sign(this.qty) !== w ? "strategy-flip" : "strategy-entry";
    this.submitMarket(side, Math.abs(delta), reason);
  }

  private match(bar: Bar) {
    const feeR = this.config.feeBps / 10_000;
    const slipR = this.config.slippageBps / 10_000;
    const nextOpen = this.fillOn !== "close";

    for (const o of this.orders) {
      if (o.status === "SUBMITTED" && o.type === "MARKET") {
        o.status = "ACCEPTED";
        this.log(bar.t, "OrderAccepted", `${o.id} accepted — working the next auction.`, "order");
      }
    }

    for (const o of this.orders) {
      if (o.status === "FILLED" || o.status === "CANCELLED" || o.status === "REJECTED") continue;

      if (o.type === "MARKET" && o.status === "ACCEPTED") {
        const ready = nextOpen ? this.i > o.submitIndex : true;
        if (!ready) continue;
        const raw = nextOpen ? bar.o : bar.c;
        const dir = o.side === "BUY" ? 1 : -1;
        const px = raw * (1 + dir * slipR);
        this.fill(o, px, bar, feeR);
        continue;
      }

      if (o.type === "LIMIT" && o.limitPrice != null && (o.status === "WORKING" || o.status === "ACCEPTED")) {
        o.status = "WORKING";
        const buy = o.side === "BUY";
        const touched = buy ? bar.l <= o.limitPrice : bar.h >= o.limitPrice;
        if (!touched) continue;
        const gapped = buy ? bar.o < o.limitPrice : bar.o > o.limitPrice;
        const px = gapped ? bar.o : o.limitPrice;
        this.fill(o, px, bar, feeR);
      }
    }
  }

  private fill(o: LiveOrder, px: number, bar: Bar, feeR: number) {
    const dir = o.side === "BUY" ? 1 : -1;
    let q = o.qty;
    const feeAmt = q * px * feeR;

    if (dir > 0 && this.qty >= 0) {
      const need = q * px + feeAmt;
      if (this.cash < need) {
        q = roundToLot(Math.max(this.cash - feeAmt, 0) / px, this.inst.lotSize);
        if (q < this.inst.lotSize) {
          o.status = "REJECTED";
          this.log(bar.t, "OrderRejected", `${o.id} rejected — cash.`, "risk");
          return;
        }
      }
    }

    const signed = dir * q;
    const prevQty = this.qty;
    let realizedThis = 0;
    if (prevQty !== 0 && Math.sign(prevQty) !== Math.sign(signed)) {
      const overlap = Math.min(Math.abs(prevQty), q);
      realizedThis = overlap * (px - this.avg) * Math.sign(prevQty);
      this.realized += realizedThis;
    }

    if (prevQty === 0) {
      this.qty = signed;
      this.avg = px;
    } else if (Math.sign(prevQty) === Math.sign(signed)) {
      const tot = Math.abs(prevQty) + q;
      this.avg = (Math.abs(prevQty) * this.avg + q * px) / tot;
      this.qty = prevQty + signed;
    } else {
      this.qty = prevQty + signed;
      if (Math.abs(this.qty) < this.inst.lotSize / 2) {
        this.qty = 0;
        this.avg = 0;
      } else if (Math.sign(this.qty) === Math.sign(signed)) {
        this.avg = px;
      }
    }

    this.cash -= signed * px + feeAmt;
    o.status = "FILLED";

    const closedOut = Math.abs(prevQty) > 0 && (Math.abs(this.qty) < this.inst.lotSize / 2 || Math.sign(this.qty) !== Math.sign(prevQty));
    this.trades.push({
      id: `T-${this.trades.length + 1}`,
      side: o.side,
      qty: q,
      price: px,
      time: bar.t,
      fee: feeAmt,
      pnl: realizedThis - (closedOut ? feeAmt : 0),
      reason: o.reason,
      barIndex: this.i,
    });
    this.signals.push({
      t: bar.t,
      kind: closedOut ? "exit" : "entry",
      side: o.side,
      barIndex: this.i,
    });
    this.log(
      bar.t,
      "OrderFilled",
      `${o.side} ${q} ${this.inst.symbol} @ ${px.toPrecision(6)}  fee ${feeAmt.toFixed(2)}`,
      "fill",
    );
    if (Math.abs(this.qty) < this.inst.lotSize / 2) {
      this.log(bar.t, "PositionClosed", `Realized ${this.realized.toFixed(2)}`, "fill");
    } else if (prevQty === 0) {
      this.log(bar.t, "PositionOpened", `${this.qty} @ ${this.avg.toPrecision(6)}`, "fill");
    } else {
      this.log(bar.t, "PositionChanged", `qty ${this.qty}`, "info");
    }
  }

  private mark(bar: Bar) {
    this.equity[this.i] = this.cash + this.qty * bar.c;
    this.cashArr[this.i] = this.cash;
    this.posArr[this.i] = this.qty;
  }

  private stamp() {
    return this.i >= 0 ? this.bars[this.i]!.t : (this.bars[0]?.t ?? 0);
  }

  private log(time: number, type: string, message: string, severity: EngineEvent["severity"]) {
    this.events.push({
      id: `E-${this.evtSeq++}`,
      time,
      type,
      message,
      severity,
    });
  }
}

export function runNautilus(config: BacktestConfig, bars: Bar[]): BacktestResult {
  return new NautilusEngine(config, bars, { autoStrategy: true }).runAll();
}
