import { useMemo, useState } from "react";
import {
  fmtNum,
  fmtPct,
  fmtPx,
  fmtUsd,
  getInstrument,
  pnlClass,
  SPEED_PRESETS,
  type BacktestResult,
  type PerfStats,
} from "@/lib/engine";
import { useDesk } from "@/lib/desk-store";
import { Button } from "@/components/ui/button";
import { Field, Input, NativeSelect, Segmented } from "@/components/ui/controls";
import { cn } from "@/lib/utils";

export function StatsGrid({ stats }: { stats: PerfStats | null; runtimeMs?: number }) {
  if (!stats) {
    return <p className="px-4 py-6 text-sm text-muted">No book yet. Arm a run.</p>;
  }
  const rows: { k: string; v: string; cls?: string }[] = [
    { k: "Return", v: fmtPct(stats.totalReturn), cls: pnlClass(stats.totalReturn) },
    { k: "CAGR", v: fmtPct(stats.cagr), cls: pnlClass(stats.cagr) },
    { k: "Sharpe", v: fmtNum(stats.sharpe) },
    { k: "Sortino", v: fmtNum(stats.sortino) },
    { k: "Calmar", v: fmtNum(stats.calmar) },
    { k: "Max DD", v: fmtPct(stats.maxDrawdown), cls: pnlClass(stats.maxDrawdown) },
    { k: "Win rate", v: fmtPct(stats.winRate) },
    { k: "Profit factor", v: fmtNum(stats.profitFactor) },
    { k: "Trades", v: String(stats.trades) },
    { k: "Exposure", v: fmtPct(stats.exposure, 1) },
    { k: "Vol", v: fmtPct(stats.volatility, 1) },
    { k: "Equity", v: fmtUsd(stats.finalEquity) },
  ];
  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg bg-border">
      {rows.map((r) => (
        <div key={r.k} className="flex flex-col gap-0.5 bg-surface px-3 py-2.5">
          <span className="text-2xs tracking-wide text-subtle uppercase">{r.k}</span>
          <span className={cn("font-mono text-sm tabular", r.cls ?? "text-fg")}>{r.v}</span>
        </div>
      ))}
    </div>
  );
}

