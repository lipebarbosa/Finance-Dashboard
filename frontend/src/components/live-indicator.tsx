import { useEffect, useState } from "react";
import { priceSocket } from "@/services/websocket";

export function LiveIndicator() {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    priceSocket.connect();
    const off = priceSocket.onStatus(setConnected);
    return () => {
      off();
    };
  }, []);

  return (
    <div className="flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1.5 text-xs">
      <span
        className={`pulse-dot h-2 w-2 rounded-full ${connected ? "bg-success" : "bg-muted-foreground"}`}
      />
      <span className="text-muted-foreground">
        {connected ? "Live Market Data" : "Disconnected"}
      </span>
    </div>
  );
}
