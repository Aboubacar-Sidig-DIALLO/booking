"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Plus,
  Users,
  Clock,
  CheckCircle,
  Zap,
  BarChart3,
  Star,
  Building2,
  Heart,
  Search,
  Bell,
  Eye,
  Timer,
  Activity,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { setThemeForNavigation } from "@/hooks/useThemeColor";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Données simulées pour les salles populaires
const popularRooms = [
  {
    id: 1,
    name: "Salle de conférence A",
    capacity: 12,
    equipment: ["Écran", "WiFi", "Projecteur"],
    status: "disponible",
    nextBooking: "14:00 - 16:00",
    isFavorite: true,
    occupancy: 85,
  },
  {
    id: 2,
    name: "Salle de réunion B",
    capacity: 8,
    equipment: ["Écran", "WiFi"],
    status: "occupée",
    nextBooking: "10:00 - 11:30",
    isFavorite: false,
    occupancy: 92,
  },
  {
    id: 3,
    name: "Espace créatif",
    capacity: 6,
    equipment: ["WiFi", "Café"],
    status: "disponible",
    nextBooking: "09:00 - 12:00",
    isFavorite: true,
    occupancy: 67,
  },
];

// Données simulées pour les réservations récentes
const recentBookings = [
  {
    id: 1,
    room: "Salle de conférence A",
    date: "Aujourd'hui",
    time: "14:00 - 16:00",
    participants: 8,
    status: "confirmé",
  },
  {
    id: 2,
    room: "Espace créatif",
    date: "Demain",
    time: "09:00 - 12:00",
    participants: 6,
    status: "en attente",
  },
];

