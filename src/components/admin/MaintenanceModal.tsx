"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Wrench,
  X,
  Calendar,
  AlertTriangle,
  Settings,
  Monitor,
  Tv,
  Square,
  Smartphone,
  Volume2,
  Mic,
  Video,
  Wifi,
  Thermometer,
  Lightbulb,
  Table,
  User,
  Plug,
  Phone,
  Users,
  Clock,
  Zap,
  CalendarClock,
} from "lucide-react";

const MaintenanceSchema = z
  .object({
    startImmediately: z.boolean().default(true),
    startDate: z.string().optional(),
    startTime: z.string().optional(),
    reason: z.string().min(1, "La raison de la maintenance est requise"),
    endDate: z.string().min(1, "La date de fin est requise"),
    endTime: z.string().min(1, "L'heure de fin est requise"),
    equipment: z.array(z.string()).optional(),
  })
  .refine(
    (data) => {
      if (!data.startImmediately && (!data.startDate || !data.startTime)) {
        return false;
      }
      return true;
    },
    {
      message:
        "La date et l'heure de début sont requises pour une maintenance planifiée",
      path: ["startDate"],
    }
  );

type MaintenanceFormData = z.infer<typeof MaintenanceSchema>;

interface MaintenanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: MaintenanceFormData) => void;
  room: {
    id: number;
    name: string;
    status: string;
    equipment?: string[];
  } | null;
  isLoading?: boolean;
}

