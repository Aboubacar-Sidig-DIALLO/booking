"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Clock,
  Users,
  MapPin,
  MoreVertical,
  Edit,
  Trash2,
  Download,
  Plus,
  CheckCircle2,
  AlertCircle,
  Building2,
  Sparkles,
  Filter,
  Search,
  X,
} from "lucide-react";
import Link from "next/link";

const bookings = [
  {
    id: 1,
    room: "Salle de conférence A",
    date: "2024-01-15",
    time: "14:00 - 16:00",
    participants: 8,
    status: "confirmé",
    location: "Étage 2, Bureau 201",
    type: "conférence",
    priority: "haute",
  },
  {
    id: 2,
    room: "Salle de réunion B",
    date: "2024-01-16",
    time: "10:00 - 11:30",
    participants: 5,
    status: "en attente",
    location: "Étage 1, Bureau 105",
    type: "réunion",
    priority: "moyenne",
  },
  {
    id: 3,
    room: "Espace créatif",
    date: "2024-01-17",
    time: "09:00 - 12:00",
    participants: 6,
    status: "confirmé",
    location: "Étage 3, Bureau 301",
    type: "atelier",
    priority: "basse",
  },
];

const getStatusConfig = (status: string) => {
  switch (status) {
    case "confirmé":
      return {
        icon: CheckCircle2,
        color: "bg-gradient-to-r from-green-500 to-emerald-500",
        textColor: "text-white",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
      };
    case "en attente":
      return {
        icon: AlertCircle,
        color: "bg-gradient-to-r from-yellow-500 to-orange-500",
        textColor: "text-white",
        bgColor: "bg-yellow-50",
        borderColor: "border-yellow-200",
      };
    case "annulé":
      return {
        icon: Trash2,
        color: "bg-gradient-to-r from-red-500 to-pink-500",
        textColor: "text-white",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
      };
    default:
      return {
        icon: AlertCircle,
        color: "bg-gradient-to-r from-gray-500 to-slate-500",
        textColor: "text-white",
        bgColor: "bg-gray-50",
        borderColor: "border-gray-200",
      };
  }
};

