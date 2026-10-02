export type Side = "BUY" | "SELL";
export type OrderType = "MARKET" | "LIMIT";
export type Timeframe = "5m" | "1h" | "1d";
export type EngineKind = "vector" | "nautilus";
export type DeskMode = "vector" | "nautilus" | "dryrun" | "compare";
export type SessionKind = "24/7" | "24/5" | "rth";
export type AssetClass = "crypto" | "equity" | "fx" | "future";
export type FillOn = "next-open" | "close";

export type Bar = {
  t: number;
  o: number;
  h: number;
  l: number;
  c: number;
  v: number;
};

export type Instrument = {
  id: string;
  symbol: string;
  name: string;
  venue: string;
  assetClass: AssetClass;
  session: SessionKind;
  tickSize: number;
  lotSize: number;
  currency: string;
  leverage: number;
  seed: number;
  startPrice: number;
  drift: number;
  vol: number;
  jumpProb: number;
  jumpSigma: number;
};

export type StrategyId =
  | "sma-cross"
  | "rsi-reversion"
  | "macd-momentum"
  | "bollinger"
  | "donchian";

export type ParamDef = {
  key: string;
  label: string;
  min: number;
  max: number;
  step: number;
};

export type BacktestConfig = {
  instrumentId: string;
  timeframe: Timeframe;
  strategyId: StrategyId;
  capital: number;
  feeBps: number;
  slippageBps: number;
  fillOn: FillOn;
  params: Record<string, number>;
};

export type Trade = {
  id: string;
  side: Side;
  qty: number;
  price: number;
  time: number;
  fee: number;
  pnl: number;
  reason: string;
  barIndex: number;
};

export type SignalMark = {
  t: number;
  kind: "entry" | "exit";
  side: Side;
  barIndex: number;
};

export type EngineEvent = {
  id: string;
  time: number;
  type: string;
  message: string;
  severity: "info" | "fill" | "order" | "risk" | "bar";
};

export type EquityPoint = {
  t: number;
  equity: number;
  drawdown: number;
  cash: number;
  position: number;
};

export type PerfStats = {
  totalReturn: number;
  cagr: number;
  sharpe: number;
  sortino: number;
  calmar: number;
  maxDrawdown: number;
  winRate: number;
  profitFactor: number;
  trades: number;
  avgTrade: number;
  exposure: number;
  turnover: number;
  finalEquity: number;
  volatility: number;
  hitRatio: number;
  avgWin: number;
  avgLoss: number;
  bestTrade: number;
  worstTrade: number;
  bars: number;
  years: number;
};

export type BacktestResult = {
  engine: EngineKind;
  instrumentId: string;
  strategyId: StrategyId;
  timeframe: Timeframe;
  bars: Bar[];
  equity: EquityPoint[];
  trades: Trade[];
  events: EngineEvent[];
  stats: PerfStats;
  signals: SignalMark[];
  indicators: Record<string, Array<number | null>>;
  runtimeMs: number;
  fillOn: FillOn;
};

export type PositionSnap = {
  qty: number;
  avgPrice: number;
  unrealized: number;
  realized: number;
};

export type WorkingOrder = {
  id: string;
  side: Side;
  type: OrderType;
  qty: number;
  limitPrice?: number;
  status: "SUBMITTED" | "ACCEPTED" | "WORKING";
  reason: string;
  submittedAt: number;
};

export type DryRunSnapshot = {
  index: number;
  total: number;
  bar: Bar | null;
  equity: number;
  cash: number;
  position: PositionSnap;
  orders: WorkingOrder[];
  trades: Trade[];
  events: EngineEvent[];
  equitySeries: EquityPoint[];
  signals: SignalMark[];
  done: boolean;
  stats: PerfStats | null;
};

export type SweepCell = {
  x: number;
  y: number;
  sharpe: number;
  ret: number;
  trades: number;
};

export type CompareReport = {
  vector: BacktestResult;
  nautilus: BacktestResult;
  returnDrag: number;
  sharpeGap: number;
  extraTrades: number;
  avgFillDelayBars: number;
};