export function MaintenanceModal({
  isOpen,
  onClose,
  onSubmit,
  room,
  isLoading = false,
}: MaintenanceModalProps) {
  // Mapping des équipements avec leurs icônes
  const equipmentIcons: { [key: string]: any } = {
    Projecteur: Monitor,
    Écran: Tv,
    "Tableau blanc": Square,
    "Tableau interactif": Smartphone,
    "Système audio": Volume2,
    Microphone: Mic,
    Caméra: Video,
    WiFi: Wifi,
    Climatisation: Thermometer,
    "Éclairage dimmable": Lightbulb,
    "Tables mobiles": Table,
    "Chaises confortables": User,
    "Prise électrique": Plug,
    Téléphone: Phone,
    Vidéoconférence: Users,
  };

  const getEquipmentIcon = (equipmentName: string) => {
    return equipmentIcons[equipmentName] || Settings;
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<MaintenanceFormData>({
    resolver: zodResolver(MaintenanceSchema),
    defaultValues: {
      startImmediately: true,
      startDate: "",
      startTime: "",
      reason: "",
      endDate: "",
      endTime: "17:00",
      equipment: [],
    },
  });

  const startImmediately = watch("startImmediately");
  const startDate = watch("startDate");
  const startTime = watch("startTime");
  const endDate = watch("endDate");
  const endTime = watch("endTime");
  const selectedEquipment = watch("equipment") || [];

  const handleFormSubmit = (data: MaintenanceFormData) => {
    onSubmit(data);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const toggleEquipment = (equipmentName: string) => {
    const currentEquipment = selectedEquipment || [];
    const newEquipment = currentEquipment.includes(equipmentName)
      ? currentEquipment.filter((item) => item !== equipmentName)
      : [...currentEquipment, equipmentName];
    setValue("equipment", newEquipment);
  };

  const getMinEndDate = () => {
    if (startImmediately) {
      // Si maintenance immédiate, la date de fin doit être dans le futur
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      return tomorrow.toISOString().split("T")[0];
    }
    if (startDate) {
      // Si planifiée, la date de fin doit être après la date de début
      const start = new Date(startDate);
      start.setDate(start.getDate());
      return start.toISOString().split("T")[0];
    }
    return new Date().toISOString().split("T")[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 6); // 6 mois maximum
    return maxDate.toISOString().split("T")[0];
  };

  const formatEndDate = (dateString: string, timeString: string) => {
    if (!dateString || !timeString) return "";
    const date = new Date(`${dateString}T${timeString}`);
    return (
      date.toLocaleDateString("fr-FR", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }) + ` à ${timeString}`
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={handleClose}>
          <DialogContent className="w-[95vw] sm:max-w-lg max-h-[95vh] overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-6">
                <div className="p-2 sm:p-3 bg-orange-100 rounded-xl flex-shrink-0">
                  <Wrench className="h-4 w-4 sm:h-6 sm:w-6 text-orange-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <DialogTitle className="text-base sm:text-xl font-semibold truncate">
                    Mettre en maintenance
                  </DialogTitle>
                  <DialogDescription className="text-xs sm:text-sm text-gray-600 truncate">
                    {room?.name}
                  </DialogDescription>
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                {/* Avertissement */}
                <div className="p-2.5 sm:p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                    <AlertTriangle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-orange-600 flex-shrink-0" />
                    <span className="text-xs sm:text-sm font-medium text-orange-800">
                      Attention
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-orange-700 leading-tight">
                    Cette salle ne sera plus disponible pour les réservations
                    jusqu'à la date de fin de maintenance.
                  </p>
                </div>

                <form
                  onSubmit={handleSubmit(handleFormSubmit)}
                  className="space-y-2.5 sm:space-y-4"
                >
                  {/* Type de maintenance */}
                  <div className="space-y-2 sm:space-y-3">
                    <Label className="text-xs sm:text-sm font-medium">
                      Type de maintenance
                    </Label>
                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                      <button
                        type="button"
                        onClick={() => setValue("startImmediately", true)}
                        className={`p-3 sm:p-4 rounded-lg border-2 transition-all duration-200 flex items-center justify-center gap-2 ${
                          startImmediately
                            ? "border-orange-500 bg-orange-50 shadow-sm"
                            : "border-gray-200 bg-white hover:border-orange-300"
                        }`}
                      >
                        <Zap
                          className={`h-4 w-4 sm:h-5 sm:w-5 ${startImmediately ? "text-orange-600" : "text-gray-500"}`}
                        />
                        <span
                          className={`text-xs sm:text-sm font-medium ${startImmediately ? "text-orange-900" : "text-gray-700"}`}
                        >
                          Immédiate
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setValue("startImmediately", false)}
                        className={`p-3 sm:p-4 rounded-lg border-2 transition-all duration-200 flex items-center justify-center gap-2 ${
                          !startImmediately
                            ? "border-orange-500 bg-orange-50 shadow-sm"
                            : "border-gray-200 bg-white hover:border-orange-300"
                        }`}
                      >
                        <CalendarClock
                          className={`h-4 w-4 sm:h-5 sm:w-5 ${!startImmediately ? "text-orange-600" : "text-gray-500"}`}
                        />
                        <span
                          className={`text-xs sm:text-sm font-medium ${!startImmediately ? "text-orange-900" : "text-gray-700"}`}
                        >
                          Planifiée
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Date et heure de début (si planifiée) */}
                  {!startImmediately && (
                    <div className="space-y-2 sm:space-y-3">
                      <Label className="text-xs sm:text-sm font-medium">
                        Date et heure de début *
                      </Label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                        <div className="space-y-1 sm:space-y-2">
                          <Label
                            htmlFor="startDate"
                            className="text-[10px] sm:text-xs text-gray-600"
                          >
                            Date
                          </Label>
                          <div className="relative">
                            <Calendar className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                            <Input
                              id="startDate"
                              type="date"
                              {...register("startDate")}
                              min={new Date().toISOString().split("T")[0]}
                              className={`text-xs sm:text-sm h-9 sm:h-10 pl-8 sm:pl-10 ${errors.startDate ? "border-red-500" : ""}`}
                            />
                          </div>
                          {errors.startDate && (
                            <p className="text-[10px] sm:text-xs text-red-600">
                              {errors.startDate.message}
                            </p>
                          )}
                        </div>
                        <div className="space-y-1 sm:space-y-2">
                          <Label
                            htmlFor="startTime"
                            className="text-[10px] sm:text-xs text-gray-600"
                          >
                            Heure
                          </Label>
                          <div className="relative">
                            <Clock className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                            <Input
                              id="startTime"
                              type="time"
                              {...register("startTime")}
                              className={`text-xs sm:text-sm h-9 sm:h-10 pl-8 sm:pl-10 ${errors.startTime ? "border-red-500" : ""}`}
                            />
                          </div>
                          {errors.startTime && (
                            <p className="text-[10px] sm:text-xs text-red-600">
                              {errors.startTime.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Raison de la maintenance */}
                  <div className="space-y-1 sm:space-y-2">
                    <Label htmlFor="reason" className="text-xs sm:text-sm">
                      Raison de la maintenance *
                    </Label>
                    <Textarea
                      id="reason"
                      {...register("reason")}
                      placeholder="Ex: Réparation du système de climatisation, mise à jour des équipements..."
                      rows={2}
                      className={`text-xs sm:text-sm ${errors.reason ? "border-red-500" : ""}`}
                    />
                    {errors.reason && (
                      <p className="text-xs sm:text-sm text-red-600">
                        {errors.reason.message}
                      </p>
                    )}
                  </div>

                  {/* Date et heure de fin */}
                  <div className="space-y-2 sm:space-y-4">
                    <Label className="text-xs sm:text-sm font-medium">
                      Date et heure de fin prévue *
                    </Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                      {/* Date */}
                      <div className="space-y-1 sm:space-y-2">
                        <Label
                          htmlFor="endDate"
                          className="text-[10px] sm:text-xs text-gray-600"
                        >
                          Date
                        </Label>
                        <div className="relative">
                          <Calendar className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                          <Input
                            id="endDate"
                            type="date"
                            {...register("endDate")}
                            min={getMinEndDate()}
                            max={getMaxDate()}
                            className={`text-xs sm:text-sm h-9 sm:h-10 pl-8 sm:pl-10 ${errors.endDate ? "border-red-500" : ""}`}
                          />
                        </div>
                        {errors.endDate && (
                          <p className="text-[10px] sm:text-sm text-red-600">
                            {errors.endDate.message}
                          </p>
                        )}
                      </div>

                      {/* Heure */}
                      <div className="space-y-1 sm:space-y-2">
                        <Label
                          htmlFor="endTime"
                          className="text-[10px] sm:text-xs text-gray-600"
                        >
                          Heure
                        </Label>
                        <div className="relative">
                          <Clock className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                          <Input
                            id="endTime"
                            type="time"
                            {...register("endTime")}
                            className={`text-xs sm:text-sm h-9 sm:h-10 pl-8 sm:pl-10 ${errors.endTime ? "border-red-500" : ""}`}
                          />
                        </div>
                        {errors.endTime && (
                          <p className="text-[10px] sm:text-sm text-red-600">
                            {errors.endTime.message}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Aperçu de la date et heure */}
                    {endDate && endTime && (
                      <div className="p-2 sm:p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-blue-700">
                          <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                          <span className="font-medium leading-tight">
                            Disponible le : {formatEndDate(endDate, endTime)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Équipements concernés */}
                  {room?.equipment && room.equipment.length > 0 && (
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <Settings className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-600 flex-shrink-0" />
                        <Label className="text-xs sm:text-sm font-medium">
                          Équipements concernés par la maintenance
                        </Label>
                      </div>
                      <div className="p-2 sm:p-3 bg-gray-50 rounded-lg border">
                        <p className="text-[10px] sm:text-xs text-gray-600 mb-2 sm:mb-3">
                          Sélectionnez les équipements qui nécessitent une
                          maintenance
                        </p>
                        <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                          {room.equipment.map((equipment) => {
                            const EquipmentIcon = getEquipmentIcon(equipment);
                            return (
                              <div
                                key={equipment}
                                className="flex items-center space-x-1.5 sm:space-x-2 p-1.5 sm:p-2 rounded-md hover:bg-gray-100 transition-colors"
                              >
                                <Checkbox
                                  id={`equipment-${equipment}`}
                                  checked={selectedEquipment.includes(
                                    equipment
                                  )}
                                  onCheckedChange={() =>
                                    toggleEquipment(equipment)
                                  }
                                  className="h-3.5 w-3.5 sm:h-4 sm:w-4 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                                />
                                <div className="flex items-center gap-1 sm:gap-1.5 flex-1 min-w-0">
                                  <EquipmentIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-gray-600 flex-shrink-0" />
                                  <Label
                                    htmlFor={`equipment-${equipment}`}
                                    className="text-[10px] sm:text-xs font-normal cursor-pointer truncate"
                                  >
                                    {equipment}
                                  </Label>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        {selectedEquipment.length > 0 && (
                          <div className="mt-2 sm:mt-3 p-1.5 sm:p-2 bg-orange-50 rounded-md border border-orange-200">
                            <div className="flex items-center gap-1 sm:gap-1.5 mb-1 sm:mb-1.5">
                              <Settings className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-orange-600 flex-shrink-0" />
                              <span className="text-[10px] sm:text-xs font-medium text-orange-800">
                                Sélectionnés ({selectedEquipment.length})
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-0.5 sm:gap-1">
                              {selectedEquipment.map((equipment, index) => {
                                const EquipmentIcon =
                                  getEquipmentIcon(equipment);
                                return (
                                  <div
                                    key={index}
                                    className="flex items-center gap-0.5 sm:gap-1 px-1 sm:px-1.5 py-0.5 bg-orange-100 text-orange-800 rounded text-[9px] sm:text-xs"
                                  >
                                    <EquipmentIcon className="h-2 w-2 sm:h-2.5 sm:w-2.5 flex-shrink-0" />
                                    <span className="truncate max-w-[60px] sm:max-w-20">
                                      {equipment}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4 sm:mt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleClose}
                      disabled={isLoading}
                      className="px-5 sm:px-6 py-2 text-xs sm:text-sm w-full sm:w-auto"
                    >
                      <X className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                      Annuler
                    </Button>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="px-5 sm:px-6 py-2 text-xs sm:text-sm bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white w-full sm:w-auto"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>En cours...</span>
                        </div>
                      ) : (
                        <>
                          <Wrench className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                          <span className="hidden sm:inline">
                            Mettre en maintenance
                          </span>
                          <span className="sm:hidden">Confirmer</span>
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
