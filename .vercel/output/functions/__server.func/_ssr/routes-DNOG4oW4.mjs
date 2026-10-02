import { i as __toESM } from "../_runtime.mjs";
import { K as require_react, b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Play, c as BookOpen, i as SlidersHorizontal, o as Pause, r as Square, s as Menu, t as X } from "../_libs/lucide-react.mjs";
import { t as create } from "../_libs/zustand.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DNOG4oW4.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var usd0 = new Intl.NumberFormat("en-US", {
	style: "currency",
	currency: "USD",
	maximumFractionDigits: 0
});
var usd2 = new Intl.NumberFormat("en-US", {
	style: "currency",
	currency: "USD",
	minimumFractionDigits: 2,
	maximumFractionDigits: 2
});
var num2 = new Intl.NumberFormat("en-US", {
	minimumFractionDigits: 2,
	maximumFractionDigits: 2
});
var num0 = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });
function fmtUsd(n, digits = 0) {
	if (!Number.isFinite(n)) return "—";
	return digits === 0 ? usd0.format(n) : usd2.format(n);
}
function fmtNum(n, digits = 2) {
	if (!Number.isFinite(n)) return "—";
	return digits === 0 ? num0.format(n) : num2.format(n);
}
/** `n` is a ratio: 0.123 → +12.30% */
function fmtPct(n, digits = 2) {
	if (!Number.isFinite(n)) return "—";
	return `${n > 0 ? "+" : ""}${(n * 100).toFixed(digits)}%`;
}
function fmtPx(n, tick = .01) {
	if (!Number.isFinite(n)) return "—";
	const decimals = tick >= 1 ? 0 : tick >= .01 ? 2 : tick >= 1e-4 ? 4 : 5;
	return n.toLocaleString("en-US", {
		minimumFractionDigits: decimals,
		maximumFractionDigits: decimals
	});
}
function fmtTime(t, timeframe) {
	const d = new Date(t);
	if (timeframe === "1d") return d.toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "2-digit",
		timeZone: "UTC"
	});
	return d.toLocaleString("en-US", {
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
		hour12: false,
		timeZone: "UTC"
	});
}
function fmtDuration(ms) {
	if (ms < 1) return "<1ms";
	if (ms < 1e3) return `${ms.toFixed(1)}ms`;
	return `${(ms / 1e3).toFixed(2)}s`;
}
function pnlClass(n) {
	if (n > 0) return "text-long";
	if (n < 0) return "text-short";
	return "text-muted";
}
/** Mulberry32 — deterministic, fast, good enough for synthetic paths. */
function mulberry32(seed) {
	let s = seed >>> 0;
	return function rng() {
		s |= 0;
		s = s + 1831565813 | 0;
		let t = Math.imul(s ^ s >>> 15, 1 | s);
		t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
		return ((t ^ t >>> 14) >>> 0) / 4294967296;
	};
}
function randn(rng) {
	let u = 0;
	let v = 0;
	while (u === 0) u = rng();
	while (v === 0) v = rng();
	return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}
