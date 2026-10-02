import { useEffect, useRef, useState, type PointerEvent } from "react";
import type { BacktestResult, Bar, DryRunSnapshot, SignalMark, Timeframe } from "@/lib/engine";
import { fmtPx, fmtTime } from "@/lib/engine";

type Theme = {
  long: string;
  short: string;
  muted: string;
  subtle: string;
  fg: string;
  border: string;
  accent: string;
  bg: string;
  surface: string;
};

function readTheme(el: HTMLElement): Theme {
  const s = getComputedStyle(el);
  const g = (name: string, fb: string) => s.getPropertyValue(name).trim() || fb;
  return {
    long: g("--color-long", "#6eab8a"),
    short: g("--color-short", "#c96a6a"),
    muted: g("--color-muted", "#8b919a"),
    subtle: g("--color-subtle", "#5c636c"),
    fg: g("--color-fg", "#e8eaed"),
    border: g("--color-border", "rgba(232,234,237,0.12)"),
    accent: g("--color-accent", "#d4d8de"),
    bg: g("--color-bg", "#08090b"),
    surface: g("--color-surface", "#101214"),
  };
}

function niceTicks(min: number, max: number, count: number) {
  if (!Number.isFinite(min) || !Number.isFinite(max) || min === max) {
    return [min || 0];
  }
  const span = max - min;
  const raw = span / Math.max(count, 1);
  const mag = Math.pow(10, Math.floor(Math.log10(Math.abs(raw) || 1)));
  const norm = raw / mag;
  const step = (norm < 1.5 ? 1 : norm < 3 ? 2 : norm < 7 ? 5 : 10) * mag;
  const start = Math.ceil(min / step) * step;
  const ticks: number[] = [];
  for (let v = start; v <= max + step * 0.01; v += step) ticks.push(v);
  return ticks;
}

