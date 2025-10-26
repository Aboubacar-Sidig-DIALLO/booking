"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Building2,
  Users,
  Clock,
  CheckCircle,
  Wrench,
  Calendar,
  User,
} from "lucide-react";
import { useState, useEffect } from "react";
import { LoadingDots } from "@/components/ui/LoadingDots";

interface TimeRemaining {
  hours: number;
  minutes: number;
}

interface Participant {
  user: {
    name: string | null;
    email: string;
  };
}

interface CurrentBooking {
  id: string;
  title: string;
  start: string;
  end: string;
  createdBy: {
    name: string | null;
    email: string;
  } | null;
  participants: Participant[];
  timeRemaining: TimeRemaining | null;
}

interface Room {
  id: string;
  name: string;
  capacity: number;
  location: string | null;
  description: string | null;
  isActive: boolean;
  isOccupied: boolean;
  isMaintenance: boolean;
  currentBooking: CurrentBooking | null;
  site: {
    name: string;
  } | null;
}

const getStatusConfig = (room: Room) => {
  if (room.isMaintenance) {
    return {
      color: "bg-amber-50 border-amber-200",
      icon: Wrench,
      iconColor: "text-amber-600",
      status: "Maintenance",
      statusColor: "bg-amber-100 text-amber-800",
      pulse: false,
    };
  }

  if (room.isOccupied) {
    return {
      color: "bg-red-50 border-red-200",
      icon: Clock,
      iconColor: "text-red-600",
      status: "Occupée",
      statusColor: "bg-red-100 text-red-800",
      pulse: true,
    };
  }

  return {
    color: "bg-green-50 border-green-200",
    icon: CheckCircle,
    iconColor: "text-green-600",
    status: "Disponible",
    statusColor: "bg-green-100 text-green-800",
    pulse: false,
  };
};

const formatTimeRemaining = (time: TimeRemaining | null): string => {
  if (!time) return "Bientôt terminée";

  if (time.hours > 0) {
    return `${time.hours}h ${time.minutes}m`;
  }

  return `${time.minutes}m`;
};

export function RoomStatus() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRoomStatus = async () => {
      try {
        setIsLoading(true);
        console.log("Fetching room status...");

        const response = await fetch("/api/admin/rooms/status");

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error("Response not OK:", response.status, errorData);
          throw new Error(
            errorData.details ||
              errorData.error ||
              `Erreur ${response.status}: ${response.statusText}`
          );
        }

        const data = await response.json();
        console.log("Rooms data received:", data.length, "rooms");
        setRooms(data);
      } catch (err) {
        console.error("Erreur lors du chargement:", err);
        setError(err instanceof Error ? err.message : "Erreur inconnue");
      } finally {
        setIsLoading(false);
      }
    };

    loadRoomStatus();

    // Rafraîchir toutes les minutes pour mettre à jour le temps restant
    const interval = setInterval(loadRoomStatus, 60000);

    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-64">
            <LoadingDots size={12} color="#6366f1" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center space-y-2">
            <div className="text-red-600 font-semibold mb-2">{error}</div>
            <div className="text-xs text-slate-500">
              Vérifiez la console du navigateur pour plus de détails
            </div>
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              size="sm"
              className="mt-4"
            >
              Réessayer
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Grouper les salles par statut
  const groupedRooms = {
    available: rooms.filter((r) => !r.isOccupied && !r.isMaintenance),
    occupied: rooms.filter((r) => r.isOccupied && !r.isMaintenance),
    maintenance: rooms.filter((r) => r.isMaintenance),
  };

  const groups = [
    {
      title: "Salles occupées",
      rooms: groupedRooms.occupied,
      color: "red",
      icon: Clock,
    },
    {
      title: "Salles en maintenance",
      rooms: groupedRooms.maintenance,
      color: "amber",
      icon: Wrench,
    },
    {
      title: "Salles disponibles",
      rooms: groupedRooms.available,
      color: "green",
      icon: CheckCircle,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-blue-50 border border-blue-200 rounded-xl p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Total</p>
              <p className="text-3xl font-bold text-blue-900 mt-1">
                {rooms.length}
              </p>
            </div>
            <Building2 className="h-8 w-8 text-blue-600" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-red-50 border border-red-200 rounded-xl p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600 font-medium">Occupées</p>
              <p className="text-3xl font-bold text-red-900 mt-1">
                {groupedRooms.occupied.length}
              </p>
            </div>
            <Clock className="h-8 w-8 text-red-600" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-green-50 border border-green-200 rounded-xl p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Disponibles</p>
              <p className="text-3xl font-bold text-green-900 mt-1">
                {groupedRooms.available.length}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </motion.div>
      </div>

      {/* Liste des salles par statut */}
      <div className="space-y-6">
        {groups.map((group, groupIndex) => {
          if (group.rooms.length === 0) return null;

          return (
            <motion.div
              key={group.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (groupIndex + 1) }}
              className="space-y-3"
            >
              <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <group.icon className={`h-5 w-5 text-${group.color}-600`} />
                {group.title} ({group.rooms.length})
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {group.rooms.map((room, index) => {
                  const statusConfig = getStatusConfig(room);
                  const StatusIcon = statusConfig.icon;

                  return (
                    <motion.div
                      key={room.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`relative ${statusConfig.color} border-2 rounded-xl p-4 hover:shadow-lg transition-all duration-300 ${
                        statusConfig.pulse ? "animate-pulse-slow" : ""
                      }`}
                    >
                      {/* Badge de statut */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Building2 className="h-4 w-4 text-slate-600" />
                            <h4 className="font-semibold text-slate-900">
                              {room.name}
                            </h4>
                          </div>
                          <p className="text-xs text-slate-600">
                            {room.site?.name}
                          </p>
                        </div>
                        <Badge className={statusConfig.statusColor}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusConfig.status}
                        </Badge>
                      </div>

                      {/* Informations de la salle */}
                      <div className="space-y-2 mb-3">
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="h-3 w-3 text-slate-500" />
                          <span className="text-slate-700">
                            {room.capacity} places
                          </span>
                        </div>
                        {room.location && (
                          <div className="flex items-center gap-2 text-sm">
                            <Building2 className="h-3 w-3 text-slate-500" />
                            <span className="text-slate-700">
                              {room.location}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Réservation en cours */}
                      {room.currentBooking && (
                        <div className="mt-4 pt-4 border-t border-slate-200">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between mb-2">
                              <Calendar className="h-4 w-4 text-red-600" />
                              <div
                                className={`${
                                  statusConfig.pulse
                                    ? "bg-red-100 text-red-900"
                                    : "bg-red-50 text-red-800"
                                } px-2 py-1 rounded-md text-xs font-semibold flex items-center gap-1`}
                              >
                                <Clock className="h-3 w-3" />
                                {formatTimeRemaining(
                                  room.currentBooking.timeRemaining
                                )}
                              </div>
                            </div>
                            <p className="text-sm font-medium text-slate-900">
                              {room.currentBooking.title}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-slate-600">
                              <User className="h-3 w-3" />
                              <span>
                                {room.currentBooking.createdBy?.name ||
                                  room.currentBooking.createdBy?.email ||
                                  "Utilisateur inconnu"}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
