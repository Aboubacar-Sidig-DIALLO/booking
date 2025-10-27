"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Building2,
  Save,
  X,
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
  Settings,
} from "lucide-react";

const RoomSchema = z.object({
  name: z.string().min(1, "Le nom de la salle est requis"),
  capacity: z.number().min(1, "La capacité doit être d'au moins 1 place"),
  description: z.string().optional(),
  status: z.enum(["active", "inactive"]),
  location: z.string().min(1, "L'emplacement est requis"),
  equipment: z.array(z.string()).optional(),
});

type RoomFormData = z.infer<typeof RoomSchema>;

interface RoomFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: RoomFormData) => void;
  room?: {
    id: number;
    name: string;
    capacity: number;
    status: string;
    location?: string;
    description?: string;
    equipment?: string[];
    features?: string[];
    bookings: number;
    lastMaintenance: string;
    nextMaintenance: string;
  };
  isLoading?: boolean;
}

export function RoomFormModal({
  isOpen,
  onClose,
  onSubmit,
  room,
  isLoading = false,
}: RoomFormModalProps) {
  const isEdit = !!room;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
    control,
  } = useForm<RoomFormData>({
    resolver: zodResolver(RoomSchema),
    defaultValues: {
      name: room?.name || "",
      capacity: room?.capacity || 1,
      description: room?.description || "",
      status: (room?.status as "active" | "inactive") || "active",
      location: room?.location || "",
      equipment: room?.equipment || [],
    },
  });

  const status = watch("status");
  const equipmentWatch = watch("equipment") || [];

  // S'assurer que equipment est un tableau de strings sans doublons
  const equipment = Array.isArray(equipmentWatch)
    ? equipmentWatch
        .filter((item) => typeof item === "string")
        .filter((item, index, self) => self.indexOf(item) === index)
    : [];

  // Mapper les noms d'équipements vers leurs icônes
  const getEquipmentIconForName = (name: string) => {
    const iconMap: Record<string, any> = {
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
    return iconMap[name] || Settings;
  };

  // Charger les équipements actifs avec TanStack Query
  const { data: equipments = [] } = useQuery({
    queryKey: ["admin", "equipment", "active"],
    queryFn: async () => {
      const response = await fetch("/api/admin/equipment/active");
      if (!response.ok)
        throw new Error("Erreur lors du chargement des équipements");
      return response.json();
    },
  });

  // Mapper les équipements avec leurs icônes
  const availableEquipment = equipments.map((eq: any) => ({
    name: eq.name,
    icon: getEquipmentIconForName(eq.name),
  }));

  // Mettre à jour le formulaire quand la salle change
  useEffect(() => {
    if (room) {
      // Gérer à la fois equipment et features pour compatibilité
      let equipmentList = room.equipment || room.features || [];

      // S'assurer que equipmentList contient uniquement des strings
      if (Array.isArray(equipmentList)) {
        equipmentList = equipmentList
          .filter((item) => typeof item === "string") // Filtrer uniquement les strings
          .filter((item, index, self) => self.indexOf(item) === index); // Retirer les doublons
      } else {
        equipmentList = [];
      }

      reset({
        name: room.name || "",
        capacity: room.capacity || 1,
        description: room.description || "",
        status: (room.status as "active" | "inactive") || "active",
        location: room.location || "",
        equipment: equipmentList,
      });
    } else {
      reset({
        name: "",
        capacity: 1,
        description: "",
        status: "active",
        location: "",
        equipment: [],
      });
    }
  }, [room, reset]);

  const toggleEquipment = (itemName: string) => {
    const currentEquipment = equipment || [];
    if (currentEquipment.includes(itemName)) {
      setValue(
        "equipment",
        currentEquipment.filter((e) => e !== itemName)
      );
    } else {
      setValue("equipment", [...currentEquipment, itemName]);
    }
  };

  const getEquipmentIcon = (itemName: string) => {
    return getEquipmentIconForName(itemName);
  };

  const handleFormSubmit = (data: RoomFormData) => {
    onSubmit(data);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={handleClose}>
          <DialogContent className="w-[95vw] sm:max-w-2xl max-h-[95vh] overflow-y-auto p-3 sm:p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-5 pb-2 sm:pb-4 border-b border-gray-200">
                <div className="p-1 sm:p-2 bg-blue-100 rounded-lg flex-shrink-0">
                  <Building2 className="h-3 w-3 sm:h-5 sm:w-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <DialogTitle className="text-sm sm:text-xl font-bold">
                    {isEdit ? "Modifier la salle" : "Nouvelle salle"}
                  </DialogTitle>
                  <DialogDescription className="text-[9px] sm:text-sm text-gray-600 leading-tight">
                    {isEdit
                      ? "Modifiez les informations de la salle"
                      : "Ajoutez une nouvelle salle au système"}
                  </DialogDescription>
                </div>
              </div>

              <form
                onSubmit={handleSubmit(handleFormSubmit)}
                className="space-y-1.5 sm:space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-3">
                  {/* Nom de la salle */}
                  <div className="space-y-0.5 sm:space-y-1">
                    <Label
                      htmlFor="name"
                      className="text-xs sm:text-sm font-semibold"
                    >
                      Nom de la salle *
                    </Label>
                    <Input
                      id="name"
                      {...register("name")}
                      placeholder="Ex: Salle de conférence A"
                      className={`text-sm ${errors.name ? "border-red-500" : ""}`}
                    />
                    {errors.name && (
                      <p className="text-xs text-red-600">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  {/* Capacité */}
                  <div className="space-y-0.5 sm:space-y-1">
                    <Label
                      htmlFor="capacity"
                      className="text-xs sm:text-sm font-semibold"
                    >
                      Capacité *
                    </Label>
                    <Input
                      id="capacity"
                      type="number"
                      min="1"
                      {...register("capacity", { valueAsNumber: true })}
                      placeholder="Ex: 12"
                      className={`text-sm ${errors.capacity ? "border-red-500" : ""}`}
                    />
                    {errors.capacity && (
                      <p className="text-xs text-red-600">
                        {errors.capacity.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Emplacement */}
                <div className="space-y-0.5 sm:space-y-1">
                  <Label
                    htmlFor="location"
                    className="text-xs sm:text-sm font-semibold"
                  >
                    Emplacement *
                  </Label>
                  <Input
                    id="location"
                    {...register("location")}
                    placeholder="Ex: Bâtiment A, 2ème étage"
                    className={`text-sm ${errors.location ? "border-red-500" : ""}`}
                  />
                  {errors.location && (
                    <p className="text-xs text-red-600">
                      {errors.location.message}
                    </p>
                  )}
                </div>

                {/* Statut */}
                <div className="space-y-0.5 sm:space-y-1">
                  <Label
                    htmlFor="status"
                    className="text-xs sm:text-sm font-semibold"
                  >
                    Statut
                  </Label>
                  <Select
                    value={status}
                    onValueChange={(value) => setValue("status", value as any)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Description */}
                <div className="space-y-0.5 sm:space-y-1">
                  <Label
                    htmlFor="description"
                    className="text-xs sm:text-sm font-semibold"
                  >
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    {...register("description")}
                    placeholder="Description de la salle (optionnel)"
                    rows={1}
                    className="text-sm min-h-[60px]"
                  />
                </div>

                {/* Équipements */}
                {availableEquipment.length > 0 && (
                  <div className="space-y-0.5 sm:space-y-2">
                    <Label className="text-[10px] sm:text-sm font-semibold block">
                      Équipements disponibles
                    </Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-1 sm:gap-2">
                      {availableEquipment.map((item: any) => {
                        const IconComponent = item.icon;
                        return (
                          <div
                            key={item.name}
                            className="flex items-center space-x-1 sm:space-x-2 p-0.5 sm:p-2 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 rounded transition-all border border-transparent hover:border-blue-200"
                          >
                            <Checkbox
                              id={`equipment-${item.name}`}
                              checked={equipment.includes(item.name)}
                              onCheckedChange={() => toggleEquipment(item.name)}
                              className="flex-shrink-0 h-3 w-3 sm:h-4 sm:w-4"
                            />
                            <Label
                              htmlFor={`equipment-${item.name}`}
                              className="text-[10px] sm:text-xs font-medium cursor-pointer flex items-center gap-0.5 sm:gap-2 flex-1 min-w-0"
                            >
                              <IconComponent className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5 text-gray-600 flex-shrink-0" />
                              <span className="truncate block text-[10px] sm:text-xs">
                                {item.name}
                              </span>
                            </Label>
                          </div>
                        );
                      })}
                    </div>
                    {equipment.length > 0 && (
                      <div className="mt-0.5 sm:mt-2 pt-0.5 sm:pt-2 border-t border-gray-100">
                        <p className="text-[10px] sm:text-sm font-medium text-gray-700 mb-0.5 sm:mb-2">
                          Sélectionnés ({equipment.length})
                        </p>
                        <div className="flex flex-wrap gap-1 sm:gap-1.5">
                          {equipment.map((item, index) => {
                            const IconComponent = getEquipmentIcon(item);
                            return (
                              <span
                                key={`${item}-${index}`}
                                className="inline-flex items-center gap-0.5 sm:gap-1 px-1 sm:px-2 py-0.5 sm:py-1 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 text-[9px] sm:text-xs font-medium rounded border border-blue-200"
                              >
                                <IconComponent className="h-2 w-2 sm:h-3 sm:w-3 text-blue-600" />
                                <span className="hidden sm:inline">{item}</span>
                                <button
                                  type="button"
                                  onClick={() => toggleEquipment(item)}
                                  className="ml-0.5 hover:text-blue-900 hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                                >
                                  <X className="h-1.5 w-1.5 sm:h-2.5 sm:w-2.5" />
                                </button>
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex justify-center gap-3 mt-1.5 sm:mt-4 pt-1.5 sm:pt-3 border-t border-gray-200">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    disabled={isLoading}
                    className="px-6 sm:px-8 py-2.5 text-sm sm:text-base min-w-[120px] sm:min-w-[150px]"
                  >
                    <X className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                    Annuler
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 sm:px-8 py-2.5 text-sm sm:text-base bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white min-w-[120px] sm:min-w-[150px]"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-1">
                        <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span className="text-[10px] sm:text-xs">
                          En cours...
                        </span>
                      </div>
                    ) : (
                      <>
                        <Save className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                        {isEdit ? "Modifier" : "Créer"}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
