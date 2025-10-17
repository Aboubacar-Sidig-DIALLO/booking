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
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Calendar,
  Users,
  Shield,
  Repeat,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Clock,
  Building2,
  Sparkles,
} from "lucide-react";

const step1Schema = z.object({
  roomId: z.string().min(1, "Choisissez une salle"),
  from: z.string().min(1),
  to: z.string().min(1),
});

type Step1Values = z.infer<typeof step1Schema>;

const steps = [
  {
    id: 1,
    title: "Salle & Créneau",
    icon: MapPin,
    description: "Choisissez votre espace et horaire",
  },
  {
    id: 2,
    title: "Configuration",
    icon: Users,
    description: "Participants et options",
  },
  {
    id: 3,
    title: "Confirmation",
    icon: CheckCircle,
    description: "Vérifiez et confirmez",
  },
];

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

  const nextStep = () => {
    if (step < 3) {
      setStep((step + 1) as 1 | 2 | 3);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep((step - 1) as 1 | 2 | 3);
    }
  };

  return (
    <div className="space-y-8">
      {/* Indicateur de progression moderne */}
      <div className="relative">
        {/* Barre de progression en arrière-plan */}
        <div className="absolute top-4 sm:top-6 left-4 sm:left-6 right-4 sm:right-6 h-0.5 bg-slate-200">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: `${((step - 1) / 2) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        <div className="flex items-center justify-between mb-6 sm:mb-8 relative z-10 px-2">
          {steps.map((stepItem, index) => {
            const Icon = stepItem.icon;
            const isActive = step === stepItem.id;
            const isCompleted = step > stepItem.id;

            return (
              <div
                key={stepItem.id}
                className="flex flex-col items-center space-y-2 sm:space-y-3 flex-1 min-w-0"
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all duration-300 bg-white ${
                    isActive
                      ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25"
                      : isCompleted
                        ? "bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/25"
                        : "bg-slate-100 text-slate-400"
                  }`}
                >
                  <Icon className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                  {isCompleted && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 h-3 w-3 sm:h-4 sm:w-4 bg-green-500 rounded-full flex items-center justify-center"
                    >
                      <CheckCircle className="h-2 w-2 sm:h-3 sm:w-3 text-white" />
                    </motion.div>
                  )}
                </motion.div>
                <div className="text-center px-1">
                  <h3
                    className={`text-xs sm:text-sm font-semibold leading-tight ${isActive ? "text-slate-900" : "text-slate-500"}`}
                  >
                    <span className="hidden sm:inline">{stepItem.title}</span>
                    <span className="sm:hidden">
                      {stepItem.title.split(" ")[0]}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 leading-tight hidden sm:block">
                    {stepItem.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* Section Salle */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-blue-100">
                <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
                  <div className="h-8 w-8 sm:h-10 sm:w-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                    <Building2 className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base sm:text-lg font-semibold text-slate-900">
                      Sélection de l'espace
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      Choisissez la salle qui correspond à vos besoins
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700">
                      Salle *
                    </Label>
                    <Select
                      value={form.watch("roomId")}
                      onValueChange={(v) =>
                        form.setValue("roomId", v, { shouldValidate: true })
                      }
                    >
                      <SelectTrigger className="h-10 sm:h-12 bg-white border-slate-200 rounded-lg sm:rounded-xl">
                        <SelectValue placeholder="Choisir une salle" />
                      </SelectTrigger>
                      <SelectContent className="rounded-lg sm:rounded-xl">
                        <SelectItem value="room-a">
                          🏢 Salle de conférence A
                        </SelectItem>
                        <SelectItem value="room-b">
                          💻 Salle de réunion B
                        </SelectItem>
                        <SelectItem value="room-c">
                          🎯 Espace créatif C
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {form.formState.errors.roomId && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs text-red-600 flex items-center space-x-1"
                      >
                        <span>⚠️</span>
                        <span>{form.formState.errors.roomId.message}</span>
                      </motion.p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700">
                      Titre de la réunion
                    </Label>
                    <Input
                      placeholder="Ex: Réunion équipe marketing"
                      className="h-10 sm:h-12 bg-white border-slate-200 rounded-lg sm:rounded-xl"
                    />
                  </div>
                </div>
              </div>

              {/* Section Créneau */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-green-100">
                <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
                  <div className="h-8 w-8 sm:h-10 sm:w-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base sm:text-lg font-semibold text-slate-900">
                      Planification
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      Définissez la durée et l'horaire de votre réunion
                    </p>
                  </div>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <Label className="text-sm font-medium text-slate-700">
                    Créneau horaire *
                  </Label>
                  <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 border border-slate-200">
                    <DateTimeRangePicker
                      value={range}
                      onChange={onRangeChange}
                    />
                  </div>
                  {(form.formState.errors.from || form.formState.errors.to) && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs text-red-600 flex items-center space-x-1"
                    >
                      <span>⚠️</span>
                      <span>Veuillez sélectionner un créneau valide.</span>
                    </motion.p>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6 sm:space-y-8"
            >
              <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-purple-100">
                <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
                  <div className="h-8 w-8 sm:h-10 sm:w-10 bg-gradient-to-br from-purple-500 to-violet-600 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                    <Users className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base sm:text-lg font-semibold text-slate-900">
                      Configuration avancée
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      Personnalisez votre réservation
                    </p>
                  </div>
                </div>

                <div className="space-y-4 sm:space-y-6">
                  <ParticipantsPicker
                    value={participants}
                    onChange={setParticipants}
                  />
                  <PrivacySelector value={privacy} onChange={setPrivacy} />
                  <RecurrenceEditor
                    value={recurrence}
                    onChange={setRecurrence}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6 sm:space-y-8"
            >
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-orange-100">
                <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
                  <div className="h-8 w-8 sm:h-10 sm:w-10 bg-gradient-to-br from-orange-500 to-amber-600 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base sm:text-lg font-semibold text-slate-900">
                      Récapitulatif
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      Vérifiez les détails avant confirmation
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 border border-slate-200 space-y-3 sm:space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <Building2 className="h-3 w-3 sm:h-4 sm:w-4 text-slate-500 flex-shrink-0" />
                        <span className="text-xs sm:text-sm font-medium text-slate-700">
                          Salle:
                        </span>
                        <span className="text-xs sm:text-sm text-slate-900 truncate">
                          {form.watch("roomId") || "—"}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-slate-500 flex-shrink-0" />
                        <span className="text-xs sm:text-sm font-medium text-slate-700">
                          Début:
                        </span>
                        <span className="text-xs sm:text-sm text-slate-900 truncate">
                          {range.from}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-slate-500 flex-shrink-0" />
                        <span className="text-xs sm:text-sm font-medium text-slate-700">
                          Fin:
                        </span>
                        <span className="text-xs sm:text-sm text-slate-900 truncate">
                          {range.to}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <Users className="h-3 w-3 sm:h-4 sm:w-4 text-slate-500 flex-shrink-0" />
                        <span className="text-xs sm:text-sm font-medium text-slate-700">
                          Participants:
                        </span>
                        <span className="text-xs sm:text-sm text-slate-900">
                          {participants.length}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-slate-500 flex-shrink-0" />
                        <span className="text-xs sm:text-sm font-medium text-slate-700">
                          Confidentialité:
                        </span>
                        <span className="text-xs sm:text-sm text-slate-900">
                          {privacy}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <Repeat className="h-3 w-3 sm:h-4 sm:w-4 text-slate-500 flex-shrink-0" />
                        <span className="text-xs sm:text-sm font-medium text-slate-700">
                          Récurrence:
                        </span>
                        <span className="text-xs sm:text-sm text-slate-900 truncate">
                          {recurrence || "Aucune"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation moderne */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-4 sm:pt-6 border-t border-slate-200 gap-4 sm:gap-0">
          <div className="flex items-center space-x-3 order-2 sm:order-1">
            {step > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                className="h-10 sm:h-12 px-4 sm:px-6 rounded-lg sm:rounded-xl border-slate-200 hover:bg-slate-50 w-full sm:w-auto"
              >
                <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                Retour
              </Button>
            )}
          </div>

          <div className="flex items-center space-x-3 order-1 sm:order-2 w-full sm:w-auto">
            {step < 3 ? (
              <Button
                type={step === 1 ? "submit" : "button"}
                onClick={step === 2 ? nextStep : undefined}
                disabled={step === 1 && !form.formState.isValid}
                className="h-10 sm:h-12 px-6 sm:px-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg sm:rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto text-sm sm:text-base"
              >
                {step === 1 ? "Continuer" : "Suivant"}
                <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 ml-2" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={async () => {
                  setSubmitting(true);
                  try {
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
                className="h-10 sm:h-12 px-6 sm:px-8 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg sm:rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto text-sm sm:text-base"
              >
                {submitting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="h-3 w-3 sm:h-4 sm:w-4 mr-2 border-2 border-white border-t-transparent rounded-full"
                    />
                    Création…
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                    Créer la réservation
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
