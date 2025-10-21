"use client";

import { useState, useEffect } from "react";
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
  Calendar,
  Clock,
  Users,
  MapPin,
  MoreVertical,
  Edit,
  Download,
  Plus,
  CheckCircle2,
  AlertCircle,
  Building2,
  X,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useTenantBookings } from "@/hooks/use-tenant-data";
import { useTenant } from "@/contexts/tenant-context";
import { FeatureGate } from "@/components/feature-gate";
import { TENANT_FEATURES } from "@/types/tenant";

interface Booking {
  id: string;
  title: string;
  description?: string;
  start: string;
  end: string;
  status: string;
  privacy: string;
  room: {
    id: string;
    name: string;
    capacity: number;
    site: {
      name: string;
    };
  };
  participants: Array<{
    userId: string;
    role: string;
  }>;
}

export default function BookingsPage() {
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const { tenant, isLoading: tenantLoading } = useTenant();

  // Utiliser le hook multi-tenant pour récupérer les réservations
  const {
    data: bookings = [],
    isLoading: bookingsLoading,
    error,
  } = useTenantBookings({
    mine: true, // Récupérer seulement les réservations de l'utilisateur connecté
  });

  useEffect(() => {
    // Vérifier s'il y a un ID à mettre en surbrillance
    const highlightId = searchParams.get("highlight");
    if (highlightId) {
      setHighlightedId(highlightId);
      // Supprimer le paramètre de l'URL après 3 secondes
      setTimeout(() => {
        setHighlightedId(null);
        const url = new URL(window.location.href);
        url.searchParams.delete("highlight");
        window.history.replaceState({}, "", url.toString());
      }, 3000);
    }
  }, [searchParams]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (startString: string, endString: string) => {
    const start = new Date(startString);
    const end = new Date(endString);
    return `${start.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })} - ${end.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}`;
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case "pending":
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case "cancelled":
        return <X className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "Confirmé";
      case "pending":
        return "En attente";
      case "cancelled":
        return "Annulé";
      default:
        return status;
    }
  };

  if (tenantLoading || bookingsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "linear",
              }}
              className="h-8 w-8 border-2 border-blue-600 border-t-transparent rounded-full"
            />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <AlertCircle className="h-16 w-16 text-red-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-red-600 mb-2">
              Erreur lors du chargement
            </h3>
            <p className="text-red-500 mb-6">
              Impossible de charger vos réservations. Veuillez réessayer.
            </p>
            <Button onClick={() => window.location.reload()}>Réessayer</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-2">
                Mes Réservations
              </h1>
              <p className="text-slate-600">
                Gérez et consultez toutes vos réservations de salles
                {tenant && (
                  <span className="ml-2 text-sm text-blue-600 font-medium">
                    • {tenant.name}
                  </span>
                )}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <FeatureGate
                feature={TENANT_FEATURES.ADVANCED_REPORTS}
                fallback={null}
              >
                <Button variant="outline" className="h-10">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </FeatureGate>
              <Link href="/bookings/new">
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvelle réservation
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Réservations */}
        {bookings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <Building2 className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-500 mb-2">
              Aucune réservation trouvée
            </h3>
            <p className="text-slate-400 mb-6">
              Créez votre première réservation pour commencer
            </p>
            <Link href="/bookings/new">
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Créer une réservation
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {bookings.map((booking, index) => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`${highlightedId === booking.id ? "ring-2 ring-blue-500 ring-opacity-50" : ""}`}
                >
                  <Card
                    className={`h-full hover:shadow-lg transition-all duration-200 ${
                      highlightedId === booking.id
                        ? "bg-blue-50 border-blue-200"
                        : ""
                    }`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-lg font-semibold text-slate-900 truncate">
                            {booking.title}
                          </CardTitle>
                          <CardDescription className="text-sm text-slate-500 mt-1">
                            {booking.room.name}
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2 ml-2">
                          {getStatusIcon(booking.status)}
                          <span className="text-xs font-medium text-slate-600">
                            {getStatusLabel(booking.status)}
                          </span>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(booking.start)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Clock className="h-4 w-4" />
                          <span>{formatTime(booking.start, booking.end)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <MapPin className="h-4 w-4" />
                          <span>{booking.room.site.name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Users className="h-4 w-4" />
                          <span>
                            {booking.participants.length} participant
                            {booking.participants.length > 1 ? "s" : ""}
                          </span>
                        </div>
                      </div>

                      {booking.description && (
                        <p className="text-sm text-slate-600 line-clamp-2">
                          {booking.description}
                        </p>
                      )}

                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline" className="h-8">
                            <Edit className="h-3 w-3 mr-1" />
                            Modifier
                          </Button>
                          <Button size="sm" variant="outline" className="h-8">
                            <Download className="h-3 w-3 mr-1" />
                            Export
                          </Button>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
