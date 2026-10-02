import { getStrategy } from "./strategies";
import type { BacktestConfig } from "./types";

export const DEFAULT_CONFIG: BacktestConfig = {
  instrumentId: "BTC-USDT",
  timeframe: "1d",
  strategyId: "sma-cross",
  capital: 100_000,
  feeBps: 5,
  slippageBps: 2,
  fillOn: "next-open",
  params: { ...getStrategy("sma-cross").defaults },
};

export const CAPITAL_PRESETS = [25_000, 100_000, 250_000, 1_000_000] as const;
export const SPEED_PRESETS = [
  { id: 1, label: "1×" },
  { id: 4, label: "4×" },
  { id: 12, label: "12×" },
  { id: 36, label: "36×" },
] as const;
