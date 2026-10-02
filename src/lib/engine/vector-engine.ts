import { getInstrument, roundToLot } from "./market-data";
import { buildEquity, computeStats } from "./stats";
import { computeIndicators, vectorSignals } from "./strategies";
import type { BacktestConfig, BacktestResult, SignalMark, Trade } from "./types";

/**
 * Vectorbt-style from_signals:
 * one pass over typed arrays, target position from the signal lane,
 * fills at next-open (default) or close, proportional sizing, fees + slippage.
 */
export function runVector(config: BacktestConfig, bars: ReturnType<typeof import("./market-data").getBars>): BacktestResult {
  const t0 = performance.now();
  const inst = getInstrument(config.instrumentId);
  const n = bars.length;
  const book = computeIndicators(bars, config.strategyId, config.params);
  const { want } = vectorSignals(bars, config.strategyId, config.params, book);

  const fee = config.feeBps / 10_000;
  const slip = config.slippageBps / 10_000;
  const nextOpen = config.fillOn !== "close";

  const equity = new Float64Array(n);
  const cashArr = new Float64Array(n);
  const posArr = new Float64Array(n);

  let cash = config.capital;
  let qty = 0;
  let avg = 0;
  let realized = 0;
  const trades: Trade[] = [];
  const signals: SignalMark[] = [];
  let tradeSeq = 1;

  const fillPriceAt = (signalIndex: number, side: 1 | -1) => {
    const idx = nextOpen ? Math.min(signalIndex + 1, n - 1) : signalIndex;
    const raw = nextOpen ? bars[idx]!.o : bars[idx]!.c;
    const px = raw * (1 + side * slip);
    return { idx, px };
  };

  const closePosition = (signalIndex: number, reason: string) => {
    if (Math.abs(qty) < inst.lotSize / 2) return;
    const side = qty > 0 ? 1 : -1;
    const { idx, px } = fillPriceAt(signalIndex, -side as 1 | -1);
    const feeAmt = Math.abs(qty) * px * fee;
    const pnl = qty * (px - avg) - feeAmt;
    cash += qty * px - feeAmt;
    realized += pnl;
    trades.push({
      id: `T-${tradeSeq++}`,
      side: qty > 0 ? "SELL" : "BUY",
      qty: Math.abs(qty),
      price: px,
      time: bars[idx]!.t,
      fee: feeAmt,
      pnl,
      reason,
      barIndex: idx,
    });
    signals.push({
      t: bars[idx]!.t,
      kind: "exit",
      side: qty > 0 ? "SELL" : "BUY",
      barIndex: idx,
    });
    qty = 0;
    avg = 0;
  };

  const openPosition = (signalIndex: number, dir: 1 | -1, reason: string) => {
    const { idx, px } = fillPriceAt(signalIndex, dir);
    const notional = cash * 0.99;
    let q = roundToLot(Math.abs(notional / px), inst.lotSize) * dir;
    if (Math.abs(q) < inst.lotSize) return;
    const feeAmt = Math.abs(q) * px * fee;
    if (dir > 0 && cash < Math.abs(q) * px + feeAmt) {
      q = roundToLot((cash - feeAmt) / px, inst.lotSize);
      if (q < inst.lotSize) return;
    }
    cash -= q * px + feeAmt;
    qty = q;
    avg = px;
    trades.push({
      id: `T-${tradeSeq++}`,
      side: dir > 0 ? "BUY" : "SELL",
      qty: Math.abs(q),
      price: px,
      time: bars[idx]!.t,
      fee: feeAmt,
      pnl: 0,
      reason,
      barIndex: idx,
    });
    signals.push({
      t: bars[idx]!.t,
      kind: "entry",
      side: dir > 0 ? "BUY" : "SELL",
      barIndex: idx,
    });
  };

  for (let i = 0; i < n; i++) {
    const target = want[i] ?? 0;
    const pos = qty > 0 ? 1 : qty < 0 ? -1 : 0;
    if (target !== pos) {
      if (pos !== 0) closePosition(i, target === 0 ? "signal-flat" : "signal-flip");
      if (target !== 0) openPosition(i, target as 1 | -1, "signal-entry");
    }
    const mark = bars[i]!.c;
    equity[i] = cash + qty * mark;
    cashArr[i] = cash;
    posArr[i] = qty;
  }

  if (Math.abs(qty) > 0) closePosition(n - 1, "eod-flatten");

  const equityPts = buildEquity(bars, equity, cashArr, posArr);
  const stats = computeStats(config.capital, inst, config.timeframe, bars, equityPts, trades);
  return {
    engine: "vector",
    instrumentId: config.instrumentId,
    strategyId: config.strategyId,
    timeframe: config.timeframe,
    bars,
    equity: equityPts,
    trades,
    events: [],
    stats,
    signals,
    indicators: book,
    runtimeMs: performance.now() - t0,
    fillOn: config.fillOn,
  };
}

export function sweepSma(
  config: BacktestConfig,
  bars: ReturnType<typeof import("./market-data").getBars>,
  fastMin = 5,
  fastMax = 24,
  slowMin = 20,
  slowMax = 60,
  step = 2,
) {
  const cells: { fast: number; slow: number; sharpe: number; ret: number; trades: number }[] = [];
  for (let f = fastMin; f <= fastMax; f += step) {
    for (let s = slowMin; s <= slowMax; s += step) {
      if (s <= f) continue;
      const r = runVector(
        { ...config, strategyId: "sma-cross", params: { ...config.params, fast: f, slow: s } },
        bars,
      );
      cells.push({
        fast: f,
        slow: s,
        sharpe: r.stats.sharpe,
        ret: r.stats.totalReturn,
        trades: r.stats.trades,
      });
    }
  }
  return cells;
}
