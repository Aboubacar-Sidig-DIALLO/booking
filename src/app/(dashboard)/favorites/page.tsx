"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  Building2,
  Users,
  Wifi,
  Monitor,
  Coffee,
  Star,
  Search,
  Plus,
  Eye,
  Calendar,
  Zap,
  TrendingUp,
  Activity,
  Edit,
} from "lucide-react";
import Link from "next/link";

// Données simulées pour les salles favorites
const favoriteRooms = [
  {
    id: 1,
    name: "Salle de conférence A",
    capacity: 12,
    equipment: ["Écran", "WiFi", "Projecteur"],
    status: "disponible",
    nextBooking: "14:00 - 16:00",
    occupancy: 85,
    lastUsed: "2024-01-15",
    totalBookings: 24,
    averageRating: 4.8,
    location: "Étage 2, Bureau 201",
    description: "Salle moderne avec vue panoramique",
  },
  {
    id: 2,
    name: "Espace créatif",
    capacity: 6,
    equipment: ["WiFi", "Café", "Tableau blanc"],
    status: "disponible",
    nextBooking: "09:00 - 12:00",
    occupancy: 67,
    lastUsed: "2024-01-14",
    totalBookings: 18,
    averageRating: 4.9,
    location: "Étage 3, Bureau 301",
    description: "Espace collaboratif pour brainstorming",
  },
  {
    id: 3,
    name: "Salle de réunion VIP",
    capacity: 8,
    equipment: ["Écran 4K", "WiFi", "Sonorisation", "Café"],
    status: "occupée",
    nextBooking: "10:00 - 11:30",
    occupancy: 92,
    lastUsed: "2024-01-13",
    totalBookings: 31,
    averageRating: 4.7,
    location: "Étage 1, Bureau 105",
    description: "Salle premium pour réunions importantes",
  },
];

const getStatusConfig = (status: string) => {
  switch (status) {
    case "disponible":
      return {
        color: "bg-green-100 text-green-800",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
      };
    case "occupée":
      return {
        color: "bg-red-100 text-red-800",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
      };
    default:
      return {
        color: "bg-gray-100 text-gray-800",
        bgColor: "bg-gray-50",
        borderColor: "border-gray-200",
      };
  }
};

const getEquipmentIcon = (equipment: string) => {
  switch (equipment.toLowerCase()) {
    case "wifi":
      return <Wifi className="h-3 w-3" />;
    case "écran":
    case "écran 4k":
      return <Monitor className="h-3 w-3" />;
    case "café":
      return <Coffee className="h-3 w-3" />;
    case "projecteur":
      return <Monitor className="h-3 w-3" />;
    case "sonorisation":
      return <Zap className="h-3 w-3" />;
    case "tableau blanc":
      return <Edit className="h-3 w-3" />;
    default:
      return <Star className="h-3 w-3" />;
  }
};

