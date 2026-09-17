import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Finance Dashboard" },
      { name: "description", content: "Manage your dashboard preferences and API connection." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">Preferences and connection.</p>
      </div>

      <div className="glass-card space-y-4 rounded-xl p-6">
        <h2 className="text-base font-semibold">Profile</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Display name</Label>
            <Input id="name" defaultValue="Trader" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" defaultValue="you@example.com" />
          </div>
        </div>
      </div>

      <div className="glass-card space-y-4 rounded-xl p-6">
        <h2 className="text-base font-semibold">Backend</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="api">REST API URL</Label>
            <Input id="api" defaultValue="http://localhost:8080" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ws">WebSocket URL</Label>
            <Input id="ws" defaultValue="ws://localhost:8080/ws/prices" />
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Spring Boot endpoints: <code>GET /assets</code>, <code>POST /assets</code>,{" "}
          <code>GET /assets/chart/portfolio-last-30-days</code>, <code>GET /assets/{"{id}"}/metrics</code>.
        </p>
      </div>

      <div className="glass-card space-y-4 rounded-xl p-6">
        <h2 className="text-base font-semibold">Preferences</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Live updates</p>
            <p className="text-xs text-muted-foreground">Stream prices via WebSocket.</p>
          </div>
          <Switch defaultChecked />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Compact tables</p>
            <p className="text-xs text-muted-foreground">Hide secondary columns.</p>
          </div>
          <Switch />
        </div>
      </div>

      <div className="flex justify-end">
        <Button>Save changes</Button>
      </div>
    </div>
  );
}
