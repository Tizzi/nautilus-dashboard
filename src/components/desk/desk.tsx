import { useEffect } from "react";
import { BookOpen, Menu, Pause, Play, Square } from "lucide-react";
import {
  fmtPx,
  fmtUsd,
  getBars,
  getInstrument,
  getStrategy,
  INSTRUMENTS,
  pnlClass,
  type BacktestResult,
  type DeskMode,
} from "@/lib/engine";
import { useDesk } from "@/lib/desk-store";
import { Button } from "@/components/ui/button";
import { Segmented } from "@/components/ui/controls";
import { EquityChart, PriceChart } from "@/components/desk/charts";
import { SetupPanel } from "@/components/desk/setup-panel";
import { SidePanel } from "@/components/desk/side";
import { Blotter } from "@/components/desk/blotter";
import { MethodSheet } from "@/components/desk/method";
import { cn } from "@/lib/utils";

const MODES: { id: DeskMode; label: string }[] = [
  { id: "vector", label: "Vector" },
  { id: "nautilus", label: "Nautilus" },
  { id: "dryrun", label: "Dry-run" },
  { id: "compare", label: "Compare" },
];

function KeelMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path fill="currentColor" d="M12 2.8 20 9.2 12 21.2 4 9.2Z" />
      <path fill="var(--color-bg)" d="M12 6.4 16.4 9.8 12 16.8 7.6 9.8Z" />
    </svg>
  );
}

function Clock() {
  return (
    <time className="hidden font-mono text-2xs text-subtle tabular sm:block" dateTime="2026-10-01T20:00:00.000Z">
      UTC book · 2026-10-01
    </time>
  );
}

function Ticker() {
  return (
    <div className="hidden min-w-0 flex-1 items-center gap-4 overflow-hidden lg:flex">
      {INSTRUMENTS.map((inst) => {
        const bars = getBars(inst.id, "1d");
        const last = bars[bars.length - 1];
        const prev = bars[bars.length - 2];
        const ch = last && prev ? last.c / prev.c - 1 : 0;
        return (
          <span key={inst.id} className="flex shrink-0 items-baseline gap-1.5 font-mono text-2xs tabular">
            <span className="text-subtle">{inst.symbol}</span>
            <span className="text-fg">{last ? fmtPx(last.c, inst.tickSize) : "—"}</span>
            <span className={pnlClass(ch)}>{ch >= 0 ? "+" : ""}{(ch * 100).toFixed(1)}%</span>
          </span>
        );
      })}
    </div>
  );
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
  const dry = useDesk((s) => s.dry);
  const last = dry?.bar ?? result?.bars.at(-1);
  const inst = getInstrument(useDesk((s) => s.config.instrumentId));

  return (
    <header className="flex flex-col gap-3 border-b border-border px-3 py-3 sm:px-4">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <KeelMark className="size-6 text-long" />
          <div className="leading-none">
            <p className="font-display text-xl italic tracking-tight text-fg">KEEL</p>
            <p className="mt-0.5 hidden text-2xs tracking-wide text-subtle uppercase sm:block">
              Dual-engine desk
            </p>
          </div>
        </div>
        <Ticker />
        <div className="ml-auto flex items-center gap-2">
          {last ? (
            <span className="hidden font-mono text-xs tabular sm:flex sm:flex-col sm:items-end">
              <span className="text-2xs text-subtle">{inst.symbol}</span>
              <span>{fmtPx(last.c, inst.tickSize)}</span>
            </span>
          ) : null}
          <Clock />
          <Button variant="ghost" size="icon-sm" className="lg:hidden" onClick={() => setSetupOpen(true)} aria-label="Book">
            <Menu className="size-4" />
          </Button>
          <Button variant="ghost" size="icon-sm" onClick={() => setMethodOpen(true)} aria-label="Engines">
            <BookOpen className="size-4" />
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <Segmented value={mode} onChange={setMode} options={MODES} className="w-full sm:max-w-md" />
        <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
          {!dryRunning ? (
            <Button size="sm" onClick={armDry}>
              Arm dry-run
            </Button>
          ) : (
            <>
              <Button size="sm" variant="secondary" onClick={togglePause}>
                {dryPaused ? <Play className="size-3.5" /> : <Pause className="size-3.5" />}
                {dryPaused ? "Resume" : "Pause"}
              </Button>
              <Button size="sm" variant="warn" onClick={haltDry}>
                <Square className="size-3.5" />
                Halt
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
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
  const ret =
    eq != null ? eq / config.capital - 1 : stats?.totalReturn;
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-border px-4 py-2 text-xs">
      <span className="font-mono text-fg">
        {inst.symbol} {config.timeframe}
      </span>
      <span className="text-muted">{strat.name}</span>
      <span className="text-subtle">
        fee {config.feeBps} bps · slip {config.slippageBps} bps · {config.fillOn}
      </span>
      {eq != null ? (
        <span className={cn("ml-auto font-mono tabular", pnlClass(ret ?? 0))}>
          {fmtUsd(eq)} {ret != null ? `  ${ret >= 0 ? "+" : ""}${(ret * 100).toFixed(2)}%` : ""}
        </span>
      ) : null}
    </div>
  );
}

export function Desk() {
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
  const chartResult: BacktestResult | null =
    mode === "nautilus" ? (nautilus ?? vector) : mode === "compare" ? (compare?.vector ?? vector) : vector;

  useEffect(() => {
    if (!dryRunning || dryPaused) return;
    const ms = Math.max(16, Math.round(480 / drySpeed));
    const id = window.setInterval(() => stepDry(), ms);
    return () => window.clearInterval(id);
  }, [dryPaused, dryRunning, drySpeed, stepDry]);

  return (
    <div className="flex min-h-dvh flex-col bg-bg text-fg">
      <Header />
      <StatusStrip />
      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <aside className="hidden w-72 shrink-0 border-r border-border lg:block">
          <SetupPanel />
        </aside>
        <main className="flex min-w-0 flex-1 flex-col">
          <section className="relative min-h-72 flex-1 desk-grid">
            <PriceChart
              result={chartResult}
              dry={mode === "dryrun" ? dry : null}
              timeframe={config.timeframe}
              tickSize={inst.tickSize}
            />
          </section>
          <section className="h-32 shrink-0 border-t border-border sm:h-36">
            <EquityChart
              primary={mode === "compare" ? (compare?.vector ?? vector) : result}
              secondary={mode === "compare" ? compare?.nautilus : null}
              dry={mode === "dryrun" ? dry : null}
            />
          </section>
        </main>
        <aside className="hidden w-80 shrink-0 border-l border-border lg:flex lg:flex-col">
          <SidePanel result={mode === "dryrun" ? nautilus : result} />
        </aside>
      </div>
      <div className="hidden max-h-44 lg:block">
        <Blotter result={result} dry={dry} />
      </div>
      <div className="border-t border-border p-3 lg:hidden">
        <SidePanel result={mode === "dryrun" ? nautilus : result} />
      </div>

      {setupOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button type="button" className="absolute inset-0 bg-bg/70" aria-label="Close book" onClick={() => setSetupOpen(false)} />
          <div className="absolute inset-x-0 bottom-0 max-h-[86dvh] overflow-hidden rounded-t-xl bg-surface shadow-[var(--shadow-border)]">
            <SetupPanel />
          </div>
        </div>
      ) : null}
      <MethodSheet />
    </div>
  );
}