export default function FavoritesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

  // Filtrer et trier les salles favorites
  const filteredRooms = favoriteRooms
    .filter((room) => {
      const matchesSearch =
        room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || room.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "recent":
          return (
            new Date(b.lastUsed).getTime() - new Date(a.lastUsed).getTime()
          );
        case "popular":
          return b.totalBookings - a.totalBookings;
        case "rating":
          return b.averageRating - a.averageRating;
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-pink-50/30 to-rose-50/50">
      {/* Header moderne avec gradient */}
      <div className="relative overflow-hidden bg-gradient-to-r from-pink-600 via-rose-600 to-red-600">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-pink-600/90 via-rose-600/90 to-red-600/90"></div>

        {/* Éléments décoratifs */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute top-20 right-20 w-24 h-24 bg-white/5 rounded-full blur-lg"></div>
          <div className="absolute bottom-10 left-1/4 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
                  Mes favoris
                </h1>
              </div>
              <p className="text-pink-100 text-lg sm:text-xl max-w-2xl">
                Vos salles préférées et les plus utilisées
              </p>

              {/* Statistiques rapides */}
              <div className="flex flex-wrap gap-4 pt-4">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                  <Heart className="h-4 w-4 text-pink-300" />
                  <span className="text-white text-sm font-medium">
                    {favoriteRooms.length} favoris
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                  <TrendingUp className="h-4 w-4 text-pink-300" />
                  <span className="text-white text-sm font-medium">
                    {favoriteRooms.reduce(
                      (sum, room) => sum + room.totalBookings,
                      0
                    )}{" "}
                    réservations
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                  <Star className="h-4 w-4 text-yellow-300" />
                  <span className="text-white text-sm font-medium">
                    {(
                      favoriteRooms.reduce(
                        (sum, room) => sum + room.averageRating,
                        0
                      ) / favoriteRooms.length
                    ).toFixed(1)}
                    /5
                  </span>
                </div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <Link href="/bookings/new">
                <Button className="bg-gradient-to-r from-white to-pink-50 text-pink-600 hover:from-pink-50 hover:to-white shadow-lg hover:shadow-xl h-12 px-6 rounded-xl font-semibold">
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvelle réservation
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Section de filtres et recherche */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Recherche */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Rechercher dans vos favoris..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filtres */}
            <div className="flex gap-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value="all">Tous les statuts</option>
                <option value="disponible">Disponible</option>
                <option value="occupée">Occupée</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value="recent">Plus récent</option>
                <option value="popular">Plus populaire</option>
                <option value="rating">Mieux noté</option>
                <option value="name">Nom (A-Z)</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Grille des salles favorites */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredRooms.map((room, index) => {
              const statusConfig = getStatusConfig(room.status);
              return (
                <motion.div
                  key={room.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="group"
                >
                  <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden h-full">
                    <CardContent className="p-6">
                      {/* En-tête avec statut */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center shadow-lg">
                            <Building2 className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-slate-900 mb-1">
                              {room.name}
                            </h3>
                            <p className="text-sm text-slate-600">
                              📍 {room.location}
                            </p>
                          </div>
                        </div>
                        <Badge className={`${statusConfig.color} text-xs`}>
                          {room.status}
                        </Badge>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                        {room.description}
                      </p>

                      {/* Statistiques */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="bg-slate-50 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <Users className="h-4 w-4 text-slate-500" />
                            <span className="text-xs font-medium text-slate-700">
                              Capacité
                            </span>
                          </div>
                          <div className="text-lg font-bold text-slate-900">
                            {room.capacity}
                          </div>
                        </div>
                        <div className="bg-slate-50 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <Activity className="h-4 w-4 text-slate-500" />
                            <span className="text-xs font-medium text-slate-700">
                              Occupation
                            </span>
                          </div>
                          <div className="text-lg font-bold text-slate-900">
                            {room.occupancy}%
                          </div>
                        </div>
                      </div>

                      {/* Équipements */}
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-slate-900 mb-2">
                          Équipements
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {room.equipment.slice(0, 3).map((item, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-1 bg-slate-100 text-slate-700 px-2 py-1 rounded-md text-xs"
                            >
                              {getEquipmentIcon(item)}
                              <span>{item}</span>
                            </div>
                          ))}
                          {room.equipment.length > 3 && (
                            <div className="bg-slate-100 text-slate-700 px-2 py-1 rounded-md text-xs">
                              +{room.equipment.length - 3}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Métriques */}
                      <div className="flex items-center justify-between text-sm text-slate-600 mb-4">
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-500 fill-current" />
                          <span>{room.averageRating}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{room.totalBookings} réservations</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Link href={`/rooms/${room.id}`} className="flex-1">
                          <Button
                            variant="outline"
                            className="w-full border-slate-200 hover:bg-slate-50 cursor-pointer"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Voir
                          </Button>
                        </Link>
                        <Link
                          href={`/bookings/new?room=${room.id}`}
                          className="flex-1"
                        >
                          <Button
                            className="w-full bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white cursor-pointer"
                            disabled={room.status === "occupée"}
                          >
                            <Calendar className="h-4 w-4 mr-2" />
                            Réserver
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* État vide */}
        {filteredRooms.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center py-16"
          >
            <div className="relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 bg-gradient-to-r from-pink-100 to-rose-100 rounded-full blur-2xl opacity-50"></div>
              </div>
              <div className="relative">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-pink-500 to-rose-600 rounded-2xl shadow-lg mb-6">
                  <Heart className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  {searchTerm || statusFilter !== "all"
                    ? "Aucun résultat"
                    : "Aucun favori"}
                </h3>
                <p className="text-slate-600 text-lg mb-8 max-w-md mx-auto">
                  {searchTerm || statusFilter !== "all"
                    ? "Aucune salle ne correspond à vos critères de recherche."
                    : "Vous n'avez pas encore de salles favorites. Explorez les salles disponibles et ajoutez-les à vos favoris !"}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  {searchTerm || statusFilter !== "all" ? (
                    <Button
                      onClick={() => {
                        setSearchTerm("");
                        setStatusFilter("all");
                      }}
                      className="bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white shadow-lg hover:shadow-xl h-12 px-8 rounded-xl font-semibold cursor-pointer"
                    >
                      Effacer les filtres
                    </Button>
                  ) : (
                    <Link href="/rooms">
                      <Button className="bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white shadow-lg hover:shadow-xl h-12 px-8 rounded-xl font-semibold cursor-pointer">
                        <Building2 className="h-5 w-5 mr-2" />
                        Explorer les salles
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