/** Fixed series end so SSR and client paint the same book. */
var SERIES_END = Date.UTC(2026, 9, 1, 20, 0, 0);
var INSTRUMENTS = [
	{
		id: "BTC-USDT",
		symbol: "BTC-USDT",
		name: "Bitcoin",
		venue: "BINANCE",
		assetClass: "crypto",
		session: "24/7",
		tickSize: .1,
		lotSize: .001,
		currency: "USDT",
		leverage: 2,
		seed: 11631617,
		startPrice: 28420,
		drift: .22,
		vol: .62,
		jumpProb: .012,
		jumpSigma: .035
	},
	{
		id: "ETH-USDT",
		symbol: "ETH-USDT",
		name: "Ether",
		venue: "BINANCE",
		assetClass: "crypto",
		session: "24/7",
		tickSize: .01,
		lotSize: .01,
		currency: "USDT",
		leverage: 2,
		seed: 948993,
		startPrice: 1640,
		drift: .18,
		vol: .72,
		jumpProb: .014,
		jumpSigma: .04
	},
	{
		id: "SPY",
		symbol: "SPY",
		name: "S&P 500 ETF",
		venue: "ARCA",
		assetClass: "equity",
		session: "rth",
		tickSize: .01,
		lotSize: 1,
		currency: "USD",
		leverage: 1,
		seed: 5967873,
		startPrice: 418,
		drift: .09,
		vol: .16,
		jumpProb: .004,
		jumpSigma: .018
	},
	{
		id: "AAPL",
		symbol: "AAPL",
		name: "Apple",
		venue: "XNAS",
		assetClass: "equity",
		session: "rth",
		tickSize: .01,
		lotSize: 1,
		currency: "USD",
		leverage: 1,
		seed: 699166,
		startPrice: 172,
		drift: .12,
		vol: .24,
		jumpProb: .008,
		jumpSigma: .03
	},
	{
		id: "EURUSD",
		symbol: "EURUSD",
		name: "Euro / Dollar",
		venue: "IDEALPRO",
		assetClass: "fx",
		session: "24/5",
		tickSize: 1e-5,
		lotSize: 1e3,
		currency: "USD",
		leverage: 5,
		seed: 974861,
		startPrice: 1.0842,
		drift: .01,
		vol: .08,
		jumpProb: .003,
		jumpSigma: .006
	},
	{
		id: "NQ",
		symbol: "NQ",
		name: "Nasdaq 100",
		venue: "CME",
		assetClass: "future",
		session: "24/5",
		tickSize: .25,
		lotSize: 1,
		currency: "USD",
		leverage: 5,
		seed: 1156369,
		startPrice: 15240,
		drift: .14,
		vol: .22,
		jumpProb: .006,
		jumpSigma: .016
	}
];
var INSTRUMENT_MAP = Object.fromEntries(INSTRUMENTS.map((i) => [i.id, i]));
function getInstrument(id) {
	return INSTRUMENT_MAP[id] ?? INSTRUMENTS[0];
}
var TF_MS = {
	"5m": 3e5,
	"1h": 36e5,
	"1d": 864e5
};
var LOOKBACK_MS = {
	"5m": 10368e5,
	"1h": 12096e6,
	"1d": 9504e7
};
var PERIODS_PER_YEAR = {
	"5m": 105120,
	"1h": 8760,
	"1d": 365
};
function periodsPerYear(tf, session) {
	if (tf === "1d") return session === "24/7" ? 365 : 252;
	if (tf === "1h") {
		if (session === "24/7") return 8760;
		if (session === "24/5") return 6048;
		return 1638;
	}
	if (session === "24/7") return 105120;
	if (session === "24/5") return 72576;
	return 19656;
}
function isSessionOpen(inst, t, tf) {
	const d = new Date(t);
	const day = d.getUTCDay();
	const hour = d.getUTCHours();
	if (inst.session === "24/7") return true;
	if (day === 0 || day === 6) return false;
	if (tf === "1d") return true;
	if (inst.session === "rth") return hour >= 14 && hour < 21;
	return true;
}
function regimeDrift(progress, base, rng, inst) {
	const phase = Math.floor(progress * 3);
	if (inst.assetClass === "fx") return phase === 1 ? base * .2 : -base * .4;
	if (phase === 0) return base * 1.8;
	if (phase === 1) return base * .1;
	return -base * .6;
}
function generateBars(inst, tf) {
	const rng = mulberry32(inst.seed ^ tf.charCodeAt(0) << 8 ^ tf.length);
	const step = TF_MS[tf];
	const start = SERIES_END - LOOKBACK_MS[tf];
	const ppy = PERIODS_PER_YEAR[tf];
	const dt = 1 / ppy;
	const sqrtDt = Math.sqrt(dt);
	const bars = [];
	let price = inst.startPrice;
	let t = start;
	const totalSpan = SERIES_END - start;
	while (t < SERIES_END) {
		if (!isSessionOpen(inst, t, tf)) {
			t += step;
			continue;
		}
		const progress = (t - start) / totalSpan;
		let shock = (regimeDrift(progress, inst.drift, rng, inst) - .5 * inst.vol * inst.vol) * dt + inst.vol * sqrtDt * randn(rng);
		if (rng() < inst.jumpProb * dt * ppy) shock += inst.jumpSigma * randn(rng);
		const open = price;
		const close = Math.max(inst.tickSize, open * Math.exp(shock));
		const range = Math.abs(close - open) + open * inst.vol * sqrtDt * Math.abs(randn(rng)) * .6;
		const wickUp = Math.abs(randn(rng)) * range * .45;
		const wickDn = Math.abs(randn(rng)) * range * .45;
		const high = Math.max(open, close) + wickUp;
		const low = Math.max(inst.tickSize, Math.min(open, close) - wickDn);
		const volume = (inst.assetClass === "crypto" ? 420 + rng() * 180 : inst.assetClass === "fx" ? 8e8 : 32e5) * (.7 + Math.abs(Math.sin((progress + rng() * .05) * Math.PI * 2))) * (1 + Math.abs(shock) * 14);
		bars.push({
			t,
			o: roundTick(open, inst.tickSize),
			h: roundTick(high, inst.tickSize),
			l: roundTick(low, inst.tickSize),
			c: roundTick(close, inst.tickSize),
			v: Math.round(volume)
		});
		price = close;
		t += step;
	}
	return bars;
}
function roundTick(px, tick) {
	return Math.round(px / tick) * tick;
}
var cache = /* @__PURE__ */ new Map();
function getBars(instrumentId, timeframe) {
	const key = `${instrumentId}:${timeframe}`;
	const hit = cache.get(key);
	if (hit) return hit;
	const bars = generateBars(getInstrument(instrumentId), timeframe);
	cache.set(key, bars);
	return bars;
}
function roundToLot(qty, lot) {
	if (lot <= 0) return qty;
	return Math.floor(qty / lot + 1e-12) * lot;
}
function smaAt(src, i, period) {
	if (i + 1 < period) return null;
	let s = 0;
	for (let k = i - period + 1; k <= i; k++) s += src[k];
	return s / period;
}
function sma(src, period) {
	const out = new Array(src.length);
	for (let i = 0; i < src.length; i++) out[i] = smaAt(src, i, period);
	return out;
}
function ema(src, period) {
	const out = new Array(src.length);
	const k = 2 / (period + 1);
	let prev = null;
	let seed = 0;
	for (let i = 0; i < src.length; i++) {
		const v = src[i];
		if (i + 1 < period) {
			seed += v;
			out[i] = null;
			if (i + 1 === period) {
				prev = seed / period;
				out[i] = prev;
			}
			continue;
		}
		prev = v * k + prev * (1 - k);
		out[i] = prev;
	}
	return out;
}
/** Wilder RSI. */
function rsi(src, period) {
	const out = new Array(src.length);
	out[0] = null;
	let avgG = 0;
	let avgL = 0;
	for (let i = 1; i < src.length; i++) {
		const ch = src[i] - src[i - 1];
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
function macd(src, fast = 12, slow = 26, signal = 9) {
	const eFast = ema(src, fast);
	const eSlow = ema(src, slow);
	const line = new Array(src.length);
	for (let i = 0; i < src.length; i++) line[i] = eFast[i] != null && eSlow[i] != null ? eFast[i] - eSlow[i] : null;
	const compact = [];
	const idx = [];
	for (let i = 0; i < line.length; i++) if (line[i] != null) {
		compact.push(line[i]);
		idx.push(i);
	}
	const sigCompact = ema(compact, signal);
	const sig = new Array(src.length).fill(null);
	const hist = new Array(src.length).fill(null);
	for (let k = 0; k < idx.length; k++) {
		const i = idx[k];
		const s = sigCompact[k] ?? null;
		sig[i] = s;
		hist[i] = s != null && line[i] != null ? line[i] - s : null;
	}
	return {
		macd: line,
		signal: sig,
		hist
	};
}
function bollinger(src, period, stdDev) {
	const mid = sma(src, period);
	const upper = new Array(src.length);
	const lower = new Array(src.length);
	for (let i = 0; i < src.length; i++) {
		if (mid[i] == null) {
			upper[i] = null;
			lower[i] = null;
			continue;
		}
		let ss = 0;
		for (let k = i - period + 1; k <= i; k++) {
			const d = src[k] - mid[i];
			ss += d * d;
		}
		const sd = Math.sqrt(ss / period);
		upper[i] = mid[i] + stdDev * sd;
		lower[i] = mid[i] - stdDev * sd;
	}
	return {
		mid,
		upper,
		lower
	};
}
function donchian(high, low, period) {
	const upper = new Array(high.length);
	const lower = new Array(high.length);
	const mid = new Array(high.length);
	for (let i = 0; i < high.length; i++) {
		if (i + 1 < period) {
			upper[i] = lower[i] = mid[i] = null;
			continue;
		}
		let hi = -Infinity;
		let lo = Infinity;
		for (let k = i - period + 1; k <= i; k++) {
			if (high[k] > hi) hi = high[k];
			if (low[k] < lo) lo = low[k];
		}
		upper[i] = hi;
		lower[i] = lo;
		mid[i] = (hi + lo) / 2;
	}
	return {
		upper,
		lower,
		mid
	};
}
function closes(bars) {
	const a = new Float64Array(bars.length);
	for (let i = 0; i < bars.length; i++) a[i] = bars[i].c;
	return a;
}
function highs(bars) {
	const a = new Float64Array(bars.length);
	for (let i = 0; i < bars.length; i++) a[i] = bars[i].h;
	return a;
}
function lows(bars) {
	const a = new Float64Array(bars.length);
	for (let i = 0; i < bars.length; i++) a[i] = bars[i].l;
	return a;
}
var STRATEGIES = [
	{
		id: "sma-cross",
		name: "SMA Cross",
		short: "SMA",
		family: "trend",
		description: "Fast SMA vs slow SMA. Long above the cross, flat or short below.",
		params: [
			{
				key: "fast",
				label: "Fast",
				min: 5,
				max: 40,
				step: 1
			},
			{
				key: "slow",
				label: "Slow",
				min: 15,
				max: 80,
				step: 1
			},
			{
				key: "longShort",
				label: "Long/short",
				min: 0,
				max: 1,
				step: 1
			}
		],
		defaults: {
			fast: 10,
			slow: 30,
			longShort: 0
		},
		longShortDefault: false
	},
	{
		id: "rsi-reversion",
		name: "RSI Reversion",
		short: "RSI",
		family: "reversion",
		description: "Buy oversold crosses, exit into overbought. Classic mean-reversion tape.",
		params: [
			{
				key: "period",
				label: "Period",
				min: 5,
				max: 28,
				step: 1
			},
			{
				key: "oversold",
				label: "Oversold",
				min: 10,
				max: 40,
				step: 1
			},
			{
				key: "overbought",
				label: "Overbought",
				min: 60,
				max: 90,
				step: 1
			}
		],
		defaults: {
			period: 14,
			oversold: 30,
			overbought: 70
		},
		longShortDefault: false
	},
	{
		id: "macd-momentum",
		name: "MACD Momentum",
		short: "MACD",
		family: "trend",
		description: "MACD line vs signal. Trend following with histogram confirmation.",
		params: [
			{
				key: "fast",
				label: "Fast",
				min: 6,
				max: 18,
				step: 1
			},
			{
				key: "slow",
				label: "Slow",
				min: 18,
				max: 40,
				step: 1
			},
			{
				key: "signal",
				label: "Signal",
				min: 5,
				max: 15,
				step: 1
			}
		],
		defaults: {
			fast: 12,
			slow: 26,
			signal: 9
		},
		longShortDefault: false
	},
	{
		id: "bollinger",
		name: "Bollinger",
		short: "BB",
		family: "reversion",
		description: "Mode 0 fades the bands (reversion). Mode 1 buys the break of the upper band.",
		params: [
			{
				key: "period",
				label: "Period",
				min: 10,
				max: 40,
				step: 1
			},
			{
				key: "std",
				label: "Std",
				min: 1,
				max: 3.5,
				step: .1
			},
			{
				key: "mode",
				label: "Mode",
				min: 0,
				max: 1,
				step: 1
			}
		],
		defaults: {
			period: 20,
			std: 2,
			mode: 0
		},
		longShortDefault: false
	},
	{
		id: "donchian",
		name: "Donchian Trend",
		short: "DON",
		family: "breakout",
		description: "Turtle-style channel breakout. Enter N-bar high, exit M-bar low.",
		params: [
			{
				key: "entry",
				label: "Entry",
				min: 10,
				max: 55,
				step: 1
			},
			{
				key: "exit",
				label: "Exit",
				min: 5,
				max: 30,
				step: 1
			},
			{
				key: "longShort",
				label: "Long/short",
				min: 0,
				max: 1,
				step: 1
			}
		],
		defaults: {
			entry: 20,
			exit: 10,
			longShort: 0
		},
		longShortDefault: false
	}
];
var STRATEGY_MAP = Object.fromEntries(STRATEGIES.map((s) => [s.id, s]));
function getStrategy(id) {
	return STRATEGY_MAP[id] ?? STRATEGIES[0];
}
function computeIndicators(bars, strategyId, params) {
	const c = closes(bars);
	const h = highs(bars);
	const l = lows(bars);
	const book = {};
	if (strategyId === "sma-cross") {
		const fast = Math.max(2, Math.round(params.fast ?? 10));
		const slow = Math.max(fast + 1, Math.round(params.slow ?? 30));
		book.fast = sma(c, fast);
		book.slow = sma(c, slow);
	} else if (strategyId === "rsi-reversion") book.rsi = rsi(c, Math.max(2, Math.round(params.period ?? 14)));
	else if (strategyId === "macd-momentum") {
		const m = macd(c, Math.max(2, Math.round(params.fast ?? 12)), Math.max(3, Math.round(params.slow ?? 26)), Math.max(2, Math.round(params.signal ?? 9)));
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
function vectorSignals(bars, strategyId, params, book) {
	const n = bars.length;
	const want = new Int8Array(n);
	const longShort = (params.longShort ?? 0) >= 1 ? 1 : 0;
	if (strategyId === "sma-cross") {
		const fast = book.fast;
		const slow = book.slow;
		for (let i = 0; i < n; i++) {
			if (fast[i] == null || slow[i] == null) continue;
			if (fast[i] > slow[i]) want[i] = 1;
			else want[i] = longShort ? -1 : 0;
		}
	} else if (strategyId === "rsi-reversion") {
		const r = book.rsi;
		const os = params.oversold ?? 30;
		const ob = params.overbought ?? 70;
		let pos = 0;
		for (let i = 1; i < n; i++) {
			pos = want[i - 1];
			if (r[i] == null || r[i - 1] == null) {
				want[i] = pos;
				continue;
			}
			if (pos <= 0 && r[i - 1] <= os && r[i] > os) pos = 1;
			else if (pos >= 0 && r[i - 1] >= ob && r[i] < ob) pos = 0;
			want[i] = pos;
		}
	} else if (strategyId === "macd-momentum") {
		const line = book.macd;
		const sig = book.signal;
		for (let i = 0; i < n; i++) {
			if (line[i] == null || sig[i] == null) continue;
			want[i] = line[i] > sig[i] ? 1 : 0;
		}
	} else if (strategyId === "bollinger") {
		const mode = params.mode ?? 0;
		const upper = book.upper;
		const lower = book.lower;
		const mid = book.mid;
		let pos = 0;
		for (let i = 1; i < n; i++) {
			pos = want[i - 1];
			const c = bars[i].c;
			if (upper[i] == null || lower[i] == null || mid[i] == null) {
				want[i] = pos;
				continue;
			}
			if (mode < .5) {
				if (pos <= 0 && c < lower[i]) pos = 1;
				else if (pos > 0 && c > mid[i]) pos = 0;
			} else if (pos <= 0 && c > upper[i]) pos = 1;
			else if (pos > 0 && c < mid[i]) pos = 0;
			want[i] = pos;
		}
	} else {
		const eh = book.entryHigh;
		const el = book.entryLow;
		const xl = book.exitLow;
		const xh = book.exitHigh;
		let pos = 0;
		for (let i = 1; i < n; i++) {
			pos = want[i - 1];
			const c = bars[i].c;
			if (eh[i] == null || xl[i] == null) {
				want[i] = pos;
				continue;
			}
			if (pos <= 0 && c >= eh[i]) pos = 1;
			else if (pos > 0 && c <= xl[i]) pos = 0;
			if (longShort) {
				if (pos >= 0 && el[i] != null && c <= el[i]) pos = -1;
				else if (pos < 0 && xh[i] != null && c >= xh[i]) pos = 0;
			}
			want[i] = pos;
		}
	}
	return { want };
}
function emptyStats(capital, bars) {
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
		years: 0
	};
}
function buildEquity(bars, equity, cash, position) {
	const out = new Array(bars.length);
	let peak = equity[0] ?? 0;
	for (let i = 0; i < bars.length; i++) {
		const eq = equity[i] ?? 0;
		if (eq > peak) peak = eq;
		const dd = peak > 0 ? eq / peak - 1 : 0;
		out[i] = {
			t: bars[i].t,
			equity: eq,
			drawdown: dd,
			cash: cash[i] ?? 0,
			position: position[i] ?? 0
		};
	}
	return out;
}
function computeStats(capital, inst, tf, bars, equity, trades) {
	if (bars.length < 2 || equity.length < 2) return emptyStats(capital, bars.length);
	const firstT = bars[0].t;
	const lastT = bars[bars.length - 1].t;
	const years = Math.max((lastT - firstT) / 315576e5, 1 / 365);
	const finalEquity = equity[equity.length - 1].equity;
	const totalReturn = capital > 0 ? finalEquity / capital - 1 : 0;
	const cagr = capital > 0 ? Math.pow(Math.max(finalEquity, 1e-9) / capital, 1 / years) - 1 : 0;
	const ppy = periodsPerYear(tf, inst.session);
	const rets = [];
	for (let i = 1; i < equity.length; i++) {
		const prev = equity[i - 1].equity;
		if (prev > 0) rets.push(equity[i].equity / prev - 1);
	}
	const n = rets.length;
	const mean = n ? rets.reduce((a, b) => a + b, 0) / n : 0;
	let varr = 0;
	for (const r of rets) varr += (r - mean) * (r - mean);
	const std = n > 1 ? Math.sqrt(varr / (n - 1)) : 0;
	const sharpe = std > 0 ? mean / std * Math.sqrt(ppy) : 0;
	const downs = rets.filter((r) => r < 0);
	let downVar = 0;
	for (const r of downs) downVar += r * r;
	const downStd = downs.length > 1 ? Math.sqrt(downVar / downs.length) : 0;
	const sortino = downStd > 0 ? mean / downStd * Math.sqrt(ppy) : 0;
	let maxDd = 0;
	for (const p of equity) if (p.drawdown < maxDd) maxDd = p.drawdown;
	const calmar = maxDd < 0 ? cagr / Math.abs(maxDd) : 0;
	const vol = std * Math.sqrt(ppy);
	const pnls = trades.filter((t) => t.reason.includes("flat") || t.reason.includes("flip") || t.reason.includes("eod") || t.reason.includes("flatten") || t.pnl !== 0 && !t.reason.includes("entry")).map((t) => t.pnl);
	const wins = pnls.filter((p) => p > 0);
	const losses = pnls.filter((p) => p < 0);
	const gp = wins.reduce((a, b) => a + b, 0);
	const gl = Math.abs(losses.reduce((a, b) => a + b, 0));
	const exposure = equity.length === 0 ? 0 : equity.filter((p) => Math.abs(p.position) > 1e-12).length / equity.length;
	const turnover = capital > 0 ? trades.reduce((a, t) => a + Math.abs(t.qty * t.price), 0) / (capital * Math.max(years, 1e-6)) : 0;
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
		years
	};
}
/**
* Vectorbt-style from_signals:
* one pass over typed arrays, target position from the signal lane,
* fills at next-open (default) or close, proportional sizing, fees + slippage.
*/
function runVector(config, bars) {
	const t0 = performance.now();
	const inst = getInstrument(config.instrumentId);
	const n = bars.length;
	const book = computeIndicators(bars, config.strategyId, config.params);
	const { want } = vectorSignals(bars, config.strategyId, config.params, book);
	const fee = config.feeBps / 1e4;
	const slip = config.slippageBps / 1e4;
	const nextOpen = config.fillOn !== "close";
	const equity = new Float64Array(n);
	const cashArr = new Float64Array(n);
	const posArr = new Float64Array(n);
	let cash = config.capital;
	let qty = 0;
	let avg = 0;
	let realized = 0;
	const trades = [];
	const signals = [];
	let tradeSeq = 1;
	const fillPriceAt = (signalIndex, side) => {
		const idx = nextOpen ? Math.min(signalIndex + 1, n - 1) : signalIndex;
		return {
			idx,
			px: (nextOpen ? bars[idx].o : bars[idx].c) * (1 + side * slip)
		};
	};
	const closePosition = (signalIndex, reason) => {
		if (Math.abs(qty) < inst.lotSize / 2) return;
		const { idx, px } = fillPriceAt(signalIndex, -(qty > 0 ? 1 : -1));
		const feeAmt = Math.abs(qty) * px * fee;
		const pnl = qty * (px - avg) - feeAmt;
		cash += qty * px - feeAmt;
		realized += pnl;
		trades.push({
			id: `T-${tradeSeq++}`,
			side: qty > 0 ? "SELL" : "BUY",
			qty: Math.abs(qty),
			price: px,
			time: bars[idx].t,
			fee: feeAmt,
			pnl,
			reason,
			barIndex: idx
		});
		signals.push({
			t: bars[idx].t,
			kind: "exit",
			side: qty > 0 ? "SELL" : "BUY",
			barIndex: idx
		});
		qty = 0;
		avg = 0;
	};
	const openPosition = (signalIndex, dir, reason) => {
		const { idx, px } = fillPriceAt(signalIndex, dir);
		const notional = cash * .99;
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
			time: bars[idx].t,
			fee: feeAmt,
			pnl: 0,
			reason,
			barIndex: idx
		});
		signals.push({
			t: bars[idx].t,
			kind: "entry",
			side: dir > 0 ? "BUY" : "SELL",
			barIndex: idx
		});
	};
	for (let i = 0; i < n; i++) {
		const target = want[i] ?? 0;
		const pos = qty > 0 ? 1 : qty < 0 ? -1 : 0;
		if (target !== pos) {
			if (pos !== 0) closePosition(i, target === 0 ? "signal-flat" : "signal-flip");
			if (target !== 0) openPosition(i, target, "signal-entry");
		}
		const mark = bars[i].c;
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
		fillOn: config.fillOn
	};
}
function sweepSma(config, bars, fastMin = 5, fastMax = 24, slowMin = 20, slowMax = 60, step = 2) {
	const cells = [];
	for (let f = fastMin; f <= fastMax; f += step) for (let s = slowMin; s <= slowMax; s += step) {
		if (s <= f) continue;
		const r = runVector({
			...config,
			strategyId: "sma-cross",
			params: {
				...config.params,
				fast: f,
				slow: s
			}
		}, bars);
		cells.push({
			fast: f,
			slow: s,
			sharpe: r.stats.sharpe,
			ret: r.stats.totalReturn,
			trades: r.stats.trades
		});
	}
	return cells;
}
/**
* NautilusTrader-style event engine:
* clock → bar → strategy intent → matching (next-open market, touch limits) →
* portfolio mark-to-market. Same fill model for historical backtest and dry-run.
*/
var NautilusEngine = class {
	config;
	bars;
	inst;
	book;
	want;
	i = -1;
	cash;
	qty = 0;
	avg = 0;
	realized = 0;
	seq = 1;
	evtSeq = 1;
	orders = [];
	trades = [];
	events = [];
	signals = [];
	equity;
	cashArr;
	posArr;
	autoStrategy;
	t0 = 0;
	fillOn;
	constructor(config, bars, opts) {
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
	submitMarket(side, qty, reason) {
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
			submitIndex: Math.max(this.i, 0)
		});
		this.log(this.stamp(), "OrderSubmitted", `${side} MKT ${q} ${this.inst.symbol} · ${reason}`, "order");
	}
	submitLimit(side, qty, limitPrice, reason) {
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
			submitIndex: Math.max(this.i, 0)
		});
		this.log(this.stamp(), "OrderAccepted", `${side} LMT ${q} @ ${limitPrice} ${this.inst.symbol}`, "order");
	}
	flattenNow(reason = "flatten") {
		if (Math.abs(this.qty) < this.inst.lotSize / 2) return;
		const idx = Math.max(this.i, 0);
		const bar = this.bars[idx];
		if (!bar) return;
		const side = this.qty > 0 ? "SELL" : "BUY";
		const o = {
			id: `O-${this.seq++}`,
			side,
			type: "MARKET",
			qty: Math.abs(this.qty),
			status: "ACCEPTED",
			reason,
			submittedAt: bar.t,
			submitIndex: idx - 1
		};
		const feeR = this.config.feeBps / 1e4;
		this.fill(o, bar.c, bar, feeR);
		this.mark(bar);
	}
	cancelAll() {
		for (const o of this.orders) if (o.status === "WORKING" || o.status === "SUBMITTED" || o.status === "ACCEPTED") {
			o.status = "CANCELLED";
			this.log(this.stamp(), "OrderCancelled", o.id, "order");
		}
	}
	step() {
		if (this.i >= this.bars.length - 1) return false;
		this.i += 1;
		const bar = this.bars[this.i];
		this.match(bar);
		if (this.autoStrategy) this.runStrategy(bar);
		this.mark(bar);
		return this.i < this.bars.length - 1;
	}
	runAll() {
		while (this.step());
		if (Math.abs(this.qty) >= this.inst.lotSize / 2) this.flattenNow("eod-flatten");
		return this.toResult();
	}
	toResult() {
		const used = this.i >= 0 ? this.i + 1 : 0;
		const bars = this.bars.slice(0, Math.max(used, 0));
		const equityPts = buildEquity(bars, this.equity.subarray(0, bars.length), this.cashArr.subarray(0, bars.length), this.posArr.subarray(0, bars.length));
		const stats = computeStats(this.config.capital, this.inst, this.config.timeframe, bars, equityPts, this.trades);
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
			fillOn: this.config.fillOn
		};
	}
	snapshot() {
		const bar = this.i >= 0 ? this.bars[this.i] : null;
		const mark = bar?.c ?? 0;
		const unrealized = this.qty * (mark - this.avg);
		const used = this.i >= 0 ? this.i + 1 : 0;
		const bars = this.bars.slice(0, used);
		const equityPts = buildEquity(bars, this.equity.subarray(0, used), this.cashArr.subarray(0, used), this.posArr.subarray(0, used));
		const stats = used > 2 ? computeStats(this.config.capital, this.inst, this.config.timeframe, bars, equityPts, this.trades) : null;
		const orders = this.orders.filter((o) => o.status === "SUBMITTED" || o.status === "ACCEPTED" || o.status === "WORKING").map((o) => ({
			id: o.id,
			side: o.side,
			type: o.type,
			qty: o.qty,
			limitPrice: o.limitPrice,
			status: o.status === "WORKING" ? "WORKING" : o.status === "ACCEPTED" ? "ACCEPTED" : "SUBMITTED",
			reason: o.reason,
			submittedAt: o.submittedAt
		}));
		const position = {
			qty: this.qty,
			avgPrice: this.avg,
			unrealized,
			realized: this.realized
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
			stats
		};
	}
	runStrategy(bar) {
		if (this.i < 1) return;
		if (this.orders.some((o) => o.status === "SUBMITTED" || o.status === "ACCEPTED" || o.status === "WORKING")) return;
		const w = this.want[this.i] ?? 0;
		const px = bar.c;
		const delta = w * roundToLot(Math.max(this.cash + this.qty * px, 0) * .98 / px, this.inst.lotSize) - this.qty;
		if (Math.abs(delta) < this.inst.lotSize) return;
		const side = delta > 0 ? "BUY" : "SELL";
		const reason = w === 0 ? "strategy-flat" : Math.sign(this.qty) !== 0 && Math.sign(this.qty) !== w ? "strategy-flip" : "strategy-entry";
		this.submitMarket(side, Math.abs(delta), reason);
	}
	match(bar) {
		const feeR = this.config.feeBps / 1e4;
		const slipR = this.config.slippageBps / 1e4;
		const nextOpen = this.fillOn !== "close";
		for (const o of this.orders) if (o.status === "SUBMITTED" && o.type === "MARKET") {
			o.status = "ACCEPTED";
			this.log(bar.t, "OrderAccepted", `${o.id} accepted — working the next auction.`, "order");
		}
		for (const o of this.orders) {
			if (o.status === "FILLED" || o.status === "CANCELLED" || o.status === "REJECTED") continue;
			if (o.type === "MARKET" && o.status === "ACCEPTED") {
				if (!(nextOpen ? this.i > o.submitIndex : true)) continue;
				const px = (nextOpen ? bar.o : bar.c) * (1 + (o.side === "BUY" ? 1 : -1) * slipR);
				this.fill(o, px, bar, feeR);
				continue;
			}
			if (o.type === "LIMIT" && o.limitPrice != null && (o.status === "WORKING" || o.status === "ACCEPTED")) {
				o.status = "WORKING";
				const buy = o.side === "BUY";
				if (!(buy ? bar.l <= o.limitPrice : bar.h >= o.limitPrice)) continue;
				const px = (buy ? bar.o < o.limitPrice : bar.o > o.limitPrice) ? bar.o : o.limitPrice;
				this.fill(o, px, bar, feeR);
			}
		}
	}
	fill(o, px, bar, feeR) {
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
			realizedThis = Math.min(Math.abs(prevQty), q) * (px - this.avg) * Math.sign(prevQty);
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
			} else if (Math.sign(this.qty) === Math.sign(signed)) this.avg = px;
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
			barIndex: this.i
		});
		this.signals.push({
			t: bar.t,
			kind: closedOut ? "exit" : "entry",
			side: o.side,
			barIndex: this.i
		});
		this.log(bar.t, "OrderFilled", `${o.side} ${q} ${this.inst.symbol} @ ${px.toPrecision(6)}  fee ${feeAmt.toFixed(2)}`, "fill");
		if (Math.abs(this.qty) < this.inst.lotSize / 2) this.log(bar.t, "PositionClosed", `Realized ${this.realized.toFixed(2)}`, "fill");
		else if (prevQty === 0) this.log(bar.t, "PositionOpened", `${this.qty} @ ${this.avg.toPrecision(6)}`, "fill");
		else this.log(bar.t, "PositionChanged", `qty ${this.qty}`, "info");
	}
	mark(bar) {
		this.equity[this.i] = this.cash + this.qty * bar.c;
		this.cashArr[this.i] = this.cash;
		this.posArr[this.i] = this.qty;
	}
	stamp() {
		return this.i >= 0 ? this.bars[this.i].t : this.bars[0]?.t ?? 0;
	}
	log(time, type, message, severity) {
		this.events.push({
			id: `E-${this.evtSeq++}`,
			time,
			type,
			message,
			severity
		});
	}
};
function runNautilus(config, bars) {
	return new NautilusEngine(config, bars, { autoStrategy: true }).runAll();
}
function runCompare(config, bars) {
	const vector = runVector(config, bars);
	const nautilus = runNautilus(config, bars);
	const vExits = vector.signals.filter((s) => s.kind === "exit");
	const nExits = nautilus.signals.filter((s) => s.kind === "exit");
	const n = Math.min(vExits.length, nExits.length);
	let delay = 0;
	for (let i = 0; i < n; i++) delay += nExits[i].barIndex - vExits[i].barIndex;
	const avgFillDelayBars = n ? delay / n : 0;
	return {
		vector,
		nautilus,
		returnDrag: vector.stats.totalReturn - nautilus.stats.totalReturn,
		sharpeGap: vector.stats.sharpe - nautilus.stats.sharpe,
		extraTrades: vector.stats.trades - nautilus.stats.trades,
		avgFillDelayBars
	};
}
var DEFAULT_CONFIG = {
	instrumentId: "BTC-USDT",
	timeframe: "1d",
	strategyId: "sma-cross",
	capital: 1e5,
	feeBps: 5,
	slippageBps: 2,
	fillOn: "next-open",
	params: { ...getStrategy("sma-cross").defaults }
};
var CAPITAL_PRESETS = [
	25e3,
	1e5,
	25e4,
	1e6
];
var SPEED_PRESETS = [
	{
		id: 1,
		label: "1×"
	},
	{
		id: 4,
		label: "4×"
	},
	{
		id: 12,
		label: "12×"
	},
	{
		id: 36,
		label: "36×"
	}
];
var live = null;
var defaultVector = runVector(DEFAULT_CONFIG, getBars(DEFAULT_CONFIG.instrumentId, DEFAULT_CONFIG.timeframe));
function barsFor(config) {
	return getBars(config.instrumentId, config.timeframe);
}
var useDesk = create((set, get) => ({
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
		set({
			config: {
				...get().config,
				...patch
			},
			nautilus: null,
			compare: null,
			sweep: null
		});
		get().runVectorNow();
	},
	setParam: (key, value) => {
		set({
			config: {
				...get().config,
				params: {
					...get().config.params,
					[key]: value
				}
			},
			nautilus: null,
			compare: null,
			sweep: null
		});
		get().runVectorNow();
	},
	setStrategy: (id) => {
		const meta = getStrategy(id);
		set({
			config: {
				...get().config,
				strategyId: id,
				params: { ...meta.defaults }
			},
			nautilus: null,
			compare: null,
			sweep: null
		});
		get().runVectorNow();
	},
	runVectorNow: () => {
		const { config } = get();
		set({ vector: runVector(config, barsFor(config)) });
	},
	runNautilusNow: () => {
		const { config } = get();
		set({
			nautilus: runNautilus(config, barsFor(config)),
			mode: get().mode === "vector" ? "nautilus" : get().mode
		});
	},
	runCompareNow: () => {
		const { config } = get();
		const compare = runCompare(config, barsFor(config));
		set({
			compare,
			vector: compare.vector,
			nautilus: compare.nautilus,
			mode: "compare"
		});
	},
	runSweep: () => {
		const { config } = get();
		set({
			sweep: sweepSma(config, barsFor(config)),
			mode: "vector"
		});
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
			dryPaused: false
		});
	},
	stepDry: () => {
		if (!live) return;
		live.step();
		const snap = live.snapshot();
		set({
			dry: snap,
			dryRunning: snap.done ? false : get().dryRunning,
			nautilus: snap.done ? live.toResult() : get().nautilus
		});
	},
	togglePause: () => set({ dryPaused: !get().dryPaused }),
	haltDry: () => {
		if (!live) {
			set({
				dryRunning: false,
				dryPaused: false
			});
			return;
		}
		live.flattenNow("halt");
		const nautilus = live.toResult();
		const dry = live.snapshot();
		live = null;
		set({
			dryRunning: false,
			dryPaused: false,
			dry,
			nautilus
		});
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
	setSetupOpen: (setupOpen) => set({ setupOpen })
}));
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var buttonVariants = cva("inline-flex items-center justify-center font-medium select-none transition-[opacity,transform,background-color,color,box-shadow] duration-150 ease-out disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:not-disabled:scale-[0.96]", {
	variants: {
		variant: {
			primary: "bg-accent text-accent-fg hover:opacity-90",
			secondary: "bg-elevated text-fg shadow-[var(--shadow-border)] hover:shadow-[var(--shadow-border-hover)]",
			ghost: "text-muted hover:bg-elevated hover:text-fg",
			long: "bg-long text-bg hover:opacity-90",
			short: "bg-short text-fg hover:opacity-90",
			warn: "bg-warn/15 text-warn hover:bg-warn/25"
		},
		size: {
			sm: "h-8 gap-1.5 rounded-md px-3 text-xs",
			md: "h-10 gap-2 rounded-lg px-4 text-sm",
			lg: "h-11 gap-2 rounded-lg px-5 text-sm",
			icon: "size-10 rounded-lg",
			"icon-sm": "size-8 rounded-md"
		}
	},
	defaultVariants: {
		variant: "primary",
		size: "md"
	}
});
function Button({ className, variant, size, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		className: cn(buttonVariants({
			variant,
			size
		}), className),
		...props
	});
}
function Field({ label, hint, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "flex flex-col gap-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "flex items-baseline justify-between gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-2xs font-medium tracking-wide text-muted uppercase",
				children: label
			}), hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-mono text-2xs text-subtle tabular",
				children: hint
			}) : null]
		}), children]
	});
}
var controlClass = "h-10 w-full rounded-lg bg-elevated px-3 text-sm text-fg shadow-[var(--shadow-border)] outline-none transition-[box-shadow] duration-150 placeholder:text-subtle hover:shadow-[var(--shadow-border-hover)] focus-visible:ring-2 focus-visible:ring-ring";
function Input({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		className: cn(controlClass, "font-mono tabular", className),
		...props
	});
}
function NativeSelect({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
		className: cn(controlClass, "appearance-none bg-[length:12px] pr-8", className),
		style: {
			backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%238b919a' stroke-width='2'><path d='m6 9 6 6 6-6'/></svg>\")",
			backgroundRepeat: "no-repeat",
			backgroundPosition: "right 10px center"
		},
		...props
	});
}
function Segmented({ value, onChange, options, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("flex rounded-xl bg-elevated p-1 shadow-[var(--shadow-border)]", className),
		children: options.map((opt) => {
			const on = opt.id === value;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => onChange(opt.id),
				className: cn("relative min-h-9 flex-1 rounded-lg px-2.5 text-xs font-medium transition-[color,background-color] duration-150", on ? "bg-accent text-accent-fg" : "text-muted hover:text-fg"),
				children: opt.label
			}, opt.id);
		})
	});
}
function SliderRow({ label, value, min, max, step, onChange, format }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "flex flex-col gap-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "flex items-baseline justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-2xs font-medium tracking-wide text-muted uppercase",
				children: label
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-mono text-xs text-fg tabular",
				children: format ? format(value) : value
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			type: "range",
			min,
			max,
			step,
			value,
			onChange: (e) => onChange(Number(e.target.value)),
			className: "h-8 w-full cursor-pointer appearance-none bg-transparent accent-accent"
		})]
	});
}
function readTheme(el) {
	const s = getComputedStyle(el);
	const g = (name, fb) => s.getPropertyValue(name).trim() || fb;
	return {
		long: g("--color-long", "#6eab8a"),
		short: g("--color-short", "#c96a6a"),
		muted: g("--color-muted", "#8b919a"),
		subtle: g("--color-subtle", "#5c636c"),
		fg: g("--color-fg", "#e8eaed"),
		border: g("--color-border", "rgba(232,234,237,0.12)"),
		accent: g("--color-accent", "#d4d8de"),
		bg: g("--color-bg", "#08090b"),
		surface: g("--color-surface", "#101214")
	};
}
function niceTicks(min, max, count) {
	if (!Number.isFinite(min) || !Number.isFinite(max) || min === max) return [min || 0];
	const raw = (max - min) / Math.max(count, 1);
	const mag = Math.pow(10, Math.floor(Math.log10(raw)));
	const norm = raw / mag;
	const step = (norm < 1.5 ? 1 : norm < 3 ? 2 : norm < 7 ? 5 : 10) * mag;
	const start = Math.ceil(min / step) * step;
	const ticks = [];
	for (let v = start; v <= max + step * .01; v += step) ticks.push(v);
	return ticks;
}
function visibleBars(bars, cursor, follow, window = 160) {
	if (!follow || cursor == null) return {
		bars,
		offset: 0
	};
	const end = Math.min(bars.length, cursor + 1);
	const start = Math.max(0, end - window);
	return {
		bars: bars.slice(start, end),
		offset: start
	};
}
function PriceChart({ result, dry, timeframe, tickSize }) {
	const wrapRef = (0, import_react.useRef)(null);
	const canvasRef = (0, import_react.useRef)(null);
	const [hover, setHover] = (0, import_react.useState)(null);
	const sourceBars = dry?.bar ? (result?.bars ?? []).slice(0, dry.index + 1) : result?.bars ?? [];
	const { bars, offset } = visibleBars(sourceBars.length ? sourceBars : result?.bars ?? [], dry ? dry.index : null, Boolean(dry), dry ? 140 : 9999);
	const signals = (dry ? dry.signals : result?.signals) ?? [];
	const indicators = result?.indicators ?? {};
	(0, import_react.useEffect)(() => {
		const canvas = canvasRef.current;
		const wrap = wrapRef.current;
		if (!canvas || !wrap) return;
		const theme = readTheme(wrap);
		const dpr = Math.min(window.devicePixelRatio || 1, 2);
		const w = wrap.clientWidth;
		const h = wrap.clientHeight;
		canvas.width = Math.max(1, Math.floor(w * dpr));
		canvas.height = Math.max(1, Math.floor(h * dpr));
		canvas.style.width = `${w}px`;
		canvas.style.height = `${h}px`;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		ctx.clearRect(0, 0, w, h);
		ctx.fillStyle = theme.surface;
		ctx.fillRect(0, 0, w, h);
		if (bars.length < 2) {
			ctx.fillStyle = theme.muted;
			ctx.font = "13px IBM Plex Sans, sans-serif";
			ctx.fillText("No bars in view.", 24, h / 2);
			return;
		}
		const padL = 58;
		const padR = 12;
		const padT = 16;
		const padB = 22;
		const volH = Math.max(36, h * .18);
		const plotH = h - padT - padB - volH - 8;
		const plotW = w - padL - padR;
		const plotX = padL;
		const plotY = padT;
		let lo = Infinity;
		let hi = -Infinity;
		let vmax = 1;
		for (const b of bars) {
			if (b.l < lo) lo = b.l;
			if (b.h > hi) hi = b.h;
			if (b.v > vmax) vmax = b.v;
		}
		bookLast(indicators, "mid");
		bookLast(indicators, "upper");
		bookLast(indicators, "lower");
		const pad = (hi - lo) * .06 || hi * .01;
		lo -= pad;
		hi += pad;
		const y = (px) => plotY + (hi - px) / (hi - lo) * plotH;
		const slot = plotW / bars.length;
		const bodyW = Math.max(1, Math.min(9, slot * .62));
		const xAt = (i) => plotX + (i + .5) * slot;
		ctx.strokeStyle = theme.border;
		ctx.lineWidth = 1;
		ctx.font = "10px IBM Plex Mono, monospace";
		ctx.fillStyle = theme.subtle;
		ctx.textAlign = "right";
		ctx.textBaseline = "middle";
		for (const tick of niceTicks(lo, hi, 5)) {
			const yy = y(tick);
			ctx.beginPath();
			ctx.moveTo(plotX, yy);
			ctx.lineTo(plotX + plotW, yy);
			ctx.stroke();
			ctx.fillText(fmtPx(tick, tickSize), 50, yy);
		}
		const bbU = indicators.upper;
		const bbM = indicators.mid;
		const bbL = indicators.lower;
		if (bbU && bbL && bbM) {
			ctx.beginPath();
			let started = false;
			for (let i = 0; i < bars.length; i++) {
				const u = bbU[i + offset];
				if (u == null) continue;
				const xx = xAt(i);
				if (!started) {
					ctx.moveTo(xx, y(u));
					started = true;
				} else ctx.lineTo(xx, y(u));
			}
			for (let i = bars.length - 1; i >= 0; i--) {
				const l = bbL[i + offset];
				if (l == null) continue;
				ctx.lineTo(xAt(i), y(l));
			}
			ctx.closePath();
			ctx.fillStyle = "color-mix(in oklab, var(--color-accent) 8%, transparent)";
			ctx.fillStyle = hexAlpha(theme.accent, .08);
			ctx.fill();
		}
		const overlayKeys = [
			"fast",
			"slow",
			"mid"
		];
		const overlayCols = [
			theme.accent,
			theme.muted,
			theme.subtle
		];
		overlayKeys.forEach((key, ki) => {
			const arr = indicators[key];
			if (!arr) return;
			ctx.beginPath();
			ctx.strokeStyle = overlayCols[ki] ?? theme.muted;
			ctx.lineWidth = 1.15;
			let started = false;
			for (let i = 0; i < bars.length; i++) {
				const v = arr[i + offset];
				if (v == null) continue;
				const xx = xAt(i);
				const yy = y(v);
				if (!started) {
					ctx.moveTo(xx, yy);
					started = true;
				} else ctx.lineTo(xx, yy);
			}
			ctx.stroke();
		});
		for (let i = 0; i < bars.length; i++) {
			const b = bars[i];
			const xx = xAt(i);
			const up = b.c >= b.o;
			ctx.strokeStyle = up ? theme.long : theme.short;
			ctx.fillStyle = up ? theme.long : theme.short;
			ctx.beginPath();
			ctx.moveTo(xx, y(b.h));
			ctx.lineTo(xx, y(b.l));
			ctx.stroke();
			const top = y(Math.max(b.o, b.c));
			const bot = y(Math.min(b.o, b.c));
			const bh = Math.max(1, bot - top);
			ctx.fillRect(xx - bodyW / 2, top, bodyW, bh);
		}
		const volY = plotY + plotH + 8;
		for (let i = 0; i < bars.length; i++) {
			const b = bars[i];
			const xx = xAt(i);
			const vh = b.v / vmax * volH;
			ctx.fillStyle = b.c >= b.o ? hexAlpha(theme.long, .35) : hexAlpha(theme.short, .35);
			ctx.fillRect(xx - bodyW / 2, volY + volH - vh, bodyW, vh);
		}
		for (const s of signals) {
			const i = s.barIndex - offset;
			if (i < 0 || i >= bars.length) continue;
			const b = bars[i];
			const xx = xAt(i);
			ctx.fillStyle = s.side === "BUY" ? theme.long : theme.short;
			ctx.beginPath();
			if (s.kind === "entry") {
				const yy = y(b.l) + 7;
				ctx.moveTo(xx, yy);
				ctx.lineTo(xx - 4, yy + 7);
				ctx.lineTo(xx + 4, yy + 7);
			} else {
				const yy = y(b.h) - 7;
				ctx.moveTo(xx, yy);
				ctx.lineTo(xx - 4, yy - 7);
				ctx.lineTo(xx + 4, yy - 7);
			}
			ctx.closePath();
			ctx.fill();
		}
		ctx.fillStyle = theme.subtle;
		ctx.textAlign = "left";
		ctx.textBaseline = "top";
		ctx.font = "10px IBM Plex Mono, monospace";
		const first = bars[0];
		const last = bars[bars.length - 1];
		ctx.fillText(fmtTime(first.t, timeframe), plotX, h - 16);
		ctx.textAlign = "right";
		ctx.fillText(fmtTime(last.t, timeframe), plotX + plotW, h - 16);
		if (hover) {
			const i = Math.max(0, Math.min(bars.length - 1, hover.i));
			const b = bars[i];
			const xx = xAt(i);
			ctx.strokeStyle = hexAlpha(theme.fg, .25);
			ctx.setLineDash([3, 3]);
			ctx.beginPath();
			ctx.moveTo(xx, plotY);
			ctx.lineTo(xx, volY + volH);
			ctx.stroke();
			ctx.setLineDash([]);
			ctx.fillStyle = theme.fg;
			ctx.font = "11px IBM Plex Mono, monospace";
			ctx.textAlign = "left";
			ctx.textBaseline = "top";
			const line = `${fmtTime(b.t, timeframe)}  O ${fmtPx(b.o, tickSize)}  H ${fmtPx(b.h, tickSize)}  L ${fmtPx(b.l, tickSize)}  C ${fmtPx(b.c, tickSize)}`;
			ctx.fillText(line, 62, 4);
		}
	}, [
		bars,
		hover,
		indicators,
		offset,
		signals,
		tickSize,
		timeframe
	]);
	function onMove(e) {
		const wrap = wrapRef.current;
		if (!wrap || bars.length < 2) return;
		const rect = wrap.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const padL = 58;
		const plotW = rect.width - padL - 12;
		const i = Math.floor((x - padL) / plotW * bars.length);
		setHover({
			i,
			x,
			y: e.clientY - rect.top
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref: wrapRef,
		className: "relative h-full min-h-64 w-full overflow-hidden rounded-[inherit] bg-surface",
		onPointerMove: onMove,
		onPointerLeave: () => setHover(null),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
			ref: canvasRef,
			className: "block h-full w-full"
		})
	});
}
function bookLast(book, key) {
	return book[key];
}
function hexAlpha(color, a) {
	if (color.startsWith("#") && color.length === 7) return `rgba(${parseInt(color.slice(1, 3), 16)},${parseInt(color.slice(3, 5), 16)},${parseInt(color.slice(5, 7), 16)},${a})`;
	return color;
}
function EquityChart({ primary, secondary, dry }) {
	const wrapRef = (0, import_react.useRef)(null);
	const canvasRef = (0, import_react.useRef)(null);
	const series = dry?.equitySeries?.length ? dry.equitySeries : primary?.equity ?? [];
	const other = secondary?.equity ?? [];
	(0, import_react.useEffect)(() => {
		const canvas = canvasRef.current;
		const wrap = wrapRef.current;
		if (!canvas || !wrap) return;
		const theme = readTheme(wrap);
		const dpr = Math.min(window.devicePixelRatio || 1, 2);
		const w = wrap.clientWidth;
		const h = wrap.clientHeight;
		canvas.width = Math.max(1, Math.floor(w * dpr));
		canvas.height = Math.max(1, Math.floor(h * dpr));
		canvas.style.width = `${w}px`;
		canvas.style.height = `${h}px`;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		ctx.fillStyle = theme.surface;
		ctx.fillRect(0, 0, w, h);
		if (series.length < 2) return;
		const padL = 58;
		const padR = 12;
		const padT = 10;
		const padB = 8;
		let min = Infinity;
		let max = -Infinity;
		for (const p of series) {
			if (p.equity < min) min = p.equity;
			if (p.equity > max) max = p.equity;
		}
		for (const p of other) {
			if (p.equity < min) min = p.equity;
			if (p.equity > max) max = p.equity;
		}
		if (min === max) {
			min *= .99;
			max *= 1.01;
		}
		const y = (v) => padT + (max - v) / (max - min) * (h - padT - padB);
		const x = (i, n) => padL + i / Math.max(n - 1, 1) * (w - padL - padR);
		ctx.font = "10px IBM Plex Mono, monospace";
		ctx.fillStyle = theme.subtle;
		ctx.textAlign = "right";
		ctx.strokeStyle = theme.border;
		ctx.lineWidth = 1;
		for (const tick of niceTicks(min, max, 3)) {
			const yy = y(tick);
			ctx.beginPath();
			ctx.moveTo(padL, yy);
			ctx.lineTo(w - padR, yy);
			ctx.stroke();
			ctx.fillText(Math.round(tick).toLocaleString("en-US"), 52, yy + 3);
		}
		const draw = (pts, color, fill) => {
			if (pts.length < 2) return;
			ctx.beginPath();
			pts.forEach((p, i) => {
				const xx = x(i, pts.length);
				const yy = y(p.equity);
				if (i === 0) ctx.moveTo(xx, yy);
				else ctx.lineTo(xx, yy);
			});
			ctx.strokeStyle = color;
			ctx.lineWidth = 1.4;
			ctx.stroke();
			if (fill) {
				const lastX = x(pts.length - 1, pts.length);
				ctx.lineTo(lastX, h - padB);
				ctx.lineTo(x(0, pts.length), h - padB);
				ctx.closePath();
				ctx.fillStyle = hexAlpha(color, .08);
				ctx.fill();
			}
		};
		draw(series, theme.accent, !other.length);
		if (other.length) draw(other, theme.long, false);
		ctx.fillStyle = theme.subtle;
		ctx.textAlign = "left";
		ctx.font = "10px IBM Plex Sans, sans-serif";
		ctx.fillText(other.length ? "Steel  Vector    Sea  Nautilus" : "Equity", 64, 12);
	}, [other, series]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref: wrapRef,
		className: "relative h-full min-h-28 w-full overflow-hidden bg-surface",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
			ref: canvasRef,
			className: "block h-full w-full"
		})
	});
}
function SweepHeat({ cells, onPick }) {
	if (!cells.length) return null;
	const sharpes = cells.map((c) => c.sharpe);
	const max = Math.max(...sharpes, .01);
	const min = Math.min(...sharpes, -.01);
	const fasts = [...new Set(cells.map((c) => c.fast))].sort((a, b) => a - b);
	const slows = [...new Set(cells.map((c) => c.slow))].sort((a, b) => a - b);
	const lookup = new Map(cells.map((c) => [`${c.fast}:${c.slow}`, c]));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-baseline justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-2xs font-medium tracking-wide text-muted uppercase",
				children: "SMA Sharpe sweep"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-2xs text-subtle",
				children: "fast → · slow ↓"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-px",
			style: { gridTemplateColumns: `repeat(${fasts.length}, minmax(0, 1fr))` },
			children: slows.flatMap((s) => fasts.map((f) => {
				const cell = lookup.get(`${f}:${s}`);
				if (!cell) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "aspect-square rounded-sm bg-elevated/50" }, `${f}:${s}`);
				const t = cell.sharpe >= 0 ? cell.sharpe / max : cell.sharpe / Math.abs(min);
				const bg = cell.sharpe >= 0 ? `color-mix(in oklab, var(--color-long) ${Math.round(Math.min(t, 1) * 70)}%, var(--color-elevated))` : `color-mix(in oklab, var(--color-short) ${Math.round(Math.min(-t, 1) * 70)}%, var(--color-elevated))`;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					title: `SMA ${f}/${s}  Sharpe ${cell.sharpe.toFixed(2)}  ${cell.trades} trades`,
					onClick: () => onPick(f, s),
					className: "aspect-square rounded-sm",
					style: { background: bg }
				}, `${f}:${s}`);
			}))
		})]
	});
}
function SetupPanel() {
	const config = useDesk((s) => s.config);
	const sweep = useDesk((s) => s.sweep);
	const patchConfig = useDesk((s) => s.patchConfig);
	const setParam = useDesk((s) => s.setParam);
	const setStrategy = useDesk((s) => s.setStrategy);
	const runNautilusNow = useDesk((s) => s.runNautilusNow);
	const runCompareNow = useDesk((s) => s.runCompareNow);
	const runSweep = useDesk((s) => s.runSweep);
	const inst = getInstrument(config.instrumentId);
	const strat = getStrategy(config.strategyId);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full flex-col gap-5 overflow-y-auto p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersHorizontal, { className: "size-3.5 text-muted" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-2xs font-medium tracking-wide text-muted uppercase",
					children: "Book"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Field, {
				label: "Instrument",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NativeSelect, {
					value: config.instrumentId,
					onChange: (e) => patchConfig({ instrumentId: e.target.value }),
					children: INSTRUMENTS.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
						value: i.id,
						children: [
							i.symbol,
							" · ",
							i.venue
						]
					}, i.id))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-2xs text-subtle",
					children: [
						inst.name,
						" · ",
						inst.assetClass,
						" · ",
						inst.leverage,
						"×"
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Timeframe",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Segmented, {
					value: config.timeframe,
					onChange: (timeframe) => patchConfig({ timeframe }),
					options: [
						{
							id: "5m",
							label: "5m"
						},
						{
							id: "1h",
							label: "1h"
						},
						{
							id: "1d",
							label: "1d"
						}
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Field, {
				label: "Strategy",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NativeSelect, {
					value: config.strategyId,
					onChange: (e) => setStrategy(e.target.value),
					children: STRATEGIES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: s.id,
						children: s.name
					}, s.id))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-2xs leading-snug text-subtle",
					children: strat.description
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-col gap-3",
				children: strat.params.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderRow, {
					label: p.label,
					min: p.min,
					max: p.max,
					step: p.step,
					value: config.params[p.key] ?? p.min,
					onChange: (v) => setParam(p.key, v),
					format: (v) => p.step < 1 ? v.toFixed(1) : String(Math.round(v))
				}, p.key))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Capital",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Segmented, {
					value: String(config.capital),
					onChange: (v) => patchConfig({ capital: Number(v) }),
					options: CAPITAL_PRESETS.map((c) => ({
						id: String(c),
						label: c >= 1e6 ? "1M" : `${c / 1e3}k`
					}))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderRow, {
				label: "Fee",
				min: 0,
				max: 20,
				step: .5,
				value: config.feeBps,
				onChange: (feeBps) => patchConfig({ feeBps }),
				format: (v) => `${v.toFixed(1)} bps`
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderRow, {
				label: "Slippage",
				min: 0,
				max: 15,
				step: .5,
				value: config.slippageBps,
				onChange: (slippageBps) => patchConfig({ slippageBps }),
				format: (v) => `${v.toFixed(1)} bps`
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Fill",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Segmented, {
					value: config.fillOn,
					onChange: (fillOn) => patchConfig({ fillOn }),
					options: [{
						id: "next-open",
						label: "Next open"
					}, {
						id: "close",
						label: "Close"
					}]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-2 pt-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "secondary",
						onClick: runNautilusNow,
						children: "Run Nautilus"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						onClick: runCompareNow,
						children: "Compare engines"
					}),
					config.strategyId === "sma-cross" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						onClick: runSweep,
						children: "Sweep SMA grid"
					}) : null
				]
			}),
			sweep ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SweepHeat, {
				cells: sweep,
				onPick: (fast, slow) => {
					setParam("fast", fast);
					setParam("slow", slow);
				}
			}) : null
		]
	});
}
function StatsGrid({ stats, runtimeMs }) {
	if (!stats) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "px-4 py-6 text-sm text-muted",
		children: "No book yet. Arm a run."
	});
	const rows = [
		{
			k: "Return",
			v: fmtPct(stats.totalReturn),
			cls: pnlClass(stats.totalReturn)
		},
		{
			k: "CAGR",
			v: fmtPct(stats.cagr),
			cls: pnlClass(stats.cagr)
		},
		{
			k: "Sharpe",
			v: fmtNum(stats.sharpe)
		},
		{
			k: "Sortino",
			v: fmtNum(stats.sortino)
		},
		{
			k: "Calmar",
			v: fmtNum(stats.calmar)
		},
		{
			k: "Max DD",
			v: fmtPct(stats.maxDrawdown),
			cls: pnlClass(stats.maxDrawdown)
		},
		{
			k: "Win rate",
			v: fmtPct(stats.winRate)
		},
		{
			k: "Profit factor",
			v: fmtNum(stats.profitFactor)
		},
		{
			k: "Trades",
			v: String(stats.trades)
		},
		{
			k: "Exposure",
			v: fmtPct(stats.exposure, 1)
		},
		{
			k: "Vol",
			v: fmtPct(stats.volatility, 1)
		},
		{
			k: "Equity",
			v: fmtUsd(stats.finalEquity)
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid grid-cols-2 gap-px overflow-hidden rounded-lg bg-border",
		children: rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-0.5 bg-surface px-3 py-2.5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-2xs tracking-wide text-subtle uppercase",
				children: r.k
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: cn("font-mono text-sm tabular", r.cls ?? "text-fg"),
				children: r.v
			})]
		}, r.k))
	}), runtimeMs != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
		className: "mt-2 px-1 font-mono text-2xs text-subtle",
		children: ["Runtime ", fmtDuration(runtimeMs)]
	}) : null] });
}
function CompareTable() {
	const compare = useDesk((s) => s.compare);
	if (!compare) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted",
		children: "Run a comparison from the book."
	});
	const rows = [
		{
			k: "Return",
			a: fmtPct(compare.vector.stats.totalReturn),
			b: fmtPct(compare.nautilus.stats.totalReturn)
		},
		{
			k: "Sharpe",
			a: fmtNum(compare.vector.stats.sharpe),
			b: fmtNum(compare.nautilus.stats.sharpe)
		},
		{
			k: "Max DD",
			a: fmtPct(compare.vector.stats.maxDrawdown),
			b: fmtPct(compare.nautilus.stats.maxDrawdown)
		},
		{
			k: "Trades",
			a: String(compare.vector.stats.trades),
			b: String(compare.nautilus.stats.trades)
		},
		{
			k: "Win rate",
			a: fmtPct(compare.vector.stats.winRate),
			b: fmtPct(compare.nautilus.stats.winRate)
		},
		{
			k: "Runtime",
			a: fmtDuration(compare.vector.runtimeMs),
			b: fmtDuration(compare.nautilus.runtimeMs)
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
			className: "w-full text-left text-xs",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
				className: "text-2xs tracking-wide text-subtle uppercase",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "py-1.5 font-medium",
						children: "Metric"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "py-1.5 font-medium",
						children: "Vector"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "py-1.5 font-medium",
						children: "Nautilus"
					})
				] })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
				className: "font-mono tabular",
				children: rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-t border-border",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "py-1.5 font-sans text-muted",
							children: r.k
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "py-1.5",
							children: r.a
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "py-1.5",
							children: r.b
						})
					]
				}, r.k))
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "text-xs leading-relaxed text-muted",
			children: [
				"Event fills lag the vector book by ",
				fmtNum(compare.avgFillDelayBars, 1),
				" bars on average. Return drag ",
				fmtPct(compare.returnDrag),
				" — fees, next-open matching, and one-bar intent delay."
			]
		})]
	});
}
function EventTape() {
	const mode = useDesk((s) => s.mode);
	const dry = useDesk((s) => s.dry);
	const nautilus = useDesk((s) => s.nautilus);
	const slice = ((mode === "dryrun" ? dry?.events : nautilus?.events) ?? []).slice(-40).reverse();
	if (!slice.length) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "px-1 text-sm text-muted",
		children: "Event bus is quiet. Arm dry-run or run Nautilus."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
		className: "flex flex-col gap-0 font-mono text-2xs",
		children: slice.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
			className: "flex gap-2 border-b border-border py-1.5 last:border-0",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("mt-0.5 size-1.5 shrink-0 rounded-full", e.severity === "fill" ? "bg-long" : e.severity === "risk" ? "bg-short" : e.severity === "order" ? "bg-warn" : "bg-subtle") }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "w-28 shrink-0 text-subtle",
					children: e.type
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "min-w-0 text-muted",
					children: e.message
				})
			]
		}, e.id))
	});
}
function OrderTicket() {
	const config = useDesk((s) => s.config);
	const dry = useDesk((s) => s.dry);
	const dryRunning = useDesk((s) => s.dryRunning);
	const dryManual = useDesk((s) => s.dryManual);
	const setDryManual = useDesk((s) => s.setDryManual);
	const submitLive = useDesk((s) => s.submitLive);
	const flattenLive = useDesk((s) => s.flattenLive);
	const inst = getInstrument(config.instrumentId);
	const px = dry?.bar?.c ?? 0;
	const defaultQty = (0, import_react.useMemo)(() => {
		if (!px) return inst.lotSize;
		const eq = dry?.equity ?? config.capital;
		return Math.max(inst.lotSize, Math.floor(eq * .1 / px / inst.lotSize) * inst.lotSize);
	}, [
		config.capital,
		dry?.equity,
		inst.lotSize,
		px
	]);
	const [qty, setQty] = (0, import_react.useState)(String(defaultQty));
	const [typ, setTyp] = (0, import_react.useState)("MARKET");
	const [limit, setLimit] = (0, import_react.useState)("");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-2xs font-medium tracking-wide text-muted uppercase",
					children: "Ticket"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex items-center gap-2 text-xs text-muted",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "checkbox",
						checked: dryManual,
						onChange: (e) => setDryManual(e.target.checked),
						className: "size-4 accent-accent"
					}), "Discretionary"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Qty",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: qty,
						onChange: (e) => setQty(e.target.value),
						inputMode: "decimal"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Type",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(NativeSelect, {
						value: typ,
						onChange: (e) => setTyp(e.target.value),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "MARKET",
							children: "Market"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "LIMIT",
							children: "Limit"
						})]
					})
				})]
			}),
			typ === "LIMIT" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Limit",
				hint: px ? fmtPx(px, inst.tickSize) : void 0,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: limit,
					onChange: (e) => setLimit(e.target.value),
					inputMode: "decimal"
				})
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "long",
					disabled: !dryRunning,
					onClick: () => submitLive("BUY", Number(qty) || defaultQty, typ, Number(limit) || px),
					children: "Buy"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "short",
					disabled: !dryRunning,
					onClick: () => submitLive("SELL", Number(qty) || defaultQty, typ, Number(limit) || px),
					children: "Sell"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "secondary",
				disabled: !dryRunning,
				onClick: flattenLive,
				children: "Flatten"
			})
		]
	});
}
function DryControls() {
	const config = useDesk((s) => s.config);
	const dry = useDesk((s) => s.dry);
	const dryRunning = useDesk((s) => s.dryRunning);
	const dryPaused = useDesk((s) => s.dryPaused);
	const drySpeed = useDesk((s) => s.drySpeed);
	const setDrySpeed = useDesk((s) => s.setDrySpeed);
	const armDry = useDesk((s) => s.armDry);
	const haltDry = useDesk((s) => s.haltDry);
	const togglePause = useDesk((s) => s.togglePause);
	const stepDry = useDesk((s) => s.stepDry);
	const pos = dry?.position;
	const inst = getInstrument(config.instrumentId);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-2",
				children: !dryRunning ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: armDry,
					children: "Arm dry-run"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "secondary",
						onClick: togglePause,
						children: dryPaused ? "Resume" : "Pause"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						onClick: stepDry,
						children: "Step"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "warn",
						onClick: haltDry,
						children: "Halt"
					})
				] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Segmented, {
				value: String(drySpeed),
				onChange: (v) => setDrySpeed(Number(v)),
				options: SPEED_PRESETS.map((s) => ({
					id: String(s.id),
					label: s.label
				}))
			}),
			dry?.bar ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
				className: "grid grid-cols-2 gap-2 text-xs",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						k: "Mark",
						v: fmtPx(dry.bar.c, inst.tickSize)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						k: "Equity",
						v: fmtUsd(dry.equity, 2),
						cls: pnlClass(dry.equity - config.capital)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						k: "Cash",
						v: fmtUsd(dry.cash, 2)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						k: "Pos",
						v: pos ? `${pos.qty}` : "—",
						cls: pos && pos.qty !== 0 ? pos.qty > 0 ? "text-long" : "text-short" : void 0
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						k: "uPnL",
						v: fmtUsd(pos?.unrealized ?? 0, 2),
						cls: pnlClass(pos?.unrealized ?? 0)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						k: "Clock",
						v: `${dry.index + 1}/${dry.total}`
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs leading-relaxed text-muted",
				children: "Paper session on the Nautilus matching engine. Strategy submits on each bar, or take the tape yourself."
			})
		]
	});
}
function Stat({ k, v, cls }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg bg-elevated px-2.5 py-2 shadow-[var(--shadow-border)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
			className: "text-2xs text-subtle uppercase",
			children: k
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
			className: cn("font-mono text-sm tabular", cls),
			children: v
		})]
	});
}
function SidePanel({ result }) {
	const mode = useDesk((s) => s.mode);
	const [tab, setTab] = (0, import_react.useState)("stats");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full min-h-0 flex-col",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "px-3 pt-3",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Segmented, {
				value: tab,
				onChange: setTab,
				options: [
					{
						id: "stats",
						label: "Stats"
					},
					{
						id: "tape",
						label: "Tape"
					},
					{
						id: "ticket",
						label: "Ticket"
					}
				]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-h-0 flex-1 overflow-y-auto p-3",
			children: [
				tab === "stats" ? mode === "compare" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CompareTable, {}) : mode === "dryrun" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DryControls, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatsGrid, {
					stats: result?.stats ?? null,
					runtimeMs: result?.runtimeMs
				}) : null,
				tab === "tape" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EventTape, {}) : null,
				tab === "ticket" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DryControls, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrderTicket, {})]
				}) : null
			]
		})]
	});
}
function Blotter({ result, dry }) {
	const mode = useDesk((s) => s.mode);
	const tf = useDesk((s) => s.config.timeframe);
	const trades = (mode === "dryrun" ? dry?.trades : result?.trades) ?? [];
	const working = dry?.orders ?? [];
	const rows = trades.slice(-12).reverse();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-0 flex-col border-t border-border bg-surface",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between px-4 py-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-2xs font-medium tracking-wide text-muted uppercase",
				children: "Blotter"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "font-mono text-2xs text-subtle tabular",
				children: [
					working.length ? `${working.length} working · ` : null,
					trades.length,
					" fills"
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "min-h-0 overflow-auto",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full min-w-[640px] text-left text-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
					className: "sticky top-0 bg-surface text-2xs tracking-wide text-subtle uppercase",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-1.5 font-medium",
							children: "Time"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-2 py-1.5 font-medium",
							children: "Side"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-2 py-1.5 font-medium",
							children: "Qty"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-2 py-1.5 font-medium",
							children: "Price"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-2 py-1.5 font-medium",
							children: "Fee"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-2 py-1.5 font-medium",
							children: "PnL"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-1.5 font-medium",
							children: "Reason"
						})
					] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", {
					className: "font-mono tabular",
					children: [
						working.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-t border-border text-warn",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-1.5",
									children: fmtTime(o.submittedAt, tf)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-2 py-1.5",
									children: o.side
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-2 py-1.5",
									children: o.qty
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-2 py-1.5",
									children: o.type === "LIMIT" ? o.limitPrice : "MKT"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-2 py-1.5",
									children: "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-2 py-1.5",
									children: o.status
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-1.5 font-sans text-muted",
									children: o.reason
								})
							]
						}, o.id)),
						rows.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-t border-border",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-1.5 text-muted",
									children: fmtTime(t.time, tf)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: cn("px-2 py-1.5", t.side === "BUY" ? "text-long" : "text-short"),
									children: t.side
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-1.5",
									children: t.qty
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-2 py-1.5",
									children: fmtPx(t.price)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-2 py-1.5 text-muted",
									children: fmtUsd(t.fee, 2)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: cn("px-2 py-1.5", pnlClass(t.pnl)),
									children: fmtUsd(t.pnl, 2)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-1.5 font-sans text-muted",
									children: t.reason
								})
							]
						}, t.id)),
						!rows.length && !working.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							colSpan: 7,
							className: "px-4 py-6 font-sans text-sm text-muted",
							children: "No fills. Vector books instantly — Nautilus and dry-run print here."
						}) }) : null
					]
				})]
			})
		})]
	});
}
function MethodSheet() {
	const open = useDesk((s) => s.methodOpen);
	const setOpen = useDesk((s) => s.setMethodOpen);
	if (!open) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-50 flex items-end justify-center sm:items-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			"aria-label": "Close",
			className: "absolute inset-0 bg-bg/70",
			onClick: () => setOpen(false)
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative max-h-[88dvh] w-full max-w-xl overflow-y-auto rounded-t-xl bg-surface p-5 shadow-[var(--shadow-border)] sm:rounded-xl sm:p-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4 flex items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-2xl italic text-fg",
					children: "Two clocks, one desk"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted",
					children: "How KEEL books a trade."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "icon-sm",
					onClick: () => setOpen(false),
					"aria-label": "Close",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-4 text-sm leading-relaxed text-muted",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mb-1 text-fg",
						children: "Vector"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
						"Array-native, in the spirit of vectorbt. Indicators are typed arrays. A signal lane becomes a target position in a single pass — ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-fg",
							children: "from_signals"
						}),
						" ",
						"with fees, slippage, and compounding size. Fast enough to sweep a parameter grid."
					] })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mb-1 text-fg",
						children: "Nautilus"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Event-driven, in the spirit of NautilusTrader. A clock emits bars. The strategy submits orders. The matching engine accepts, then fills market orders on the next open (or close) with slippage, and limit orders when the bar trades through. Portfolio marks cash, average, realized. Same bus as dry-run." })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mb-1 text-fg",
						children: "Dry-run"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Paper session on the Nautilus engine. Arm the book, pick a speed, and watch the tape. Discretionary mode turns the strategy off so you work the ticket yourself. Halt flattens at mark." })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mb-1 text-fg",
						children: "Why they disagree"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Vector assumes the fill at the configured auction in the same pass. Nautilus waits for the next matching cycle, so entries lag a bar and costs compound. Compare mode prints the drag — that gap is the point." })] })
				]
			})]
		})]
	});
}
var MODES = [
	{
		id: "vector",
		label: "Vector"
	},
	{
		id: "nautilus",
		label: "Nautilus"
	},
	{
		id: "dryrun",
		label: "Dry-run"
	},
	{
		id: "compare",
		label: "Compare"
	}
];
function KeelMark({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 24 24",
		className,
		"aria-hidden": "true",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			fill: "currentColor",
			d: "M12 2.8 20 9.2 12 21.2 4 9.2Z"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			fill: "var(--color-bg)",
			d: "M12 6.4 16.4 9.8 12 16.8 7.6 9.8Z"
		})]
	});
}
function Clock() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("time", {
		className: "hidden font-mono text-2xs text-subtle tabular sm:block",
		dateTime: (/* @__PURE__ */ new Date()).toISOString(),
		children: "UTC book · 2026-10-01"
	});
}
function Ticker() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "hidden min-w-0 flex-1 items-center gap-4 overflow-hidden lg:flex",
		children: INSTRUMENTS.map((inst) => {
			const bars = getBars(inst.id, "1d");
			const last = bars[bars.length - 1];
			const prev = bars[bars.length - 2];
			const ch = last && prev ? last.c / prev.c - 1 : 0;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "flex shrink-0 items-baseline gap-1.5 font-mono text-2xs tabular",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-subtle",
						children: inst.symbol
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-fg",
						children: last ? fmtPx(last.c, inst.tickSize) : "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: pnlClass(ch),
						children: [
							ch >= 0 ? "+" : "",
							(ch * 100).toFixed(1),
							"%"
						]
					})
				]
			}, inst.id);
		})
	});
}
function Header() {
	const mode = useDesk((s) => s.mode);
	const setMode = useDesk((s) => s.setMode);
	const setMethodOpen = useDesk((s) => s.setMethodOpen);
	const setSetupOpen = useDesk((s) => s.setSetupOpen);
	const dryRunning = useDesk((s) => s.dryRunning);
	const dryPaused = useDesk((s) => s.dryPaused);
	const armDry = useDesk((s) => s.armDry);
	const haltDry = useDesk((s) => s.haltDry);
	const togglePause = useDesk((s) => s.togglePause);
	const result = useActiveResult();
	const last = useDesk((s) => s.dry)?.bar ?? result?.bars.at(-1);
	const inst = getInstrument(useDesk((s) => s.config.instrumentId));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "flex flex-col gap-3 border-b border-border px-3 py-3 sm:px-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeelMark, { className: "size-6 text-long" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "leading-none",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-xl italic tracking-tight text-fg",
							children: "KEEL"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-0.5 hidden text-2xs tracking-wide text-subtle uppercase sm:block",
							children: "Dual-engine desk"
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ticker, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "ml-auto flex items-center gap-2",
					children: [
						last ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "hidden font-mono text-xs tabular sm:flex sm:flex-col sm:items-end",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-2xs text-subtle",
								children: inst.symbol
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: fmtPx(last.c, inst.tickSize) })]
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "icon-sm",
							className: "lg:hidden",
							onClick: () => setSetupOpen(true),
							"aria-label": "Book",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "icon-sm",
							onClick: () => setMethodOpen(true),
							"aria-label": "Engines",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "size-4" })
						})
					]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-2 sm:flex-row sm:items-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Segmented, {
				value: mode,
				onChange: setMode,
				options: MODES,
				className: "w-full sm:max-w-md"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap items-center gap-2 sm:ml-auto",
				children: !dryRunning ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					onClick: armDry,
					children: "Arm dry-run"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					variant: "secondary",
					onClick: togglePause,
					children: [dryPaused ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, { className: "size-3.5" }), dryPaused ? "Resume" : "Pause"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					variant: "warn",
					onClick: haltDry,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, { className: "size-3.5" }), "Halt"]
				})] })
			})]
		})]
	});
}
function useActiveResult() {
	const mode = useDesk((s) => s.mode);
	const vector = useDesk((s) => s.vector);
	const nautilus = useDesk((s) => s.nautilus);
	const compare = useDesk((s) => s.compare);
	if (mode === "nautilus" || mode === "dryrun") return nautilus ?? vector;
	if (mode === "compare") return compare?.vector ?? vector;
	return vector;
}
function StatusStrip() {
	const config = useDesk((s) => s.config);
	const mode = useDesk((s) => s.mode);
	const dry = useDesk((s) => s.dry);
	const result = useActiveResult();
	const inst = getInstrument(config.instrumentId);
	const strat = getStrategy(config.strategyId);
	const stats = mode === "dryrun" ? dry?.stats : result?.stats;
	const eq = mode === "dryrun" && dry ? dry.equity : stats?.finalEquity;
	const ret = eq != null ? eq / config.capital - 1 : stats?.totalReturn;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-border px-4 py-2 text-xs",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "font-mono text-fg",
				children: [
					inst.symbol,
					" ",
					config.timeframe
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-muted",
				children: strat.name
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "text-subtle",
				children: [
					"fee ",
					config.feeBps,
					" bps · slip ",
					config.slippageBps,
					" bps · ",
					config.fillOn
				]
			}),
			eq != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: cn("ml-auto font-mono tabular", pnlClass(ret ?? 0)),
				children: [
					fmtUsd(eq),
					" ",
					ret != null ? `  ${ret >= 0 ? "+" : ""}${(ret * 100).toFixed(2)}%` : ""
				]
			}) : null
		]
	});
}
function Desk() {
	const mode = useDesk((s) => s.mode);
	const config = useDesk((s) => s.config);
	const vector = useDesk((s) => s.vector);
	const nautilus = useDesk((s) => s.nautilus);
	const compare = useDesk((s) => s.compare);
	const dry = useDesk((s) => s.dry);
	const dryRunning = useDesk((s) => s.dryRunning);
	const dryPaused = useDesk((s) => s.dryPaused);
	const drySpeed = useDesk((s) => s.drySpeed);
	const setupOpen = useDesk((s) => s.setupOpen);
	const setSetupOpen = useDesk((s) => s.setSetupOpen);
	const stepDry = useDesk((s) => s.stepDry);
	const result = useActiveResult();
	const inst = getInstrument(config.instrumentId);
	const chartResult = mode === "nautilus" ? nautilus ?? vector : mode === "compare" ? compare?.vector ?? vector : vector;
	(0, import_react.useEffect)(() => {
		if (!dryRunning || dryPaused) return;
		const ms = Math.max(16, Math.round(480 / drySpeed));
		const id = window.setInterval(() => stepDry(), ms);
		return () => window.clearInterval(id);
	}, [
		dryPaused,
		dryRunning,
		drySpeed,
		stepDry
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh flex-col bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusStrip, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-h-0 flex-1 flex-col lg:flex-row",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
						className: "hidden w-72 shrink-0 border-r border-border lg:block",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SetupPanel, {})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
						className: "flex min-w-0 flex-1 flex-col",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
							className: "relative min-h-72 flex-1 desk-grid",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriceChart, {
								result: chartResult,
								dry: mode === "dryrun" ? dry : null,
								timeframe: config.timeframe,
								tickSize: inst.tickSize
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
							className: "h-32 shrink-0 border-t border-border sm:h-36",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EquityChart, {
								primary: mode === "compare" ? compare?.vector ?? vector : result,
								secondary: mode === "compare" ? compare?.nautilus : null,
								dry: mode === "dryrun" ? dry : null
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
						className: "hidden w-80 shrink-0 border-l border-border lg:flex lg:flex-col",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidePanel, { result: mode === "dryrun" ? nautilus : result })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "hidden max-h-44 lg:block",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Blotter, {
					result,
					dry
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "border-t border-border p-3 lg:hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidePanel, { result: mode === "dryrun" ? nautilus : result })
			}),
			setupOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "fixed inset-0 z-40 lg:hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "absolute inset-0 bg-bg/70",
					"aria-label": "Close book",
					onClick: () => setSetupOpen(false)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute inset-x-0 bottom-0 max-h-[86dvh] overflow-hidden rounded-t-xl bg-surface shadow-[var(--shadow-border)]",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SetupPanel, {})
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MethodSheet, {})
		]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Desk, {});
}
//#endregion
export { Home as component };
