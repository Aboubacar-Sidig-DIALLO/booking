"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
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
  const equipment = watch("equipment") || [];

  // Équipements prédéfinis disponibles avec leurs icônes
  const availableEquipment = [
    { name: "Projecteur", icon: Monitor },
    { name: "Écran", icon: Tv },
    { name: "Tableau blanc", icon: Square },
    { name: "Tableau interactif", icon: Smartphone },
    { name: "Système audio", icon: Volume2 },
    { name: "Microphone", icon: Mic },
    { name: "Caméra", icon: Video },
    { name: "WiFi", icon: Wifi },
    { name: "Climatisation", icon: Thermometer },
    { name: "Éclairage dimmable", icon: Lightbulb },
    { name: "Tables mobiles", icon: Table },
    { name: "Chaises confortables", icon: User },
    { name: "Prise électrique", icon: Plug },
    { name: "Téléphone", icon: Phone },
    { name: "Vidéoconférence", icon: Users },
  ];

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
    const equipmentItem = availableEquipment.find(
      (item) => item.name === itemName
    );
    return equipmentItem ? equipmentItem.icon : Settings;
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
          <DialogContent className="sm:max-w-lg">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Building2 className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-semibold">
                    {isEdit ? "Modifier la salle" : "Nouvelle salle"}
                  </DialogTitle>
                  <DialogDescription className="text-sm text-gray-600">
                    {isEdit
                      ? "Modifiez les informations de la salle"
                      : "Ajoutez une nouvelle salle au système"}
                  </DialogDescription>
                </div>
              </div>

              <form
                onSubmit={handleSubmit(handleFormSubmit)}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Nom de la salle */}
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom de la salle *</Label>
                    <Input
                      id="name"
                      {...register("name")}
                      placeholder="Ex: Salle de conférence A"
                      className={errors.name ? "border-red-500" : ""}
                    />
                    {errors.name && (
                      <p className="text-sm text-red-600">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  {/* Capacité */}
                  <div className="space-y-2">
                    <Label htmlFor="capacity">Capacité *</Label>
                    <Input
                      id="capacity"
                      type="number"
                      min="1"
                      {...register("capacity", { valueAsNumber: true })}
                      placeholder="Ex: 12"
                      className={errors.capacity ? "border-red-500" : ""}
                    />
                    {errors.capacity && (
                      <p className="text-sm text-red-600">
                        {errors.capacity.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Emplacement */}
                <div className="space-y-2">
                  <Label htmlFor="location">Emplacement *</Label>
                  <Input
                    id="location"
                    {...register("location")}
                    placeholder="Ex: Bâtiment A, 2ème étage"
                    className={errors.location ? "border-red-500" : ""}
                  />
                  {errors.location && (
                    <p className="text-sm text-red-600">
                      {errors.location.message}
                    </p>
                  )}
                </div>

                {/* Statut */}
                <div className="space-y-2">
                  <Label htmlFor="status">Statut</Label>
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
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    {...register("description")}
                    placeholder="Description de la salle (optionnel)"
                    rows={3}
                  />
                </div>

                {/* Équipements */}
                <div className="space-y-3">
                  <Label>Équipements disponibles</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {availableEquipment.map((item) => {
                      const IconComponent = item.icon;
                      return (
                        <div
                          key={item.name}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`equipment-${item.name}`}
                            checked={equipment.includes(item.name)}
                            onCheckedChange={() => toggleEquipment(item.name)}
                          />
                          <Label
                            htmlFor={`equipment-${item.name}`}
                            className="text-sm font-normal cursor-pointer flex items-center gap-2"
                          >
                            <IconComponent className="h-4 w-4 text-gray-600" />
                            {item.name}
                          </Label>
                        </div>
                      );
                    })}
                  </div>
                  {equipment.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm text-gray-600 mb-2">
                        Équipements sélectionnés :
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {equipment.map((item) => {
                          const IconComponent = getEquipmentIcon(item);
                          return (
                            <span
                              key={item}
                              className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                            >
                              <IconComponent className="h-3 w-3" />
                              {item}
                              <button
                                type="button"
                                onClick={() => toggleEquipment(item)}
                                className="ml-1 hover:text-blue-600"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 mt-6 justify-center">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    disabled={isLoading}
                    className="px-8 py-3 text-base min-w-[140px]"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Annuler
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="px-8 py-3 text-base bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white min-w-[140px]"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>En cours...</span>
                      </div>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
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
