import {
  bollinger,
  closes,
  donchian,
  highs,
  lows,
  macd,
  rsi,
  sma,
} from "./indicators";
import type { Bar, ParamDef, Side, StrategyId } from "./types";

export type StrategyMeta = {
  id: StrategyId;
  name: string;
  short: string;
  description: string;
  family: "trend" | "reversion" | "breakout";
  params: ParamDef[];
  defaults: Record<string, number>;
  longShortDefault: boolean;
};

export const STRATEGIES: StrategyMeta[] = [
  {
    id: "sma-cross",
    name: "SMA Cross",
    short: "SMA",
    family: "trend",
    description: "Fast SMA vs slow SMA. Long above the cross, flat or short below.",
    params: [
      { key: "fast", label: "Fast", min: 5, max: 40, step: 1 },
      { key: "slow", label: "Slow", min: 15, max: 80, step: 1 },
      { key: "longShort", label: "Long/short", min: 0, max: 1, step: 1 },
    ],
    defaults: { fast: 10, slow: 30, longShort: 0 },
    longShortDefault: false,
  },
  {
    id: "rsi-reversion",
    name: "RSI Reversion",
    short: "RSI",
    family: "reversion",
    description: "Buy oversold crosses, exit into overbought. Classic mean-reversion tape.",
    params: [
      { key: "period", label: "Period", min: 5, max: 28, step: 1 },
      { key: "oversold", label: "Oversold", min: 10, max: 40, step: 1 },
      { key: "overbought", label: "Overbought", min: 60, max: 90, step: 1 },
    ],
    defaults: { period: 14, oversold: 30, overbought: 70 },
    longShortDefault: false,
  },
  {
    id: "macd-momentum",
    name: "MACD Momentum",
    short: "MACD",
    family: "trend",
    description: "MACD line vs signal. Trend following with histogram confirmation.",
    params: [
      { key: "fast", label: "Fast", min: 6, max: 18, step: 1 },
      { key: "slow", label: "Slow", min: 18, max: 40, step: 1 },
      { key: "signal", label: "Signal", min: 5, max: 15, step: 1 },
    ],
    defaults: { fast: 12, slow: 26, signal: 9 },
    longShortDefault: false,
  },
  {
    id: "bollinger",
    name: "Bollinger",
    short: "BB",
    family: "reversion",
    description:
      "Mode 0 fades the bands (reversion). Mode 1 buys the break of the upper band.",
    params: [
      { key: "period", label: "Period", min: 10, max: 40, step: 1 },
      { key: "std", label: "Std", min: 1, max: 3.5, step: 0.1 },
      { key: "mode", label: "Mode", min: 0, max: 1, step: 1 },
    ],
    defaults: { period: 20, std: 2, mode: 0 },
    longShortDefault: false,
  },
  {
    id: "donchian",
    name: "Donchian Trend",
    short: "DON",
    family: "breakout",
    description: "Turtle-style channel breakout. Enter N-bar high, exit M-bar low.",
    params: [
      { key: "entry", label: "Entry", min: 10, max: 55, step: 1 },
      { key: "exit", label: "Exit", min: 5, max: 30, step: 1 },
      { key: "longShort", label: "Long/short", min: 0, max: 1, step: 1 },
    ],
    defaults: { entry: 20, exit: 10, longShort: 0 },
    longShortDefault: false,
  },
];

export const STRATEGY_MAP = Object.fromEntries(STRATEGIES.map((s) => [s.id, s])) as Record<
  StrategyId,
  StrategyMeta
>;

export function getStrategy(id: StrategyId) {
  return STRATEGY_MAP[id] ?? STRATEGIES[0]!;
}

export type IndicatorBook = Record<string, Array<number | null>>;

export function computeIndicators(
  bars: Bar[],
  strategyId: StrategyId,
  params: Record<string, number>,
): IndicatorBook {
  const c = closes(bars);
  const h = highs(bars);
  const l = lows(bars);
  const book: IndicatorBook = {};
  if (strategyId === "sma-cross") {
    const fast = Math.max(2, Math.round(params.fast ?? 10));
    const slow = Math.max(fast + 1, Math.round(params.slow ?? 30));
    book.fast = sma(c, fast);
    book.slow = sma(c, slow);
  } else if (strategyId === "rsi-reversion") {
    book.rsi = rsi(c, Math.max(2, Math.round(params.period ?? 14)));
  } else if (strategyId === "macd-momentum") {
    const m = macd(
      c,
      Math.max(2, Math.round(params.fast ?? 12)),
      Math.max(3, Math.round(params.slow ?? 26)),
      Math.max(2, Math.round(params.signal ?? 9)),
    );
    book.macd = m.macd;
    book.signal = m.signal;
    book.hist = m.hist;
  } else if (strategyId === "bollinger") {
    const bb = bollinger(c, Math.max(5, Math.round(params.period ?? 20)), params.std ?? 2);
    book.mid = bb.mid;
    book.upper = bb.upper;
    book.lower = bb.lower;
  } else {
    const entry = Math.max(5, Math.round(params.entry ?? 20));
    const exitP = Math.max(3, Math.round(params.exit ?? 10));
    const e = donchian(h, l, entry);
    const x = donchian(h, l, exitP);
    book.entryHigh = e.upper;
    book.entryLow = e.lower;
    book.exitHigh = x.upper;
    book.exitLow = x.lower;
  }
  return book;
}

