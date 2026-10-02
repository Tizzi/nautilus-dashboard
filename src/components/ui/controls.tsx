import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="flex items-baseline justify-between gap-2">
        <span className="text-2xs font-medium tracking-wide text-muted uppercase">{label}</span>
        {hint ? <span className="font-mono text-2xs text-subtle tabular">{hint}</span> : null}
      </span>
      {children}
    </label>
  );
}

const controlClass =
  "h-10 w-full rounded-lg bg-elevated px-3 text-sm text-fg shadow-[var(--shadow-border)] outline-none transition-[box-shadow] duration-150 placeholder:text-subtle hover:shadow-[var(--shadow-border-hover)] focus-visible:ring-2 focus-visible:ring-ring";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(controlClass, "font-mono tabular", className)} {...props} />;
}

export function NativeSelect({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(controlClass, "appearance-none bg-[length:12px] pr-8", className)}
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%238b919a' stroke-width='2'><path d='m6 9 6 6 6-6'/></svg>\")",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 10px center",
      }}
      {...props}
    />
  );
}

export function Segmented<T extends string>({
  value,
  onChange,
  options,
  className,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { id: T; label: string }[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex rounded-xl bg-elevated p-1 shadow-[var(--shadow-border)]",
        className,
      )}
    >
      {options.map((opt) => {
        const on = opt.id === value;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className={cn(
              "relative min-h-9 flex-1 rounded-lg px-2.5 text-xs font-medium transition-[color,background-color] duration-150",
              on ? "bg-accent text-accent-fg" : "text-muted hover:text-fg",
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export function SliderRow({
  label,
  value,
  min,
  max,
  step,
  onChange,
  format,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  format?: (v: number) => string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="flex items-baseline justify-between">
        <span className="text-2xs font-medium tracking-wide text-muted uppercase">{label}</span>
        <span className="font-mono text-xs text-fg tabular">{format ? format(value) : value}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-8 w-full cursor-pointer appearance-none bg-transparent accent-accent"
      />
    </label>
  );
}
