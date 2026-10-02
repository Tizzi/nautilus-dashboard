import { SlidersHorizontal } from "lucide-react";
import {
  CAPITAL_PRESETS,
  INSTRUMENTS,
  getInstrument,
  getStrategy,
  STRATEGIES,
} from "@/lib/engine";
import { useDesk } from "@/lib/desk-store";
import { Button } from "@/components/ui/button";
import { Field, NativeSelect, Segmented, SliderRow } from "@/components/ui/controls";
import { SweepHeat } from "@/components/desk/charts";

export function SetupPanel() {
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

  return (
    <div className="flex h-full flex-col gap-5 overflow-y-auto p-4">
      <header className="flex items-center gap-2">
        <SlidersHorizontal className="size-3.5 text-muted" />
        <h2 className="text-2xs font-medium tracking-wide text-muted uppercase">Book</h2>
      </header>

      <Field label="Instrument">
        <NativeSelect
          value={config.instrumentId}
          onChange={(e) => patchConfig({ instrumentId: e.target.value })}
        >
          {INSTRUMENTS.map((i) => (
            <option key={i.id} value={i.id}>
              {i.symbol} · {i.venue}
            </option>
          ))}
        </NativeSelect>
        <p className="text-2xs text-subtle">
          {inst.name} · {inst.assetClass} · {inst.leverage}×
        </p>
      </Field>

      <Field label="Timeframe">
        <Segmented
          value={config.timeframe}
          onChange={(timeframe) => patchConfig({ timeframe })}
          options={[
            { id: "5m", label: "5m" },
            { id: "1h", label: "1h" },
            { id: "1d", label: "1d" },
          ]}
        />
      </Field>

      <Field label="Strategy">
        <NativeSelect
          value={config.strategyId}
          onChange={(e) => setStrategy(e.target.value as typeof config.strategyId)}
        >
          {STRATEGIES.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </NativeSelect>
        <p className="text-2xs leading-snug text-subtle">{strat.description}</p>
      </Field>

      <div className="flex flex-col gap-3">
        {strat.params.map((p) => (
          <SliderRow
            key={p.key}
            label={p.label}
            min={p.min}
            max={p.max}
            step={p.step}
            value={config.params[p.key] ?? p.min}
            onChange={(v) => setParam(p.key, v)}
            format={(v) => (p.step < 1 ? v.toFixed(1) : String(Math.round(v)))}
          />
        ))}
      </div>

      <Field label="Capital">
        <Segmented
          value={String(config.capital)}
          onChange={(v) => patchConfig({ capital: Number(v) })}
          options={CAPITAL_PRESETS.map((c) => ({
            id: String(c),
            label: c >= 1_000_000 ? "1M" : `${c / 1000}k`,
          }))}
        />
      </Field>

      <SliderRow
        label="Fee"
        min={0}
        max={20}
        step={0.5}
        value={config.feeBps}
        onChange={(feeBps) => patchConfig({ feeBps })}
        format={(v) => `${v.toFixed(1)} bps`}
      />
      <SliderRow
        label="Slippage"
        min={0}
        max={15}
        step={0.5}
        value={config.slippageBps}
        onChange={(slippageBps) => patchConfig({ slippageBps })}
        format={(v) => `${v.toFixed(1)} bps`}
      />

      <Field label="Fill">
        <Segmented
          value={config.fillOn}
          onChange={(fillOn) => patchConfig({ fillOn })}
          options={[
            { id: "next-open", label: "Next open" },
            { id: "close", label: "Close" },
          ]}
        />
      </Field>

      <div className="flex flex-col gap-2 pt-1">
        <Button variant="secondary" onClick={runNautilusNow}>
          Run Nautilus
        </Button>
        <Button variant="ghost" onClick={runCompareNow}>
          Compare engines
        </Button>
        {config.strategyId === "sma-cross" ? (
          <Button variant="ghost" onClick={runSweep}>
            Sweep SMA grid
          </Button>
        ) : null}
      </div>

      {sweep ? (
        <SweepHeat
          cells={sweep}
          onPick={(fast, slow) => {
            setParam("fast", fast);
            setParam("slow", slow);
          }}
        />
      ) : null}
    </div>
  );
}
