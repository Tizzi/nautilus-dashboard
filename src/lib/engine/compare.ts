import { runNautilus } from "./nautilus-engine";
import { runVector } from "./vector-engine";
import type { BacktestConfig, Bar, CompareReport } from "./types";

export function runCompare(config: BacktestConfig, bars: Bar[]): CompareReport {
  const vector = runVector(config, bars);
  const nautilus = runNautilus(config, bars);

  const vExits = vector.signals.filter((s) => s.kind === "exit");
  const nExits = nautilus.signals.filter((s) => s.kind === "exit");
  const n = Math.min(vExits.length, nExits.length);
  let delay = 0;
  for (let i = 0; i < n; i++) delay += (nExits[i]!.barIndex - vExits[i]!.barIndex);
  const avgFillDelayBars = n ? delay / n : 0;

  return {
    vector,
    nautilus,
    returnDrag: vector.stats.totalReturn - nautilus.stats.totalReturn,
    sharpeGap: vector.stats.sharpe - nautilus.stats.sharpe,
    extraTrades: vector.stats.trades - nautilus.stats.trades,
    avgFillDelayBars,
  };
}
