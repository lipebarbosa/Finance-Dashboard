import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { assetsApi } from "@/services/api";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Portfolio Analytics — Finance Dashboard" },
      { name: "description", content: "Allocation, performance distribution, and portfolio growth." },
    ],
  }),
  component: AnalyticsPage,
});

const COLORS = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
];

function AnalyticsPage() {
  const assetsQ = useQuery({ queryKey: ["assets"], queryFn: () => assetsApi.list() });
  const chartQ = useQuery({ queryKey: ["chart"], queryFn: () => assetsApi.portfolioChart() });

  const assets = assetsQ.data ?? [];
  const allocation = assets.slice(0, 6).map((a) => ({ name: a.symbol, value: a.currentPrice }));
  const distribution = assets.map((a) => ({ name: a.symbol, change: Number(a.changePercent.toFixed(2)) }));

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Portfolio Analytics</h1>
        <p className="text-sm text-muted-foreground">
          Allocation, distribution and growth across your portfolio.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="glass-card rounded-xl p-5">
          <h2 className="mb-1 text-base font-semibold">Asset Allocation</h2>
          <p className="mb-4 text-xs text-muted-foreground">By current price weight</p>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={allocation}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  stroke="var(--color-card)"
                >
                  {allocation.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 flex flex-wrap gap-3 text-xs">
            {allocation.map((a, i) => (
              <div key={a.name} className="flex items-center gap-1.5 text-muted-foreground">
                <span className="h-2 w-2 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                {a.name}
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-xl p-5">
          <h2 className="mb-1 text-base font-semibold">Performance Distribution</h2>
          <p className="mb-4 text-xs text-muted-foreground">24h change by asset</p>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={distribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="change" radius={[6, 6, 0, 0]}>
                  {distribution.map((d, i) => (
                    <Cell
                      key={i}
                      fill={d.change >= 0 ? "var(--color-success)" : "var(--color-destructive)"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-xl p-5">
        <h2 className="mb-1 text-base font-semibold">Portfolio Growth</h2>
        <p className="mb-4 text-xs text-muted-foreground">Last 30 days</p>
        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartQ.data ?? []}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis
                dataKey="date"
                stroke="var(--color-muted-foreground)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => v.slice(5)}
              />
              <YAxis
                stroke="var(--color-muted-foreground)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: 12,
                  fontSize: 12,
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="var(--color-primary)"
                strokeWidth={2.5}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
