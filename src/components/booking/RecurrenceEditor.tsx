"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function RecurrenceEditor({
  value,
  onChange,
}: {
  value?: string | null;
  onChange: (v: string | null) => void;
}) {
  return (
    <div className="grid gap-1">
      <Label>Récurrence (RRULE)</Label>
      <Input
        placeholder="Ex: FREQ=WEEKLY;COUNT=10"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value || null)}
      />
      <p className="text-xs text-neutral-600 dark:text-neutral-300">
        Laissez vide pour une occurrence unique.
      </p>
    </div>
  );
}
