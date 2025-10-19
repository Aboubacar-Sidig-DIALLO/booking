"use client";

import { Users, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface AttendeeCountSelectorProps {
  value: number;
  onChange: (count: number) => void;
  min?: number;
  max?: number;
}

const QUICK_COUNTS = [2, 4, 6, 8, 12, 16, 20];

export default function AttendeeCountSelector({
  value,
  onChange,
  min = 1,
  max = 50,
}: AttendeeCountSelectorProps) {
  const handleIncrement = () => {
    if (value < max) onChange(value + 1);
  };

  const handleDecrement = () => {
    if (value > min) onChange(value - 1);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Users className="h-4 w-4 text-purple-600" />
        <Label className="font-medium text-slate-900">
          Nombre de participants
        </Label>
      </div>

      {/* Sélecteur principal */}
      <div className="flex items-center justify-center space-x-4 bg-white rounded-xl border border-slate-200 p-4">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleDecrement}
          disabled={value <= min}
          className="h-10 w-10 rounded-full border-slate-300 hover:bg-slate-50"
        >
          <Minus className="h-4 w-4" />
        </Button>

        <div className="text-center min-w-[80px]">
          <div className="text-2xl font-bold text-slate-900">{value}</div>
          <div className="text-xs text-slate-500">
            {value === 1 ? "personne" : "personnes"}
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleIncrement}
          disabled={value >= max}
          className="h-10 w-10 rounded-full border-slate-300 hover:bg-slate-50"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Sélection rapide */}
      <div className="space-y-2">
        <Label className="text-sm text-slate-700">
          {" "}
          Nombre de participants courants{" "}
        </Label>
        <div className="flex flex-wrap gap-2">
          {QUICK_COUNTS.map((count) => (
            <Button
              key={count}
              type="button"
              variant={value === count ? "default" : "outline"}
              size="sm"
              onClick={() => onChange(count)}
              className="h-8 px-3 text-xs"
            >
              {count}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
