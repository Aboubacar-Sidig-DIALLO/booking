"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DateTimeRangePicker, {
  DateTimeRange,
} from "@/components/ui/datetime-range-picker";
import { Button } from "@/components/ui/button";
import ParticipantsPicker, { Participant } from "./ParticipantsPicker";
import PrivacySelector, { Privacy } from "./PrivacySelector";
import RecurrenceEditor from "./RecurrenceEditor";
import { api } from "@/lib/api";
import { useState as useReactState } from "react";
import { useState } from "react";

const step1Schema = z.object({
  roomId: z.string().min(1, "Choisissez une salle"),
  from: z.string().min(1),
  to: z.string().min(1),
});

type Step1Values = z.infer<typeof step1Schema>;

export default function BookingWizard() {
  const [range, setRange] = useState<DateTimeRange>(() => ({
    from: new Date().toISOString().slice(0, 16),
    to: new Date(Date.now() + 60 * 60e3).toISOString().slice(0, 16),
  }));

  const form = useForm<Step1Values>({
    resolver: zodResolver(step1Schema),
    defaultValues: { roomId: "", from: range.from, to: range.to },
    mode: "onChange",
  });

  // keep RHF in sync with local range picker
  const onRangeChange = (v: DateTimeRange) => {
    setRange(v);
    form.setValue("from", v.from, { shouldValidate: true });
    form.setValue("to", v.to, { shouldValidate: true });
  };

  const [step, setStep] = useReactState<1 | 2 | 3>(1);
  const [participants, setParticipants] = useReactState<Participant[]>([]);
  const [privacy, setPrivacy] = useReactState<Privacy>("public");
  const [recurrence, setRecurrence] = useReactState<string | null>(null);
  const [submitting, setSubmitting] = useReactState(false);

  const onSubmit = (values: Step1Values) => {
    if (step === 1) {
      setStep(2);
      return;
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Nouvelle réservation</h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-300">
          Étape 1 : salle et créneau
        </p>
      </header>

      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-1">
            <Label>Salle</Label>
            <Select
              value={form.watch("roomId")}
              onValueChange={(v) =>
                form.setValue("roomId", v, { shouldValidate: true })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Choisir une salle" />
              </SelectTrigger>
              <SelectContent>
                {/* Placeholder — à remplacer par une liste fetchée */}
                <SelectItem value="room-a">Salle A</SelectItem>
                <SelectItem value="room-b">Salle B</SelectItem>
                <SelectItem value="room-c">Salle C</SelectItem>
              </SelectContent>
            </Select>
            {form.formState.errors.roomId ? (
              <p className="text-xs text-red-600">
                {form.formState.errors.roomId.message}
              </p>
            ) : null}
          </div>

          <div className="grid gap-1">
            <Label>Titre (optionnel)</Label>
            <Input placeholder="Titre de la réunion" />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Créneau</Label>
          <DateTimeRangePicker value={range} onChange={onRangeChange} />
          {(form.formState.errors.from || form.formState.errors.to) && (
            <p className="text-xs text-red-600">
              Veuillez sélectionner un créneau valide.
            </p>
          )}
        </div>

        {step === 1 && (
          <div className="flex items-center gap-3">
            <Button type="submit" disabled={!form.formState.isValid}>
              Continuer
            </Button>
            <Button type="button" variant="ghost" onClick={() => form.reset()}>
              Réinitialiser
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <ParticipantsPicker
              value={participants}
              onChange={setParticipants}
            />
            <PrivacySelector value={privacy} onChange={setPrivacy} />
            <RecurrenceEditor value={recurrence} onChange={setRecurrence} />
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setStep(1)}
              >
                Retour
              </Button>
              <Button
                type="button"
                onClick={() => setStep(3)}
                disabled={!form.formState.isValid}
              >
                Continuer
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="rounded-lg border p-4">
              <h3 className="font-medium">Récapitulatif</h3>
              <ul className="mt-2 text-sm">
                <li>Salle: {form.watch("roomId") || "—"}</li>
                <li>
                  De: {range.from} → À: {range.to}
                </li>
                <li>Participants: {participants.length}</li>
                <li>Confidentialité: {privacy}</li>
                <li>Récurrence: {recurrence || "—"}</li>
              </ul>
            </div>
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setStep(2)}
              >
                Retour
              </Button>
              <Button
                type="button"
                onClick={async () => {
                  setSubmitting(true);
                  try {
                    // Optimistic: invalider après succès, ou simuler en local
                    await api.post("/bookings", {
                      roomId: form.getValues("roomId"),
                      from: new Date(range.from).toISOString(),
                      to: new Date(range.to).toISOString(),
                      participants,
                      privacy,
                      recurrence,
                    });
                  } catch (e) {
                    // ignore (mock)
                  } finally {
                    setSubmitting(false);
                  }
                }}
                disabled={submitting}
              >
                {submitting ? "Création…" : "Créer la réservation"}
              </Button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
