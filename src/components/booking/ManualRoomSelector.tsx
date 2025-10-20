"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Building2,
  Users,
  Wifi,
  Monitor,
  Coffee,
  X,
  CheckCircle,
  Star,
  Sparkles,
  TrendingUp,
  Clock,
  Zap,
  Heart,
  Award,
  Lock,
  Calendar,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Room {
  id: string;
  name: string;
  capacity: number;
  location?: string;
  features: Array<{ feature: { name: string; icon?: string } }>;
  site: { name: string };
  matchScore?: number;
  category?: "recommended" | "perfect" | "available" | "large";
  isAvailable?: boolean;
  conflictingBooking?: {
    title: string;
    startTime: string;
    endTime: string;
    status: string;
  } | null;
}

interface ManualRoomSelectorProps {
  onRoomSelect: (roomId: string) => void;
  onClose: () => void;
  selectedRoomId?: string;
  attendeeCount?: number;
  timeRange?: { from: string; to: string };
  showUnavailableByDefault?: boolean;
}

export default function ManualRoomSelector({
  onRoomSelect,
  onClose,
  selectedRoomId,
  attendeeCount = 2,
  timeRange,
  showUnavailableByDefault = true,
}: ManualRoomSelectorProps) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [capacityFilter, setCapacityFilter] = useState<string>("all");
  const [roomsWithAvailability, setRoomsWithAvailability] = useState<Room[]>(
    []
  );
  const [showUnavailable, setShowUnavailable] = useState(
    showUnavailableByDefault
  );
  const [availabilityLoading, setAvailabilityLoading] = useState(false);

  const scoreAndCategorizeRooms = useCallback(
    (roomsData: Room[]): Room[] => {
      return roomsData
        .map((room) => {
          let matchScore = 0;

          // Score basé sur la capacité
          if (room.capacity >= attendeeCount) {
            if (room.capacity <= attendeeCount * 1.2) {
              matchScore += 50; // Taille parfaite
            } else if (room.capacity <= attendeeCount * 1.5) {
              matchScore += 35; // Légèrement trop grande
            } else {
              matchScore += 20; // Trop grande
            }
          }

          // Bonus pour les équipements utiles
          const hasWifi = room.features?.some((rf) =>
            rf.feature.name.toLowerCase().includes("wifi")
          );
          const hasScreen = room.features?.some(
            (rf) =>
              rf.feature.name.toLowerCase().includes("écran") ||
              rf.feature.name.toLowerCase().includes("monitor")
          );

          if (hasWifi) matchScore += 15;
          if (hasScreen) matchScore += 15;

          return {
            ...room,
            matchScore: Math.min(100, matchScore),
          };
        })
        .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
    },
    [attendeeCount]
  );

  const fetchAllRooms = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/rooms");
      const data = await response.json();
      const scoredRooms = scoreAndCategorizeRooms(data || []);
      setRooms(scoredRooms);
    } catch (error) {
      console.error("Erreur lors de la récupération des salles:", error);
    } finally {
      setLoading(false);
    }
  }, [scoreAndCategorizeRooms]);

  const fetchRoomsAvailability = useCallback(async () => {
    if (!timeRange?.from || !timeRange?.to) return;

    setAvailabilityLoading(true);
    try {
      const response = await fetch("/api/rooms/availability", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ timeRange }),
      });
      const data = await response.json();

      const roomsWithScoresAndAvailability = scoreAndCategorizeRooms(
        data || []
      );
      setRoomsWithAvailability(roomsWithScoresAndAvailability);
    } catch (error) {
      console.error("Erreur lors de la vérification de disponibilité:", error);
      setRoomsWithAvailability(rooms);
    } finally {
      setAvailabilityLoading(false);
    }
  }, [timeRange, rooms, scoreAndCategorizeRooms]);

  useEffect(() => {
    fetchAllRooms();
  }, [attendeeCount, fetchAllRooms]);

  useEffect(() => {
    if (timeRange?.from && timeRange?.to) {
      fetchRoomsAvailability();
    }
  }, [timeRange, fetchRoomsAvailability]);

  const getFeatureIcon = (featureName: string) => {
    switch (featureName.toLowerCase()) {
      case "wifi":
        return <Wifi className="h-3 w-3" />;
      case "écran":
      case "monitor":
        return <Monitor className="h-3 w-3" />;
      case "café":
      case "coffee":
        return <Coffee className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const getCategoryInfo = (category: Room["category"]) => {
    switch (category) {
      case "perfect":
        return {
          label: "Parfait",
          icon: Star,
          color: "text-green-600 bg-green-100",
          description: "Taille idéale pour votre groupe",
        };
      case "recommended":
        return {
          label: "Recommandé",
          icon: TrendingUp,
          color: "text-blue-600 bg-blue-100",
          description: "Très bon choix",
        };
      case "large":
        return {
          label: "Grande salle",
          icon: Building2,
          color: "text-orange-600 bg-orange-100",
          description: "Plus grande que nécessaire",
        };
      default:
        return {
          label: "Disponible",
          icon: CheckCircle,
          color: "text-slate-600 bg-slate-100",
          description: "Salle disponible",
        };
    }
  };

  // Générer des suggestions personnalisées
  const getQuickSuggestions = () => {
    const suggestions = [];

    // Meilleure correspondance
    const topMatch = rooms.find(
      (room) => room.matchScore && room.matchScore >= 90
    );
    if (topMatch) {
      suggestions.push({
        room: topMatch,
        type: "top",
        label: "Meilleur choix",
        icon: Award,
        color: "bg-gradient-to-r from-green-500 to-emerald-600",
        description: "Parfaitement adapté à vos besoins",
      });
    }

    // Salle populaire (simulation basée sur la capacité et les équipements)
    const popularRoom = rooms.find(
      (room) =>
        room.features.length >= 2 &&
        room.capacity >= attendeeCount &&
        room.capacity <= attendeeCount * 1.5 &&
        room.id !== topMatch?.id
    );
    if (popularRoom) {
      suggestions.push({
        room: popularRoom,
        type: "popular",
        label: "Populaire",
        icon: Heart,
        color: "bg-gradient-to-r from-pink-500 to-rose-600",
        description: "Souvent choisie pour ce type de réunion",
      });
    }

    // Salle avec équipements premium
    const premiumRoom = rooms.find(
      (room) =>
        room.features.length >= 3 &&
        room.id !== topMatch?.id &&
        room.id !== popularRoom?.id
    );
    if (premiumRoom) {
      suggestions.push({
        room: premiumRoom,
        type: "premium",
        label: "Équipée",
        icon: Zap,
        color: "bg-gradient-to-r from-purple-500 to-indigo-600",
        description: "Nombreux équipements disponibles",
      });
    }

    return suggestions.slice(0, 3);
  };

  const quickSuggestions = getQuickSuggestions();

  // Générer des suggestions supplémentaires
  const getMoreSuggestions = () => {
    const moreSuggestions = [];
    const usedIds = quickSuggestions.map((s) => s.room.id);

    // Salle la plus spacieuse disponible
    const spaciousRoom = rooms.find(
      (room) => room.capacity >= attendeeCount * 2 && !usedIds.includes(room.id)
    );
    if (spaciousRoom) {
      moreSuggestions.push({
        room: spaciousRoom,
        type: "spacious",
        label: "Spacieuse",
        reason: "Pour plus de confort et d'espace",
      });
    }

    // Salle avec le plus d'équipements
    const bestEquippedRoom = rooms
      .filter((room) => !usedIds.includes(room.id))
      .sort((a, b) => b.features.length - a.features.length)[0];
    if (bestEquippedRoom && bestEquippedRoom.features.length > 0) {
      moreSuggestions.push({
        room: bestEquippedRoom,
        type: "equipped",
        label: "Mieux équipée",
        reason: `${bestEquippedRoom.features.length} équipements disponibles`,
      });
    }

    // Salle économique (plus petite mais suffisante)
    const economicRoom = rooms.find(
      (room) =>
        room.capacity >= attendeeCount &&
        room.capacity <= attendeeCount * 1.2 &&
        !usedIds.includes(room.id)
    );
    if (economicRoom && economicRoom.id !== bestEquippedRoom?.id) {
      moreSuggestions.push({
        room: economicRoom,
        type: "economic",
        label: "Optimale",
        reason: "Taille parfaitement adaptée",
      });
    }

    return moreSuggestions.slice(0, 4);
  };

  const [showMoreSuggestions, setShowMoreSuggestions] = useState(false);
  const moreSuggestions = getMoreSuggestions();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Sélection manuelle
            </h3>
            <p className="text-sm text-slate-600">
              {attendeeCount} participant{attendeeCount > 1 ? "s" : ""} •
              Suggestions intelligentes
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-8 w-8 p-0 hover:bg-white/50"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Résumé des critères */}
      <div className="bg-white rounded-lg p-4 mb-4 border border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4 text-blue-600" />
              <span className="font-medium">
                {attendeeCount} participant{attendeeCount > 1 ? "s" : ""}
              </span>
            </div>
            {timeRange && (
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4 text-green-600" />
                <span className="text-slate-600">
                  {new Date(timeRange.from).toLocaleDateString("fr-FR", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                  })}
                </span>
              </div>
            )}
          </div>
          <div className="text-xs text-slate-500">
            {roomsWithAvailability.length > 0
              ? `${roomsWithAvailability.filter((r) => r.isAvailable !== false).length} disponibles sur ${roomsWithAvailability.length} salles`
              : `${rooms.length} salles au total`}
          </div>
        </div>
      </div>

      {/* Suggestions rapides */}
      {quickSuggestions.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <Sparkles className="h-5 w-5 text-amber-500" />
            <h4 className="text-sm font-semibold text-slate-900">
              Suggestions pour vous
            </h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {quickSuggestions.map((suggestion, index) => {
              const SuggestionIcon = suggestion.icon;
              return (
                <motion.div
                  key={suggestion.room.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative overflow-hidden rounded-xl border-2 transition-all duration-200 cursor-pointer hover:shadow-lg ${
                    selectedRoomId === suggestion.room.id
                      ? "border-blue-500 shadow-lg shadow-blue-500/20"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                  onClick={() => onRoomSelect(suggestion.room.id)}
                >
                  {/* Badge de suggestion */}
                  <div
                    className={`${suggestion.color} text-white px-3 py-1 text-xs font-medium flex items-center space-x-1`}
                  >
                    <SuggestionIcon className="h-3 w-3" />
                    <span>{suggestion.label}</span>
                  </div>

                  <div className="p-4 bg-white">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h5 className="font-semibold text-slate-900 text-sm mb-1">
                          {suggestion.room.name}
                        </h5>
                        <p className="text-xs text-slate-600 mb-2">
                          {suggestion.description}
                        </p>
                      </div>
                      {selectedRoomId === suggestion.room.id && (
                        <CheckCircle className="h-4 w-4 text-blue-600 flex-shrink-0 ml-2" />
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 text-xs text-slate-600">
                        <div className="flex items-center space-x-1">
                          <Users className="h-3 w-3" />
                          <span>{suggestion.room.capacity}</span>
                        </div>
                        {suggestion.room.matchScore && (
                          <div className="flex items-center space-x-1">
                            <Star className="h-3 w-3 text-amber-500" />
                            <span className="text-amber-600 font-medium">
                              {suggestion.room.matchScore}%
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Équipements */}
                    {suggestion.room.features.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {suggestion.room.features.slice(0, 3).map((rf, idx) => (
                          <div
                            key={idx}
                            className="flex items-center space-x-1 bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs"
                          >
                            {getFeatureIcon(rf.feature.name)}
                            <span className="hidden sm:inline">
                              {rf.feature.name}
                            </span>
                          </div>
                        ))}
                        {suggestion.room.features.length > 3 && (
                          <div className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs">
                            +{suggestion.room.features.length - 3}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* En-tête moderne et épuré */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h4 className="text-xl font-bold text-slate-900 mb-2">
              Choisir une salle
            </h4>
            <div className="flex items-center space-x-4 text-sm text-slate-600">
              <span className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>
                  {attendeeCount} personne{attendeeCount > 1 ? "s" : ""}
                </span>
              </span>
              {timeRange && (
                <span className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>
                    {new Date(timeRange.from).toLocaleDateString("fr-FR", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                </span>
              )}
              <span className="text-slate-400">•</span>
              <span className="font-medium">
                {roomsWithAvailability.length > 0
                  ? `${roomsWithAvailability.filter((r) => r.isAvailable !== false).length} disponibles`
                  : `${rooms.length} salles`}
              </span>
            </div>
          </div>
        </div>

        {/* Filtres modernes en ligne */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Filtres de suggestion */}
          <div className="flex items-center space-x-2">
            {[
              { value: "all", label: "Toutes", icon: "🏢" },
              { value: "perfect", label: "Parfaites", icon: "⭐" },
              { value: "recommended", label: "Recommandées", icon: "👍" },
            ].map(({ value, label, icon }) => (
              <button
                key={value}
                onClick={() => setSelectedCategory(value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedCategory === value
                    ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25"
                    : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
                }`}
              >
                <span className="mr-1">{icon}</span>
                {label}
              </button>
            ))}
          </div>

          <div className="w-px h-6 bg-slate-200"></div>

          {/* Filtres de capacité */}
          <div className="flex items-center space-x-2">
            {[
              { value: "all", label: "Toutes", icon: "📊" },
              { value: "exact", label: `~${attendeeCount}`, icon: "🎯" },
              { value: "small", label: "≤8", icon: "👥" },
              { value: "medium", label: "9-16", icon: "👨‍👩‍👧‍👦" },
              { value: "large", label: "16+", icon: "🏛️" },
            ].map(({ value, label, icon }) => (
              <button
                key={value}
                onClick={() => setCapacityFilter(value)}
                className={`px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  capacityFilter === value
                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/25"
                    : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
                }`}
              >
                <span className="mr-1">{icon}</span>
                {label}
              </button>
            ))}
          </div>

          <div className="flex-1"></div>

          {/* Toggle occupées */}
          <button
            onClick={() => setShowUnavailable(!showUnavailable)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              showUnavailable
                ? "bg-slate-100 text-slate-700"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {showUnavailable ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
            <span>
              {showUnavailable ? "Masquer occupées" : "Voir occupées"}
            </span>
          </button>
        </div>

        {/* Légende moderne et discrète */}
        {timeRange?.from && timeRange?.to && (
          <div className="flex items-center justify-center space-x-8 mt-6 py-3">
            <div className="flex items-center space-x-2 text-sm text-slate-600">
              <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
              <span>Disponible</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-slate-600">
              <div className="w-2 h-2 bg-red-400 rounded-full"></div>
              <span>Occupée</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-slate-600">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>Sélectionnée</span>
            </div>
          </div>
        )}
      </div>

      {/* Grille des salles */}
      <div className="space-y-4">
        {loading || availabilityLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-4 border border-slate-200 animate-pulse"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="h-5 bg-slate-200 rounded-lg w-2/3"></div>
                  <div className="h-4 w-4 bg-slate-200 rounded-full"></div>
                </div>
                <div className="h-3 bg-slate-200 rounded w-1/2 mb-4"></div>
                <div className="flex justify-center mb-4">
                  <div className="h-8 bg-slate-200 rounded-full w-20"></div>
                </div>
                <div className="flex justify-center space-x-2 mb-4">
                  <div className="h-6 bg-slate-200 rounded-full w-12"></div>
                  <div className="h-6 bg-slate-200 rounded-full w-12"></div>
                </div>
                <div className="h-10 bg-slate-200 rounded-xl w-full"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {(() => {
              const roomsToDisplay =
                roomsWithAvailability.length > 0
                  ? roomsWithAvailability
                  : rooms;

              const filteredRooms = roomsToDisplay.filter((room) => {
                const matchesCategory =
                  selectedCategory === "all" ||
                  room.category === selectedCategory;

                let matchesCapacity = true;
                if (capacityFilter === "small")
                  matchesCapacity = room.capacity <= 8;
                else if (capacityFilter === "medium")
                  matchesCapacity = room.capacity > 8 && room.capacity <= 16;
                else if (capacityFilter === "large")
                  matchesCapacity = room.capacity > 16;
                else if (capacityFilter === "exact")
                  matchesCapacity =
                    room.capacity >= attendeeCount &&
                    room.capacity <= attendeeCount * 1.5;

                const matchesAvailability =
                  showUnavailable || room.isAvailable !== false;

                return (
                  matchesCategory && matchesCapacity && matchesAvailability
                );
              });

              if (filteredRooms.length === 0) {
                return (
                  <div className="text-center py-12">
                    <Building2 className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                    <h4 className="font-medium text-slate-500 mb-2">
                      Aucune salle trouvée
                    </h4>
                    <p className="text-sm text-slate-400">
                      Essayez de modifier vos critères de recherche
                    </p>
                  </div>
                );
              }

              return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredRooms.map((room, index) => {
                    const isSelected = selectedRoomId === room.id;
                    const isAvailable = room.isAvailable !== false;
                    const hasConflict = room.conflictingBooking;

                    return (
                      <motion.div
                        key={room.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.02 }}
                        className={`group relative bg-white rounded-2xl border transition-all duration-300 hover:shadow-lg h-80 flex flex-col ${
                          isSelected
                            ? "border-blue-400 shadow-xl shadow-blue-500/20 ring-4 ring-blue-500/10"
                            : isAvailable
                              ? "border-slate-200 hover:border-emerald-300 cursor-pointer hover:-translate-y-1"
                              : "border-red-200 bg-gradient-to-br from-red-50 to-red-100/50 cursor-not-allowed opacity-75"
                        }`}
                        onClick={() => isAvailable && onRoomSelect(room.id)}
                      >
                        {/* Badge de statut moderne */}
                        <div className="absolute -top-2 -right-2 z-10">
                          {isSelected ? (
                            <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                              <CheckCircle className="h-4 w-4 text-white" />
                            </div>
                          ) : isAvailable ? (
                            <div className="w-4 h-4 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-full shadow-md"></div>
                          ) : (
                            <div className="w-6 h-6 bg-gradient-to-br from-red-400 to-red-500 rounded-full flex items-center justify-center shadow-lg">
                              <Lock className="h-3 w-3 text-white" />
                            </div>
                          )}
                        </div>

                        <div className="p-4 flex flex-col h-full">
                          {/* En-tête moderne */}
                          <div className="mb-3">
                            <div className="flex items-start justify-between mb-1">
                              <h4
                                className={`font-bold text-base truncate ${isAvailable ? "text-slate-900" : "text-slate-600"}`}
                              >
                                {room.name}
                              </h4>
                              {/* Score de compatibilité en badge */}
                              {room.matchScore &&
                                room.matchScore > 0 &&
                                isAvailable && (
                                  <div className="flex items-center space-x-1 bg-amber-100 text-amber-700 px-2 py-1 rounded-full text-xs font-semibold">
                                    <Star className="h-3 w-3" />
                                    <span>{room.matchScore}%</span>
                                  </div>
                                )}
                            </div>
                            <p
                              className={`text-sm ${isAvailable ? "text-slate-500" : "text-slate-400"}`}
                            >
                              📍 {room.site.name}
                            </p>
                          </div>

                          {/* Zone de statut avec hauteur fixe */}
                          <div className="h-16 mb-3 flex items-center justify-center">
                            {hasConflict ? (
                              <div className="w-full p-2 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg flex items-center justify-center">
                                <div className="flex flex-col items-center justify-center space-y-1">
                                  <div className="flex items-center space-x-2">
                                    <Calendar className="h-3 w-3 text-red-500" />
                                    <span className="text-xs font-semibold text-red-700">
                                      Occupée actuellement
                                    </span>
                                  </div>
                                  <p className="text-xs text-red-600 truncate">
                                    📅 {hasConflict.title}
                                  </p>
                                </div>
                              </div>
                            ) : (
                              <div
                                className={`flex items-center space-x-2 px-3 py-2 rounded-full ${
                                  isAvailable
                                    ? "bg-emerald-100 text-emerald-700"
                                    : "bg-slate-50 text-slate-500"
                                }`}
                              >
                                <CheckCircle className="h-4 w-4" />
                                <span className="text-sm font-medium">
                                  Disponible
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Capacité avec style moderne */}
                          <div className="flex items-center justify-center mb-3">
                            <div
                              className={`flex items-center space-x-2 px-4 py-2 rounded-full ${
                                isAvailable
                                  ? "bg-slate-100 text-slate-700"
                                  : "bg-slate-50 text-slate-500"
                              }`}
                            >
                              <Users className="h-4 w-4" />
                              <span className="font-semibold">
                                {room.capacity}
                              </span>
                              <span className="text-sm">places</span>
                            </div>
                          </div>

                          {/* Équipements avec emojis - espace flexible */}
                          <div className="flex-1 flex items-center justify-center mb-4">
                            {room.features.length > 0 ? (
                              <div className="flex flex-wrap justify-center gap-1">
                                {room.features.slice(0, 3).map((rf, idx) => (
                                  <div
                                    key={idx}
                                    className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${
                                      isAvailable
                                        ? "bg-slate-100 text-slate-600"
                                        : "bg-slate-50 text-slate-400"
                                    }`}
                                  >
                                    {getFeatureIcon(rf.feature.name)}
                                    <span className="font-medium">
                                      {rf.feature.name}
                                    </span>
                                  </div>
                                ))}
                                {room.features.length > 3 && (
                                  <div
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                                      isAvailable
                                        ? "bg-slate-100 text-slate-600"
                                        : "bg-slate-50 text-slate-400"
                                    }`}
                                  >
                                    +{room.features.length - 3}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="text-xs text-slate-400">
                                Aucun équipement
                              </div>
                            )}
                          </div>

                          {/* Bouton d'action moderne - toujours en bas */}
                          <button
                            type="button"
                            disabled={!isAvailable}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (isAvailable) onRoomSelect(room.id);
                            }}
                            className={`w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                              isSelected
                                ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25"
                                : isAvailable
                                  ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:shadow-lg hover:shadow-emerald-500/25 group-hover:scale-105"
                                  : "bg-slate-200 text-slate-500 cursor-not-allowed"
                            }`}
                          >
                            {isSelected ? (
                              <span className="flex items-center justify-center space-x-2">
                                <CheckCircle className="h-4 w-4" />
                                <span>Sélectionnée</span>
                              </span>
                            ) : isAvailable ? (
                              <span className="flex items-center justify-center space-x-2">
                                <span>Sélectionner</span>
                                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                              </span>
                            ) : (
                              <span className="flex items-center justify-center space-x-2">
                                <Lock className="h-4 w-4" />
                                <span>Occupée</span>
                              </span>
                            )}
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              );
            })()}
          </>
        )}
      </div>
    </motion.div>
  );
}
