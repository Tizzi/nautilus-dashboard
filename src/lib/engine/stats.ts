import { periodsPerYear } from "./market-data";
import type { Bar, EquityPoint, Instrument, PerfStats, Timeframe, Trade } from "./types";

function emptyStats(capital: number, bars: number): PerfStats {
  return {
    totalReturn: 0,
    cagr: 0,
    sharpe: 0,
    sortino: 0,
    calmar: 0,
    maxDrawdown: 0,
    winRate: 0,
    profitFactor: 0,
    trades: 0,
    avgTrade: 0,
    exposure: 0,
    turnover: 0,
    finalEquity: capital,
    volatility: 0,
    hitRatio: 0,
    avgWin: 0,
    avgLoss: 0,
    bestTrade: 0,
    worstTrade: 0,
    bars,
    years: 0,
  };
}

export function buildEquity(
  bars: Bar[],
  equity: Float64Array,
  cash: Float64Array,
  position: Float64Array,
): EquityPoint[] {
  const out: EquityPoint[] = new Array(bars.length);
  let peak = equity[0] ?? 0;
  for (let i = 0; i < bars.length; i++) {
    const eq = equity[i] ?? 0;
    if (eq > peak) peak = eq;
    const dd = peak > 0 ? eq / peak - 1 : 0;
    out[i] = {
      t: bars[i]!.t,
      equity: eq,
      drawdown: dd,
      cash: cash[i] ?? 0,
      position: position[i] ?? 0,
    };
  }
  return out;
}

export function computeStats(
  capital: number,
  inst: Instrument,
  tf: Timeframe,
  bars: Bar[],
  equity: EquityPoint[],
  trades: Trade[],
): PerfStats {
  if (bars.length < 2 || equity.length < 2) return emptyStats(capital, bars.length);
  const firstT = bars[0]!.t;
  const lastT = bars[bars.length - 1]!.t;
  const years = Math.max((lastT - firstT) / (365.25 * 24 * 3600 * 1000), 1 / 365);
  const finalEquity = equity[equity.length - 1]!.equity;
  const totalReturn = capital > 0 ? finalEquity / capital - 1 : 0;
  const cagr = capital > 0 ? Math.pow(Math.max(finalEquity, 1e-9) / capital, 1 / years) - 1 : 0;

  const ppy = periodsPerYear(tf, inst.session);
  const rets: number[] = [];
  for (let i = 1; i < equity.length; i++) {
    const prev = equity[i - 1]!.equity;
    if (prev > 0) rets.push(equity[i]!.equity / prev - 1);
  }
  const n = rets.length;
  const mean = n ? rets.reduce((a, b) => a + b, 0) / n : 0;
  let varr = 0;
  for (const r of rets) varr += (r - mean) * (r - mean);
  const std = n > 1 ? Math.sqrt(varr / (n - 1)) : 0;
  const sharpe = std > 0 ? (mean / std) * Math.sqrt(ppy) : 0;

  const downs = rets.filter((r) => r < 0);
  let downVar = 0;
  for (const r of downs) downVar += r * r;
  const downStd = downs.length > 1 ? Math.sqrt(downVar / downs.length) : 0;
  const sortino = downStd > 0 ? (mean / downStd) * Math.sqrt(ppy) : 0;

  let maxDd = 0;
  for (const p of equity) if (p.drawdown < maxDd) maxDd = p.drawdown;
  const calmar = maxDd < 0 ? cagr / Math.abs(maxDd) : 0;
  const vol = std * Math.sqrt(ppy);

  const closed = trades.filter(
    (t) =>
      t.reason.includes("flat") ||
      t.reason.includes("flip") ||
      t.reason.includes("eod") ||
      t.reason.includes("flatten") ||
      (t.pnl !== 0 && !t.reason.includes("entry")),
  );
  const pnls = closed.map((t) => t.pnl);
  const wins = pnls.filter((p) => p > 0);
  const losses = pnls.filter((p) => p < 0);
  const gp = wins.reduce((a, b) => a + b, 0);
  const gl = Math.abs(losses.reduce((a, b) => a + b, 0));
  const exposure =
    equity.length === 0 ? 0 : equity.filter((p) => Math.abs(p.position) > 1e-12).length / equity.length;
  const turnover =
    capital > 0 ? trades.reduce((a, t) => a + Math.abs(t.qty * t.price), 0) / (capital * Math.max(years, 1e-6)) : 0;

  return {
    totalReturn,
    cagr,
    sharpe,
    sortino,
    calmar,
    maxDrawdown: maxDd,
    winRate: pnls.length ? wins.length / pnls.length : 0,
    profitFactor: gl > 0 ? gp / gl : gp > 0 ? 10 : 0,
    trades: pnls.length,
    avgTrade: pnls.length ? pnls.reduce((a, b) => a + b, 0) / pnls.length : 0,
    exposure,
    turnover,
    finalEquity,
    volatility: vol,
    hitRatio: pnls.length ? wins.length / pnls.length : 0,
    avgWin: wins.length ? gp / wins.length : 0,
    avgLoss: losses.length ? losses.reduce((a, b) => a + b, 0) / losses.length : 0,
    bestTrade: pnls.length ? Math.max(...pnls) : 0,
    worstTrade: pnls.length ? Math.min(...pnls) : 0,
    bars: bars.length,
    years,
  };
}
