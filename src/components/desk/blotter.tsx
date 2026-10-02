import { fmtPx, fmtTime, fmtUsd, pnlClass, type BacktestResult, type DryRunSnapshot } from "@/lib/engine";
import { useDesk } from "@/lib/desk-store";
import { cn } from "@/lib/utils";

export function Blotter({
  result,
  dry,
}: {
  result: BacktestResult | null;
  dry: DryRunSnapshot | null;
}) {
  const mode = useDesk((s) => s.mode);
  const tf = useDesk((s) => s.config.timeframe);
  const trades = (mode === "dryrun" ? dry?.trades : result?.trades) ?? [];
  const working = dry?.orders ?? [];
  const rows = trades.slice(-12).reverse();

  return (
    <div className="flex min-h-0 flex-col border-t border-border bg-surface">
      <div className="flex items-center justify-between px-4 py-2">
        <h2 className="text-2xs font-medium tracking-wide text-muted uppercase">Blotter</h2>
        <p className="font-mono text-2xs text-subtle tabular">
          {working.length ? `${working.length} working · ` : null}
          {trades.length} fills
        </p>
      </div>
      <div className="min-h-0 overflow-auto">
        <table className="w-full min-w-[640px] text-left text-xs">
          <thead className="sticky top-0 bg-surface text-2xs tracking-wide text-subtle uppercase">
            <tr>
              <th className="px-4 py-1.5 font-medium">Time</th>
              <th className="px-2 py-1.5 font-medium">Side</th>
              <th className="px-2 py-1.5 font-medium">Qty</th>
              <th className="px-2 py-1.5 font-medium">Price</th>
              <th className="px-2 py-1.5 font-medium">Fee</th>
              <th className="px-2 py-1.5 font-medium">PnL</th>
              <th className="px-4 py-1.5 font-medium">Reason</th>
            </tr>
          </thead>
          <tbody className="font-mono tabular">
            {working.map((o) => (
              <tr key={o.id} className="border-t border-border text-warn">
                <td className="px-4 py-1.5">{fmtTime(o.submittedAt, tf)}</td>
                <td className="px-2 py-1.5">{o.side}</td>
                <td className="px-2 py-1.5">{o.qty}</td>
                <td className="px-2 py-1.5">{o.type === "LIMIT" ? o.limitPrice : "MKT"}</td>
                <td className="px-2 py-1.5">—</td>
                <td className="px-2 py-1.5">{o.status}</td>
                <td className="px-4 py-1.5 font-sans text-muted">{o.reason}</td>
              </tr>
            ))}
            {rows.map((t) => (
              <tr key={t.id} className="border-t border-border">
                <td className="px-4 py-1.5 text-muted">{fmtTime(t.time, tf)}</td>
                <td className={cn("px-2 py-1.5", t.side === "BUY" ? "text-long" : "text-short")}>
                  {t.side}
                </td>
                <td className="px-4 py-1.5">{t.qty}</td>
                <td className="px-2 py-1.5">{fmtPx(t.price)}</td>
                <td className="px-2 py-1.5 text-muted">{fmtUsd(t.fee, 2)}</td>
                <td className={cn("px-2 py-1.5", pnlClass(t.pnl))}>{fmtUsd(t.pnl, 2)}</td>
                <td className="px-4 py-1.5 font-sans text-muted">{t.reason}</td>
              </tr>
            ))}
            {!rows.length && !working.length ? (
              <tr>
                <td colSpan={7} className="px-4 py-6 font-sans text-sm text-muted">
                  No fills. Vector books instantly — Nautilus and dry-run print here.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
