"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useRealtime } from "@/hooks/useRealtime";
import { useEffect } from "react";

export default function WallboardPage() {
  const { data, refetch } = useQuery({
    queryKey: ["wallboard", "rooms"],
    queryFn: async () => {
      try {
        const res = await api.get("/rooms", {
          params: {
            from: new Date().toISOString(),
            to: new Date(Date.now() + 60 * 60e3).toISOString(),
          },
        });
        return res.data as Array<{
          id: string;
          name: string;
          nextFreeInMin: number;
          status: "free" | "busy" | "pending";
        }>;
      } catch {
        // Mock fallback
        return [
          { id: "a", name: "Salle A", nextFreeInMin: 15, status: "busy" },
          { id: "b", name: "Salle B", nextFreeInMin: 0, status: "free" },
          { id: "c", name: "Salle C", nextFreeInMin: 5, status: "pending" },
        ];
      }
    },
    refetchInterval: 30_000,
  });

  useRealtime({
    "booking.created": () => refetch(),
    "booking.updated": () => refetch(),
    "booking.cancelled": () => refetch(),
  });

  useEffect(() => {
    const id = setInterval(() => refetch(), 30_000);
    return () => clearInterval(id);
  }, [refetch]);

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Affichage mural</h1>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {(data ?? []).map((r) => (
          <div key={r.id} className="rounded-xl border p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="text-lg font-semibold">{r.name}</div>
              <div
                title={r.status}
                className={
                  r.status === "free"
                    ? "h-3 w-3 rounded-full bg-green-500"
                    : r.status === "busy"
                      ? "h-3 w-3 rounded-full bg-red-500"
                      : "h-3 w-3 rounded-full bg-yellow-500"
                }
              />
            </div>
            <div className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
              Prochain créneau libre: {r.nextFreeInMin} min
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
