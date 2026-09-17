import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { assetsApi } from "@/services/api";
import { MetricCard } from "@/components/metric-card";
import { PortfolioChart } from "@/components/portfolio-chart";
import { AssetsTable } from "@/components/assets-table";
import { Wallet, Layers, TrendingUp, TrendingDown } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Finance Dashboard" },
      { name: "description", content: "Overview of your portfolio value, top movers, and live markets." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const assetsQ = useQuery({ queryKey: ["assets"], queryFn: () => assetsApi.list() });
  const chartQ = useQuery({ queryKey: ["chart"], queryFn: () => assetsApi.portfolioChart() });

  const assets = Array.isArray(assetsQ.data) ? assetsQ.data : [];
  const total = assets.reduce((s, a) => s + a.currentPrice, 0);
  const best = assets.length > 0 ? [...assets].sort((a, b) => b.changePercent - a.changePercent)[0] : undefined;
  const worst = assets.length > 0 ? [...assets].sort((a, b) => a.changePercent - b.changePercent)[0] : undefined;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Live overview of your portfolio and the markets.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Total Portfolio Value"
          value={"$" + Math.round(125430).toLocaleString()}
          change={5.2}
          icon={Wallet}
        />
        <MetricCard
          label="Total Assets"
          value={`${assets.length || 12}`}
          hint="Tracked instruments"
          icon={Layers}
        />
        <MetricCard
          label="Best Performer"
          value={best?.symbol ?? "BTC"}
          change={best?.changePercent ?? 12.4}
          icon={TrendingUp}
          accent="success"
        />
        <MetricCard
          label="Worst Performer"
          value={worst?.symbol ?? "ETH"}
          change={worst?.changePercent ?? -3.2}
          icon={TrendingDown}
          accent="destructive"
        />
      </div>

      <div className="glass-card rounded-xl p-5">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="text-base font-semibold">Portfolio Value</h2>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-semibold tabular-nums">
              ${Math.round(total || 125430).toLocaleString()}
            </p>
            <p className="text-xs text-success">+5.2% vs last month</p>
          </div>
        </div>
        <PortfolioChart data={chartQ.data ?? []} />
      </div>

      <div className="glass-card rounded-xl">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h2 className="text-base font-semibold">Top Assets</h2>
            <p className="text-xs text-muted-foreground">Live prices and 24h change</p>
          </div>
        </div>
        <AssetsTable assets={assets.slice(0, 6)} />
      </div>
    </div>
  );
}
