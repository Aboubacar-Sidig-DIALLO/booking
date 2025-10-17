"use client";

import { useId } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type DateTimeRange = { from: string; to: string };

export function DateTimeRangePicker({
  value,
  onChange,
}: {
  value: DateTimeRange;
  onChange: (v: DateTimeRange) => void;
}) {
  const idFrom = useId();
  const idTo = useId();
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      <div className="grid gap-1">
        <Label htmlFor={idFrom}>De</Label>
        <Input
          id={idFrom}
          type="datetime-local"
          value={value.from}
          onChange={(e) => onChange({ ...value, from: e.target.value })}
        />
      </div>
      <div className="grid gap-1">
        <Label htmlFor={idTo}>À</Label>
        <Input
          id={idTo}
          type="datetime-local"
          value={value.to}
          onChange={(e) => onChange({ ...value, to: e.target.value })}
        />
      </div>
    </div>
  );
}

export default DateTimeRangePicker;