function hexAlpha(color: string, a: number) {
  if (color.startsWith("#") && color.length === 7) {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${a})`;
  }
  return color;
}

function visibleBars(all: Bar[], cursor: number | null, follow: boolean, window = 180) {
  if (!follow || cursor == null) return { bars: all, offset: 0 };
  const end = Math.min(all.length, Math.max(cursor + 1, 2));
  const start = Math.max(0, end - window);
  return { bars: all.slice(start, end), offset: start };
}

type PricePayload = {
  bars: Bar[];
  offset: number;
  signals: SignalMark[];
  indicators: Record<string, Array<number | null>>;
  timeframe: Timeframe;
  tickSize: number;
  hover: { i: number } | null;
};

function drawPrice(canvas: HTMLCanvasElement, wrap: HTMLElement, payload: PricePayload) {
  const theme = readTheme(wrap);
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = Math.max(1, wrap.clientWidth);
  const h = Math.max(1, wrap.clientHeight);
  canvas.width = Math.floor(w * dpr);
  canvas.height = Math.floor(h * dpr);
  canvas.style.width = `${w}px`;
  canvas.style.height = `${h}px`;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.fillStyle = theme.surface;
  ctx.fillRect(0, 0, w, h);

  const { bars, offset, signals, indicators, timeframe, tickSize, hover } = payload;
  if (bars.length < 2) {
    ctx.fillStyle = theme.muted;
    ctx.font = "13px IBM Plex Sans, sans-serif";
    ctx.fillText(bars.length ? "Waiting for the next bar." : "Loading book…", 24, h / 2);
    return;
  }

  const padL = 58;
  const padR = 12;
  const padT = 18;
  const padB = 22;
  const volH = Math.max(32, h * 0.16);
  const plotH = Math.max(40, h - padT - padB - volH - 8);
  const plotW = Math.max(10, w - padL - padR);
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
  const pad = (hi - lo) * 0.06 || hi * 0.01 || 1;
  lo -= pad;
  hi += pad;
  const y = (px: number) => plotY + ((hi - px) / (hi - lo)) * plotH;
  const slot = plotW / bars.length;
  const xAt = (i: number) => plotX + (i + 0.5) * slot;

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
    ctx.fillText(fmtPx(tick, tickSize), plotX - 8, yy);
  }

  const overlayKeys = ["fast", "slow", "mid"];
  const overlayCols = [theme.accent, theme.muted, theme.subtle];
  overlayKeys.forEach((key, ki) => {
    const arr = indicators[key];
    if (!arr) return;
    ctx.beginPath();
    ctx.strokeStyle = overlayCols[ki] ?? theme.muted;
    ctx.lineWidth = 1.2;
    let started = false;
    for (let i = 0; i < bars.length; i++) {
      const v = arr[i + offset];
      if (v == null) continue;
      if (!started) {
        ctx.moveTo(xAt(i), y(v));
        started = true;
      } else ctx.lineTo(xAt(i), y(v));
    }
    ctx.stroke();
  });

  if (slot >= 2.4) {
    const bodyW = Math.max(1, Math.min(8, slot * 0.62));
    for (let i = 0; i < bars.length; i++) {
      const b = bars[i]!;
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
      ctx.fillRect(xx - bodyW / 2, top, bodyW, Math.max(1, bot - top));
    }
  } else {
    for (let px = 0; px < plotW; px++) {
      const i0 = Math.floor((px / plotW) * bars.length);
      const i1 = Math.max(i0 + 1, Math.floor(((px + 1) / plotW) * bars.length));
      let o = bars[i0]!.o;
      let c = bars[Math.min(i1 - 1, bars.length - 1)]!.c;
      let hgt = -Infinity;
      let low = Infinity;
      for (let i = i0; i < i1 && i < bars.length; i++) {
        const b = bars[i]!;
        if (b.h > hgt) hgt = b.h;
        if (b.l < low) low = b.l;
        c = b.c;
      }
      const up = c >= o;
      ctx.strokeStyle = up ? theme.long : theme.short;
      ctx.beginPath();
      const xx = plotX + px + 0.5;
      ctx.moveTo(xx, y(hgt));
      ctx.lineTo(xx, y(low));
      ctx.stroke();
    }
  }

  const volY = plotY + plotH + 8;
  const bodyW = Math.max(1, Math.min(8, slot * 0.62));
  for (let i = 0; i < bars.length; i++) {
    const b = bars[i]!;
    const xx = xAt(i);
    const vh = (b.v / vmax) * volH;
    ctx.fillStyle = b.c >= b.o ? hexAlpha(theme.long, 0.35) : hexAlpha(theme.short, 0.35);
    ctx.fillRect(xx - bodyW / 2, volY + volH - vh, Math.max(1, bodyW), vh);
  }

  for (const s of signals) {
    const i = s.barIndex - offset;
    if (i < 0 || i >= bars.length) continue;
    const b = bars[i]!;
    const xx = xAt(i);
    ctx.fillStyle = s.side === "BUY" ? theme.long : theme.short;
    ctx.beginPath();
    if (s.kind === "entry") {
      const yy = y(b.l) + 6;
      ctx.moveTo(xx, yy);
      ctx.lineTo(xx - 4, yy + 6);
      ctx.lineTo(xx + 4, yy + 6);
    } else {
      const yy = y(b.h) - 6;
      ctx.moveTo(xx, yy);
      ctx.lineTo(xx - 4, yy - 6);
      ctx.lineTo(xx + 4, yy - 6);
    }
    ctx.closePath();
    ctx.fill();
  }

  ctx.fillStyle = theme.subtle;
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.font = "10px IBM Plex Mono, monospace";
  ctx.fillText(fmtTime(bars[0]!.t, timeframe), plotX, h - 16);
  ctx.textAlign = "right";
  ctx.fillText(fmtTime(bars[bars.length - 1]!.t, timeframe), plotX + plotW, h - 16);

  if (hover) {
    const i = Math.max(0, Math.min(bars.length - 1, hover.i));
    const b = bars[i]!;
    const xx = xAt(i);
    ctx.strokeStyle = hexAlpha(theme.fg, 0.28);
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(xx, plotY);
    ctx.lineTo(xx, volY + volH);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = theme.fg;
    ctx.font = "11px IBM Plex Mono, monospace";
    ctx.textAlign = "left";
    ctx.fillText(
      `${fmtTime(b.t, timeframe)}  O ${fmtPx(b.o, tickSize)}  H ${fmtPx(b.h, tickSize)}  L ${fmtPx(b.l, tickSize)}  C ${fmtPx(b.c, tickSize)}`,
      plotX + 4,
      3,
    );
  }
}

export function PriceChart({
  result,
  dry,
  timeframe,
  tickSize,
}: {
  result: BacktestResult | null;
  dry: DryRunSnapshot | null;
  timeframe: Timeframe;
  tickSize: number;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hover, setHover] = useState<{ i: number; x: number; y: number } | null>(null);

  const all = result?.bars ?? [];
  const follow = Boolean(dry);
  const { bars, offset } = visibleBars(all, dry ? dry.index : null, follow, 180);
  const signals = (dry ? dry.signals : result?.signals) ?? [];
  const indicators = result?.indicators ?? {};

  const payloadRef = useRef<PricePayload>({
    bars,
    offset,
    signals,
    indicators,
    timeframe,
    tickSize,
    hover,
  });
  payloadRef.current = { bars, offset, signals, indicators, timeframe, tickSize, hover };

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const paint = () => drawPrice(canvas, wrap, payloadRef.current);
    paint();
    const ro = new ResizeObserver(paint);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [bars.length, offset, all[0]?.t, all[all.length - 1]?.c, hover, timeframe, tickSize, signals.length]);

  function onMove(e: PointerEvent<HTMLDivElement>) {
    const wrap = wrapRef.current;
    if (!wrap || bars.length < 2) return;
    const rect = wrap.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const padL = 58;
    const padR = 12;
    const plotW = rect.width - padL - padR;
    const i = Math.floor(((x - padL) / plotW) * bars.length);
    setHover({ i, x, y: e.clientY - rect.top });
  }

  return (
    <div
      ref={wrapRef}
      className="relative h-full min-h-64 w-full overflow-hidden bg-surface"
      onPointerMove={onMove}
      onPointerLeave={() => setHover(null)}
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}

export function EquityChart({
  primary,
  secondary,
  dry,
}: {
  primary: BacktestResult | null;
  secondary?: BacktestResult | null;
  dry?: DryRunSnapshot | null;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const series = dry?.equitySeries?.length ? dry.equitySeries : (primary?.equity ?? []);
  const other = secondary?.equity ?? [];

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const paint = () => {
      const theme = readTheme(wrap);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, wrap.clientWidth);
      const h = Math.max(1, wrap.clientHeight);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
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
      const padT = 14;
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
        min *= 0.99;
        max *= 1.01;
      }
      const y = (v: number) => padT + ((max - v) / (max - min)) * (h - padT - padB);
      const x = (i: number, n: number) => padL + (i / Math.max(n - 1, 1)) * (w - padL - padR);

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
        ctx.fillText(Math.round(tick).toLocaleString("en-US"), padL - 6, yy + 3);
      }

      const draw = (pts: typeof series, color: string, fill: boolean) => {
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
          ctx.fillStyle = hexAlpha(color, 0.1);
          ctx.fill();
        }
      };

      draw(series, theme.accent, !other.length);
      if (other.length) draw(other, theme.long, false);
      ctx.fillStyle = theme.subtle;
      ctx.textAlign = "left";
      ctx.font = "10px IBM Plex Sans, sans-serif";
      ctx.fillText(other.length ? "Steel Vector    Sea Nautilus" : "Mark-to-market equity", padL + 6, 4);
    };
    paint();
    const ro = new ResizeObserver(paint);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [other, series]);

  return (
    <div ref={wrapRef} className="relative h-full min-h-28 w-full overflow-hidden bg-surface">
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}

export function SweepHeat({
  cells,
  onPick,
}: {
  cells: { fast: number; slow: number; sharpe: number; ret: number; trades: number }[];
  onPick: (fast: number, slow: number) => void;
}) {
  if (!cells.length) return null;
  const sharpes = cells.map((c) => c.sharpe);
  const max = Math.max(...sharpes, 0.01);
  const min = Math.min(...sharpes, -0.01);
  const fasts = [...new Set(cells.map((c) => c.fast))].sort((a, b) => a - b);
  const slows = [...new Set(cells.map((c) => c.slow))].sort((a, b) => a - b);
  const lookup = new Map(cells.map((c) => [`${c.fast}:${c.slow}`, c]));
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between">
        <p className="text-2xs font-medium tracking-wide text-muted uppercase">SMA Sharpe sweep</p>
        <p className="font-mono text-2xs text-subtle">fast → · slow ↓</p>
      </div>
      <div
        className="grid gap-px"
        style={{ gridTemplateColumns: `repeat(${fasts.length}, minmax(0, 1fr))` }}
      >
        {slows.flatMap((s) =>
          fasts.map((f) => {
            const cell = lookup.get(`${f}:${s}`);
            if (!cell) {
              return <div key={`${f}:${s}`} className="aspect-square rounded-sm bg-elevated/50" />;
            }
            const t = cell.sharpe >= 0 ? cell.sharpe / max : cell.sharpe / Math.abs(min);
            const bg =
              cell.sharpe >= 0
                ? `color-mix(in oklab, var(--color-long) ${Math.round(Math.min(t, 1) * 70)}%, var(--color-elevated))`
                : `color-mix(in oklab, var(--color-short) ${Math.round(Math.min(-t, 1) * 70)}%, var(--color-elevated))`;
            return (
              <button
                key={`${f}:${s}`}
                type="button"
                title={`SMA ${f}/${s}  Sharpe ${cell.sharpe.toFixed(2)}  ${cell.trades} trades`}
                onClick={() => onPick(f, s)}
                className="aspect-square rounded-sm"
                style={{ background: bg }}
              />
            );
          }),
        )}
      </div>
    </div>
  );
}