export type VectorSignals = {
  want: Int8Array; // -1 short, 0 flat, 1 long
};

export function vectorSignals(
  bars: Bar[],
  strategyId: StrategyId,
  params: Record<string, number>,
  book: IndicatorBook,
): VectorSignals {
  const n = bars.length;
  const want = new Int8Array(n);
  const longShort = (params.longShort ?? 0) >= 1 ? 1 : 0;

  if (strategyId === "sma-cross") {
    const fast = book.fast!;
    const slow = book.slow!;
    for (let i = 0; i < n; i++) {
      if (fast[i] == null || slow[i] == null) continue;
      if (fast[i]! > slow[i]!) want[i] = 1;
      else want[i] = longShort ? -1 : 0;
    }
  } else if (strategyId === "rsi-reversion") {
    const r = book.rsi!;
    const os = params.oversold ?? 30;
    const ob = params.overbought ?? 70;
    let pos = 0;
    for (let i = 1; i < n; i++) {
      pos = want[i - 1]!;
      if (r[i] == null || r[i - 1] == null) {
        want[i] = pos as 0 | 1 | -1;
        continue;
      }
      if (pos <= 0 && r[i - 1]! <= os && r[i]! > os) pos = 1;
      else if (pos >= 0 && r[i - 1]! >= ob && r[i]! < ob) pos = 0;
      want[i] = pos as 0 | 1 | -1;
    }
  } else if (strategyId === "macd-momentum") {
    const line = book.macd!;
    const sig = book.signal!;
    for (let i = 0; i < n; i++) {
      if (line[i] == null || sig[i] == null) continue;
      want[i] = line[i]! > sig[i]! ? 1 : 0;
    }
  } else if (strategyId === "bollinger") {
    const mode = params.mode ?? 0;
    const upper = book.upper!;
    const lower = book.lower!;
    const mid = book.mid!;
    let pos = 0;
    for (let i = 1; i < n; i++) {
      pos = want[i - 1]!;
      const c = bars[i]!.c;
      if (upper[i] == null || lower[i] == null || mid[i] == null) {
        want[i] = pos as 0 | 1 | -1;
        continue;
      }
      if (mode < 0.5) {
        if (pos <= 0 && c < lower[i]!) pos = 1;
        else if (pos > 0 && c > mid[i]!) pos = 0;
      } else {
        if (pos <= 0 && c > upper[i]!) pos = 1;
        else if (pos > 0 && c < mid[i]!) pos = 0;
      }
      want[i] = pos as 0 | 1 | -1;
    }
  } else {
    const eh = book.entryHigh!;
    const el = book.entryLow!;
    const xl = book.exitLow!;
    const xh = book.exitHigh!;
    let pos = 0;
    for (let i = 1; i < n; i++) {
      pos = want[i - 1]!;
      const c = bars[i]!.c;
      if (eh[i] == null || xl[i] == null) {
        want[i] = pos as 0 | 1 | -1;
        continue;
      }
      if (pos <= 0 && c >= eh[i]!) pos = 1;
      else if (pos > 0 && c <= xl[i]!) pos = 0;
      if (longShort) {
        if (pos >= 0 && el[i] != null && c <= el[i]!) pos = -1;
        else if (pos < 0 && xh[i] != null && c >= xh[i]!) pos = 0;
      }
      want[i] = pos as 0 | 1 | -1;
    }
  }
  return { want };
}

export type Intent = { side: Side; flattenFirst: boolean } | { flatten: true } | null;

export function intentAt(
  i: number,
  strategyId: StrategyId,
  params: Record<string, number>,
  book: IndicatorBook,
  bars: Bar[],
  positionQty: number,
): Intent {
  const { want } = vectorSignals(bars.slice(0, i + 1), strategyId, params, trimBook(book, i + 1));
  const w = want[want.length - 1] ?? 0;
  const pos = positionQty > 1e-12 ? 1 : positionQty < -1e-12 ? -1 : 0;
  if (w === pos) return null;
  if (w === 0) return { flatten: true };
  if (pos !== 0 && w !== pos) return { side: w > 0 ? "BUY" : "SELL", flattenFirst: true };
  return { side: w > 0 ? "BUY" : "SELL", flattenFirst: false };
}

function trimBook(book: IndicatorBook, n: number): IndicatorBook {
  const out: IndicatorBook = {};
  for (const [k, arr] of Object.entries(book)) out[k] = arr.slice(0, n);
  return out;
}
