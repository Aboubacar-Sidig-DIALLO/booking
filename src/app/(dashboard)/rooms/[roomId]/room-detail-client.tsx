"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  Users,
  MapPin,
  Calendar,
  Clock,
  Wifi,
  Monitor,
  Coffee,
  Volume2,
  Camera,
  Tv,
  Mic,
  Projector,
  AirVent,
  Lightbulb,
  ArrowLeft,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/common/Skeleton";
import { format } from "date-fns";
import { fr } from "date-fns/locale/fr";

interface Room {
  id: string;
  name: string;
  description: string | null;
  capacity: number;
  location: string | null;
  site: {
    id: string;
    name: string;
  } | null;
  features: {
    feature: {
      id: string;
      name: string;
    };
  }[];
}

interface Booking {
  id: string;
  title: string;
  description: string | null;
  start: string;
  end: string;
  status: string;
  participants: {
    id: string;
    user: {
      id: string;
      name: string;
      email: string;
    };
    role: string;
  }[];
}

const getEquipmentIcon = (equipment: string) => {
  const iconMap: Record<string, any> = {
    Écran: Monitor,
    WiFi: Wifi,
    Projecteur: Projector,
    Café: Coffee,
    Caméra: Camera,
    Micro: Mic,
    Sonorisation: Volume2,
    TV: Tv,
    Climatisation: AirVent,
    "Éclairage LED": Lightbulb,
  };
  return iconMap[equipment] || Monitor;
};

