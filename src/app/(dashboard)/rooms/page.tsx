"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  Plus,
  Search,
  Filter,
  Building2,
  Heart,
  Eye,
  MoreVertical,
  SortAsc,
  SortDesc,
  List,
  Grid,
  MapPin,
  CheckCircle2,
  AlertCircle,
  X,
  Wifi,
  Monitor,
  Coffee,
  Volume2,
  Calendar,
  Tv,
  Mic,
  Camera,
  Projector,
  AirVent,
  Lightbulb,
} from "lucide-react";
import Link from "next/link";
import { Skeleton as BaseSkeleton } from "@/components/common/Skeleton";
import { useRouter } from "next/navigation";
import { useFavorites } from "@/hooks/useFavorites";
import { useThemeColor } from "@/hooks/useThemeColor";

type UiRoom = {
  id: string | number;
  name: string;
  capacity: number;
  equipment: string[];
  status: "disponible" | "occupée" | string;
  nextBooking?: string;
  location: string;
  type: string;
  occupancy?: number;
  isFavorite?: boolean;
  rating?: number;
  description?: string;
};

const getStatusConfig = (status: string) => {
  switch (status) {
    case "disponible":
      return {
        icon: CheckCircle2,
        variant: "success" as const,
        color: "bg-gradient-to-r from-slate-600 to-slate-700",
        textColor: "text-white",
        bgColor: "bg-slate-50",
        borderColor: "border-slate-200",
        label: "Disponible",
      };
    case "occupée":
      return {
        icon: AlertCircle,
        variant: "warning" as const,
        color: "bg-gradient-to-r from-slate-400 to-slate-500",
        textColor: "text-white",
        bgColor: "bg-slate-50",
        borderColor: "border-slate-200",
        label: "Occupée",
      };
    default:
      return {
        icon: AlertCircle,
        variant: "secondary" as const,
        color: "bg-gradient-to-r from-slate-500 to-slate-600",
        textColor: "text-white",
        bgColor: "bg-slate-50",
        borderColor: "border-slate-200",
        label: status,
      };
  }
};

const getTypeConfig = (type: string) => {
  switch (type) {
    case "conférence":
      return { color: "bg-slate-100 text-slate-800", icon: "🎯" };
    case "réunion":
      return { color: "bg-slate-100 text-slate-800", icon: "👥" };
    case "atelier":
      return { color: "bg-slate-100 text-slate-800", icon: "🎨" };
    case "formation":
      return { color: "bg-slate-100 text-slate-800", icon: "📚" };
    case "vip":
      return { color: "bg-slate-100 text-slate-800", icon: "⭐" };
    case "téléconférence":
      return { color: "bg-slate-100 text-slate-800", icon: "📹" };
    default:
      return { color: "bg-slate-100 text-slate-800", icon: "🏢" };
  }
};

const getEquipmentIcon = (equipment: string) => {
  const equipmentMap: {
    [key: string]: {
      icon: any;
      color: string;
      bgColor: string;
      borderColor: string;
      description: string;
    };
  } = {
    Écran: {
      icon: Monitor,
      color: "text-slate-600",
      bgColor: "bg-slate-50",
      borderColor: "border-slate-200",
      description: "Écran haute résolution",
    },
    WiFi: {
      icon: Wifi,
      color: "text-slate-600",
      bgColor: "bg-slate-50",
      borderColor: "border-slate-200",
      description: "Connexion internet haut débit",
    },
    Projecteur: {
      icon: Projector,
      color: "text-slate-600",
      bgColor: "bg-slate-50",
      borderColor: "border-slate-200",
      description: "Projecteur HD",
    },
    Café: {
      icon: Coffee,
      color: "text-slate-600",
      bgColor: "bg-slate-50",
      borderColor: "border-slate-200",
      description: "Machine à café",
    },
    Caméra: {
      icon: Camera,
      color: "text-slate-600",
      bgColor: "bg-slate-50",
      borderColor: "border-slate-200",
      description: "Caméra HD",
    },
    Micro: {
      icon: Mic,
      color: "text-slate-600",
      bgColor: "bg-slate-50",
      borderColor: "border-slate-200",
      description: "Microphone professionnel",
    },
    Sonorisation: {
      icon: Volume2,
      color: "text-slate-600",
      bgColor: "bg-slate-50",
      borderColor: "border-slate-200",
      description: "Système audio",
    },
    TV: {
      icon: Tv,
      color: "text-slate-600",
      bgColor: "bg-slate-50",
      borderColor: "border-slate-200",
      description: "Téléviseur 4K",
    },
    Climatisation: {
      icon: AirVent,
      color: "text-slate-600",
      bgColor: "bg-slate-50",
      borderColor: "border-slate-200",
      description: "Climatisation réversible",
    },
    "Éclairage LED": {
      icon: Lightbulb,
      color: "text-slate-600",
      bgColor: "bg-slate-50",
      borderColor: "border-slate-200",
      description: "Éclairage LED dimmable",
    },
    "Tableau blanc": {
      icon: Calendar,
      color: "text-slate-600",
      bgColor: "bg-slate-50",
      borderColor: "border-slate-200",
      description: "Tableau blanc interactif",
    },
  };

  return (
    equipmentMap[equipment] || {
      icon: Monitor,
      color: "text-slate-600",
      bgColor: "bg-slate-50",
      borderColor: "border-slate-200",
      description: "Équipement disponible",
    }
  );
};

