import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { assetsApi } from "@/services/api";
import { AssetsTable } from "@/components/assets-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, RefreshCw, Search, ArrowUpDown } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/assets")({
  head: () => ({
    meta: [
      { title: "Assets — Finance Dashboard" },
      { name: "description", content: "Manage tracked crypto and financial assets." },
    ],
  }),
  component: AssetsPage,
});

const PAGE_SIZE = 8;

function AssetsPage() {
  const qc = useQueryClient();
  const { data = [], isFetching, refetch } = useQuery({
    queryKey: ["assets"],
    queryFn: () => assetsApi.list(),
  });

  const [q, setQ] = useState("");
  const [sortDesc, setSortDesc] = useState(true);
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ symbol: "", name: "" });

  const create = useMutation({
    mutationFn: assetsApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["assets"] });
      toast.success("Asset saved");
      setOpen(false);
      setForm({ symbol: "", name: "" });
    },
  });

  const filtered = useMemo(() => {
    const lower = q.toLowerCase();
    const list = data.filter(
      (a) => a.symbol.toLowerCase().includes(lower) || a.name.toLowerCase().includes(lower),
    );
    list.sort((a, b) =>
      sortDesc ? b.changePercent - a.changePercent : a.changePercent - b.changePercent,
    );
    return list;
  }, [data, q, sortDesc]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const view = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Assets</h1>
          <p className="text-sm text-muted-foreground">
            All tracked instruments with live prices.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              refetch();
              toast.success("Prices refreshed");
            }}
            disabled={isFetching}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
            Refresh Prices
          </Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Asset
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add Asset</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="symbol">Symbol</Label>
                  <Input
                    id="symbol"
                    placeholder="BTC"
                    value={form.symbol}
                    onChange={(e) => setForm((f) => ({ ...f, symbol: e.target.value.toUpperCase() }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="Bitcoin"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={() => create.mutate(form)}
                  disabled={!form.symbol || !form.name || create.isPending}
                >
                  Save Asset
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="glass-card rounded-xl">
        <div className="flex flex-wrap items-center gap-3 border-b border-border px-5 py-3">
          <div className="relative w-full max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(1);
              }}
              placeholder="Search assets…"
              className="h-9 pl-9"
            />
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSortDesc((s) => !s)}
            className="text-xs text-muted-foreground"
          >
            <ArrowUpDown className="mr-2 h-3 w-3" />
            Sort by 24h {sortDesc ? "↓" : "↑"}
          </Button>
          <span className="ml-auto text-xs text-muted-foreground">
            {filtered.length} results
          </span>
        </div>

        <AssetsTable assets={view} />

        <div className="flex items-center justify-between border-t border-border px-5 py-3 text-xs text-muted-foreground">
          <span>
            Page {page} of {pages}
          </span>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={page >= pages}
              onClick={() => setPage((p) => Math.min(pages, p + 1))}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
