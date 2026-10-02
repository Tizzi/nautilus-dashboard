import { create } from "zustand";
import {
  DEFAULT_CONFIG,
  NautilusEngine,
  getBars,
  getStrategy,
  runCompare,
  runNautilus,
  runVector,
  sweepSma,
  type BacktestConfig,
  type BacktestResult,
  type CompareReport,
  type DeskMode,
  type DryRunSnapshot,
  type StrategyId,
} from "@/lib/engine";

let live: NautilusEngine | null = null;

export function getLiveEngine() {
  return live;
}

const defaultBars = getBars(DEFAULT_CONFIG.instrumentId, DEFAULT_CONFIG.timeframe);
const defaultVector = runVector(DEFAULT_CONFIG, defaultBars);

type SweepRow = { fast: number; slow: number; sharpe: number; ret: number; trades: number };

type DeskState = {
  mode: DeskMode;
  config: BacktestConfig;
  vector: BacktestResult | null;
  nautilus: BacktestResult | null;
  compare: CompareReport | null;
  dry: DryRunSnapshot | null;
  dryRunning: boolean;
  dryPaused: boolean;
  drySpeed: number;
  dryManual: boolean;
  sweep: SweepRow[] | null;
  methodOpen: boolean;
  setupOpen: boolean;
  setMode: (mode: DeskMode) => void;
  patchConfig: (patch: Partial<BacktestConfig>) => void;
  setParam: (key: string, value: number) => void;
  setStrategy: (id: StrategyId) => void;
  runVectorNow: () => void;
  runNautilusNow: () => void;
  runCompareNow: () => void;
  runSweep: () => void;
  armDry: () => void;
  stepDry: () => void;
  togglePause: () => void;
  haltDry: () => void;
  flattenLive: () => void;
  submitLive: (side: "BUY" | "SELL", qty: number, type: "MARKET" | "LIMIT", limit?: number) => void;
  setDrySpeed: (n: number) => void;
  setDryManual: (v: boolean) => void;
  setMethodOpen: (v: boolean) => void;
  setSetupOpen: (v: boolean) => void;
};

function barsFor(config: BacktestConfig) {
  return getBars(config.instrumentId, config.timeframe);
}

export const useDesk = create<DeskState>((set, get) => ({
  mode: "vector",
  config: DEFAULT_CONFIG,
  vector: defaultVector,
  nautilus: null,
  compare: null,
  dry: null,
  dryRunning: false,
  dryPaused: false,
  drySpeed: 12,
  dryManual: false,
  sweep: null,
  methodOpen: false,
  setupOpen: false,

  setMode: (mode) => {
    set({ mode });
    if (mode === "nautilus" && !get().nautilus) get().runNautilusNow();
    if (mode === "compare" && !get().compare) get().runCompareNow();
  },

  patchConfig: (patch) => {
    const config = { ...get().config, ...patch };
    set({ config, nautilus: null, compare: null, sweep: null });
    get().runVectorNow();
  },

  setParam: (key, value) => {
    const config = { ...get().config, params: { ...get().config.params, [key]: value } };
    set({ config, nautilus: null, compare: null, sweep: null });
    get().runVectorNow();
  },

  setStrategy: (id) => {
    const meta = getStrategy(id);
    const config = { ...get().config, strategyId: id, params: { ...meta.defaults } };
    set({ config, nautilus: null, compare: null, sweep: null });
    get().runVectorNow();
  },

  runVectorNow: () => {
    const { config } = get();
    const vector = runVector(config, barsFor(config));
    set({ vector });
  },

  runNautilusNow: () => {
    const { config } = get();
    const nautilus = runNautilus(config, barsFor(config));
    set({ nautilus, mode: get().mode === "vector" ? "nautilus" : get().mode });
  },

  runCompareNow: () => {
    const { config } = get();
    const compare = runCompare(config, barsFor(config));
    set({ compare, vector: compare.vector, nautilus: compare.nautilus, mode: "compare" });
  },

  runSweep: () => {
    const { config } = get();
    const sweep = sweepSma(config, barsFor(config));
    set({ sweep, mode: "vector" });
  },

  armDry: () => {
    const { config, dryManual } = get();
    live = new NautilusEngine(config, barsFor(config), { autoStrategy: !dryManual });
    live.step();
    live.step();
    set({
      mode: "dryrun",
      dry: live.snapshot(),
      dryRunning: true,
      dryPaused: false,
    });
  },

  stepDry: () => {
    if (!live) return;
    live.step();
    const snap = live.snapshot();
    set({
      dry: snap,
      dryRunning: snap.done ? false : get().dryRunning,
      nautilus: snap.done ? live.toResult() : get().nautilus,
    });
  },

  togglePause: () => set({ dryPaused: !get().dryPaused }),

  haltDry: () => {
    if (!live) {
      set({ dryRunning: false, dryPaused: false });
      return;
    }
    live.flattenNow("halt");
    const nautilus = live.toResult();
    const dry = live.snapshot();
    live = null;
    set({ dryRunning: false, dryPaused: false, dry, nautilus });
  },

  flattenLive: () => {
    if (!live) return;
    live.flattenNow("manual-flatten");
    set({ dry: live.snapshot() });
  },

  submitLive: (side, qty, type, limit) => {
    if (!live) return;
    if (type === "LIMIT" && limit != null) live.submitLimit(side, qty, limit, "manual");
    else live.submitMarket(side, qty, "manual");
    set({ dry: live.snapshot() });
  },

  setDrySpeed: (drySpeed) => set({ drySpeed }),
  setDryManual: (dryManual) => set({ dryManual }),
  setMethodOpen: (methodOpen) => set({ methodOpen }),
  setSetupOpen: (setupOpen) => set({ setupOpen }),
}));
