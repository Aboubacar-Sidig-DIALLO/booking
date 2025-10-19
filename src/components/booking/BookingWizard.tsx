"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import DateTimeRangePicker, {
  DateTimeRange,
} from "@/components/ui/datetime-range-picker";
import { Button } from "@/components/ui/button";
import ParticipantsPicker, { Participant } from "./ParticipantsPicker";
import PrivacySelector, { Privacy } from "./PrivacySelector";
import RecurrenceEditor from "./RecurrenceEditor";
import { api } from "@/lib/api";
import { useEffect, useState as useReactState } from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Users,
  Shield,
  Repeat,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Clock,
  Building2,
  Sparkles,
  Wifi,
  Monitor,
  Coffee,
  Star,
} from "lucide-react";
import AttendeeCountSelector from "./AttendeeCountSelector";
import RoomSuggestions from "./RoomSuggestions";
import ManualRoomSelector from "./ManualRoomSelector";

const step1Schema = z.object({
  attendeeCount: z.number().min(1, "Au moins 1 participant requis"),
  title: z.string().min(1, "Le titre est requis"),
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
    defaultValues: {
      attendeeCount: 2,
      title: "",
      roomId: "",
      from: range.from,
      to: range.to,
    },
    mode: "onChange",
  });

  // keep RHF in sync with local range picker
  const onRangeChange = (v: DateTimeRange) => {
    setRange(v);
    form.setValue("from", v.from, { shouldValidate: false });
    form.setValue("to", v.to, { shouldValidate: false });
  };

  const [step, setStep] = useReactState<1 | 2 | 3>(1);
  const [participants, setParticipants] = useReactState<Participant[]>([]);
  const [privacy, setPrivacy] = useReactState<Privacy>("public");
  const [recurrence, setRecurrence] = useReactState<string | null>(null);
  const [submitting, setSubmitting] = useReactState(false);
  const [attendeeCount, setAttendeeCount] = useState(2);
  const [selectedRoomId, setSelectedRoomId] = useState<string>("");
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showManualSelector, setShowManualSelector] = useState(false);
  const [showUnavailableByDefault, setShowUnavailableByDefault] =
    useState(true);

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

  // Déclencher les suggestions quand les critères changent
  useEffect(() => {
    if (attendeeCount > 0 && range.from && range.to) {
      setShowSuggestions(true);
    }
  }, [attendeeCount, range.from, range.to]);

  // Scroll automatique vers le haut lors du changement d'étape
  useEffect(() => {
    // Petit délai pour laisser l'animation de transition se terminer
    const timer = setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, 150); // Délai de 150ms pour synchroniser avec l'animation de transition

    return () => clearTimeout(timer);
  }, [step]);

  const getFeatureIcon = (featureName: string) => {
    switch (featureName.toLowerCase()) {
      case "wifi":
        return <Wifi className="h-4 w-4" />;
      case "écran":
      case "monitor":
        return <Monitor className="h-4 w-4" />;
      case "café":
      case "coffee":
        return <Coffee className="h-4 w-4" />;
      default:
        return <Star className="h-4 w-4" />;
    }
  };

  const handleRoomSelect = async (
    roomId: string,
    fromManualSelector = false
  ) => {
    setSelectedRoomId(roomId);
    form.setValue("roomId", roomId, { shouldValidate: true });

    // Fermer le sélecteur manuel seulement si la sélection vient des suggestions
    if (!fromManualSelector) {
      setShowManualSelector(false);
    }

    // Reset selectedRoom avant de récupérer les nouvelles données
    setSelectedRoom(null);

    // Récupérer les détails de la salle sélectionnée
    try {
      const response = await fetch(`/api/rooms/${roomId}`);
      if (response.ok) {
        const roomData = await response.json();
        setSelectedRoom(roomData);
      }
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des détails de la salle:",
        error
      );
    }
  };

  // Fonction pour ouvrir le sélecteur avec toutes les salles (disponibles + occupées)
  const openManualSelectorWithAll = () => {
    setShowUnavailableByDefault(true);
    setShowManualSelector(true);
  };

  // Fonction pour ouvrir le sélecteur avec seulement les salles disponibles
  const openManualSelectorAvailableOnly = () => {
    setShowUnavailableByDefault(false);
    setShowManualSelector(true);
  };

  // Fonction pour gérer le clic sur les étapes de la timeline
  const handleStepClick = (stepId: number) => {
    // Permettre la navigation seulement vers les étapes précédentes ou l'étape actuelle
    if (stepId <= step) {
      setStep(stepId);
      // Le scroll sera géré par le useEffect qui surveille [step]
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

            const isClickable = stepItem.id <= step;

            return (
              <div
                key={stepItem.id}
                className="flex flex-col items-center space-y-2 sm:space-y-3 flex-1 min-w-0"
              >
                <motion.button
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleStepClick(stepItem.id)}
                  disabled={!isClickable}
                  className={`relative h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all duration-300 bg-white ${
                    isActive
                      ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25"
                      : isCompleted
                        ? "bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/30 hover:scale-105"
                        : "bg-slate-100 text-slate-400"
                  } ${
                    isClickable && !isActive
                      ? "cursor-pointer hover:bg-gradient-to-br hover:from-slate-200 hover:to-slate-300 hover:shadow-md"
                      : isClickable
                        ? "cursor-pointer"
                        : "cursor-not-allowed opacity-60"
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
                </motion.button>
                <div className="text-center px-1">
                  <h3
                    className={`text-xs sm:text-sm font-semibold leading-tight transition-colors duration-200 ${
                      isActive
                        ? "text-slate-900"
                        : isClickable
                          ? "text-slate-600 hover:text-slate-800"
                          : "text-slate-500"
                    }`}
                  >
                    <span className="hidden sm:inline">{stepItem.title}</span>
                    <span className="sm:hidden">
                      {stepItem.title.split(" ")[0]}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 leading-tight hidden sm:block">
                    {stepItem.description}
                    {isClickable && !isActive && (
                      <span className="block text-xs text-blue-500 mt-1 opacity-75">
                        Cliquer pour revenir
                      </span>
                    )}
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
              {/* Section Participants */}
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-100">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="h-10 w-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">
                      Participants
                    </h3>
                    <p className="text-sm text-slate-600">
                      Combien de personnes participeront à la réunion ?
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Titre de la réunion */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700">
                      Titre de la réunion *
                    </Label>
                    <input
                      type="text"
                      placeholder="Ex: Réunion équipe marketing"
                      value={form.watch("title")}
                      onChange={(e) =>
                        form.setValue("title", e.target.value, {
                          shouldValidate: true,
                        })
                      }
                      className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    {form.formState.errors.title && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs text-red-600 flex items-center space-x-1"
                      >
                        <span>⚠️</span>
                        <span>{form.formState.errors.title.message}</span>
                      </motion.p>
                    )}
                  </div>

                  {/* Nombre de participants */}
                  <AttendeeCountSelector
                    value={attendeeCount}
                    onChange={(count) => {
                      setAttendeeCount(count);
                      form.setValue("attendeeCount", count, {
                        shouldValidate: true,
                      });
                    }}
                  />
                </div>
              </div>

              {/* Section Créneau */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
                  <div className="h-8 w-8 sm:h-10 sm:w-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base sm:text-lg font-semibold text-slate-900">
                      Planification
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      Définissez la durée et l&apos;horaire de votre réunion
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

              {/* Suggestions de salles */}
              {showSuggestions && !showManualSelector && (
                <RoomSuggestions
                  attendeeCount={attendeeCount}
                  timeRange={range}
                  onRoomSelect={handleRoomSelect}
                  selectedRoomId={selectedRoomId}
                  onManualSelection={openManualSelectorAvailableOnly}
                />
              )}

              {/* Sélecteur manuel de salle */}
              {showManualSelector && (
                <ManualRoomSelector
                  onRoomSelect={(roomId) => handleRoomSelect(roomId, true)}
                  onClose={() => setShowManualSelector(false)}
                  selectedRoomId={selectedRoomId}
                  attendeeCount={attendeeCount}
                  timeRange={range}
                  showUnavailableByDefault={showUnavailableByDefault}
                />
              )}

              {/* Salle sélectionnée avec détails */}
              {selectedRoomId &&
                (selectedRoom ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-12 w-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                          <CheckCircle className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-slate-900">
                            {selectedRoom.name}
                          </h3>
                          <p className="text-sm text-slate-600">
                            📍 {selectedRoom.site?.name}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={openManualSelectorWithAll}
                          className="bg-white hover:bg-slate-50"
                        >
                          Changer
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedRoomId("");
                            setSelectedRoom(null);
                            form.setValue("roomId", "", {
                              shouldValidate: true,
                            });
                          }}
                          className="bg-white hover:bg-red-50 text-red-600 border-red-200"
                        >
                          Supprimer
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Capacité */}
                      <div className="bg-white rounded-lg p-4 border border-green-100">
                        <div className="flex items-center space-x-2 mb-2">
                          <Users className="h-5 w-5 text-green-600" />
                          <span className="font-semibold text-slate-900">
                            Capacité
                          </span>
                        </div>
                        <p className="text-2xl font-bold text-green-600">
                          {selectedRoom.capacity}
                        </p>
                        <p className="text-sm text-slate-600">
                          places disponibles
                        </p>
                      </div>

                      {/* Équipements */}
                      <div className="bg-white rounded-lg p-4 border border-green-100">
                        <div className="flex items-center space-x-2 mb-2">
                          <Sparkles className="h-5 w-5 text-green-600" />
                          <span className="font-semibold text-slate-900">
                            Équipements
                          </span>
                        </div>
                        {selectedRoom.features &&
                        selectedRoom.features.length > 0 ? (
                          <div className="space-y-2">
                            {selectedRoom.features
                              .slice(0, 3)
                              .map((rf: any, idx: number) => (
                                <div
                                  key={idx}
                                  className="flex items-center space-x-2"
                                >
                                  {getFeatureIcon(rf.feature.name)}
                                  <span className="text-sm text-slate-700">
                                    {rf.feature.name}
                                  </span>
                                </div>
                              ))}
                            {selectedRoom.features.length > 3 && (
                              <p className="text-xs text-slate-500">
                                +{selectedRoom.features.length - 3} autres
                                équipements
                              </p>
                            )}
                          </div>
                        ) : (
                          <p className="text-sm text-slate-500">
                            Équipements de base
                          </p>
                        )}
                      </div>

                      {/* Description */}
                      <div className="bg-white rounded-lg p-4 border border-green-100">
                        <div className="flex items-center space-x-2 mb-2">
                          <Building2 className="h-5 w-5 text-green-600" />
                          <span className="font-semibold text-slate-900">
                            Description
                          </span>
                        </div>
                        <p className="text-sm text-slate-700">
                          {selectedRoom.description ||
                            "Salle de réunion moderne et fonctionnelle"}
                        </p>
                        {selectedRoom.location && (
                          <p className="text-xs text-slate-500 mt-2">
                            📍 {selectedRoom.location}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  // État de chargement
                  <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                    <div className="flex items-center space-x-3">
                      <div className="h-12 w-12 bg-slate-200 rounded-xl animate-pulse"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-slate-200 rounded w-32 animate-pulse"></div>
                        <div className="h-3 bg-slate-200 rounded w-24 animate-pulse"></div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="bg-white rounded-lg p-4 border border-slate-100"
                        >
                          <div className="h-4 bg-slate-200 rounded w-20 mb-2 animate-pulse"></div>
                          <div className="h-6 bg-slate-200 rounded w-16 mb-1 animate-pulse"></div>
                          <div className="h-3 bg-slate-200 rounded w-24 animate-pulse"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

              {/* Bouton pour accéder au sélecteur manuel */}
              {!selectedRoomId && !showManualSelector && (
                <div className="text-center">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={
                      showSuggestions
                        ? openManualSelectorWithAll
                        : openManualSelectorWithAll
                    }
                    className="bg-white hover:bg-slate-50"
                  >
                    <Building2 className="h-4 w-4 mr-2" />
                    {showSuggestions
                      ? "Voir toutes les salles"
                      : "Choisir une salle"}
                  </Button>
                </div>
              )}
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
                        <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-slate-500 flex-shrink-0" />
                        <span className="text-xs sm:text-sm font-medium text-slate-700">
                          Titre:
                        </span>
                        <span className="text-xs sm:text-sm text-slate-900 truncate">
                          {form.watch("title") || "—"}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <Building2 className="h-3 w-3 sm:h-4 sm:w-4 text-slate-500 flex-shrink-0" />
                        <span className="text-xs sm:text-sm font-medium text-slate-700">
                          Salle:
                        </span>
                        <span className="text-xs sm:text-sm text-slate-900 truncate">
                          {selectedRoomId || "—"}
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
                      roomId: selectedRoomId,
                      title: form.getValues("title"),
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
