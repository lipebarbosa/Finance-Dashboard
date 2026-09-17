import axios from "axios";

const baseURL = (import.meta as any).env?.VITE_API_URL || "http://localhost:8080";

export const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

export type Asset = {
  id: string | number;
  symbol: string;
  name: string;
  currentPrice: number;
  changePercent: number;
  updatedAt: string;
};

export type AssetMetrics = {
  symbol: string;
  marketCap?: number;
  volume24h?: number;
  high24h?: number;
  low24h?: number;
};

export type PortfolioPoint = { date: string; value: number };

// ------- Mock fallbacks (used until backend is reachable) -------
const MOCK_ASSETS: Asset[] = [
  { id: 1, symbol: "BTC", name: "Bitcoin", currentPrice: 64000, changePercent: 2.4, updatedAt: new Date().toISOString() },
  { id: 2, symbol: "ETH", name: "Ethereum", currentPrice: 3100, changePercent: -1.2, updatedAt: new Date().toISOString() },
  { id: 3, symbol: "SOL", name: "Solana", currentPrice: 180, changePercent: 4.8, updatedAt: new Date().toISOString() },
  { id: 4, symbol: "BNB", name: "BNB", currentPrice: 612, changePercent: 0.8, updatedAt: new Date().toISOString() },
  { id: 5, symbol: "ADA", name: "Cardano", currentPrice: 0.46, changePercent: -2.1, updatedAt: new Date().toISOString() },
  { id: 6, symbol: "XRP", name: "Ripple", currentPrice: 0.58, changePercent: 1.6, updatedAt: new Date().toISOString() },
  { id: 7, symbol: "DOGE", name: "Dogecoin", currentPrice: 0.16, changePercent: 12.4, updatedAt: new Date().toISOString() },
  { id: 8, symbol: "AVAX", name: "Avalanche", currentPrice: 34, changePercent: -3.2, updatedAt: new Date().toISOString() },
  { id: 9, symbol: "DOT", name: "Polkadot", currentPrice: 7.2, changePercent: 0.3, updatedAt: new Date().toISOString() },
  { id: 10, symbol: "MATIC", name: "Polygon", currentPrice: 0.72, changePercent: 1.1, updatedAt: new Date().toISOString() },
  { id: 11, symbol: "LINK", name: "Chainlink", currentPrice: 16.2, changePercent: 3.4, updatedAt: new Date().toISOString() },
  { id: 12, symbol: "LTC", name: "Litecoin", currentPrice: 84, changePercent: -0.8, updatedAt: new Date().toISOString() },
];

function mockChart(): PortfolioPoint[] {
  const out: PortfolioPoint[] = [];
  let v = 110000;
  const now = Date.now();
  for (let i = 29; i >= 0; i--) {
    v += (Math.random() - 0.45) * 3500;
    out.push({
      date: new Date(now - i * 86400000).toISOString().slice(0, 10),
      value: Math.round(v),
    });
  }
  return out;
}

async function safe<T>(p: Promise<{ data: T }>, fallback: T): Promise<T> {
  try {
    const r = await p;
    if (typeof r.data === "string" && (r.data.trim().startsWith("<!DOCTYPE") || r.data.trim().startsWith("<html"))) {
      throw new Error("Received HTML instead of JSON");
    }
    return r.data;
  } catch {
    return fallback;
  }
}

export const assetsApi = {
  list: () => safe<Asset[]>(api.get("/assets"), MOCK_ASSETS),
  create: (payload: { symbol: string; name: string }) =>
    safe<Asset>(api.post("/assets", payload), {
      id: Math.random(),
      symbol: payload.symbol,
      name: payload.name,
      currentPrice: 0,
      changePercent: 0,
      updatedAt: new Date().toISOString(),
    }),
  portfolioChart: () =>
    safe<PortfolioPoint[]>(api.get("/assets/chart/portfolio-last-30-days"), mockChart()),
  metrics: (id: string | number) =>
    safe<AssetMetrics>(api.get(`/assets/${id}/metrics`), { symbol: String(id) }),
};
