"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Building2,
  Users,
  Calendar,
  Wrench,
  Clock,
  MapPin,
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
} from "lucide-react";

interface RoomDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: {
    id: number;
    name: string;
    capacity: number;
    status: string;
    location?: string;
    description?: string;
    equipment?: string[];
    maintenanceReason?: string;
    maintenanceEndDate?: string;
    maintenanceEndTime?: string;
    maintenanceEquipment?: string[];
    bookings: number;
    lastMaintenance: string;
    nextMaintenance: string;
  } | null;
}

export function RoomDetailsModal({
  isOpen,
  onClose,
  room,
}: RoomDetailsModalProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "active":
        return {
          color: "bg-green-100 text-green-800",
          icon: Clock,
        };
      case "maintenance":
        return {
          color: "bg-orange-100 text-orange-800",
          icon: Wrench,
        };
      case "inactive":
        return {
          color: "bg-red-100 text-red-800",
          icon: Clock,
        };
      default:
        return {
          color: "bg-gray-100 text-gray-800",
          icon: Clock,
        };
    }
  };

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

  // Vérification de sécurité pour éviter l'erreur si room est null
  if (!room) {
    return null;
  }

  const statusConfig = getStatusConfig(room.status);
  const StatusIcon = statusConfig.icon;

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="sm:max-w-2xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                  <Building2 className="h-5 w-5 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-bold">
                    {room.name}
                  </DialogTitle>
                  <DialogDescription className="text-xs text-gray-600">
                    Détails complets de la salle
                  </DialogDescription>
                </div>
              </div>

              <div className="space-y-4">
                {/* Statut */}
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-700">
                    Statut :
                  </span>
                  <Badge className={`${statusConfig.color} text-sm`}>
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {room.status}
                  </Badge>
                </div>

                {/* Informations principales */}
                <div className="grid grid-cols-2 gap-3">
                  <Card>
                    <CardContent className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-blue-100 rounded-md">
                          <Users className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Capacité</p>
                          <p className="text-lg font-semibold">
                            {room.capacity} places
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-green-100 rounded-md">
                          <Calendar className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Réservations</p>
                          <p className="text-lg font-semibold">
                            {room.bookings}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-purple-100 rounded-md">
                          <MapPin className="h-4 w-4 text-purple-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-gray-600">Emplacement</p>
                          <p className="text-sm font-semibold truncate">
                            {room.location || "Non spécifié"}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-indigo-100 rounded-md">
                          <Settings className="h-4 w-4 text-indigo-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Équipements</p>
                          <p className="text-lg font-semibold">
                            {room.equipment?.length || 0}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Maintenance */}
                <div className="space-y-2">
                  <h4 className="text-base font-semibold text-gray-900">
                    Maintenance
                  </h4>

                  {/* Informations de maintenance en cours */}
                  {room.status === "maintenance" &&
                    room.maintenanceReason &&
                    room.maintenanceEndDate && (
                      <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Wrench className="h-4 w-4 text-orange-600" />
                          <h5 className="text-sm font-semibold text-orange-800">
                            Maintenance en cours
                          </h5>
                        </div>
                        <div className="space-y-2">
                          <div>
                            <span className="text-xs font-medium text-gray-700">
                              Raison :
                            </span>
                            <p className="text-xs text-gray-600 mt-0.5">
                              {room.maintenanceReason}
                            </p>
                          </div>
                          <div>
                            <span className="text-xs font-medium text-gray-700">
                              Disponible le :
                            </span>
                            <p className="text-xs text-gray-600 mt-0.5">
                              {new Date(
                                room.maintenanceEndDate
                              ).toLocaleDateString("fr-FR", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                              {room.maintenanceEndTime &&
                                ` à ${room.maintenanceEndTime}`}
                            </p>
                          </div>
                          {room.maintenanceEquipment &&
                            room.maintenanceEquipment.length > 0 && (
                              <div>
                                <span className="text-xs font-medium text-gray-700">
                                  Équipements en maintenance :
                                </span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {room.maintenanceEquipment.map(
                                    (equipment, index) => {
                                      const EquipmentIcon =
                                        getEquipmentIcon(equipment);
                                      return (
                                        <div
                                          key={index}
                                          className="flex items-center gap-1 px-1.5 py-0.5 bg-orange-100 text-orange-800 rounded text-xs"
                                        >
                                          <EquipmentIcon className="h-2.5 w-2.5" />
                                          <span>{equipment}</span>
                                        </div>
                                      );
                                    }
                                  )}
                                </div>
                              </div>
                            )}
                        </div>
                      </div>
                    )}

                  {/* Historique de maintenance */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 bg-gray-50 rounded-md">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Wrench className="h-3 w-3 text-gray-600" />
                        <span className="text-xs font-medium text-gray-700">
                          Dernière maintenance
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">
                        {room.lastMaintenance}
                      </p>
                    </div>
                    <div className="p-2 bg-gray-50 rounded-md">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Clock className="h-3 w-3 text-gray-600" />
                        <span className="text-xs font-medium text-gray-700">
                          Prochaine maintenance
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">
                        {room.nextMaintenance}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Équipements */}
                {room.equipment && room.equipment.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-base font-semibold text-gray-900">
                      Équipements disponibles
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {room.equipment.map((equipment, index) => {
                        const IconComponent = getEquipmentIcon(equipment);
                        return (
                          <Badge
                            key={index}
                            className="bg-blue-100 text-blue-800 hover:bg-blue-200 flex items-center gap-1 text-xs px-2 py-1"
                          >
                            <IconComponent className="h-3 w-3" />
                            {equipment}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Description */}
                {room.description && (
                  <div className="space-y-2">
                    <h4 className="text-base font-semibold text-gray-900">
                      Description
                    </h4>
                    <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded-md">
                      {room.description}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