export function CompareTable() {
  const compare = useDesk((s) => s.compare);
  if (!compare) return <p className="text-sm text-muted">Run a comparison from the book.</p>;
  const rows: { k: string; a: string; b: string }[] = [
    { k: "Return", a: fmtPct(compare.vector.stats.totalReturn), b: fmtPct(compare.nautilus.stats.totalReturn) },
    { k: "Sharpe", a: fmtNum(compare.vector.stats.sharpe), b: fmtNum(compare.nautilus.stats.sharpe) },
    { k: "Max DD", a: fmtPct(compare.vector.stats.maxDrawdown), b: fmtPct(compare.nautilus.stats.maxDrawdown) },
    { k: "Trades", a: String(compare.vector.stats.trades), b: String(compare.nautilus.stats.trades) },
    { k: "Win rate", a: fmtPct(compare.vector.stats.winRate), b: fmtPct(compare.nautilus.stats.winRate) },
    { k: "Runtime", a: fmtDuration(compare.vector.runtimeMs), b: fmtDuration(compare.nautilus.runtimeMs) },
  ];
  return (
    <div className="flex flex-col gap-3">
      <table className="w-full text-left text-xs">
        <thead className="text-2xs tracking-wide text-subtle uppercase">
          <tr>
            <th className="py-1.5 font-medium">Metric</th>
            <th className="py-1.5 font-medium">Vector</th>
            <th className="py-1.5 font-medium">Nautilus</th>
          </tr>
        </thead>
        <tbody className="font-mono tabular">
          {rows.map((r) => (
            <tr key={r.k} className="border-t border-border">
              <td className="py-1.5 font-sans text-muted">{r.k}</td>
              <td className="py-1.5">{r.a}</td>
              <td className="py-1.5">{r.b}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-xs leading-relaxed text-muted">
        Event fills lag the vector book by {fmtNum(compare.avgFillDelayBars, 1)} bars on average.
        Return drag {fmtPct(compare.returnDrag)} — fees, next-open matching, and one-bar intent delay.
      </p>
    </div>
  );
}

export function EventTape() {
  const mode = useDesk((s) => s.mode);
  const dry = useDesk((s) => s.dry);
  const nautilus = useDesk((s) => s.nautilus);
  const events = (mode === "dryrun" ? dry?.events : nautilus?.events) ?? [];
  const slice = events.slice(-40).reverse();
  if (!slice.length) {
    return <p className="px-1 text-sm text-muted">Event bus is quiet. Arm dry-run or run Nautilus.</p>;
  }
  return (
    <ol className="flex flex-col gap-0 font-mono text-2xs">
      {slice.map((e) => (
        <li
          key={e.id}
          className="flex gap-2 border-b border-border py-1.5 last:border-0"
        >
          <span
            className={cn(
              "mt-0.5 size-1.5 shrink-0 rounded-full",
              e.severity === "fill"
                ? "bg-long"
                : e.severity === "risk"
                  ? "bg-short"
                  : e.severity === "order"
                    ? "bg-warn"
                    : "bg-subtle",
            )}
          />
          <span className="w-28 shrink-0 text-subtle">{e.type}</span>
          <span className="min-w-0 text-muted">{e.message}</span>
        </li>
      ))}
    </ol>
  );
}

export function OrderTicket() {
  const config = useDesk((s) => s.config);
  const dry = useDesk((s) => s.dry);
  const dryRunning = useDesk((s) => s.dryRunning);
  const dryManual = useDesk((s) => s.dryManual);
  const setDryManual = useDesk((s) => s.setDryManual);
  const submitLive = useDesk((s) => s.submitLive);
  const flattenLive = useDesk((s) => s.flattenLive);
  const inst = getInstrument(config.instrumentId);
  const px = dry?.bar?.c ?? 0;
  const defaultQty = useMemo(() => {
    if (!px) return inst.lotSize;
    const eq = dry?.equity ?? config.capital;
    return Math.max(inst.lotSize, Math.floor((eq * 0.1) / px / inst.lotSize) * inst.lotSize);
  }, [config.capital, dry?.equity, inst.lotSize, px]);
  const [qty, setQty] = useState(String(defaultQty));
  const [typ, setTyp] = useState<"MARKET" | "LIMIT">("MARKET");
  const [limit, setLimit] = useState("");

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-2xs font-medium tracking-wide text-muted uppercase">Ticket</p>
        <label className="flex items-center gap-2 text-xs text-muted">
          <input
            type="checkbox"
            checked={dryManual}
            onChange={(e) => setDryManual(e.target.checked)}
            className="size-4 accent-accent"
          />
          Discretionary
        </label>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Field label="Qty">
          <Input value={qty} onChange={(e) => setQty(e.target.value)} inputMode="decimal" />
        </Field>
        <Field label="Type">
          <NativeSelect value={typ} onChange={(e) => setTyp(e.target.value as "MARKET" | "LIMIT")}>
            <option value="MARKET">Market</option>
            <option value="LIMIT">Limit</option>
          </NativeSelect>
        </Field>
      </div>
      {typ === "LIMIT" ? (
        <Field label="Limit" hint={px ? fmtPx(px, inst.tickSize) : undefined}>
          <Input value={limit} onChange={(e) => setLimit(e.target.value)} inputMode="decimal" />
        </Field>
      ) : null}
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="long"
          disabled={!dryRunning}
          onClick={() => submitLive("BUY", Number(qty) || defaultQty, typ, Number(limit) || px)}
        >
          Buy
        </Button>
        <Button
          variant="short"
          disabled={!dryRunning}
          onClick={() => submitLive("SELL", Number(qty) || defaultQty, typ, Number(limit) || px)}
        >
          Sell
        </Button>
      </div>
      <Button variant="secondary" disabled={!dryRunning} onClick={flattenLive}>
        Flatten
      </Button>
    </div>
  );
}

export function DryControls() {
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

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        {!dryRunning ? (
          <Button onClick={armDry}>Arm dry-run</Button>
        ) : (
          <>
            <Button variant="secondary" onClick={togglePause}>
              {dryPaused ? "Resume" : "Pause"}
            </Button>
            <Button variant="ghost" onClick={stepDry}>
              Step
            </Button>
            <Button variant="warn" onClick={haltDry}>
              Halt
            </Button>
          </>
        )}
      </div>
      <Segmented
        value={String(drySpeed)}
        onChange={(v) => setDrySpeed(Number(v))}
        options={SPEED_PRESETS.map((s) => ({ id: String(s.id), label: s.label }))}
      />
      {dry?.bar ? (
        <dl className="grid grid-cols-2 gap-2 text-xs">
          <Stat k="Mark" v={fmtPx(dry.bar.c, inst.tickSize)} />
          <Stat k="Equity" v={fmtUsd(dry.equity, 2)} cls={pnlClass(dry.equity - config.capital)} />
          <Stat k="Cash" v={fmtUsd(dry.cash, 2)} />
          <Stat
            k="Pos"
            v={pos ? `${pos.qty}` : "—"}
            cls={pos && pos.qty !== 0 ? (pos.qty > 0 ? "text-long" : "text-short") : undefined}
          />
          <Stat k="uPnL" v={fmtUsd(pos?.unrealized ?? 0, 2)} cls={pnlClass(pos?.unrealized ?? 0)} />
          <Stat k="Clock" v={`${dry.index + 1}/${dry.total}`} />
        </dl>
      ) : (
        <p className="text-xs leading-relaxed text-muted">
          Paper session on the Nautilus matching engine. Strategy submits on each bar, or take the tape yourself.
        </p>
      )}
    </div>
  );
}

function Stat({ k, v, cls }: { k: string; v: string; cls?: string }) {
  return (
    <div className="rounded-lg bg-elevated px-2.5 py-2 shadow-[var(--shadow-border)]">
      <dt className="text-2xs text-subtle uppercase">{k}</dt>
      <dd className={cn("font-mono text-sm tabular", cls)}>{v}</dd>
    </div>
  );
}

export function SidePanel({ result }: { result: BacktestResult | null }) {
  const mode = useDesk((s) => s.mode);
  const [tab, setTab] = useState<"stats" | "tape" | "ticket">("stats");
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="px-3 pt-3">
        <Segmented
          value={tab}
          onChange={setTab}
          options={[
            { id: "stats", label: "Stats" },
            { id: "tape", label: "Tape" },
            { id: "ticket", label: "Ticket" },
          ]}
        />
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        {tab === "stats" ? (
          mode === "compare" ? (
            <CompareTable />
          ) : mode === "dryrun" ? (
            <DryControls />
          ) : (
            <StatsGrid stats={result?.stats ?? null} runtimeMs={result?.runtimeMs} />
          )
        ) : null}
        {tab === "tape" ? <EventTape /> : null}
        {tab === "ticket" ? (
          <div className="flex flex-col gap-4">
            <DryControls />
            <OrderTicket />
          </div>
        ) : null}
      </div>
    </div>
  );
}
