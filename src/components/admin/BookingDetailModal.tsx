"use client";

import {
  Eye,
  Calendar,
  Clock,
  Building2,
  Users,
  Edit,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useBooking } from "@/hooks/use-admin-queries";

interface BookingDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
  onEdit: () => void;
  onCancel: () => void;
}

export function BookingDetailModal({
  isOpen,
  onClose,
  bookingId,
  onEdit,
  onCancel,
}: BookingDetailModalProps) {
  const { data: booking, isLoading } = useBooking(bookingId);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-300">
            Confirmée
          </Badge>
        );
      case "PENDING":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
            En attente
          </Badge>
        );
      case "CANCELLED":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-300">
            Annulée
          </Badge>
        );
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl sm:text-2xl">
            <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <Eye className="h-5 w-5 text-white" />
            </div>
            Détails de la réservation
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base mt-2">
            Informations complètes sur cette réservation
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="py-8 text-center">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
          </div>
        ) : booking ? (
          <div className="space-y-6">
            {/* En-tête */}
            <div>
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-slate-900">
                  {booking.title}
                </h3>
                {getStatusBadge(booking.status)}
              </div>
              {booking.description && (
                <p className="text-sm text-slate-600">{booking.description}</p>
              )}
            </div>

            <Separator />

            {/* Informations principales */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Building2 className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-slate-500 mb-1">
                    Salle
                  </p>
                  <p className="text-sm font-medium text-slate-900">
                    {booking.room.name}
                  </p>
                  {booking.room.location && (
                    <p className="text-xs text-slate-600 mt-1">
                      📍 {booking.room.location}
                      {booking.room.floor && ` - Étage ${booking.room.floor}`}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-purple-600 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-slate-500 mb-1">
                    Organisateur
                  </p>
                  <p className="text-sm font-medium text-slate-900">
                    {booking.createdBy.name}
                  </p>
                  <p className="text-xs text-slate-600 mt-1">
                    {booking.createdBy.email}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-indigo-600 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-slate-500 mb-1">
                    Date
                  </p>
                  <p className="text-sm font-medium text-slate-900">
                    {formatDate(booking.start)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-orange-600 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-slate-500 mb-1">
                    Horaires
                  </p>
                  <p className="text-sm font-medium text-slate-900">
                    {formatTime(booking.start)} - {formatTime(booking.end)}
                  </p>
                </div>
              </div>
            </div>

            {/* Participants */}
            {booking.participants.length > 0 && (
              <>
                <Separator />
                <div>
                  <p className="text-xs font-semibold text-slate-500 mb-3">
                    Participants ({booking.participants.length})
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {booking.participants.map((participant) => (
                      <div
                        key={participant.user.id}
                        className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg"
                      >
                        <div className="h-8 w-8 bg-gradient-to-br from-purple-500 to-violet-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-xs font-semibold">
                            {participant.user.name
                              ?.split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase() || "U"}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900 truncate">
                            {participant.user.name || "Utilisateur"}
                          </p>
                          <p className="text-xs text-slate-600 truncate">
                            {participant.user.email}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Actions */}
            <Separator />
            <div className="flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="cursor-pointer"
              >
                Fermer
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onEdit}
                className="cursor-pointer"
              >
                <Edit className="h-4 w-4 mr-2" />
                Modifier
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={onCancel}
                className="cursor-pointer"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Annuler
              </Button>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center text-slate-600">
            Impossible de charger les détails de la réservation
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
