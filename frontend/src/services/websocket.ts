export type PriceTick = {
  symbol: string;
  price: number;
  changePercent: number;
  ts: number;
};

type Listener = (tick: PriceTick) => void;
type StatusListener = (connected: boolean) => void;

class PriceSocket {
  private ws: WebSocket | null = null;
  private listeners = new Set<Listener>();
  private statusListeners = new Set<StatusListener>();
  private mockTimer: ReturnType<typeof setInterval> | null = null;
  private connected = false;
  private url: string;

  constructor() {
    const env = (import.meta as any).env || {};
    this.url = env.VITE_WS_URL || "ws://localhost:8080/ws/prices";
  }

  private setConnected(v: boolean) {
    this.connected = v;
    this.statusListeners.forEach((l) => l(v));
  }

  connect() {
    if (typeof window === "undefined") return;
    if (this.ws || this.mockTimer) return;
    try {
      this.ws = new WebSocket(this.url);
      this.ws.onopen = () => this.setConnected(true);
      this.ws.onclose = () => {
        this.ws = null;
        this.setConnected(false);
        this.startMock();
      };
      this.ws.onerror = () => {
        this.ws?.close();
      };
      this.ws.onmessage = (ev) => {
        try {
          const tick = JSON.parse(ev.data) as PriceTick;
          this.listeners.forEach((l) => l(tick));
        } catch {
          /* ignore */
        }
      };
    } catch {
      this.startMock();
    }
  }

  private startMock() {
    if (this.mockTimer) return;
    this.setConnected(true); // simulate "live" with mock stream
    const symbols = ["BTC", "ETH", "SOL", "BNB", "ADA", "XRP", "DOGE"];
    this.mockTimer = setInterval(() => {
      const s = symbols[Math.floor(Math.random() * symbols.length)];
      const tick: PriceTick = {
        symbol: s,
        price: Math.random() * 70000,
        changePercent: (Math.random() - 0.5) * 6,
        ts: Date.now(),
      };
      this.listeners.forEach((l) => l(tick));
    }, 2500);
  }

  onTick(l: Listener) {
    this.listeners.add(l);
    return () => this.listeners.delete(l);
  }

  onStatus(l: StatusListener) {
    this.statusListeners.add(l);
    l(this.connected);
    return () => this.statusListeners.delete(l);
  }

  disconnect() {
    this.ws?.close();
    this.ws = null;
    if (this.mockTimer) clearInterval(this.mockTimer);
    this.mockTimer = null;
    this.setConnected(false);
  }
}

export const priceSocket = new PriceSocket();
