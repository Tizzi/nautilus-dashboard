function smaAt(src: ArrayLike<number>, i: number, period: number) {
  if (i + 1 < period) return null;
  let s = 0;
  for (let k = i - period + 1; k <= i; k++) s += src[k]!;
  return s / period;
}

export function sma(src: ArrayLike<number>, period: number): Array<number | null> {
  const out: Array<number | null> = new Array(src.length);
  for (let i = 0; i < src.length; i++) out[i] = smaAt(src, i, period);
  return out;
}

export function ema(src: ArrayLike<number>, period: number): Array<number | null> {
  const out: Array<number | null> = new Array(src.length);
  const k = 2 / (period + 1);
  let prev: number | null = null;
  let seed = 0;
  for (let i = 0; i < src.length; i++) {
    const v = src[i]!;
    if (i + 1 < period) {
      seed += v;
      out[i] = null;
      if (i + 1 === period) {
        prev = seed / period;
        out[i] = prev;
      }
      continue;
    }
    prev = v * k + (prev as number) * (1 - k);
    out[i] = prev;
  }
  return out;
}

/** Wilder RSI. */
export function rsi(src: ArrayLike<number>, period: number): Array<number | null> {
  const out: Array<number | null> = new Array(src.length);
  out[0] = null;
  let avgG = 0;
  let avgL = 0;
  for (let i = 1; i < src.length; i++) {
    const ch = src[i]! - src[i - 1]!;
    const g = Math.max(ch, 0);
    const l = Math.max(-ch, 0);
    if (i < period) {
      avgG += g;
      avgL += l;
      out[i] = null;
      continue;
    }
    if (i === period) {
      avgG = (avgG + g) / period;
      avgL = (avgL + l) / period;
    } else {
      avgG = (avgG * (period - 1) + g) / period;
      avgL = (avgL * (period - 1) + l) / period;
    }
    const rs = avgL === 0 ? 100 : avgG / avgL;
    out[i] = 100 - 100 / (1 + rs);
  }
  return out;
}

export function atr(
  high: ArrayLike<number>,
  low: ArrayLike<number>,
  close: ArrayLike<number>,
  period: number,
): Array<number | null> {
  const out: Array<number | null> = new Array(close.length);
  out[0] = null;
  let acc = 0;
  let prev: number | null = null;
  for (let i = 1; i < close.length; i++) {
    const tr = Math.max(
      high[i]! - low[i]!,
      Math.abs(high[i]! - close[i - 1]!),
      Math.abs(low[i]! - close[i - 1]!),
    );
    if (i < period) {
      acc += tr;
      out[i] = null;
      continue;
    }
    if (i === period) {
      prev = (acc + tr) / period;
    } else {
      prev = ((prev as number) * (period - 1) + tr) / period;
    }
    out[i] = prev;
  }
  return out;
}

export function macd(
  src: ArrayLike<number>,
  fast = 12,
  slow = 26,
  signal = 9,
): { macd: Array<number | null>; signal: Array<number | null>; hist: Array<number | null> } {
  const eFast = ema(src, fast);
  const eSlow = ema(src, slow);
  const line: Array<number | null> = new Array(src.length);
  for (let i = 0; i < src.length; i++) {
    line[i] = eFast[i] != null && eSlow[i] != null ? eFast[i]! - eSlow[i]! : null;
  }
  const compact: number[] = [];
  const idx: number[] = [];
  for (let i = 0; i < line.length; i++) {
    if (line[i] != null) {
      compact.push(line[i]!);
      idx.push(i);
    }
  }
  const sigCompact = ema(compact, signal);
  const sig: Array<number | null> = new Array(src.length).fill(null);
  const hist: Array<number | null> = new Array(src.length).fill(null);
  for (let k = 0; k < idx.length; k++) {
    const i = idx[k]!;
    const s = sigCompact[k] ?? null;
    sig[i] = s;
    hist[i] = s != null && line[i] != null ? line[i]! - s : null;
  }
  return { macd: line, signal: sig, hist };
}

export function bollinger(
  src: ArrayLike<number>,
  period: number,
  stdDev: number,
): { mid: Array<number | null>; upper: Array<number | null>; lower: Array<number | null> } {
  const mid = sma(src, period);
  const upper: Array<number | null> = new Array(src.length);
  const lower: Array<number | null> = new Array(src.length);
  for (let i = 0; i < src.length; i++) {
    if (mid[i] == null) {
      upper[i] = null;
      lower[i] = null;
      continue;
    }
    let ss = 0;
    for (let k = i - period + 1; k <= i; k++) {
      const d = src[k]! - mid[i]!;
      ss += d * d;
    }
    const sd = Math.sqrt(ss / period);
    upper[i] = mid[i]! + stdDev * sd;
    lower[i] = mid[i]! - stdDev * sd;
  }
  return { mid, upper, lower };
}

export function donchian(
  high: ArrayLike<number>,
  low: ArrayLike<number>,
  period: number,
): { upper: Array<number | null>; lower: Array<number | null>; mid: Array<number | null> } {
  const upper: Array<number | null> = new Array(high.length);
  const lower: Array<number | null> = new Array(high.length);
  const mid: Array<number | null> = new Array(high.length);
  for (let i = 0; i < high.length; i++) {
    if (i + 1 < period) {
      upper[i] = lower[i] = mid[i] = null;
      continue;
    }
    let hi = -Infinity;
    let lo = Infinity;
    for (let k = i - period + 1; k <= i; k++) {
      if (high[k]! > hi) hi = high[k]!;
      if (low[k]! < lo) lo = low[k]!;
    }
    upper[i] = hi;
    lower[i] = lo;
    mid[i] = (hi + lo) / 2;
  }
  return { upper, lower, mid };
}

export function closes(bars: { c: number }[]) {
  const a = new Float64Array(bars.length);
  for (let i = 0; i < bars.length; i++) a[i] = bars[i]!.c;
  return a;
}

export function highs(bars: { h: number }[]) {
  const a = new Float64Array(bars.length);
  for (let i = 0; i < bars.length; i++) a[i] = bars[i]!.h;
  return a;
}

export function lows(bars: { l: number }[]) {
  const a = new Float64Array(bars.length);
  for (let i = 0; i < bars.length; i++) a[i] = bars[i]!.l;
  return a;
}

export function lastValid(arr: Array<number | null>): number | null {
  for (let i = arr.length - 1; i >= 0; i--) {
    if (arr[i] != null) return arr[i]!;
  }
  return null;
}
