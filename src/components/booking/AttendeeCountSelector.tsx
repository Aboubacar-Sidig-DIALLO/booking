"use client";

import { Users } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface AttendeeCountSelectorProps {
  value: number;
  onChange: (count: number) => void;
  min?: number;
  max?: number;
  compact?: boolean;
}

const QUICK_COUNTS = [2, 4, 6, 8, 12, 16, 20];

export default function AttendeeCountSelector({
  value,
  onChange,
  min = 1,
  max = 50,
  compact = false,
}: AttendeeCountSelectorProps) {
  const handleInput = (val: string) => {
    if (val === "") {
      onChange(min);
      return;
    }
    const parsed = parseInt(val, 10);
    if (Number.isNaN(parsed)) return;
    const clamped = Math.max(min, Math.min(max, parsed));
    onChange(clamped);
  };

  if (compact) {
    return (
      <div className="space-y-2">
        <Label className="text-sm font-medium text-slate-700">
          Nombre de participants
        </Label>
        <div className="relative">
          <Input
            type="number"
            min={min}
            max={max}
            step={1}
            inputMode="numeric"
            value={value}
            onChange={(e) => handleInput(e.target.value)}
            className="h-12 pr-24 font-semibold"
            aria-label="Nombre de participants"
          />
          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs text-slate-500">
            participants
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-white rounded-xl sm:rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm`}
    >
      <div
        className={`flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 justify-between`}
      >
        <div className="flex items-start sm:items-center gap-3 min-w-0">
          <div className="h-8 w-8 bg-gradient-to-br from-purple-500 to-violet-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Users className="h-4 w-4 text-white" />
          </div>
          <div className="min-w-0">
            <Label className="font-semibold text-slate-900 block">
              Nombre de participants
            </Label>
            <div className="mt-1.5 text-[11px] sm:text-xs text-slate-500">
              Entre {min} et {max}.
            </div>
          </div>
        </div>

        <div className={`w-full sm:w-auto sm:min-w-[260px]`}>
          <div className="relative">
            <Input
              type="number"
              min={min}
              max={max}
              step={1}
              inputMode="numeric"
              value={value}
              onChange={(e) => handleInput(e.target.value)}
              className="h-11 sm:h-12 pr-24 text-base sm:text-lg font-semibold"
              aria-label="Nombre de participants"
            />
            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs text-slate-500">
              participants
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
