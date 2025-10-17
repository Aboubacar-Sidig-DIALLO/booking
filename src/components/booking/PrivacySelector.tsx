"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export type Privacy = "public" | "private" | "confidential";

export default function PrivacySelector({
  value,
  onChange,
}: {
  value: Privacy;
  onChange: (v: Privacy) => void;
}) {
  return (
    <div className="grid gap-1">
      <Label>Confidentialité</Label>
      <Select value={value} onValueChange={(v) => onChange(v as Privacy)}>
        <SelectTrigger>
          <SelectValue placeholder="Confidentialité" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="public">Publique</SelectItem>
          <SelectItem value="private">Privée</SelectItem>
          <SelectItem value="confidential">Confidentielle</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
