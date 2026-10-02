import { mulberry32, randn } from "./rng";
import type { Bar, Instrument, SessionKind, Timeframe } from "./types";

/** Fixed series end so SSR and client paint the same book. */
export const SERIES_END = Date.UTC(2026, 9, 1, 20, 0, 0);

export const INSTRUMENTS: Instrument[] = [
  {
    id: "BTC-USDT",
    symbol: "BTC-USDT",
    name: "Bitcoin",
    venue: "BINANCE",
    assetClass: "crypto",
    session: "24/7",
    tickSize: 0.1,
    lotSize: 0.001,
    currency: "USDT",
    leverage: 2,
    seed: 0x0b17c01,
    startPrice: 28420,
    drift: 0.22,
    vol: 0.62,
    jumpProb: 0.012,
    jumpSigma: 0.035,
  },
  {
    id: "ETH-USDT",
    symbol: "ETH-USDT",
    name: "Ether",
    venue: "BINANCE",
    assetClass: "crypto",
    session: "24/7",
    tickSize: 0.01,
    lotSize: 0.01,
    currency: "USDT",
    leverage: 2,
    seed: 0x0e7b01,
    startPrice: 1640,
    drift: 0.18,
    vol: 0.72,
    jumpProb: 0.014,
    jumpSigma: 0.04,
  },
  {
    id: "SPY",
    symbol: "SPY",
    name: "S&P 500 ETF",
    venue: "ARCA",
    assetClass: "equity",
    session: "rth",
    tickSize: 0.01,
    lotSize: 1,
    currency: "USD",
    leverage: 1,
    seed: 0x5b1001,
    startPrice: 418,
    drift: 0.09,
    vol: 0.16,
    jumpProb: 0.004,
    jumpSigma: 0.018,
  },
  {
    id: "AAPL",
    symbol: "AAPL",
    name: "Apple",
    venue: "XNAS",
    assetClass: "equity",
    session: "rth",
    tickSize: 0.01,
    lotSize: 1,
    currency: "USD",
    leverage: 1,
    seed: 0xaab1e,
    startPrice: 172,
    drift: 0.12,
    vol: 0.24,
    jumpProb: 0.008,
    jumpSigma: 0.03,
  },
  {
    id: "EURUSD",
    symbol: "EURUSD",
    name: "Euro / Dollar",
    venue: "IDEALPRO",
    assetClass: "fx",
    session: "24/5",
    tickSize: 0.00001,
    lotSize: 1000,
    currency: "USD",
    leverage: 5,
    seed: 0xee00d,
    startPrice: 1.0842,
    drift: 0.01,
    vol: 0.08,
    jumpProb: 0.003,
    jumpSigma: 0.006,
  },
  {
    id: "NQ",
    symbol: "NQ",
    name: "Nasdaq 100",
    venue: "CME",
    assetClass: "future",
    session: "24/5",
    tickSize: 0.25,
    lotSize: 1,
    currency: "USD",
    leverage: 5,
    seed: 0x11a511,
    startPrice: 15240,
    drift: 0.14,
    vol: 0.22,
    jumpProb: 0.006,
    jumpSigma: 0.016,
  },
];

export const INSTRUMENT_MAP = Object.fromEntries(INSTRUMENTS.map((i) => [i.id, i])) as Record<
  string,
  Instrument
>;

export function getInstrument(id: string): Instrument {
  return INSTRUMENT_MAP[id] ?? INSTRUMENTS[0]!;
}

const TF_MS: Record<Timeframe, number> = {
  "5m": 5 * 60_000,
  "1h": 60 * 60_000,
  "1d": 24 * 60 * 60_000,
};

const LOOKBACK_MS: Record<Timeframe, number> = {
  "5m": 12 * 24 * 60 * 60_000,
  "1h": 140 * 24 * 60 * 60_000,
  "1d": 1100 * 24 * 60 * 60_000,
};

const PERIODS_PER_YEAR: Record<Timeframe, number> = {
  "5m": 365 * 24 * 12,
  "1h": 365 * 24,
  "1d": 365,
};

export function timeframeMs(tf: Timeframe) {
  return TF_MS[tf];
}

