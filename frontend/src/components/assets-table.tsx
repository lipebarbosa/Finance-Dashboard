import type { Asset } from "@/services/api";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

const usd = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: n < 1 ? 4 : 2,
  }).format(n);

const time = (s: string) => {
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

export function AssetsTable({ assets, compact = false }: { assets: Asset[]; compact?: boolean }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
            <th className="py-3 pl-4 font-medium">Symbol</th>
            <th className="py-3 font-medium">Name</th>
            <th className="py-3 text-right font-medium">Price</th>
            <th className="py-3 text-right font-medium">24h</th>
            {!compact && <th className="py-3 pr-4 text-right font-medium">Updated</th>}
          </tr>
        </thead>
        <tbody>
          {assets.map((a) => {
            const positive = a.changePercent >= 0;
            return (
              <tr
                key={a.id}
                className="border-b border-border/60 transition hover:bg-accent/40"
              >
                <td className="py-3 pl-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-[11px] font-semibold text-primary ring-1 ring-primary/20">
                      {a.symbol.slice(0, 3)}
                    </div>
                    <span className="font-medium text-foreground">{a.symbol}</span>
                  </div>
                </td>
                <td className="py-3 text-muted-foreground">{a.name}</td>
                <td className="py-3 text-right font-medium tabular-nums">{usd(a.currentPrice)}</td>
                <td className="py-3 text-right">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium tabular-nums",
                      positive ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive",
                    )}
                  >
                    {positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                    {positive ? "+" : ""}
                    {a.changePercent.toFixed(2)}%
                  </span>
                </td>
                {!compact && (
                  <td className="py-3 pr-4 text-right text-xs text-muted-foreground tabular-nums">
                    {time(a.updatedAt)}
                  </td>
                )}
              </tr>
            );
          })}
          {assets.length === 0 && (
            <tr>
              <td colSpan={compact ? 4 : 5} className="py-10 text-center text-sm text-muted-foreground">
                No assets to display.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
