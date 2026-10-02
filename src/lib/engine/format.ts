const usd0 = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const usd2 = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const num2 = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const num0 = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
});

export function fmtUsd(n: number, digits = 0) {
  if (!Number.isFinite(n)) return "—";
  return digits === 0 ? usd0.format(n) : usd2.format(n);
}

export function fmtNum(n: number, digits = 2) {
  if (!Number.isFinite(n)) return "—";
  return digits === 0 ? num0.format(n) : num2.format(n);
}

/** `n` is a ratio: 0.123 → +12.30% */
export function fmtPct(n: number, digits = 2) {
  if (!Number.isFinite(n)) return "—";
  const sign = n > 0 ? "+" : "";
  return `${sign}${(n * 100).toFixed(digits)}%`;
}

export function fmtPx(n: number, tick = 0.01) {
  if (!Number.isFinite(n)) return "—";
  const decimals = tick >= 1 ? 0 : tick >= 0.01 ? 2 : tick >= 0.0001 ? 4 : 5;
  return n.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function fmtCompact(n: number) {
  if (!Number.isFinite(n)) return "—";
  const abs = Math.abs(n);
  if (abs >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (abs >= 10_000) return `${(n / 1_000).toFixed(1)}k`;
  return fmtNum(n, abs >= 100 ? 0 : 2);
}

export function fmtTime(t: number, timeframe: "5m" | "1h" | "1d") {
  const d = new Date(t);
  if (timeframe === "1d") {
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "2-digit",
      timeZone: "UTC",
    });
  }
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "UTC",
  });
}

export function fmtDuration(ms: number) {
  if (ms < 1) return "<1ms";
  if (ms < 1000) return `${ms.toFixed(1)}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

export function pnlClass(n: number) {
  if (n > 0) return "text-long";
  if (n < 0) return "text-short";
  return "text-muted";
}