export default function MyBookingsPage() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);

  // Filtrer les réservations
  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const statusMatch =
        statusFilter === "all" || booking.status === statusFilter;
      const typeMatch = typeFilter === "all" || booking.type === typeFilter;
      const priorityMatch =
        priorityFilter === "all" || booking.priority === priorityFilter;

      return statusMatch && typeMatch && priorityMatch;
    });
  }, [statusFilter, typeFilter, priorityFilter]);

  const clearFilters = () => {
    setStatusFilter("all");
    setTypeFilter("all");
    setPriorityFilter("all");
  };

  const hasActiveFilters =
    statusFilter !== "all" || typeFilter !== "all" || priorityFilter !== "all";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      {/* Header moderne avec gradient */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 via-indigo-600/90 to-purple-600/90"></div>

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
                  <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
                  Mes réservations
                </h1>
              </div>
              <p className="text-blue-100 text-lg sm:text-xl max-w-2xl">
                Gérez et suivez toutes vos réservations de salles en un seul
                endroit
              </p>

              {/* Statistiques rapides */}
              <div className="flex flex-wrap gap-4 pt-4">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                  <CheckCircle2 className="h-4 w-4 text-green-300" />
                  <span className="text-white text-sm font-medium">
                    {bookings.filter((b) => b.status === "confirmé").length}{" "}
                    Confirmées
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                  <AlertCircle className="h-4 w-4 text-yellow-300" />
                  <span className="text-white text-sm font-medium">
                    {bookings.filter((b) => b.status === "en attente").length}{" "}
                    En attente
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                  <Users className="h-4 w-4 text-blue-300" />
                  <span className="text-white text-sm font-medium">
                    {bookings.reduce((sum, b) => sum + b.participants, 0)}{" "}
                    Participants
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
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className={`bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 h-12 px-6 rounded-xl transition-all duration-200 ${
                  showFilters ? "bg-white/20" : ""
                }`}
              >
                <Filter className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Filtrer</span>
                {hasActiveFilters && (
                  <div className="ml-2 w-2 h-2 bg-yellow-400 rounded-full"></div>
                )}
              </Button>
              <Link href="/bookings/new">
                <Button className="bg-gradient-to-r from-white to-blue-50 text-blue-600 hover:from-blue-50 hover:to-white shadow-lg hover:shadow-xl h-12 px-6 rounded-xl font-semibold">
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvelle réservation
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Panneau de filtres */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="bg-white/80 backdrop-blur-sm border-b border-slate-200"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="h-5 w-5 text-slate-600" />
                  <h3 className="text-lg font-semibold text-slate-900">
                    Filtres
                  </h3>
                  {hasActiveFilters && (
                    <span className="text-sm text-slate-500">
                      ({filteredBookings.length} résultat
                      {filteredBookings.length > 1 ? "s" : ""})
                    </span>
                  )}
                </div>

                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    onClick={clearFilters}
                    className="text-slate-500 hover:text-slate-700 h-8 px-3"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Effacer les filtres
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                {/* Filtre par statut */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Statut
                  </label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="h-10 rounded-lg">
                      <SelectValue placeholder="Tous les statuts" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les statuts</SelectItem>
                      <SelectItem value="confirmé">Confirmé</SelectItem>
                      <SelectItem value="en attente">En attente</SelectItem>
                      <SelectItem value="annulé">Annulé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Filtre par type */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Type
                  </label>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="h-10 rounded-lg">
                      <SelectValue placeholder="Tous les types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les types</SelectItem>
                      <SelectItem value="conférence">Conférence</SelectItem>
                      <SelectItem value="réunion">Réunion</SelectItem>
                      <SelectItem value="atelier">Atelier</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Filtre par priorité */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Priorité
                  </label>
                  <Select
                    value={priorityFilter}
                    onValueChange={setPriorityFilter}
                  >
                    <SelectTrigger className="h-10 rounded-lg">
                      <SelectValue placeholder="Toutes les priorités" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les priorités</SelectItem>
                      <SelectItem value="haute">Haute</SelectItem>
                      <SelectItem value="moyenne">Moyenne</SelectItem>
                      <SelectItem value="basse">Basse</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Section principale des réservations */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="space-y-6 sm:space-y-8"
        >
          {filteredBookings.map((booking, index) => {
            const statusConfig = getStatusConfig(booking.status);
            const StatusIcon = statusConfig.icon;

            return (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: "easeOut",
                }}
                whileHover={{ y: -2 }}
                className="group"
              >
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden">
                  <CardContent className="p-6 sm:p-8">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Informations principales */}
                      <div className="flex-1 space-y-4">
                        {/* En-tête avec titre et statut */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-start gap-4">
                            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                              <Building2 className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                            </div>
                            <div>
                              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">
                                {booking.room}
                              </h3>
                              <p className="text-slate-500 text-sm sm:text-base capitalize">
                                {booking.type} • Priorité {booking.priority}
                              </p>
                            </div>
                          </div>

                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${statusConfig.color} ${statusConfig.textColor} shadow-lg`}
                          >
                            <StatusIcon className="h-4 w-4" />
                            <span className="font-semibold text-sm sm:text-base capitalize">
                              {booking.status}
                            </span>
                          </motion.div>
                        </div>

                        {/* Détails de la réservation */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-xs text-slate-500 font-medium">
                                Date
                              </p>
                              <p className="text-sm sm:text-base font-semibold text-slate-900">
                                {booking.date}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                            <div className="p-2 bg-green-100 rounded-lg">
                              <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                            </div>
                            <div>
                              <p className="text-xs text-slate-500 font-medium">
                                Heure
                              </p>
                              <p className="text-sm sm:text-base font-semibold text-slate-900">
                                {booking.time}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                            <div className="p-2 bg-purple-100 rounded-lg">
                              <Users className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                            </div>
                            <div>
                              <p className="text-xs text-slate-500 font-medium">
                                Participants
                              </p>
                              <p className="text-sm sm:text-base font-semibold text-slate-900">
                                {booking.participants} personnes
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                            <div className="p-2 bg-orange-100 rounded-lg">
                              <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
                            </div>
                            <div>
                              <p className="text-xs text-slate-500 font-medium">
                                Localisation
                              </p>
                              <p className="text-sm sm:text-base font-semibold text-slate-900">
                                {booking.location}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col sm:flex-row lg:flex-col gap-3 lg:min-w-[200px]">
                        <Button
                          variant="outline"
                          className="flex-1 h-12 px-4 rounded-xl border-slate-200 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-all duration-200"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          <span className="hidden sm:inline">Export</span>
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1 h-12 px-4 rounded-xl border-slate-200 hover:bg-green-50 hover:border-green-200 hover:text-green-600 transition-all duration-200"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          <span className="hidden sm:inline">Modifier</span>
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1 h-12 px-4 rounded-xl border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all duration-200"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          <span className="hidden sm:inline">Annuler</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* État vide amélioré */}
        {filteredBookings.length === 0 && bookings.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center py-16 sm:py-24"
          >
            <div className="relative">
              {/* Éléments décoratifs */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-full blur-2xl opacity-50"></div>
              </div>

              <div className="relative">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl shadow-lg mb-6">
                  <Search className="h-12 w-12 text-white" />
                </div>

                <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
                  Aucun résultat trouvé
                </h3>
                <p className="text-slate-600 text-lg sm:text-xl mb-8 max-w-md mx-auto">
                  Aucune réservation ne correspond à vos critères de filtrage.
                  Essayez de modifier vos filtres.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={clearFilters}
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl h-12 px-8 rounded-xl font-semibold"
                  >
                    <X className="h-5 w-5 mr-2" />
                    Effacer les filtres
                  </Button>
                  <Button
                    onClick={() => setShowFilters(true)}
                    variant="outline"
                    className="h-12 px-8 rounded-xl border-slate-200 hover:bg-slate-50"
                  >
                    <Filter className="h-5 w-5 mr-2" />
                    Modifier les filtres
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* État vide initial */}
        {bookings.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center py-16 sm:py-24"
          >
            <div className="relative">
              {/* Éléments décoratifs */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full blur-2xl opacity-50"></div>
              </div>

              <div className="relative">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-lg mb-6">
                  <Calendar className="h-12 w-12 text-white" />
                </div>

                <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
                  Aucune réservation
                </h3>
                <p className="text-slate-600 text-lg sm:text-xl mb-8 max-w-md mx-auto">
                  Vous n'avez pas encore de réservations. Créez votre première
                  réservation et commencez à organiser vos réunions !
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/bookings/new">
                    <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl h-12 px-8 rounded-xl font-semibold">
                      <Plus className="h-5 w-5 mr-2" />
                      Nouvelle réservation
                    </Button>
                  </Link>
                  <Link href="/rooms">
                    <Button
                      variant="outline"
                      className="h-12 px-8 rounded-xl border-slate-200 hover:bg-slate-50"
                    >
                      <Building2 className="h-5 w-5 mr-2" />
                      Explorer les salles
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
