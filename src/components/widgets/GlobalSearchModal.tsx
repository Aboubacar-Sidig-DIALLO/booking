"use client";

import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";

type SearchResult = {
  id: string;
  type: "room" | "user" | "booking";
  title: string;
  subtitle?: string;
};

export default function GlobalSearchModal() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const q = useDebounce(query, 250);
  const [results, setResults] = useState<SearchResult[]>([]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((s) => !s);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    // Mock de recherche globale
    const base: SearchResult[] = [
      { id: "r1", type: "room", title: "Salle A", subtitle: "Étage 1" },
      {
        id: "u1",
        type: "user",
        title: "Alice Martin",
        subtitle: "alice@example.com",
      },
      {
        id: "b1",
        type: "booking",
        title: "Réunion projet",
        subtitle: "Salle B",
      },
    ];
    setResults(
      q
        ? base.filter((x) => x.title.toLowerCase().includes(q.toLowerCase()))
        : base
    );
  }, [q]);

  const grouped = useMemo(() => {
    return {
      room: results.filter((r) => r.type === "room"),
      user: results.filter((r) => r.type === "user"),
      booking: results.filter((r) => r.type === "booking"),
    };
  }, [results]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="p-0">
        <div className="border-b p-3">
          <Input
            autoFocus
            placeholder="Rechercher (Ctrl+K)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="max-h-[60vh] overflow-auto p-3 text-sm">
          {(["room", "user", "booking"] as const).map((section) => (
            <div key={section} className="mb-4">
              <div className="mb-2 text-xs uppercase text-neutral-500">
                {section}
              </div>
              <div className="space-y-1">
                {grouped[section].map((r) => (
                  <div
                    key={r.id}
                    className="rounded-md p-2 hover:bg-neutral-50 dark:hover:bg-neutral-900"
                  >
                    <div className="font-medium">{r.title}</div>
                    {r.subtitle ? (
                      <div className="text-xs text-neutral-600 dark:text-neutral-300">
                        {r.subtitle}
                      </div>
                    ) : null}
                  </div>
                ))}
                {grouped[section].length === 0 ? (
                  <div className="text-neutral-500">Aucun résultat</div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