function HomeContent() {
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [quickSearch, setQuickSearch] = useState("");

  // Gestionnaire de navigation avec thème
  const handleQuickActionClick = (
    path: string,
    theme: "blue" | "green" | "purple" | "pink"
  ) => {
    setThemeForNavigation(theme);
    router.push(path);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Header moderne avec informations temps réel */}
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
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent drop-shadow-lg">
                  BookSpace
                </h1>
              </div>
              <p className="text-blue-100 text-lg sm:text-xl max-w-2xl">
                Votre hub intelligent pour la gestion d'espaces
              </p>

              {/* Informations temps réel */}
              <div className="flex flex-wrap gap-4 pt-4">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                  <Clock className="h-4 w-4 text-blue-300" />
                  <span className="text-white text-sm font-medium">
                    {formatTime(currentTime)}
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                  <Calendar className="h-4 w-4 text-blue-300" />
                  <span className="text-white text-sm font-medium">
                    {formatDate(currentTime)}
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                  <Activity className="h-4 w-4 text-green-300" />
                  <span className="text-white text-sm font-medium">
                    Système actif
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
                <Button className="bg-gradient-to-r from-white to-blue-50 text-blue-600 hover:from-blue-50 hover:to-white shadow-lg hover:shadow-xl h-12 px-6 rounded-xl font-semibold">
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvelle réservation
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Section principale avec grille de fonctionnalités */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Colonne principale - Actions rapides */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recherche rapide */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="h-5 w-5 text-blue-600" />
                    Recherche rapide
                  </CardTitle>
                  <CardDescription>
                    Trouvez rapidement une salle ou une réservation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Rechercher une salle, une réservation..."
                      value={quickSearch}
                      onChange={(e) => setQuickSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  {quickSearch && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 p-3 bg-white rounded-lg border border-slate-200"
                    >
                      <p className="text-sm text-slate-600">
                        Recherche pour:{" "}
                        <span className="font-semibold">{quickSearch}</span>
                      </p>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Actions rapides */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-orange-600" />
                    Actions rapides
                  </CardTitle>
                  <CardDescription>
                    Accédez rapidement aux fonctionnalités les plus utilisées
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <motion.div
                      onClick={() =>
                        handleQuickActionClick("/bookings/new", "blue")
                      }
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 cursor-pointer hover:shadow-lg transition-all duration-200"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                          <Plus className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900">
                            Nouvelle réservation
                          </h3>
                          <p className="text-sm text-slate-600">
                            Réserver une salle rapidement
                          </p>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      onClick={() => handleQuickActionClick("/rooms", "green")}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 cursor-pointer hover:shadow-lg transition-all duration-200"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                          <Building2 className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900">
                            Explorer les salles
                          </h3>
                          <p className="text-sm text-slate-600">
                            Voir toutes les salles disponibles
                          </p>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      onClick={() =>
                        handleQuickActionClick("/my-bookings", "purple")
                      }
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="p-4 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl border border-purple-200 cursor-pointer hover:shadow-lg transition-all duration-200"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-gradient-to-br from-purple-500 to-violet-600 rounded-lg flex items-center justify-center">
                          <Calendar className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900">
                            Mes réservations
                          </h3>
                          <p className="text-sm text-slate-600">
                            Gérer mes réservations
                          </p>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      onClick={() =>
                        handleQuickActionClick("/favorites", "pink")
                      }
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="p-4 bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl border border-pink-200 cursor-pointer hover:shadow-lg transition-all duration-200"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-gradient-to-br from-pink-500 to-rose-600 rounded-lg flex items-center justify-center">
                          <Heart className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900">
                            Mes favoris
                          </h3>
                          <p className="text-sm text-slate-600">
                            Salles préférées
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Salles populaires */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-600" />
                    Salles populaires
                  </CardTitle>
                  <CardDescription>
                    Les salles les plus utilisées aujourd'hui
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {popularRooms.map((room, index) => (
                      <motion.div
                        key={room.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                            <Building2 className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-slate-900">
                              {room.name}
                            </h4>
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <Users className="h-3 w-3" />
                              <span>{room.capacity} places</span>
                              <span className="text-slate-400">•</span>
                              <span
                                className={`px-2 py-1 rounded-full text-xs ${
                                  room.status === "disponible"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {room.status}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-right">
                            <div className="text-sm font-semibold text-slate-900">
                              {room.occupancy}%
                            </div>
                            <div className="text-xs text-slate-500">
                              occupation
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <Heart
                                className={`h-4 w-4 ${room.isFavorite ? "text-red-500 fill-current" : "text-slate-400"}`}
                              />
                            </Button>
                            <Link href={`/rooms/${room.id}`}>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                              >
                                <Eye className="h-4 w-4 text-slate-400" />
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Colonne latérale - Informations et réservations */}
          <div className="space-y-6">
            {/* Réservations récentes */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                    Réservations récentes
                  </CardTitle>
                  <CardDescription>Vos dernières réservations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentBookings.map((booking, index) => (
                      <motion.div
                        key={booking.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-3 bg-slate-50 rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-slate-900">
                            {booking.room}
                          </h4>
                          <Badge
                            className={`text-xs ${
                              booking.status === "confirmé"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {booking.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-slate-600 space-y-1">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{booking.date}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Timer className="h-3 w-3" />
                            <span>{booking.time}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            <span>{booking.participants} participants</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <div className="mt-4">
                    <Link href="/my-bookings">
                      <Button variant="outline" className="w-full">
                        Voir toutes les réservations
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Statistiques rapides */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-green-600" />
                    Statistiques
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-slate-900">
                          Réservations actives
                        </span>
                      </div>
                      <span className="text-lg font-bold text-green-600">
                        12
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-slate-900">
                          Salles disponibles
                        </span>
                      </div>
                      <span className="text-lg font-bold text-blue-600">8</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Heart className="h-4 w-4 text-purple-600" />
                        <span className="text-sm font-medium text-slate-900">
                          Favoris
                        </span>
                      </div>
                      <span className="text-lg font-bold text-purple-600">
                        5
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Notifications */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-orange-600" />
                    Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <span className="text-sm font-medium text-slate-900">
                          Réservation confirmée
                        </span>
                      </div>
                      <p className="text-xs text-slate-600">
                        Votre réservation pour la Salle A a été confirmée
                      </p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm font-medium text-slate-900">
                          Rappel
                        </span>
                      </div>
                      <p className="text-xs text-slate-600">
                        Réunion dans 30 minutes - Salle B
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Section CTA finale */}
      <div className="relative py-16 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
              Prêt à commencer ?
            </h2>
            <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
              Créez votre première réservation et découvrez la puissance de{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent font-bold">
                BookSpace
              </span>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/bookings/new">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Nouvelle réservation
                </Button>
              </Link>
              <Link href="/rooms">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-slate-300 text-slate-700 hover:bg-slate-50 px-8 py-4 rounded-xl font-semibold"
                >
                  <Building2 className="h-5 w-5 mr-2" />
                  Explorer les salles
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return <HomeContent />;
}
