import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  label: string;
  value: string;
  hint?: string;
  change?: number;
  icon: LucideIcon;
  accent?: "primary" | "success" | "destructive";
};

export function MetricCard({ label, value, hint, change, icon: Icon, accent = "primary" }: Props) {
  const positive = (change ?? 0) >= 0;
  const accentClass =
    accent === "success"
      ? "bg-success/10 text-success ring-success/20"
      : accent === "destructive"
        ? "bg-destructive/10 text-destructive ring-destructive/20"
        : "bg-primary/10 text-primary ring-primary/20";

  return (
    <div className="glass-card group relative overflow-hidden rounded-xl p-5 transition hover:translate-y-[-1px] hover:shadow-lg">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {label}
          </p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">{value}</p>
          {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
        </div>
        <div className={cn("rounded-lg p-2 ring-1", accentClass)}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      {typeof change === "number" && (
        <div
          className={cn(
            "mt-4 inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium",
            positive ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive",
          )}
        >
          {positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
          {positive ? "+" : ""}
          {change.toFixed(2)}%
        </div>
      )}
    </div>
  );
}
