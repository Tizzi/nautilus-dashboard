import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDesk } from "@/lib/desk-store";

export function MethodSheet() {
  const open = useDesk((s) => s.methodOpen);
  const setOpen = useDesk((s) => s.setMethodOpen);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-bg/70"
        onClick={() => setOpen(false)}
      />
      <div className="relative max-h-[88dvh] w-full max-w-xl overflow-y-auto rounded-t-xl bg-surface p-5 shadow-[var(--shadow-border)] sm:rounded-xl sm:p-6">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="font-display text-2xl italic text-fg">Two clocks, one desk</p>
            <p className="mt-1 text-sm text-muted">How KEEL books a trade.</p>
          </div>
          <Button variant="ghost" size="icon-sm" onClick={() => setOpen(false)} aria-label="Close">
            <X className="size-4" />
          </Button>
        </div>
        <div className="flex flex-col gap-4 text-sm leading-relaxed text-muted">
          <section>
            <h3 className="mb-1 text-fg">Vector</h3>
            <p>
              Array-native, in the spirit of vectorbt. Indicators are typed arrays. A signal lane
              becomes a target position in a single pass — <span className="text-fg">from_signals</span>{" "}
              with fees, slippage, and compounding size. Fast enough to sweep a parameter grid.
            </p>
          </section>
          <section>
            <h3 className="mb-1 text-fg">Nautilus</h3>
            <p>
              Event-driven, in the spirit of NautilusTrader. A clock emits bars. The strategy submits
              orders. The matching engine accepts, then fills market orders on the next open (or
              close) with slippage, and limit orders when the bar trades through. Portfolio marks
              cash, average, realized. Same bus as dry-run.
            </p>
          </section>
          <section>
            <h3 className="mb-1 text-fg">Dry-run</h3>
            <p>
              Paper session on the Nautilus engine. Arm the book, pick a speed, and watch the tape.
              Discretionary mode turns the strategy off so you work the ticket yourself. Halt flattens
              at mark.
            </p>
          </section>
          <section>
            <h3 className="mb-1 text-fg">Why they disagree</h3>
            <p>
              Vector assumes the fill at the configured auction in the same pass. Nautilus waits for
              the next matching cycle, so entries lag a bar and costs compound. Compare mode prints
              the drag — that gap is the point.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