export default function RoomDetailClient({ roomId }: { roomId: string }) {
  const router = useRouter();
  const [room, setRoom] = useState<Room | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Charger les données de la salle
  useEffect(() => {
    const loadRoomData = async () => {
      try {
        const [roomRes, bookingsRes] = await Promise.all([
          fetch(`/api/rooms/${roomId}`),
          fetch(`/api/bookings?roomId=${roomId}`),
        ]);

        if (roomRes.ok) {
          const roomData = await roomRes.json();
          setRoom(roomData);
        }

        if (bookingsRes.ok) {
          const bookingsData = await bookingsRes.json();
          // La réponse de createSuccessResponse a la structure { success: true, data: [...] }
          const bookingsList = bookingsData?.data || [];
          setBookings(Array.isArray(bookingsList) ? bookingsList : []);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
      } finally {
        setLoading(false);
      }
    };

    loadRoomData();
  }, [roomId]);

  // Générer le calendrier
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - startDate.getDay());

    const days: Date[] = [];
    const currentDate = new Date(startDate);
    while (currentDate <= lastDay || days.length < 42) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
      if (days.length >= 42) break;
    }

    return days;
  }, [currentMonth]);

  // Obtenir les réservations pour un jour donné
  const getBookingsForDay = (date: Date) => {
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);

    return bookings.filter((booking) => {
      const start = new Date(booking.start);
      const end = new Date(booking.end);

      // Vérifie si la réservation chevauche cette journée
      return start <= dayEnd && end >= dayStart;
    });
  };

  const handleBookingClick = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Skeleton Header */}
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-24 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-9 w-64 rounded-lg" />
            <Skeleton className="h-5 w-48 rounded-lg" />
          </div>
        </div>

        {/* Skeleton Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Skeleton Colonne gauche */}
          <div className="lg:col-span-1 space-y-6">
            {/* Skeleton Carte Capacité */}
            <Card className="border border-slate-200 shadow-lg bg-white">
              <CardHeader className="bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 text-white rounded-t-xl">
                <div className="flex items-center gap-2.5">
                  <Skeleton className="h-5 w-5 rounded bg-white/20" />
                  <Skeleton className="h-5 w-24 rounded bg-white/20" />
                </div>
              </CardHeader>
              <CardContent className="pt-6 pb-6">
                <div className="text-center space-y-2">
                  <Skeleton className="h-16 w-20 mx-auto rounded-lg bg-slate-100" />
                  <Skeleton className="h-4 w-32 mx-auto rounded" />
                </div>
              </CardContent>
            </Card>

            {/* Skeleton Carte Équipements */}
            <Card className="border border-slate-200 shadow-lg bg-white">
              <CardHeader className="bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 text-white rounded-t-xl">
                <div className="flex items-center gap-2.5">
                  <Skeleton className="h-5 w-5 rounded bg-white/20" />
                  <Skeleton className="h-5 w-32 rounded bg-white/20" />
                </div>
              </CardHeader>
              <CardContent className="pt-6 pb-6">
                <div className="grid grid-cols-2 gap-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="flex flex-col items-center gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200"
                    >
                      <Skeleton className="h-5 w-5 rounded bg-slate-300" />
                      <Skeleton className="h-3 w-16 rounded bg-slate-200" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Skeleton Carte Description */}
            <Card className="border border-slate-200 shadow-lg bg-white">
              <CardHeader className="bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 text-white rounded-t-xl">
                <div className="flex items-center gap-2.5">
                  <Skeleton className="h-5 w-5 rounded bg-white/20" />
                  <Skeleton className="h-5 w-28 rounded bg-white/20" />
                </div>
              </CardHeader>
              <CardContent className="pt-6 pb-6 space-y-2">
                <Skeleton className="h-4 w-full rounded" />
                <Skeleton className="h-4 w-5/6 rounded" />
                <Skeleton className="h-4 w-4/6 rounded" />
              </CardContent>
            </Card>
          </div>

          {/* Skeleton Colonne droite - Calendrier */}
          <div className="lg:col-span-2">
            <Card className="border border-slate-200 shadow-lg bg-white">
              <CardHeader className="bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 text-white rounded-t-xl">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-2.5">
                    <Skeleton className="h-5 w-5 rounded bg-white/20" />
                    <Skeleton className="h-5 w-32 rounded bg-white/20" />
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-2 py-1 border border-white/20">
                    <Skeleton className="h-8 w-8 rounded-md bg-white/20" />
                    <Skeleton className="h-5 w-32 rounded bg-white/20" />
                    <Skeleton className="h-8 w-8 rounded-md bg-white/20" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                {/* Skeleton En-têtes jours */}
                <div className="grid grid-cols-7 gap-2 mb-3">
                  {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                    <Skeleton key={i} className="h-8 rounded" />
                  ))}
                </div>
                {/* Skeleton Grille calendrier */}
                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: 35 }).map((_, i) => (
                    <div
                      key={i}
                      className="min-h-[90px] p-2 rounded-lg border border-slate-200 bg-white space-y-1"
                    >
                      <Skeleton className="h-4 w-6 rounded bg-slate-200" />
                      <Skeleton className="h-4 w-full rounded bg-slate-100" />
                      <Skeleton className="h-4 w-3/4 rounded bg-slate-100" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <AlertCircle className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-500 mb-2">
            Salle non trouvée
          </h3>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header avec bouton retour */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center gap-4 pb-2 border-b border-slate-200"
      >
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="rounded-lg border-slate-300 hover:bg-slate-50 hover:border-slate-400 transition-all cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
            {room.name}
          </h1>
          {room.site && (
            <p className="text-slate-600 mt-1.5 flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-slate-500" />
              <span>{room.site.name}</span>
            </p>
          )}
        </div>
      </motion.div>

      {/* Grille principale */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne gauche - Caractéristiques */}
        <div className="lg:col-span-1 space-y-6">
          {/* Carte Capacité */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
              <CardHeader className="bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 text-white rounded-t-xl">
                <CardTitle className="flex items-center gap-2.5">
                  <div className="p-1.5 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20">
                    <Users className="h-5 w-5" />
                  </div>
                  <span className="font-semibold">Capacité</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 pb-6">
                <div className="text-center">
                  <div className="text-5xl font-bold text-slate-900 mb-2">
                    {room.capacity}
                  </div>
                  <p className="text-slate-600 font-medium">
                    personnes maximum
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Carte Équipements */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
              <CardHeader className="bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 text-white rounded-t-xl">
                <CardTitle className="flex items-center gap-2.5">
                  <div className="p-1.5 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20">
                    <Monitor className="h-5 w-5" />
                  </div>
                  <span className="font-semibold">Équipements</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 pb-6">
                {room.features && room.features.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3">
                    {room.features.map(({ feature }) => {
                      const Icon = getEquipmentIcon(feature.name);
                      return (
                        <motion.div
                          key={feature.id}
                          whileHover={{ scale: 1.05, y: -2 }}
                          transition={{ duration: 0.2 }}
                          className="flex flex-col items-center gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-100 hover:shadow-sm transition-all cursor-default"
                        >
                          <div className="p-2 bg-slate-700 rounded-lg">
                            <Icon className="h-5 w-5 text-white" />
                          </div>
                          <span className="text-xs font-semibold text-slate-700 text-center leading-tight">
                            {feature.name}
                          </span>
                        </motion.div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-slate-500 text-center py-4 text-sm">
                    Aucun équipement spécifique
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Carte Description */}
          {room.description && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
                <CardHeader className="bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 text-white rounded-t-xl">
                  <CardTitle className="flex items-center gap-2.5">
                    <div className="p-1.5 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <span className="font-semibold">Description</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 pb-6">
                  <p className="text-slate-700 leading-relaxed text-sm">
                    {room.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>

        {/* Colonne droite - Calendrier */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
              <CardHeader className="bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 text-white rounded-t-xl">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <CardTitle className="flex items-center gap-2.5">
                    <div className="p-1.5 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <span className="font-semibold text-lg">Réservations</span>
                  </CardTitle>
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-2 py-1 border border-white/20">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setCurrentMonth(
                          new Date(
                            currentMonth.getFullYear(),
                            currentMonth.getMonth() - 1
                          )
                        );
                      }}
                      className="text-white hover:bg-white/20 h-8 w-8 p-0 rounded-md transition-all cursor-pointer"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-white font-semibold min-w-[160px] text-center text-sm">
                      {format(currentMonth, "MMMM yyyy", { locale: fr })}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setCurrentMonth(
                          new Date(
                            currentMonth.getFullYear(),
                            currentMonth.getMonth() + 1
                          )
                        );
                      }}
                      className="text-white hover:bg-white/20 h-8 w-8 p-0 rounded-md transition-all cursor-pointer"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                {/* En-têtes des jours de la semaine */}
                <div className="grid grid-cols-7 gap-2 mb-3">
                  {["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"].map(
                    (day, idx) => (
                      <div
                        key={day}
                        className={`text-center text-xs font-bold py-2 rounded ${
                          idx === 0 || idx === 6
                            ? "text-slate-400"
                            : "text-slate-700"
                        }`}
                      >
                        {day}
                      </div>
                    )
                  )}
                </div>

                {/* Grille du calendrier */}
                <div className="grid grid-cols-7 gap-2">
                  {calendarDays.map((day, idx) => {
                    const dayBookings = getBookingsForDay(day);
                    const isCurrentMonth =
                      day.getMonth() === currentMonth.getMonth();
                    const isToday =
                      day.toDateString() === new Date().toDateString();

                    return (
                      <motion.div
                        key={idx}
                        whileHover={{ scale: 1.02 }}
                        className={`min-h-[90px] p-2 rounded-lg border transition-all ${
                          isCurrentMonth
                            ? "bg-white border-slate-200 hover:border-slate-300 hover:shadow-md"
                            : "bg-slate-50/80 border-slate-100"
                        } ${
                          isToday
                            ? "ring-2 ring-slate-400 ring-offset-1 bg-slate-100/80 border-slate-300"
                            : ""
                        }`}
                      >
                        <div
                          className={`text-sm font-bold mb-1.5 ${
                            isCurrentMonth
                              ? isToday
                                ? "text-slate-900"
                                : "text-slate-900"
                              : "text-slate-400"
                          }`}
                        >
                          {day.getDate()}
                          {isToday && (
                            <motion.span
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="ml-1.5 inline-block h-2 w-2 bg-slate-600 rounded-full"
                            />
                          )}
                        </div>
                        <div className="space-y-1">
                          {dayBookings.slice(0, 2).map((booking) => {
                            const bookingStart = new Date(booking.start);
                            const bookingEnd = new Date(booking.end);
                            const isStartOfBooking =
                              bookingStart.toDateString() ===
                              day.toDateString();
                            const isEndOfBooking =
                              bookingEnd.toDateString() === day.toDateString();
                            const isFullDay =
                              isStartOfBooking && isEndOfBooking;
                            const isConfirmed = booking.status === "CONFIRMED";

                            return (
                              <motion.button
                                key={booking.id}
                                onClick={() => handleBookingClick(booking)}
                                whileHover={{ scale: 1.05, y: -1 }}
                                whileTap={{ scale: 0.98 }}
                                className={`w-full text-left px-2 py-1 text-[10px] font-semibold rounded-md truncate transition-all cursor-pointer shadow-sm hover:shadow-md ${
                                  isConfirmed
                                    ? "bg-slate-700 text-white hover:bg-slate-800"
                                    : "bg-slate-400 text-white hover:bg-slate-500"
                                }`}
                                title={booking.title}
                              >
                                {isStartOfBooking &&
                                  format(bookingStart, "HH:mm")}{" "}
                                {isFullDay || isStartOfBooking
                                  ? booking.title
                                  : "..."}
                              </motion.button>
                            );
                          })}
                          {dayBookings.length > 2 && (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              onClick={() => {
                                const firstBooking = dayBookings[0];
                                if (firstBooking)
                                  handleBookingClick(firstBooking);
                              }}
                              className="text-[10px] text-slate-600 hover:text-slate-800 px-1.5 py-0.5 font-semibold hover:bg-slate-100 rounded transition-all cursor-pointer"
                            >
                              +{dayBookings.length - 2} autre(s)
                            </motion.button>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Modal de détails de réservation */}
      <AnimatePresence>
        {isModalOpen && (
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto border-0 shadow-2xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
              >
                <DialogHeader className="pb-4 border-b border-slate-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <DialogTitle className="text-2xl font-bold text-slate-900 mb-3">
                        {selectedBooking?.title}
                      </DialogTitle>
                      {selectedBooking && (
                        <Badge
                          variant={
                            selectedBooking.status === "CONFIRMED"
                              ? "destructive"
                              : "secondary"
                          }
                          className="text-sm font-semibold"
                        >
                          {selectedBooking.status === "CONFIRMED"
                            ? "Confirmée"
                            : "En attente"}
                        </Badge>
                      )}
                    </div>
                  </div>
                </DialogHeader>
                {selectedBooking && (
                  <div className="space-y-6 mt-6">
                    {/* Dates et heures avec cartes élégantes */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="p-4 bg-slate-50 rounded-xl border border-slate-200"
                      >
                        <div className="flex items-center gap-2.5 mb-3">
                          <div className="p-1.5 bg-slate-700 rounded-lg">
                            <Calendar className="h-4 w-4 text-white" />
                          </div>
                          <span className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
                            Date de début
                          </span>
                        </div>
                        <p className="text-slate-900 font-bold text-base mb-2">
                          {format(
                            new Date(selectedBooking.start),
                            "EEEE d MMMM yyyy",
                            { locale: fr }
                          )}
                        </p>
                        <div className="flex items-center gap-2 text-slate-600">
                          <Clock className="h-3.5 w-3.5" />
                          <span className="text-sm font-semibold">
                            {format(new Date(selectedBooking.start), "HH:mm")}
                          </span>
                        </div>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.15 }}
                        className="p-4 bg-slate-50 rounded-xl border border-slate-200"
                      >
                        <div className="flex items-center gap-2.5 mb-3">
                          <div className="p-1.5 bg-slate-700 rounded-lg">
                            <Calendar className="h-4 w-4 text-white" />
                          </div>
                          <span className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
                            Date de fin
                          </span>
                        </div>
                        <p className="text-slate-900 font-bold text-base mb-2">
                          {format(
                            new Date(selectedBooking.end),
                            "EEEE d MMMM yyyy",
                            {
                              locale: fr,
                            }
                          )}
                        </p>
                        <div className="flex items-center gap-2 text-slate-600">
                          <Clock className="h-3.5 w-3.5" />
                          <span className="text-sm font-semibold">
                            {format(new Date(selectedBooking.end), "HH:mm")}
                          </span>
                        </div>
                      </motion.div>
                    </div>

                    {/* Description */}
                    {selectedBooking.description && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="p-4 bg-slate-50 rounded-xl border border-slate-200"
                      >
                        <span className="text-sm font-semibold text-slate-700 mb-2 block">
                          Description
                        </span>
                        <p className="text-slate-700 leading-relaxed text-sm">
                          {selectedBooking.description}
                        </p>
                      </motion.div>
                    )}

                    {/* Participants */}
                    {selectedBooking.participants &&
                      selectedBooking.participants.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.25 }}
                          className="space-y-3"
                        >
                          <span className="text-sm font-semibold text-slate-700 block">
                            Participants ({selectedBooking.participants.length})
                          </span>
                          <div className="space-y-2">
                            {selectedBooking.participants.map(
                              (participant, idx) => {
                                const userName =
                                  participant.user?.name ||
                                  "Utilisateur inconnu";
                                const userEmail = participant.user?.email || "";
                                return (
                                  <motion.div
                                    key={participant.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 + idx * 0.05 }}
                                    whileHover={{ scale: 1.01, x: 2 }}
                                    className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all"
                                  >
                                    <div className="h-9 w-9 bg-gradient-to-br from-slate-700 to-slate-800 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm">
                                      {userName.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="font-semibold text-slate-900 truncate">
                                        {userName}
                                      </p>
                                      {userEmail && (
                                        <p className="text-xs text-slate-600 truncate">
                                          {userEmail}
                                        </p>
                                      )}
                                    </div>
                                    <Badge
                                      variant="outline"
                                      className="text-xs font-semibold"
                                    >
                                      {participant.role === "HOST"
                                        ? "Organisateur"
                                        : participant.role === "REQUIRED"
                                          ? "Requis"
                                          : "Optionnel"}
                                    </Badge>
                                  </motion.div>
                                );
                              }
                            )}
                          </div>
                        </motion.div>
                      )}
                  </div>
                )}
              </motion.div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  );
}
