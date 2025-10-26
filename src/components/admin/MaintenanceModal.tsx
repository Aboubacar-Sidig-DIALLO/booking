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
} from "lucide-react";

const MaintenanceSchema = z.object({
  reason: z.string().min(1, "La raison de la maintenance est requise"),
  endDate: z.string().min(1, "La date de fin est requise"),
  endTime: z.string().min(1, "L'heure de fin est requise"),
  equipment: z.array(z.string()).optional(),
});

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
      reason: "",
      endDate: "",
      endTime: "17:00",
      equipment: [],
    },
  });

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

  const getMinDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 1); // Demain minimum
    return today.toISOString().split("T")[0];
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
          <DialogContent className="sm:max-w-lg">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-orange-100 rounded-xl">
                  <Wrench className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-semibold">
                    Mettre en maintenance
                  </DialogTitle>
                  <DialogDescription className="text-sm text-gray-600">
                    {room?.name}
                  </DialogDescription>
                </div>
              </div>

              <div className="space-y-4">
                {/* Avertissement */}
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                    <span className="text-sm font-medium text-orange-800">
                      Attention
                    </span>
                  </div>
                  <p className="text-sm text-orange-700">
                    Cette salle ne sera plus disponible pour les réservations
                    jusqu'à la date de fin de maintenance.
                  </p>
                </div>

                <form
                  onSubmit={handleSubmit(handleFormSubmit)}
                  className="space-y-4"
                >
                  {/* Raison de la maintenance */}
                  <div className="space-y-2">
                    <Label htmlFor="reason">Raison de la maintenance *</Label>
                    <Textarea
                      id="reason"
                      {...register("reason")}
                      placeholder="Ex: Réparation du système de climatisation, mise à jour des équipements..."
                      rows={3}
                      className={errors.reason ? "border-red-500" : ""}
                    />
                    {errors.reason && (
                      <p className="text-sm text-red-600">
                        {errors.reason.message}
                      </p>
                    )}
                  </div>

                  {/* Date et heure de fin */}
                  <div className="space-y-4">
                    <Label className="text-sm font-medium">
                      Date et heure de fin prévue *
                    </Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Date */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="endDate"
                          className="text-xs text-gray-600"
                        >
                          Date
                        </Label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="endDate"
                            type="date"
                            {...register("endDate")}
                            min={getMinDate()}
                            max={getMaxDate()}
                            className={`pl-10 ${errors.endDate ? "border-red-500" : ""}`}
                          />
                        </div>
                        {errors.endDate && (
                          <p className="text-sm text-red-600">
                            {errors.endDate.message}
                          </p>
                        )}
                      </div>

                      {/* Heure */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="endTime"
                          className="text-xs text-gray-600"
                        >
                          Heure
                        </Label>
                        <div className="relative">
                          <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="endTime"
                            type="time"
                            {...register("endTime")}
                            className={`pl-10 ${errors.endTime ? "border-red-500" : ""}`}
                          />
                        </div>
                        {errors.endTime && (
                          <p className="text-sm text-red-600">
                            {errors.endTime.message}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Aperçu de la date et heure */}
                    {endDate && endTime && (
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center gap-2 text-sm text-blue-700">
                          <Calendar className="h-4 w-4" />
                          <span className="font-medium">
                            Disponible le : {formatEndDate(endDate, endTime)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Équipements concernés */}
                  {room?.equipment && room.equipment.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Settings className="h-4 w-4 text-gray-600" />
                        <Label className="text-sm font-medium">
                          Équipements concernés par la maintenance
                        </Label>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg border">
                        <p className="text-xs text-gray-600 mb-3">
                          Sélectionnez les équipements qui nécessitent une
                          maintenance
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                          {room.equipment.map((equipment) => {
                            const EquipmentIcon = getEquipmentIcon(equipment);
                            return (
                              <div
                                key={equipment}
                                className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 transition-colors"
                              >
                                <Checkbox
                                  id={`equipment-${equipment}`}
                                  checked={selectedEquipment.includes(
                                    equipment
                                  )}
                                  onCheckedChange={() =>
                                    toggleEquipment(equipment)
                                  }
                                  className="data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                                />
                                <div className="flex items-center gap-1.5 flex-1 min-w-0">
                                  <EquipmentIcon className="h-3.5 w-3.5 text-gray-600 flex-shrink-0" />
                                  <Label
                                    htmlFor={`equipment-${equipment}`}
                                    className="text-xs font-normal cursor-pointer truncate"
                                  >
                                    {equipment}
                                  </Label>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        {selectedEquipment.length > 0 && (
                          <div className="mt-3 p-2 bg-orange-50 rounded-md border border-orange-200">
                            <div className="flex items-center gap-1.5 mb-1.5">
                              <Settings className="h-3 w-3 text-orange-600" />
                              <span className="text-xs font-medium text-orange-800">
                                Sélectionnés ({selectedEquipment.length})
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {selectedEquipment.map((equipment, index) => {
                                const EquipmentIcon =
                                  getEquipmentIcon(equipment);
                                return (
                                  <div
                                    key={index}
                                    className="flex items-center gap-1 px-1.5 py-0.5 bg-orange-100 text-orange-800 rounded text-xs"
                                  >
                                    <EquipmentIcon className="h-2.5 w-2.5" />
                                    <span className="truncate max-w-20">
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

                  <div className="flex gap-3 mt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleClose}
                      disabled={isLoading}
                      className="px-6"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Annuler
                    </Button>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="px-6 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>En cours...</span>
                        </div>
                      ) : (
                        <>
                          <Wrench className="h-4 w-4 mr-2" />
                          Mettre en maintenance
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
