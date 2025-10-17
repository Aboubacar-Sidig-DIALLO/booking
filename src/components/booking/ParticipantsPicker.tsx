"use client";

import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useDebounce } from "@/hooks/useDebounce";
import { Button } from "@/components/ui/button";

export type ParticipantRole = "host" | "required" | "optional";
export type Participant = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: ParticipantRole;
};

export default function ParticipantsPicker({
  value,
  onChange,
}: {
  value: Participant[];
  onChange: (v: Participant[]) => void;
}) {
  const [query, setQuery] = useState("");
  const q = useDebounce(query, 300);
  const [results, setResults] = useState<Participant[]>([]);

  useEffect(() => {
    // Mock de recherche utilisateur
    const base = [
      { id: "u1", name: "Alice Martin", email: "alice@example.com" },
      { id: "u2", name: "Bob Dupont", email: "bob@example.com" },
      { id: "u3", name: "Chloé Bernard", email: "chloe@example.com" },
    ];
    const filtered = q
      ? base.filter((u) => u.name.toLowerCase().includes(q.toLowerCase()))
      : base;
    setResults(filtered.map((u) => ({ ...u, role: "required" as const })));
  }, [q]);

  const selectedIds = useMemo(() => new Set(value.map((p) => p.id)), [value]);

  const add = (p: Participant) => {
    if (selectedIds.has(p.id)) return;
    onChange([...value, p]);
  };
  const remove = (id: string) => onChange(value.filter((p) => p.id !== id));
  const toggleRole = (id: string) =>
    onChange(
      value.map((p) =>
        p.id === id
          ? {
              ...p,
              role:
                p.role === "required"
                  ? "optional"
                  : p.role === "optional"
                    ? "host"
                    : "required",
            }
          : p
      )
    );

  return (
    <div className="space-y-3">
      <Input
        placeholder="Rechercher des participants"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="flex flex-wrap gap-2">
        {value.map((p) => (
          <Badge key={p.id} className="gap-2">
            {p.name} <span className="opacity-70">({p.role})</span>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => toggleRole(p.id)}
              aria-label="Changer rôle"
            >
              ↺
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => remove(p.id)}
              aria-label="Retirer"
            >
              ×
            </Button>
          </Badge>
        ))}
      </div>
      <div className="grid gap-2">
        {results.map((r) => (
          <div
            key={r.id}
            className="flex items-center justify-between rounded-md border p-2"
          >
            <div>
              <div className="text-sm font-medium">{r.name}</div>
              <div className="text-xs text-neutral-600 dark:text-neutral-300">
                {r.email}
              </div>
            </div>
            <Button
              size="sm"
              variant={selectedIds.has(r.id) ? "secondary" : "default"}
              onClick={() => add(r)}
              disabled={selectedIds.has(r.id)}
            >
              {selectedIds.has(r.id) ? "Ajouté" : "Ajouter"}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