export default function RoomsPage() {
  const router = useRouter();
  const theme = useThemeColor();
  const [dbRooms, setDbRooms] = useState<UiRoom[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [capacityFilter, setCapacityFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "capacity">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [hoveredEquipment, setHoveredEquipment] = useState<string | null>(null);

  // Gestion des favoris
  const {
    isFavorite,
    toggleFavorite,
    favoritesCount,
    loading: favoritesLoading,
  } = useFavorites();

  // Charger depuis la base - ATTENDRE que les favoris soient chargés avant d'afficher
  useEffect(() => {
    const load = async () => {
      // Ne charger les salles que si les favoris sont déjà chargés ou si on attend
      if (favoritesLoading) {
        // Attendre que les favoris soient chargés
        return;
      }

      setLoading(true);
      try {
        const res = await fetch("/api/rooms");
        const data = await res.json();

        // Maintenant que les favoris sont chargés, on peut utiliser isFavorite avec certitude
        const mapped: UiRoom[] = (data || []).map((r: any) => ({
          id: r.id,
          name: r.name,
          capacity: r.capacity,
          equipment: (r.features || [])
            .map((f: any) => f.feature?.name)
            .filter(Boolean),
          status: "disponible",
          nextBooking: undefined,
          location: r.location || r.site?.name || "",
          type: "réunion",
          occupancy: undefined,
          isFavorite: isFavorite(r.id), // Les favoris sont maintenant chargés, statut garanti
          rating: undefined,
          description: r.description || "",
        }));
        setDbRooms(mapped);
      } catch (e) {
        setDbRooms([]);
      } finally {
        setLoading(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [favoritesLoading]); // Dépend de favoritesLoading pour s'exécuter quand les favoris sont prêts

  // Filtrer et trier les salles
  const filteredAndSortedRooms = useMemo(() => {
    let filtered = dbRooms.filter((room) => {
      const statusMatch =
        statusFilter === "all" || room.status === statusFilter;
      const typeMatch = typeFilter === "all" || room.type === typeFilter;
      const capacityMatch =
        capacityFilter === "all" ||
        (capacityFilter === "small" && room.capacity <= 6) ||
        (capacityFilter === "medium" &&
          room.capacity > 6 &&
          room.capacity <= 12) ||
        (capacityFilter === "large" && room.capacity > 12);
      const searchMatch =
        searchQuery === "" ||
        room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.location?.toLowerCase().includes(searchQuery.toLowerCase());

      return statusMatch && typeMatch && capacityMatch && searchMatch;
    });

    // Trier les résultats
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "capacity":
          comparison = a.capacity - b.capacity;
          break;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [
    statusFilter,
    typeFilter,
    capacityFilter,
    searchQuery,
    sortBy,
    sortOrder,
    dbRooms,
  ]);

  const clearFilters = () => {
    setStatusFilter("all");
    setTypeFilter("all");
    setCapacityFilter("all");
    setSearchQuery("");
  };

  const hasActiveFilters =
    statusFilter !== "all" ||
    typeFilter !== "all" ||
    capacityFilter !== "all" ||
    searchQuery !== "";

  const handleToggleFavorite = async (
    id: string | number,
    e?: React.MouseEvent
  ) => {
    e?.preventDefault();
    e?.stopPropagation();

    // Mise à jour optimiste immédiate pour une réactivité fluide
    const currentStatus = isFavorite(id);
    const newFavoriteStatus = !currentStatus;

    // Mettre à jour immédiatement pour un feedback instantané
    setDbRooms((prev) =>
      prev.map((room) =>
        room.id === id ? { ...room, isFavorite: newFavoriteStatus } : room
      )
    );

    // Appeler l'API pour persister le changement de manière asynchrone
    // Le hook useFavorites gère déjà la mise à jour optimiste et le rollback en cas d'erreur
    toggleFavorite(id).catch((error) => {
      // En cas d'erreur, le hook rollback automatiquement, mais on force une mise à jour
      console.error("Error toggling favorite:", error);
      setDbRooms((prev) =>
        prev.map((room) => ({
          ...room,
          isFavorite: isFavorite(room.id),
        }))
      );
    });
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${theme.bgFrom} via-white ${theme.bgTo}`}
    >
      {/* Header moderne, élégant, avec espaces optimisés */}
      <div className={`relative overflow-hidden ${theme.headerBg}`}>
        <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_20%_0%,rgba(255,255,255,0.18),transparent)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(70%_50%_at_100%_10%,rgba(255,255,255,0.08),transparent)]"></div>

        {/* Ligne douce en bas pour une séparation élégante */}
        <div className="absolute inset-x-0 bottom-0 h-4 bg-white/0 [mask-image:linear-gradient(to_top,white,transparent)]"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="min-w-0">
                <div className="mb-2 -ml-1">
                  <Button
                    aria-label="Retour"
                    onClick={() => router.back()}
                    variant="outline"
                    className="h-8 sm:h-9 px-2.5 rounded-lg bg-white/10 border-white/20 text-white hover:bg-white/15 transition cursor-pointer hover:cursor-pointer"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                    >
                      <path d="M15 18l-6-6 6-6" />
                    </svg>
                  </Button>
                </div>

                <h1 className="font-bold tracking-tight text-white text-[clamp(1.65rem,2.5vw,2.75rem)] leading-tight">
                  Nos salles
                </h1>
                <p
                  className={`mt-1 ${theme.textLight} text-sm sm:text-base max-w-xl`}
                >
                  Découvrez et réservez des espaces confortables, lumineux et
                  parfaitement équipés.
                </p>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className={`h-9 sm:h-10 px-3 sm:px-4 rounded-xl bg-white/10 border-white/20 text-white hover:bg-white/15 transition cursor-pointer hover:cursor-pointer ${
                    showFilters ? "bg-white/15" : ""
                  }`}
                >
                  <Filter className="h-4 w-4 mr-1.5" />
                  <span className="hidden sm:inline">Filtres</span>
                </Button>
              </div>
            </div>

            {/* Statistiques compactes et respirantes */}
            {loading ? (
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 bg-white/10"
                  >
                    <BaseSkeleton className="h-3.5 w-3.5 rounded-full bg-white/30" />
                    <BaseSkeleton className="h-3.5 w-24 sm:w-28 bg-white/30" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-1.5 sm:gap-2 text-[12px] sm:text-[13px]">
                <div className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 bg-white/10 text-white/90">
                  <CheckCircle2 className="h-3.5 w-3.5 text-slate-300" />
                  <span>
                    {dbRooms.filter((r) => r.status === "disponible").length}{" "}
                    disponibles
                  </span>
                </div>
                <div className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 bg-white/10 text-white/90">
                  <AlertCircle className="h-3.5 w-3.5 text-slate-300" />
                  <span>
                    {dbRooms.filter((r) => r.status === "occupée").length}{" "}
                    occupées
                  </span>
                </div>
                <div className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 bg-white/10 text-white/90">
                  <Users className="h-3.5 w-3.5 text-slate-300" />
                  <span>
                    {dbRooms.reduce((sum, r) => sum + (r.capacity || 0), 0)}{" "}
                    places au total
                  </span>
                </div>
                <div className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 bg-white/10 text-white/90">
                  <Heart className="h-3.5 w-3.5 text-slate-300" />
                  <span>{favoritesCount} favoris</span>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Barre de recherche et contrôles */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {loading ? (
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-md w-full">
                <BaseSkeleton className="h-10 w-full rounded-xl bg-slate-200" />
              </div>
              <div className="flex items-center gap-3 w-full lg:w-auto">
                <div className="flex items-center gap-2">
                  <BaseSkeleton className="h-9 w-24 rounded-lg bg-slate-200" />
                  <BaseSkeleton className="h-9 w-9 rounded-lg bg-slate-200" />
                </div>
                <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
                  <BaseSkeleton className="h-8 w-8 rounded-md bg-slate-200" />
                  <BaseSkeleton className="h-8 w-8 rounded-md bg-slate-200" />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              {/* Recherche */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Rechercher une salle..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 ${theme.focusRing} focus:border-transparent`}
                />
              </div>

              {/* Contrôles */}
              <div className="flex items-center gap-3">
                {/* Tri */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600">Trier par:</span>
                  <Select
                    value={sortBy}
                    onValueChange={(value: any) => setSortBy(value)}
                  >
                    <SelectTrigger className="h-9 w-32 cursor-pointer">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Nom</SelectItem>
                      <SelectItem value="capacity">Capacité</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                    }
                    className="h-9 w-9 p-0 cursor-pointer hover:cursor-pointer"
                  >
                    {sortOrder === "asc" ? (
                      <SortAsc className="h-4 w-4" />
                    ) : (
                      <SortDesc className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                {/* Mode d'affichage */}
                <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="h-8 w-8 p-0 cursor-pointer hover:cursor-pointer"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="h-8 w-8 p-0 cursor-pointer hover:cursor-pointer"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
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
                    Filtres avancés
                  </h3>
                  {hasActiveFilters && (
                    <span className="text-sm text-slate-500">
                      ({filteredAndSortedRooms.length} résultat
                      {filteredAndSortedRooms.length > 1 ? "s" : ""})
                    </span>
                  )}
                </div>

                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    onClick={clearFilters}
                    className="text-slate-500 hover:text-slate-700 h-8 px-3 cursor-pointer"
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
                    <SelectTrigger className="h-10 rounded-lg cursor-pointer">
                      <SelectValue placeholder="Tous les statuts" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les statuts</SelectItem>
                      <SelectItem value="disponible">Disponible</SelectItem>
                      <SelectItem value="occupée">Occupée</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Filtre par type */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Type
                  </label>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="h-10 rounded-lg cursor-pointer">
                      <SelectValue placeholder="Tous les types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les types</SelectItem>
                      <SelectItem value="conférence">Conférence</SelectItem>
                      <SelectItem value="réunion">Réunion</SelectItem>
                      <SelectItem value="atelier">Atelier</SelectItem>
                      <SelectItem value="formation">Formation</SelectItem>
                      <SelectItem value="vip">VIP</SelectItem>
                      <SelectItem value="téléconférence">
                        Téléconférence
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Filtre par capacité */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Capacité
                  </label>
                  <Select
                    value={capacityFilter}
                    onValueChange={setCapacityFilter}
                  >
                    <SelectTrigger className="h-10 rounded-lg cursor-pointer">
                      <SelectValue placeholder="Toutes les capacités" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les capacités</SelectItem>
                      <SelectItem value="small">
                        Petite (≤6 personnes)
                      </SelectItem>
                      <SelectItem value="medium">
                        Moyenne (7-12 personnes)
                      </SelectItem>
                      <SelectItem value="large">
                        Grande (&gt;12 personnes)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Section principale des salles */}
      <div className="max-w-[95rem] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {loading ? (
          viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
              {Array.from({ length: 8 }).map((_, idx) => (
                <div
                  key={idx}
                  className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl overflow-hidden"
                >
                  <div className="flex h-full">
                    {/* Colonne principale - Gauche */}
                    <div className="flex-1 flex flex-col min-w-0">
                      <div className="pb-3 pt-4 px-4 border-b border-slate-100/60">
                        <div className="flex items-start gap-2.5">
                          <BaseSkeleton className="h-7 w-7 rounded-lg bg-slate-200" />
                          <div className="flex-1 min-w-0 space-y-1.5">
                            <BaseSkeleton className="h-4 w-32 bg-slate-200" />
                            <BaseSkeleton className="h-3 w-24 bg-slate-200" />
                            <div className="flex items-center gap-1.5">
                              <BaseSkeleton className="h-5 w-16 rounded-full bg-slate-200" />
                              <BaseSkeleton className="h-5 w-20 rounded-full bg-slate-200" />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="px-4 pb-4 flex-1 flex flex-col space-y-3">
                        <BaseSkeleton className="h-3 w-full bg-slate-200" />
                        <BaseSkeleton className="h-3 w-3/4 bg-slate-200" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <BaseSkeleton className="h-3 w-20 bg-slate-200" />
                            <BaseSkeleton className="h-4 w-6 rounded-full bg-slate-200" />
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {Array.from({ length: 4 }).map((_, i) => (
                              <BaseSkeleton
                                key={i}
                                className="h-6 w-16 rounded-lg bg-slate-200"
                              />
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 pt-2.5 border-t border-slate-100/60">
                          <BaseSkeleton className="h-8 flex-1 rounded-lg bg-slate-200" />
                          <BaseSkeleton className="h-8 flex-1 rounded-lg bg-slate-200" />
                        </div>
                      </div>
                    </div>
                    {/* Colonne droite */}
                    <div className="w-20 flex-shrink-0 flex flex-col items-center justify-between border-l border-slate-100/60 bg-gradient-to-b from-slate-50/50 to-transparent">
                      <div className="flex flex-col items-center gap-1.5 pt-4">
                        <BaseSkeleton className="h-9 w-9 rounded-full bg-slate-200" />
                        <BaseSkeleton className="h-9 w-9 rounded-full bg-slate-200" />
                      </div>
                      <div className="flex flex-col items-center gap-1.5 px-2 py-3 rounded-tl-lg bg-gradient-to-br from-slate-50 to-slate-100/50 border-t border-l border-slate-200/50 mx-3 w-[calc(100%-1.5rem)]">
                        <BaseSkeleton className="h-5 w-5 rounded bg-slate-200 mb-1" />
                        <BaseSkeleton className="h-5 w-8 bg-slate-200" />
                        <BaseSkeleton className="h-2.5 w-12 bg-slate-200" />
                      </div>
                      <div className="w-full pb-4">
                        <BaseSkeleton className="h-1.5 rounded-full mx-3 bg-slate-200" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={idx}
                  className="bg-white/80 backdrop-blur-sm border-0 shadow-md rounded-xl overflow-hidden border-l-4 border-l-transparent"
                >
                  <div className="p-4">
                    <div className="flex items-center gap-4">
                      <BaseSkeleton className="h-10 w-10 rounded-lg bg-slate-200 flex-shrink-0" />
                      <div className="flex-1 min-w-0 flex items-center gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-1.5">
                            <BaseSkeleton className="h-4 w-32 bg-slate-200" />
                            <BaseSkeleton className="h-5 w-16 rounded-full bg-slate-200" />
                            <BaseSkeleton className="h-5 w-20 rounded-full bg-slate-200" />
                          </div>
                          <div className="flex items-center gap-4">
                            <BaseSkeleton className="h-3 w-24 bg-slate-200" />
                            <BaseSkeleton className="h-3 w-20 bg-slate-200" />
                            <BaseSkeleton className="h-3 w-40 bg-slate-200 hidden md:block" />
                          </div>
                        </div>
                        <div className="hidden lg:flex items-center gap-1.5 flex-shrink-0">
                          {Array.from({ length: 3 }).map((_, i) => (
                            <BaseSkeleton
                              key={i}
                              className="h-8 w-8 rounded-md bg-slate-200"
                            />
                          ))}
                          <BaseSkeleton className="h-5 w-5 rounded-full bg-slate-200" />
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <BaseSkeleton className="h-8 w-8 rounded-full bg-slate-200" />
                        <BaseSkeleton className="h-8 w-16 rounded-lg bg-slate-200" />
                        <BaseSkeleton className="h-8 w-20 rounded-lg bg-slate-200" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : favoritesLoading || (dbRooms.length === 0 && !loading) ? (
          // Afficher les skeletons pendant le chargement des favoris OU si on n'a pas encore de salles
          viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
              {Array.from({ length: 8 }).map((_, idx) => (
                <div
                  key={idx}
                  className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl overflow-hidden"
                >
                  <div className="flex h-full">
                    {/* Colonne principale - Gauche */}
                    <div className="flex-1 flex flex-col min-w-0">
                      <div className="pb-3 pt-4 px-4 border-b border-slate-100/60">
                        <div className="flex items-start gap-2.5">
                          <BaseSkeleton className="h-7 w-7 rounded-lg bg-slate-200" />
                          <div className="flex-1 min-w-0 space-y-1.5">
                            <BaseSkeleton className="h-4 w-32 bg-slate-200" />
                            <BaseSkeleton className="h-3 w-24 bg-slate-200" />
                            <div className="flex items-center gap-1.5">
                              <BaseSkeleton className="h-5 w-16 rounded-full bg-slate-200" />
                              <BaseSkeleton className="h-5 w-20 rounded-full bg-slate-200" />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="px-4 pb-4 flex-1 flex flex-col space-y-3">
                        <BaseSkeleton className="h-3 w-full bg-slate-200" />
                        <BaseSkeleton className="h-3 w-3/4 bg-slate-200" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <BaseSkeleton className="h-3 w-20 bg-slate-200" />
                            <BaseSkeleton className="h-4 w-6 rounded-full bg-slate-200" />
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {Array.from({ length: 4 }).map((_, i) => (
                              <BaseSkeleton
                                key={i}
                                className="h-6 w-16 rounded-lg bg-slate-200"
                              />
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 pt-2.5 border-t border-slate-100/60">
                          <BaseSkeleton className="h-8 flex-1 rounded-lg bg-slate-200" />
                          <BaseSkeleton className="h-8 flex-1 rounded-lg bg-slate-200" />
                        </div>
                      </div>
                    </div>
                    {/* Colonne droite */}
                    <div className="w-20 flex-shrink-0 flex flex-col items-center justify-between border-l border-slate-100/60 bg-gradient-to-b from-slate-50/50 to-transparent">
                      <div className="flex flex-col items-center gap-1.5 pt-4">
                        <BaseSkeleton className="h-9 w-9 rounded-full bg-slate-200" />
                        <BaseSkeleton className="h-9 w-9 rounded-full bg-slate-200" />
                      </div>
                      <div className="flex flex-col items-center gap-1.5 px-2 py-3 rounded-tl-lg bg-gradient-to-br from-slate-50 to-slate-100/50 border-t border-l border-slate-200/50 mx-3 w-[calc(100%-1.5rem)]">
                        <BaseSkeleton className="h-5 w-5 rounded bg-slate-200 mb-1" />
                        <BaseSkeleton className="h-5 w-8 bg-slate-200" />
                        <BaseSkeleton className="h-2.5 w-12 bg-slate-200" />
                      </div>
                      <div className="w-full pb-4">
                        <BaseSkeleton className="h-1.5 rounded-full mx-3 bg-slate-200" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={idx}
                  className="bg-white/80 backdrop-blur-sm border-0 shadow-md rounded-xl overflow-hidden border-l-4 border-l-transparent"
                >
                  <div className="p-4">
                    <div className="flex items-center gap-4">
                      <BaseSkeleton className="h-10 w-10 rounded-lg bg-slate-200 flex-shrink-0" />
                      <div className="flex-1 min-w-0 flex items-center gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-1.5">
                            <BaseSkeleton className="h-4 w-32 bg-slate-200" />
                            <BaseSkeleton className="h-5 w-16 rounded-full bg-slate-200" />
                            <BaseSkeleton className="h-5 w-20 rounded-full bg-slate-200" />
                          </div>
                          <div className="flex items-center gap-4">
                            <BaseSkeleton className="h-3 w-24 bg-slate-200" />
                            <BaseSkeleton className="h-3 w-20 bg-slate-200" />
                            <BaseSkeleton className="h-3 w-40 bg-slate-200 hidden md:block" />
                          </div>
                        </div>
                        <div className="hidden lg:flex items-center gap-1.5 flex-shrink-0">
                          {Array.from({ length: 3 }).map((_, i) => (
                            <BaseSkeleton
                              key={i}
                              className="h-8 w-8 rounded-md bg-slate-200"
                            />
                          ))}
                          <BaseSkeleton className="h-5 w-5 rounded-full bg-slate-200" />
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <BaseSkeleton className="h-8 w-8 rounded-full bg-slate-200" />
                        <BaseSkeleton className="h-8 w-16 rounded-lg bg-slate-200" />
                        <BaseSkeleton className="h-8 w-20 rounded-lg bg-slate-200" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : filteredAndSortedRooms.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <Building2 className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-500 mb-2">
              Aucune salle trouvée
            </h3>
            <p className="text-slate-400 mb-6">
              {hasActiveFilters
                ? "Aucune salle ne correspond à vos critères de filtrage."
                : "Aucune salle disponible pour le moment."}
            </p>
            {hasActiveFilters && (
              <Button
                onClick={clearFilters}
                variant="outline"
                className="cursor-pointer"
              >
                <X className="h-4 w-4 mr-2" />
                Effacer les filtres
              </Button>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-6"
          >
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
                {filteredAndSortedRooms.map((room, index) => {
                  const statusConfig = getStatusConfig(room.status);
                  const typeConfig = getTypeConfig(room.type);
                  const StatusIcon = statusConfig.icon;

                  return (
                    <motion.div
                      key={room.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.5,
                        delay: index * 0.1,
                        ease: "easeOut",
                      }}
                      whileHover={{ y: -4, scale: 1.02 }}
                      className="group"
                    >
                      <Card className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden group">
                        <div className="flex h-full">
                          {/* Colonne principale - Gauche */}
                          <div className="flex-1 flex flex-col min-w-0">
                            <CardHeader className="pb-3 pt-4 px-4">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex items-start gap-2.5 flex-1 min-w-0">
                                  <div className="p-1.5 bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg shadow-md flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                                    <Building2 className="h-4 w-4 text-white" />
                                  </div>
                                  <div className="flex-1 min-w-0 space-y-1.5">
                                    <div>
                                      <CardTitle className="text-base font-bold text-slate-900 line-clamp-1 leading-tight">
                                        {room.name}
                                      </CardTitle>
                                      <CardDescription className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                                        {room.location}
                                      </CardDescription>
                                    </div>
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                      <Badge
                                        variant={statusConfig.variant}
                                        className="text-[10px] px-1.5 py-0.5 h-5 font-semibold leading-none"
                                      >
                                        <StatusIcon className="h-2.5 w-2.5 mr-0.5" />
                                        {statusConfig.label}
                                      </Badge>
                                      <Badge
                                        variant="outline"
                                        className={`text-[10px] px-1.5 py-0.5 h-5 ${typeConfig.color} text-nowrap font-semibold leading-none border-opacity-50`}
                                      >
                                        <span className="text-[9px]">
                                          {typeConfig.icon}
                                        </span>{" "}
                                        {room.type}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </CardHeader>

                            <CardContent className="px-4 pb-4 flex-1 flex flex-col space-y-3">
                              {/* Description et Capacité - Compact */}
                              <div className="space-y-2">
                                {room.description && (
                                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                                    {room.description}
                                  </p>
                                )}
                              </div>

                              {/* Équipements - Optimisé */}
                              {room.equipment.length > 0 && (
                                <div className="flex-1">
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="text-[10px] font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1">
                                      <Monitor className="h-2.5 w-2.5 text-slate-600" />
                                      Équipements
                                    </div>
                                    <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-full font-semibold">
                                      {room.equipment.length}
                                    </span>
                                  </div>
                                  <div className="flex flex-wrap gap-1.5">
                                    {room.equipment
                                      .slice(0, 4)
                                      .map((item, idx) => {
                                        const equipmentConfig =
                                          getEquipmentIcon(item);
                                        const EquipmentIcon =
                                          equipmentConfig.icon;
                                        const equipmentId = `${room.id}-${item}-${idx}`;
                                        const isHovered =
                                          hoveredEquipment === equipmentId;

                                        return (
                                          <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{
                                              delay: idx * 0.05,
                                              type: "spring",
                                              stiffness: 300,
                                              damping: 25,
                                            }}
                                            whileHover={{
                                              scale: 1.08,
                                              y: -1,
                                              transition: { duration: 0.15 },
                                            }}
                                            className={`group/eq relative flex items-center gap-1 px-2 py-1 rounded-lg ${equipmentConfig.bgColor} ${equipmentConfig.borderColor} border hover:shadow-sm transition-all duration-200 cursor-pointer`}
                                            onMouseEnter={() =>
                                              setHoveredEquipment(equipmentId)
                                            }
                                            onMouseLeave={() =>
                                              setHoveredEquipment(null)
                                            }
                                          >
                                            <EquipmentIcon
                                              className={`h-2.5 w-2.5 ${equipmentConfig.color} flex-shrink-0`}
                                            />
                                            <span className="text-[10px] font-semibold text-slate-700 group-hover/eq:text-slate-900 transition-colors leading-none">
                                              {item}
                                            </span>

                                            {/* Tooltip */}
                                            {isHovered &&
                                              viewMode !== "grid" && (
                                                <motion.div
                                                  initial={{ opacity: 0, y: 3 }}
                                                  animate={{ opacity: 1, y: 0 }}
                                                  exit={{ opacity: 0, y: 3 }}
                                                  transition={{
                                                    duration: 0.15,
                                                  }}
                                                  className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1.5 px-2 py-1 bg-slate-900 text-white text-[10px] rounded-md whitespace-nowrap z-20 shadow-lg"
                                                >
                                                  {equipmentConfig.description}
                                                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[3px] border-r-[3px] border-t-[3px] border-transparent border-t-slate-900"></div>
                                                </motion.div>
                                              )}
                                          </motion.div>
                                        );
                                      })}
                                    {room.equipment.length > 4 && (
                                      <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{
                                          delay: 0.2,
                                          type: "spring",
                                          stiffness: 300,
                                          damping: 25,
                                        }}
                                        whileHover={{
                                          scale: 1.08,
                                          y: -1,
                                          transition: { duration: 0.15 },
                                        }}
                                        className="group/more relative flex items-center gap-1 px-2 py-1 rounded-lg bg-gradient-to-r from-slate-100 to-slate-200 border border-slate-300 hover:shadow-sm transition-all duration-200 cursor-pointer"
                                        onMouseEnter={() =>
                                          setHoveredEquipment(
                                            `${room.id}-more-${room.equipment.length}`
                                          )
                                        }
                                        onMouseLeave={() =>
                                          setHoveredEquipment(null)
                                        }
                                      >
                                        <Plus className="h-2.5 w-2.5 text-slate-600 flex-shrink-0" />
                                        <span className="text-[10px] font-semibold text-slate-600 group-hover/more:text-slate-800 transition-colors leading-none">
                                          +{room.equipment.length - 4}
                                        </span>

                                        {/* Tooltip pour les équipements supplémentaires */}
                                        {hoveredEquipment ===
                                          `${room.id}-more-${room.equipment.length}` &&
                                          viewMode !== "grid" && (
                                            <motion.div
                                              initial={{ opacity: 0, y: 3 }}
                                              animate={{ opacity: 1, y: 0 }}
                                              exit={{ opacity: 0, y: 3 }}
                                              transition={{ duration: 0.15 }}
                                              className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1.5 px-2 py-1 bg-slate-900 text-white text-[10px] rounded-md whitespace-nowrap z-20 shadow-lg"
                                            >
                                              {room.equipment
                                                .slice(4)
                                                .join(", ")}
                                              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[3px] border-r-[3px] border-t-[3px] border-transparent border-t-slate-900"></div>
                                            </motion.div>
                                          )}
                                      </motion.div>
                                    )}
                                  </div>
                                </div>
                              )}

                              {/* Actions - Compact et optimisé */}
                              <div className="flex items-center gap-2 pt-2.5 border-t border-slate-100/60">
                                <Link
                                  href={`/rooms/${room.id}`}
                                  className="flex-1"
                                >
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="w-full h-8 text-xs font-semibold cursor-pointer hover:bg-slate-50 transition-colors border-slate-200"
                                  >
                                    <Eye className="h-3 w-3 mr-1.5" />
                                    Voir
                                  </Button>
                                </Link>
                                <Link
                                  href={`/bookings/new?room=${room.id}`}
                                  className="flex-1"
                                >
                                  <Button
                                    size="sm"
                                    className="w-full h-8 text-xs font-semibold bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white cursor-pointer hover:cursor-pointer shadow-sm hover:shadow-md transition-all disabled:opacity-50"
                                    disabled={room.status === "occupée"}
                                  >
                                    Réserver
                                  </Button>
                                </Link>
                              </div>
                            </CardContent>
                          </div>

                          {/* Colonne droite - Optimisée et moderne */}
                          <div className="w-20 flex-shrink-0 flex flex-col items-center justify-between border-l border-slate-100/60 bg-gradient-to-b from-slate-50/50 to-transparent">
                            {/* Actions rapides en haut */}
                            <div className="flex flex-col items-center gap-1.5 pt-4">
                              <motion.button
                                onClick={(e) =>
                                  handleToggleFavorite(room.id, e)
                                }
                                className="h-9 w-9 p-0 hover:bg-slate-100 cursor-pointer transition-all rounded-full group/fav flex items-center justify-center"
                                aria-label={
                                  room.isFavorite
                                    ? "Retirer des favoris"
                                    : "Ajouter aux favoris"
                                }
                                whileTap={{ scale: 0.85 }}
                                whileHover={{ scale: 1.1 }}
                              >
                                <motion.div
                                  key={room.isFavorite ? "filled" : "unfilled"}
                                  initial={{ scale: 0.9 }}
                                  animate={{
                                    scale: room.isFavorite ? 1.15 : 1,
                                  }}
                                  transition={{
                                    type: "spring",
                                    stiffness: 500,
                                    damping: 25,
                                  }}
                                >
                                  <Heart
                                    className={`h-4 w-4 transition-all duration-300 ease-out ${
                                      room.isFavorite
                                        ? "text-slate-700 fill-current"
                                        : "text-slate-400 group-hover/fav:text-slate-600"
                                    }`}
                                  />
                                </motion.div>
                              </motion.button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-9 w-9 p-0 hover:bg-slate-100 cursor-pointer transition-colors rounded-full"
                              >
                                <MoreVertical className="h-4 w-4 text-slate-400" />
                              </Button>
                            </div>

                            {/* Indicateur de capacité - Central et visuel */}
                            <div className="flex flex-col items-center gap-1.5 px-2 py-3 rounded-tl-lg bg-gradient-to-br from-slate-50 to-slate-100/50 border-t border-l border-slate-200/50">
                              <div className="flex flex-col items-center">
                                <Users className="h-5 w-5 text-slate-700 mb-1" />
                                <div className="text-center">
                                  <div className="text-lg font-bold text-slate-900 leading-none">
                                    {room.capacity}
                                  </div>
                                  <div className="text-[9px] text-slate-500 font-medium uppercase tracking-tight mt-0.5">
                                    places
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Indicateur de statut visuel - En bas */}
                            <div className="w-full pb-4">
                              <div
                                className={`h-1.5 rounded-full mx-3 ${room.status === "disponible" ? "bg-gradient-to-r from-slate-600 to-slate-700" : "bg-gradient-to-r from-slate-400 to-slate-500"} shadow-sm`}
                              />
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {filteredAndSortedRooms.map((room, index) => {
                  const statusConfig = getStatusConfig(room.status);
                  const typeConfig = getTypeConfig(room.type);
                  const StatusIcon = statusConfig.icon;

                  return (
                    <motion.div
                      key={room.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.4,
                        delay: index * 0.03,
                        ease: "easeOut",
                      }}
                      whileHover={{ x: 4 }}
                      className="group"
                    >
                      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md hover:shadow-lg transition-all duration-300 rounded-xl overflow-hidden border-l-4 border-l-transparent hover:border-l-slate-500">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            {/* Icône */}
                            <div className="p-2 bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg shadow-sm flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                              <Building2 className="h-4 w-4 text-white" />
                            </div>

                            {/* Informations principales */}
                            <div className="flex-1 min-w-0 flex items-center gap-4">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-1.5">
                                  <h3 className="text-base font-bold text-slate-900 truncate">
                                    {room.name}
                                  </h3>
                                  <Badge
                                    variant={statusConfig.variant}
                                    className="text-[10px] px-1.5 py-0.5 h-5 font-semibold leading-none"
                                  >
                                    <StatusIcon className="h-2.5 w-2.5 mr-0.5" />
                                    {statusConfig.label}
                                  </Badge>
                                  <Badge
                                    variant="outline"
                                    className={`text-[10px] px-1.5 py-0.5 h-5 ${typeConfig.color} font-semibold leading-none text-nowrap`}
                                  >
                                    {typeConfig.icon} {room.type}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-4 text-xs text-slate-600">
                                  <div className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3 text-slate-500" />
                                    <span className="truncate">
                                      {room.location}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Users className="h-3 w-3 text-slate-600" />
                                    <span className="font-semibold">
                                      {room.capacity} places
                                    </span>
                                  </div>
                                  {room.description && (
                                    <span className="text-slate-500 truncate hidden md:inline">
                                      {room.description}
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Équipements compacts */}
                              {room.equipment.length > 0 && (
                                <div className="hidden lg:flex items-center gap-1.5 flex-shrink-0">
                                  <div className="flex items-center gap-1">
                                    {room.equipment
                                      .slice(0, 3)
                                      .map((item, idx) => {
                                        const equipmentConfig =
                                          getEquipmentIcon(item);
                                        const EquipmentIcon =
                                          equipmentConfig.icon;
                                        const equipmentId = `${room.id}-list-compact-${item}-${idx}`;
                                        const isHovered =
                                          hoveredEquipment === equipmentId;

                                        return (
                                          <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{
                                              delay: idx * 0.05,
                                              type: "spring",
                                              stiffness: 300,
                                              damping: 25,
                                            }}
                                            whileHover={{ scale: 1.1 }}
                                            className="relative"
                                            onMouseEnter={() =>
                                              setHoveredEquipment(equipmentId)
                                            }
                                            onMouseLeave={() =>
                                              setHoveredEquipment(null)
                                            }
                                          >
                                            <div
                                              className={`p-1.5 rounded-md ${equipmentConfig.bgColor} ${equipmentConfig.borderColor} border cursor-pointer transition-all hover:shadow-sm`}
                                            >
                                              <EquipmentIcon
                                                className={`h-3 w-3 ${equipmentConfig.color}`}
                                              />
                                            </div>
                                            {isHovered && (
                                              <motion.div
                                                initial={{ opacity: 0, y: 5 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 5 }}
                                                className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-[10px] rounded-md whitespace-nowrap z-20 shadow-lg"
                                              >
                                                {item}
                                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[3px] border-r-[3px] border-t-[3px] border-transparent border-t-slate-900"></div>
                                              </motion.div>
                                            )}
                                          </motion.div>
                                        );
                                      })}
                                    {room.equipment.length > 3 && (
                                      <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-full font-semibold">
                                        +{room.equipment.length - 3}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <motion.button
                                onClick={(e) =>
                                  handleToggleFavorite(room.id, e)
                                }
                                className="h-8 w-8 p-0 hover:bg-slate-100 cursor-pointer transition-colors rounded-full flex items-center justify-center"
                                aria-label={
                                  room.isFavorite
                                    ? "Retirer des favoris"
                                    : "Ajouter aux favoris"
                                }
                                whileTap={{ scale: 0.85 }}
                                whileHover={{ scale: 1.1 }}
                              >
                                <motion.div
                                  key={room.isFavorite ? "filled" : "unfilled"}
                                  initial={{ scale: 0.9 }}
                                  animate={{
                                    scale: room.isFavorite ? 1.15 : 1,
                                  }}
                                  transition={{
                                    type: "spring",
                                    stiffness: 500,
                                    damping: 25,
                                  }}
                                >
                                  <Heart
                                    className={`h-4 w-4 transition-all duration-300 ease-out ${
                                      room.isFavorite
                                        ? "text-slate-700 fill-current"
                                        : "text-slate-400 group-hover:text-slate-600"
                                    }`}
                                  />
                                </motion.div>
                              </motion.button>
                              <Link href={`/rooms/${room.id}`}>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-8 px-3 text-xs font-semibold cursor-pointer hover:bg-slate-50 transition-colors border-slate-200"
                                >
                                  <Eye className="h-3 w-3 mr-1.5" />
                                  <span className="hidden sm:inline">Voir</span>
                                </Button>
                              </Link>
                              <Link href={`/bookings/new?room=${room.id}`}>
                                <Button
                                  size="sm"
                                  className="h-8 px-3 text-xs font-semibold bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white cursor-pointer hover:cursor-pointer shadow-sm hover:shadow-md transition-all disabled:opacity-50"
                                  disabled={room.status === "occupée"}
                                >
                                  Réserver
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