export function periodsPerYear(tf: Timeframe, session: SessionKind) {
  if (tf === "1d") return session === "24/7" ? 365 : 252;
  if (tf === "1h") {
    if (session === "24/7") return 365 * 24;
    if (session === "24/5") return 252 * 24;
    return 252 * 6.5;
  }
  if (session === "24/7") return 365 * 24 * 12;
  if (session === "24/5") return 252 * 24 * 12;
  return 252 * 78;
}

function isSessionOpen(inst: Instrument, t: number, tf: Timeframe) {
  const d = new Date(t);
  const day = d.getUTCDay();
  const hour = d.getUTCHours();
  if (inst.session === "24/7") return true;
  if (day === 0 || day === 6) return false;
  if (tf === "1d") return true;
  if (inst.session === "rth") return hour >= 14 && hour < 21;
  return true;
}

function regimeDrift(progress: number, base: number, rng: () => number, inst: Instrument) {
  // Three regimes: trend, chop, mean-revert — different per book so strategies have contrast.
  const phase = Math.floor(progress * 3);
  if (inst.assetClass === "fx") {
    return phase === 1 ? base * 0.2 : -base * 0.4;
  }
  if (phase === 0) return base * 1.8;
  if (phase === 1) return base * 0.1;
  return -base * 0.6;
}

function generateBars(inst: Instrument, tf: Timeframe): Bar[] {
  const rng = mulberry32(inst.seed ^ (tf.charCodeAt(0) << 8) ^ tf.length);
  const step = TF_MS[tf];
  const start = SERIES_END - LOOKBACK_MS[tf];
  const ppy = PERIODS_PER_YEAR[tf];
  const dt = 1 / ppy;
  const sqrtDt = Math.sqrt(dt);
  const bars: Bar[] = [];
  let price = inst.startPrice;
  let t = start;
  const totalSpan = SERIES_END - start;

  while (t < SERIES_END) {
    if (!isSessionOpen(inst, t, tf)) {
      t += step;
      continue;
    }
    const progress = (t - start) / totalSpan;
    const mu = regimeDrift(progress, inst.drift, rng, inst);
    let shock = (mu - 0.5 * inst.vol * inst.vol) * dt + inst.vol * sqrtDt * randn(rng);
    if (rng() < inst.jumpProb * dt * ppy) {
      shock += inst.jumpSigma * randn(rng);
    }
    const open = price;
    const close = Math.max(inst.tickSize, open * Math.exp(shock));
    const range = Math.abs(close - open) + open * inst.vol * sqrtDt * Math.abs(randn(rng)) * 0.6;
    const wickUp = Math.abs(randn(rng)) * range * 0.45;
    const wickDn = Math.abs(randn(rng)) * range * 0.45;
    const high = Math.max(open, close) + wickUp;
    const low = Math.max(inst.tickSize, Math.min(open, close) - wickDn);
    const baseVol =
      inst.assetClass === "crypto" ? 420 + rng() * 180 : inst.assetClass === "fx" ? 8e8 : 3.2e6;
    const uShape = 0.7 + Math.abs(Math.sin((progress + rng() * 0.05) * Math.PI * 2));
    const volume = baseVol * uShape * (1 + Math.abs(shock) * 14);

    bars.push({
      t,
      o: roundTick(open, inst.tickSize),
      h: roundTick(high, inst.tickSize),
      l: roundTick(low, inst.tickSize),
      c: roundTick(close, inst.tickSize),
      v: Math.round(volume),
    });
    price = close;
    t += step;
  }
  return bars;
}

function roundTick(px: number, tick: number) {
  return Math.round(px / tick) * tick;
}

const cache = new Map<string, Bar[]>();

export function getBars(instrumentId: string, timeframe: Timeframe): Bar[] {
  const key = `${instrumentId}:${timeframe}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const inst = getInstrument(instrumentId);
  const bars = generateBars(inst, timeframe);
  cache.set(key, bars);
  return bars;
}

export function roundToLot(qty: number, lot: number) {
  if (lot <= 0) return qty;
  return Math.floor(qty / lot + 1e-12) * lot;
}

export { PERIODS_PER_YEAR };
