"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Calendar,
  Plus,
  Trash2,
  Clock,
  Users,
  AlertCircle,
  CheckCircle,
  XCircle,
  Building2,
  Eye,
  Edit,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  useAdminBookings,
  useCancelBooking,
  useUpdateBooking,
  useAdminRooms,
} from "@/hooks/use-admin-queries";
import { EmptyState } from "@/components/admin/EmptyState";
import { BookingDetailModal } from "./BookingDetailModal";
import { BookingEditModal } from "./BookingEditModal";
import { ConfirmationModal } from "./ConfirmationModal";
import { BookingSkeleton } from "./BookingSkeleton";
import { BookingFilterSidebar } from "./BookingFilterSidebar";

export function BookingManagement() {
  const router = useRouter();
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [roomSearch, setRoomSearch] = useState("");
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(
    null
  );
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const { data: bookings = [], isLoading: isLoadingBookings } =
    useAdminBookings(selectedStatus === "all" ? undefined : selectedStatus);
  const { data: rooms = [] } = useAdminRooms();

  const cancelBookingMutation = useCancelBooking();
  const updateBookingMutation = useUpdateBooking();

  const handleCancelBooking = async (id: string) => {
    try {
      await cancelBookingMutation.mutateAsync(id);
      setShowCancelConfirm(false);
      setSelectedBookingId(null);
    } catch (error) {
      // L'erreur est déjà gérée par la mutation
    }
  };

  const handleNewBooking = () => {
    router.push("/bookings/new");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-300">
            <CheckCircle className="h-3 w-3 mr-1" />
            Confirmée
          </Badge>
        );
      case "PENDING":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
            <Clock className="h-3 w-3 mr-1" />
            En attente
          </Badge>
        );
      case "CANCELLED":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-300">
            <XCircle className="h-3 w-3 mr-1" />
            Annulée
          </Badge>
        );
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isUpcoming = (start: string) => {
    return new Date(start) > new Date();
  };

  const isActive = (start: string, end: string) => {
    const now = new Date();
    return new Date(start) <= now && new Date(end) >= now;
  };

  const visibleBookings = (bookings || []).filter((b: any) =>
    roomSearch.trim()
      ? (b.room?.name || "")
          .toLowerCase()
          .includes(roomSearch.trim().toLowerCase())
      : true
  );

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
        {/* Filtres sur le côté */}
        <div className="lg:col-span-3">
          <BookingFilterSidebar
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
            bookings={bookings}
          />
        </div>

        {/* Liste des réservations */}
        <div className="lg:col-span-9">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                <div className="flex-1 min-w-0">
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-600" />
                    Réservations
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm mt-1">
                    {selectedStatus === "all"
                      ? "Toutes les réservations"
                      : `Réservations ${selectedStatus.toLowerCase()}`}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <div className="relative w-full sm:w-72">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Search className="h-4 w-4 text-slate-400" />
                    </div>
                    <Input
                      value={roomSearch}
                      onChange={(e) => setRoomSearch(e.target.value)}
                      placeholder="Rechercher par salle..."
                      className="pl-9 h-9 rounded-xl bg-white/80 backdrop-blur border-slate-200 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:border-transparent transition-shadow shadow-sm focus-visible:shadow-md"
                    />
                    {roomSearch && (
                      <button
                        type="button"
                        onClick={() => setRoomSearch("")}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 rounded-md p-1"
                        aria-label="Effacer la recherche"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                  {bookings.length > 0 && (
                    <Button
                      onClick={handleNewBooking}
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white cursor-pointer"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Nouvelle réservation
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingBookings ? (
                <BookingSkeleton />
              ) : visibleBookings.length === 0 ? (
                <EmptyState
                  icon={Calendar}
                  title={`Aucune réservation ${selectedStatus !== "all" ? selectedStatus.toLowerCase() : ""}`}
                  description="Il n'y a aucune réservation à afficher pour le moment."
                  action={
                    <Button
                      onClick={handleNewBooking}
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Créer une réservation
                    </Button>
                  }
                />
              ) : (
                <div className="space-y-3">
                  {visibleBookings.map((booking, index) => (
                    <motion.div
                      key={booking.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-4 border border-slate-200 rounded-lg hover:shadow-md transition-shadow bg-white"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start gap-3 mb-2">
                            <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Calendar className="h-5 w-5 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <h4 className="font-semibold text-slate-900 truncate">
                                  {booking.title}
                                </h4>
                                {getStatusBadge(booking.status)}
                                {(isUpcoming(booking.start) ||
                                  isActive(booking.start, booking.end)) && (
                                  <Badge
                                    className={`${
                                      isActive(booking.start, booking.end)
                                        ? "bg-green-100 text-green-800 border-green-300"
                                        : "bg-blue-100 text-blue-800 border-blue-300"
                                    }`}
                                  >
                                    <AlertCircle className="h-3 w-3 mr-1" />
                                    {isActive(booking.start, booking.end)
                                      ? "En cours"
                                      : "À venir"}
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-4 text-xs sm:text-sm text-slate-600 flex-wrap">
                                <div className="flex items-center gap-1">
                                  <Building2 className="h-3.5 w-3.5" />
                                  <span>{booking.room.name}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3.5 w-3.5" />
                                  <span>
                                    {formatTime(booking.start)} -{" "}
                                    {formatTime(booking.end)}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3.5 w-3.5" />
                                  <span>{formatDate(booking.start)}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Users className="h-3.5 w-3.5" />
                                  <span>
                                    {booking.participants.length + 1}{" "}
                                    participant
                                    {booking.participants.length > 0 ? "s" : ""}
                                  </span>
                                </div>
                              </div>
                              {booking.description && (
                                <p className="text-xs text-slate-500 mt-2 line-clamp-2">
                                  {booking.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedBookingId(booking.id);
                                    setShowDetailModal(true);
                                  }}
                                  className="h-8 w-8 p-0 cursor-pointer hover:bg-blue-50"
                                >
                                  <Eye className="h-4 w-4 text-blue-500" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Voir les détails</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedBookingId(booking.id);
                                    setShowEditModal(true);
                                  }}
                                  className="h-8 w-8 p-0 cursor-pointer hover:bg-orange-50"
                                >
                                  <Edit className="h-4 w-4 text-orange-500" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Modifier</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedBookingId(booking.id);
                                    setShowCancelConfirm(true);
                                  }}
                                  className="h-8 w-8 p-0 cursor-pointer hover:bg-red-50"
                                >
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Annuler la réservation</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modales */}
      {selectedBookingId && (
        <>
          <BookingDetailModal
            isOpen={showDetailModal}
            onClose={() => {
              setShowDetailModal(false);
              setSelectedBookingId(null);
            }}
            bookingId={selectedBookingId}
            onEdit={() => {
              setShowDetailModal(false);
              setShowEditModal(true);
            }}
            onCancel={() => {
              setShowDetailModal(false);
              setShowCancelConfirm(true);
            }}
          />

          <BookingEditModal
            isOpen={showEditModal}
            onClose={() => {
              setShowEditModal(false);
              setSelectedBookingId(null);
            }}
            onSubmit={async (data) => {
              try {
                await updateBookingMutation.mutateAsync({
                  id: selectedBookingId,
                  ...data,
                });
                setShowEditModal(false);
                setSelectedBookingId(null);
              } catch (error) {
                // L'erreur est déjà gérée par la mutation
              }
            }}
            bookingId={selectedBookingId}
            rooms={rooms}
            isLoading={updateBookingMutation.isPending}
          />

          <ConfirmationModal
            isOpen={showCancelConfirm}
            onClose={() => {
              setShowCancelConfirm(false);
              setSelectedBookingId(null);
            }}
            onConfirm={() => handleCancelBooking(selectedBookingId)}
            title="Annuler la réservation"
            description="Êtes-vous sûr de vouloir annuler cette réservation ? Cette action enverra une notification à l'utilisateur."
            type="cancel"
            isLoading={cancelBookingMutation.isPending}
          />
        </>
      )}
    </>
  );
}
