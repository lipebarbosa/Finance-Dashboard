import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { priceSocket, type PriceTick } from "@/services/websocket";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/market")({
  head: () => ({
    meta: [
      { title: "Market Overview — Finance Dashboard" },
      { name: "description", content: "Live prices for top market assets." },
    ],
  }),
  component: MarketPage,
});

type Card = {
  symbol: string;
  name: string;
  price: number;
  change: number;
  spark: { v: number }[];
};

const INITIAL: Card[] = [
  { symbol: "BTC", name: "Bitcoin", price: 64000, change: 2.4, spark: seed(64000) },
  { symbol: "ETH", name: "Ethereum", price: 3100, change: -1.2, spark: seed(3100) },
  { symbol: "SOL", name: "Solana", price: 180, change: 4.8, spark: seed(180) },
  { symbol: "BNB", name: "BNB", price: 612, change: 0.8, spark: seed(612) },
];

function seed(base: number) {
  const out: { v: number }[] = [];
  let v = base;
  for (let i = 0; i < 24; i++) {
    v += (Math.random() - 0.5) * base * 0.01;
    out.push({ v });
  }
  return out;
}

function MarketPage() {
  const [cards, setCards] = useState<Card[]>(INITIAL);

  useEffect(() => {
    priceSocket.connect();
    const off = priceSocket.onTick((tick: PriceTick) => {
      setCards((prev) =>
        prev.map((c) => {
          if (c.symbol !== tick.symbol) return c;
          const newPrice = tick.price > 0 && tick.symbol === c.symbol
            ? c.price + (Math.random() - 0.5) * c.price * 0.01
            : c.price;
          const spark = [...c.spark.slice(1), { v: newPrice }];
          return { ...c, price: newPrice, change: tick.changePercent, spark };
        }),
      );
    });
    return () => {
      off();
    };
  }, []);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Market Overview</h1>
        <p className="text-sm text-muted-foreground">Top markets with live prices.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => {
          const positive = c.change >= 0;
          return (
            <div key={c.symbol} className="glass-card rounded-xl p-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-[11px] font-semibold text-primary ring-1 ring-primary/20">
                      {c.symbol.slice(0, 3)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{c.symbol}</p>
                      <p className="text-xs text-muted-foreground">{c.name}</p>
                    </div>
                  </div>
                </div>
                <span
                  className={cn(
                    "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium",
                    positive ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive",
                  )}
                >
                  {positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {positive ? "+" : ""}
                  {c.change.toFixed(2)}%
                </span>
              </div>
              <p className="mt-4 text-2xl font-semibold tabular-nums">
                ${c.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </p>
              <div className="mt-3 h-12">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={c.spark}>
                    <defs>
                      <linearGradient id={`sp-${c.symbol}`} x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="0%"
                          stopColor={positive ? "var(--color-success)" : "var(--color-destructive)"}
                          stopOpacity={0.4}
                        />
                        <stop
                          offset="100%"
                          stopColor={positive ? "var(--color-success)" : "var(--color-destructive)"}
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey="v"
                      stroke={positive ? "var(--color-success)" : "var(--color-destructive)"}
                      strokeWidth={1.8}
                      fill={`url(#sp-${c.symbol})`}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
