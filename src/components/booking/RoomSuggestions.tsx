"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Users,
  Sparkles,
  CheckCircle,
  Wifi,
  Monitor,
  Coffee,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DateTimeRange } from "@/components/ui/datetime-range-picker";

interface Room {
  id: string;
  name: string;
  capacity: number;
  features: Array<{ feature: { name: string; icon?: string } }>;
  site: { name: string };
  available: boolean;
  matchScore: number;
}

interface RoomSuggestionsProps {
  attendeeCount: number;
  timeRange: DateTimeRange;
  onRoomSelect: (roomId: string) => void;
  selectedRoomId?: string;
  onManualSelection?: () => void;
}

export default function RoomSuggestions({
  attendeeCount,
  timeRange,
  onRoomSelect,
  selectedRoomId,
  onManualSelection,
}: RoomSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSuggestions = useCallback(async () => {
    setLoading(true);
    try {
      // Appel API pour obtenir les suggestions
      const response = await fetch("/api/rooms/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          capacity: attendeeCount,
          start: timeRange.from,
          end: timeRange.to,
        }),
      });
      const data = await response.json();
      setSuggestions(data.rooms || []);
    } catch (error) {
      console.error("Erreur lors de la récupération des suggestions:", error);
    } finally {
      setLoading(false);
    }
  }, [attendeeCount, timeRange.from, timeRange.to]);

  useEffect(() => {
    if (attendeeCount > 0 && timeRange.from && timeRange.to) {
      fetchSuggestions();
    }
  }, [attendeeCount, timeRange.from, timeRange.to, fetchSuggestions]);

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

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return "bg-green-100 text-green-800";
    if (score >= 70) return "bg-blue-100 text-blue-800";
    return "bg-orange-100 text-orange-800";
  };

  const getMatchScoreLabel = (score: number) => {
    if (score >= 90) return "Parfait";
    if (score >= 70) return "Très bien";
    return "Convenable";
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-100">
        <div className="flex items-center space-x-3 mb-4">
          <div className="h-10 w-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-white animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Recherche de salles...
            </h3>
            <p className="text-sm text-slate-600">
              Analyse des disponibilités en cours
            </p>
          </div>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg p-4 animate-pulse">
              <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-slate-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-100">
      <div className="flex items-center space-x-3 mb-6">
        <div className="h-10 w-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            Suggestions intelligentes
          </h3>
          <p className="text-sm text-slate-600">
            {suggestions.length > 3
              ? `3 meilleures suggestions sur ${suggestions.length} salles disponibles`
              : `${suggestions.length} salle${suggestions.length > 1 ? "s" : ""} disponible${suggestions.length > 1 ? "s" : ""}`}{" "}
            pour {attendeeCount} personne{attendeeCount > 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <AnimatePresence>
          {suggestions.slice(0, 3).map((room, index) => (
            <motion.div
              key={room.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white rounded-xl border-2 transition-all duration-200 cursor-pointer hover:shadow-lg ${
                selectedRoomId === room.id
                  ? "border-purple-500 shadow-lg shadow-purple-500/20"
                  : "border-slate-200 hover:border-purple-300"
              }`}
              onClick={() => onRoomSelect(room.id)}
            >
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-semibold text-slate-900">
                        {room.name}
                      </h4>
                      {selectedRoomId === room.id && (
                        <CheckCircle className="h-5 w-5 text-purple-600" />
                      )}
                    </div>
                    <p className="text-sm text-slate-600">{room.site.name}</p>
                  </div>
                  <Badge
                    className={`${getMatchScoreColor(room.matchScore)} text-xs`}
                  >
                    {getMatchScoreLabel(room.matchScore)}
                  </Badge>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-4 text-sm text-slate-600">
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{room.capacity} places</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Building2 className="h-4 w-4" />
                      <span>Disponible</span>
                    </div>
                  </div>
                </div>

                {room.features.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {room.features.slice(0, 4).map((rf, idx) => (
                      <div
                        key={idx}
                        className="flex items-center space-x-1 bg-slate-100 text-slate-700 px-2 py-1 rounded-md text-xs"
                      >
                        {getFeatureIcon(rf.feature.name)}
                        <span>{rf.feature.name}</span>
                      </div>
                    ))}
                    {room.features.length > 4 && (
                      <div className="bg-slate-100 text-slate-700 px-2 py-1 rounded-md text-xs">
                        +{room.features.length - 4} autres
                      </div>
                    )}
                  </div>
                )}

                <Button
                  type="button"
                  variant={selectedRoomId === room.id ? "default" : "outline"}
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRoomSelect(room.id);
                  }}
                  className="w-full"
                >
                  {selectedRoomId === room.id ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Sélectionnée
                    </>
                  ) : (
                    <>
                      Sélectionner cette salle
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {suggestions.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8"
          >
            <Building2 className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h4 className="font-medium text-slate-500 mb-2">
              Aucune salle disponible automatiquement
            </h4>
            <p className="text-sm text-slate-400 mb-6">
              Aucune salle ne correspond parfaitement à vos critères pour ce
              créneau
            </p>
            {onManualSelection && (
              <Button
                onClick={onManualSelection}
                variant="outline"
                className="bg-white hover:bg-slate-50 border-slate-300"
              >
                <Building2 className="h-4 w-4 mr-2" />
                Choisir une salle manuellement
              </Button>
            )}
          </motion.div>
        )}

        {/* Indicateur et bouton pour plus de suggestions */}
        {suggestions.length > 3 && (
          <div className="text-center py-3 border-t border-slate-200">
            <p className="text-sm text-slate-500 mb-3">
              <span className="font-medium">
                {suggestions.length - 3} autres salles
              </span>{" "}
              correspondent également à vos critères
            </p>
          </div>
        )}

        {/* Bouton pour sélection manuelle */}
        {suggestions.length > 0 && onManualSelection && (
          <div className="flex justify-center mt-6">
            <Button
              onClick={onManualSelection}
              variant="outline"
              size="sm"
              className="bg-white hover:bg-slate-50 border-slate-300"
            >
              <Building2 className="h-4 w-4 mr-2" />
              {suggestions.length > 3
                ? `Voir toutes les ${suggestions.length} salles disponibles`
                : "Voir toutes les salles disponibles"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
