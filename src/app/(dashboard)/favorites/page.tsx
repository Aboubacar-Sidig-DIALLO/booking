"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  Building2,
  Users,
  Search,
  Eye,
  Calendar,
  MapPin,
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
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { Skeleton as BaseSkeleton } from "@/components/common/Skeleton";
import { useFavorites } from "@/hooks/useFavorites";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useRouter } from "next/navigation";

type UiRoom = {
  id: string;
  name: string;
  capacity: number;
  equipment: string[];
  status: "disponible" | "occupée";
  location: string;
  description?: string;
  site?: {
    name: string;
  };
};

const getEquipmentIcon = (equipment: string) => {
  const equipmentMap: Record<string, any> = {
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
  return equipmentMap[equipment] || Monitor;
};

export default function FavoritesPage() {
  const router = useRouter();
  const theme = useThemeColor();
  const [rooms, setRooms] = useState<UiRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { getFavorites, loading: favoritesLoading } = useFavorites();

  // Charger les salles favorites
  useEffect(() => {
    const loadFavoriteRooms = async () => {
      setLoading(true);
      try {
        // Récupérer les IDs des favoris
        const favoritesRes = await fetch("/api/favorites");
        if (!favoritesRes.ok && favoritesRes.status !== 401) {
          throw new Error("Failed to load favorites");
        }

        const favoritesData = favoritesRes.ok
          ? await favoritesRes.json()
          : { roomIds: [] };
        const favoriteRoomIds = favoritesData.roomIds || [];

        if (favoriteRoomIds.length === 0) {
          setRooms([]);
          setLoading(false);
          return;
        }

        // Charger toutes les salles
        const roomsRes = await fetch("/api/rooms");
        const allRooms = await roomsRes.json();

        // Filtrer pour ne garder que les favoris
        const favoriteRooms = allRooms
          .filter((room: any) => favoriteRoomIds.includes(room.id))
          .map((r: any) => ({
            id: r.id,
            name: r.name,
            capacity: r.capacity,
            equipment: (r.features || [])
              .map((f: any) => f.feature?.name)
              .filter(Boolean),
            status: "disponible" as const, // Pour simplifier, on peut améliorer avec un calcul réel
            location: r.location || r.site?.name || "",
            description: r.description || "",
            site: r.site,
          }));

        setRooms(favoriteRooms);
      } catch (error) {
        console.error("Error loading favorite rooms:", error);
        setRooms([]);
      } finally {
        setLoading(false);
      }
    };

    if (!favoritesLoading) {
      loadFavoriteRooms();
    }
  }, [favoritesLoading]);

  // Filtrer et trier les salles favorites
  const filteredRooms = useMemo(() => {
    let filtered = rooms.filter((room) => {
      const matchesSearch =
        room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.location.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });

    // Trier par nom (alphabétique)
    filtered.sort((a, b) => a.name.localeCompare(b.name));

    return filtered;
  }, [rooms, searchTerm]);

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${theme.bgFrom} via-white ${theme.bgTo}`}
    >
      {/* Header moderne avec palette dynamique */}
      <div className={`relative overflow-hidden ${theme.headerBg}`}>
        <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_20%_0%,rgba(255,255,255,0.18),transparent)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(70%_50%_at_100%_10%,rgba(255,255,255,0.08),transparent)]"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
          >
            <div className="space-y-4 w-full">
              {/* Bouton de retour moderne, intelligent et élégant */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mb-4 -ml-1"
              >
                <Button
                  aria-label="Retour à l'accueil"
                  onClick={() => {
                    // Navigation intelligente : vérifie si on peut revenir en arrière
                    if (
                      typeof window !== "undefined" &&
                      window.history.length > 1
                    ) {
                      router.back();
                    } else {
                      // Sinon, redirige vers la page d'accueil
                      router.push("/home");
                    }
                  }}
                  variant="ghost"
                  className="group relative h-9 sm:h-10 px-3 sm:px-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white backdrop-blur-sm transition-all duration-200 cursor-pointer hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] overflow-hidden"
                >
                  {/* Effet de brillance au survol */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />

                  <ArrowLeft className="h-4 w-4 transition-all duration-200 group-hover:-translate-x-0.5 group-hover:scale-110 relative z-10" />
                </Button>
              </motion.div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
                  <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-white fill-current" />
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
                  Mes favoris
                </h1>
              </div>
              <p className={`${theme.textLight} text-lg sm:text-xl max-w-2xl`}>
                Vos salles préférées à portée de clic
              </p>

              {/* Statistiques rapides */}
              {loading ? (
                <div className="flex flex-wrap gap-4 pt-4">
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/20">
                    <BaseSkeleton className="h-4 w-4 rounded-full bg-white/30" />
                    <BaseSkeleton className="h-4 w-24 bg-white/30" />
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/20">
                    <BaseSkeleton className="h-4 w-4 rounded-full bg-white/30" />
                    <BaseSkeleton className="h-4 w-32 bg-white/30" />
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-4 pt-4">
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/20">
                    <Heart className="h-4 w-4 text-slate-300" />
                    <span className="text-white text-sm font-medium">
                      {rooms.length} {rooms.length > 1 ? "favoris" : "favori"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/20">
                    <Users className="h-4 w-4 text-slate-300" />
                    <span className="text-white text-sm font-medium">
                      {rooms.reduce((sum, room) => sum + room.capacity, 0)}{" "}
                      places au total
                    </span>
                  </div>
                </div>
              )}
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Link href="/rooms">
                <Button
                  className={`bg-white/10 backdrop-blur-sm border border-white/20 text-white text-nowrap hover:bg-white/15 shadow-lg hover:shadow-xl h-12 px-6 rounded-xl font-semibold transition-all cursor-pointer`}
                >
                  <Building2 className="h-4 w-4 mr-2" />
                  Explorer les salles
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Section de recherche */}
      {loading || favoritesLoading ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200/60 mb-8"
          >
            <div className="relative">
              <BaseSkeleton className="h-12 w-full rounded-xl bg-slate-200" />
            </div>
          </motion.div>
        </div>
      ) : rooms.length > 0 ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200/60 mb-8"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher dans vos favoris..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 ${theme.focusRing} focus:border-transparent shadow-sm`}
              />
            </div>
          </motion.div>
        </div>
      ) : null}

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {loading || favoritesLoading ? (
          // Skeleton pendant le chargement - structure identique aux cards réelles
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, idx) => (
              <Card
                key={idx}
                className="bg-white/80 backdrop-blur-sm border border-slate-200 shadow-lg rounded-2xl overflow-hidden h-full"
              >
                <CardContent className="p-6">
                  {/* En-tête avec icône, nom, localisation et badge */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <BaseSkeleton className="h-12 w-12 rounded-xl bg-slate-200" />
                      <div className="flex-1 min-w-0">
                        <BaseSkeleton className="h-5 w-32 bg-slate-200 mb-1" />
                        <div className="flex items-center gap-1">
                          <BaseSkeleton className="h-3.5 w-3.5 rounded bg-slate-200" />
                          <BaseSkeleton className="h-4 w-24 bg-slate-200" />
                        </div>
                      </div>
                    </div>
                    <BaseSkeleton className="h-5 w-16 rounded-full bg-slate-200 flex-shrink-0 ml-2" />
                  </div>

                  {/* Description */}
                  <div className="mb-4">
                    <BaseSkeleton className="h-4 w-full bg-slate-200 mb-2" />
                    <BaseSkeleton className="h-4 w-4/5 bg-slate-200" />
                  </div>

                  {/* Capacité */}
                  <div className="bg-slate-50 rounded-lg p-3 mb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <BaseSkeleton className="h-4 w-4 rounded bg-slate-300" />
                      <BaseSkeleton className="h-3 w-16 bg-slate-300" />
                    </div>
                    <BaseSkeleton className="h-6 w-24 bg-slate-300" />
                  </div>

                  {/* Équipements */}
                  <div className="mb-4">
                    <BaseSkeleton className="h-3 w-20 bg-slate-300 mb-2" />
                    <div className="flex flex-wrap gap-2">
                      <BaseSkeleton className="h-6 w-20 rounded-lg bg-slate-200" />
                      <BaseSkeleton className="h-6 w-16 rounded-lg bg-slate-200" />
                      <BaseSkeleton className="h-6 w-24 rounded-lg bg-slate-200" />
                      <BaseSkeleton className="h-6 w-20 rounded-lg bg-slate-200" />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-auto pt-4 border-t border-slate-200">
                    <BaseSkeleton className="h-10 flex-1 rounded-lg bg-slate-200" />
                    <BaseSkeleton className="h-10 flex-1 rounded-lg bg-slate-200" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredRooms.length === 0 && rooms.length > 0 ? (
          // Aucun résultat après filtrage
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center py-16"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-100 rounded-2xl mb-6">
              <Search className="h-10 w-10 text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">
              Aucun résultat
            </h3>
            <p className="text-slate-600 text-lg mb-8 max-w-md mx-auto">
              Aucune salle favorite ne correspond à votre recherche.
            </p>
            <Button
              onClick={() => setSearchTerm("")}
              variant="outline"
              className="border-slate-300 hover:bg-slate-50 cursor-pointer"
            >
              Effacer la recherche
            </Button>
          </motion.div>
        ) : filteredRooms.length === 0 ? (
          // État vide - Aucun favori
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center py-16"
          >
            <div className="relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 bg-slate-100 rounded-full blur-2xl opacity-50"></div>
              </div>
              <div className="relative">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  className={`inline-flex items-center justify-center w-24 h-24 ${theme.iconBg} rounded-2xl shadow-lg mb-6`}
                >
                  <Heart className="h-12 w-12 text-white" />
                </motion.div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  Aucune salle favorite
                </h3>
                <p className="text-slate-600 text-lg mb-8 max-w-md mx-auto">
                  Vous n'avez pas encore de salles favorites. Explorez les
                  salles disponibles et ajoutez celles qui vous intéressent à
                  vos favoris pour y accéder rapidement.
                </p>
                <Link href="/rooms">
                  <Button
                    className={`bg-gradient-to-r ${theme.primaryFrom} ${theme.primaryTo} ${theme.hoverGradientFrom} ${theme.hoverGradientTo} text-white shadow-lg hover:shadow-xl h-12 px-8 rounded-xl font-semibold transition-all cursor-pointer`}
                  >
                    <Building2 className="h-5 w-5 mr-2" />
                    Explorer les salles
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        ) : (
          // Grille des salles favorites
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredRooms.map((room, index) => {
                return (
                  <motion.div
                    key={room.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -4 }}
                    className="group"
                  >
                    <Card className="bg-white/80 backdrop-blur-sm border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden h-full">
                      <CardContent className="p-6">
                        {/* En-tête avec statut */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div
                              className={`h-12 w-12 ${theme.iconBg} rounded-xl flex items-center justify-center shadow-md flex-shrink-0`}
                            >
                              <Building2 className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-bold text-slate-900 mb-1 line-clamp-1">
                                {room.name}
                              </h3>
                              <div className="flex items-center gap-1 text-sm text-slate-600">
                                <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                                <span className="truncate">
                                  {room.location}
                                </span>
                              </div>
                            </div>
                          </div>
                          <Badge className="bg-slate-100 text-slate-800 text-xs flex-shrink-0 ml-2">
                            {room.status}
                          </Badge>
                        </div>

                        {/* Description */}
                        {room.description && (
                          <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                            {room.description}
                          </p>
                        )}

                        {/* Capacité */}
                        <div className="bg-slate-50 rounded-lg p-3 mb-4">
                          <div className="flex items-center gap-2 mb-1">
                            <Users className="h-4 w-4 text-slate-600" />
                            <span className="text-xs font-medium text-slate-700">
                              Capacité
                            </span>
                          </div>
                          <div className="text-lg font-bold text-slate-900">
                            {room.capacity} personne
                            {room.capacity > 1 ? "s" : ""}
                          </div>
                        </div>

                        {/* Équipements */}
                        {room.equipment.length > 0 && (
                          <div className="mb-4">
                            <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">
                              Équipements
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {room.equipment.slice(0, 4).map((item, idx) => {
                                const Icon = getEquipmentIcon(item);
                                return (
                                  <div
                                    key={idx}
                                    className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 text-slate-700 px-2.5 py-1.5 rounded-lg text-xs font-medium"
                                  >
                                    <Icon className="h-3 w-3 text-slate-600" />
                                    <span>{item}</span>
                                  </div>
                                );
                              })}
                              {room.equipment.length > 4 && (
                                <div className="bg-slate-100 border border-slate-200 text-slate-700 px-2.5 py-1.5 rounded-lg text-xs font-medium">
                                  +{room.equipment.length - 4}
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-2 mt-auto pt-4 border-t border-slate-200">
                          <Link href={`/rooms/${room.id}`} className="flex-1">
                            <Button
                              variant="outline"
                              className="w-full border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
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
                              className={`w-full bg-gradient-to-r ${theme.primaryFrom} ${theme.primaryTo} ${theme.hoverGradientFrom} ${theme.hoverGradientTo} text-white shadow-sm hover:shadow-md transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
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
        )}
      </div>
    </div>
  );
}
