"use client";

import { useState, useMemo } from "react";
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
  Clock,
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
  Star,
  Activity,
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

const rooms = [
  {
    id: 1,
    name: "Salle de conférence A",
    capacity: 12,
    equipment: ["Écran", "WiFi", "Projecteur"],
    status: "disponible",
    nextBooking: "14:00 - 16:00",
    location: "Étage 2, Bureau 201",
    type: "conférence",
    occupancy: 85,
    isFavorite: true,
    rating: 4.8,
    description: "Salle moderne équipée pour les présentations importantes",
    features: ["Vue panoramique", "Climatisation", "Éclairage LED"],
    image: "/api/placeholder/400/300",
  },
  {
    id: 2,
    name: "Salle de réunion B",
    capacity: 8,
    equipment: ["Écran", "WiFi"],
    status: "occupée",
    nextBooking: "10:00 - 11:30",
    location: "Étage 1, Bureau 105",
    type: "réunion",
    occupancy: 92,
    isFavorite: false,
    rating: 4.5,
    description: "Espace intime pour les réunions d'équipe",
    features: ["Tableau blanc", "Climatisation"],
    image: "/api/placeholder/400/300",
  },
  {
    id: 3,
    name: "Espace créatif",
    capacity: 6,
    equipment: ["WiFi", "Café"],
    status: "disponible",
    nextBooking: "09:00 - 12:00",
    location: "Étage 3, Bureau 301",
    type: "atelier",
    occupancy: 67,
    isFavorite: true,
    rating: 4.9,
    description: "Espace inspirant pour le brainstorming et la créativité",
    features: ["Décoration moderne", "Fauteuils confortables", "Café gratuit"],
    image: "/api/placeholder/400/300",
  },
  {
    id: 4,
    name: "Salle de formation",
    capacity: 20,
    equipment: ["Écran", "WiFi", "Projecteur", "Café"],
    status: "disponible",
    nextBooking: "15:00 - 17:00",
    location: "Étage 1, Bureau 120",
    type: "formation",
    occupancy: 78,
    isFavorite: false,
    rating: 4.7,
    description: "Grande salle pour les formations et séminaires",
    features: ["Écran géant", "Sonorisation", "Espace détente"],
    image: "/api/placeholder/400/300",
  },
  {
    id: 5,
    name: "Salle VIP",
    capacity: 4,
    equipment: ["Écran", "WiFi", "Café", "Micro"],
    status: "disponible",
    nextBooking: "16:00 - 18:00",
    location: "Étage 4, Bureau 401",
    type: "vip",
    occupancy: 45,
    isFavorite: true,
    rating: 5.0,
    description: "Salle premium pour les réunions importantes",
    features: ["Design luxueux", "Service premium", "Vue panoramique"],
    image: "/api/placeholder/400/300",
  },
  {
    id: 6,
    name: "Salle de téléconférence",
    capacity: 10,
    equipment: ["Écran", "WiFi", "Caméra", "Micro"],
    status: "occupée",
    nextBooking: "11:00 - 12:30",
    location: "Étage 2, Bureau 205",
    type: "téléconférence",
    occupancy: 88,
    isFavorite: false,
    rating: 4.6,
    description: "Équipée pour les réunions à distance",
    features: ["Caméra HD", "Son haute qualité", "Écran tactile"],
    image: "/api/placeholder/400/300",
  },
];

const getStatusConfig = (status: string) => {
  switch (status) {
    case "disponible":
      return {
        icon: CheckCircle2,
        variant: "success" as const,
        color: "bg-gradient-to-r from-green-500 to-emerald-500",
        textColor: "text-white",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
        label: "Disponible",
      };
    case "occupée":
      return {
        icon: AlertCircle,
        variant: "warning" as const,
        color: "bg-gradient-to-r from-red-500 to-pink-500",
        textColor: "text-white",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        label: "Occupée",
      };
    default:
      return {
        icon: AlertCircle,
        variant: "secondary" as const,
        color: "bg-gradient-to-r from-gray-500 to-slate-500",
        textColor: "text-white",
        bgColor: "bg-gray-50",
        borderColor: "border-gray-200",
        label: status,
      };
  }
};

const getTypeConfig = (type: string) => {
  switch (type) {
    case "conférence":
      return { color: "bg-blue-100 text-blue-800", icon: "🎯" };
    case "réunion":
      return { color: "bg-green-100 text-green-800", icon: "👥" };
    case "atelier":
      return { color: "bg-purple-100 text-purple-800", icon: "🎨" };
    case "formation":
      return { color: "bg-orange-100 text-orange-800", icon: "📚" };
    case "vip":
      return { color: "bg-yellow-100 text-yellow-800", icon: "⭐" };
    case "téléconférence":
      return { color: "bg-indigo-100 text-indigo-800", icon: "📹" };
    default:
      return { color: "bg-gray-100 text-gray-800", icon: "🏢" };
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
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      description: "Écran haute résolution",
    },
    WiFi: {
      icon: Wifi,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      description: "Connexion internet haut débit",
    },
    Projecteur: {
      icon: Projector,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      description: "Projecteur HD",
    },
    Café: {
      icon: Coffee,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      description: "Machine à café",
    },
    Caméra: {
      icon: Camera,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-200",
      description: "Caméra HD",
    },
    Micro: {
      icon: Mic,
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      description: "Microphone professionnel",
    },
    Sonorisation: {
      icon: Volume2,
      color: "text-pink-600",
      bgColor: "bg-pink-50",
      borderColor: "border-pink-200",
      description: "Système audio",
    },
    TV: {
      icon: Tv,
      color: "text-cyan-600",
      bgColor: "bg-cyan-50",
      borderColor: "border-cyan-200",
      description: "Téléviseur 4K",
    },
    Climatisation: {
      icon: AirVent,
      color: "text-teal-600",
      bgColor: "bg-teal-50",
      borderColor: "border-teal-200",
      description: "Climatisation réversible",
    },
    "Éclairage LED": {
      icon: Lightbulb,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
      description: "Éclairage LED dimmable",
    },
    "Tableau blanc": {
      icon: Calendar,
      color: "text-gray-600",
      bgColor: "bg-gray-50",
      borderColor: "border-gray-200",
      description: "Tableau blanc interactif",
    },
  };

  return (
    equipmentMap[equipment] || {
      icon: Monitor,
      color: "text-gray-600",
      bgColor: "bg-gray-50",
      borderColor: "border-gray-200",
      description: "Équipement disponible",
    }
  );
};

export default function RoomsPage() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [capacityFilter, setCapacityFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<
    "name" | "capacity" | "occupancy" | "rating"
  >("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [hoveredEquipment, setHoveredEquipment] = useState<string | null>(null);

  // Filtrer et trier les salles
  const filteredAndSortedRooms = useMemo(() => {
    let filtered = rooms.filter((room) => {
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
        room.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.location.toLowerCase().includes(searchQuery.toLowerCase());

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
        case "occupancy":
          comparison = a.occupancy - b.occupancy;
          break;
        case "rating":
          comparison = a.rating - b.rating;
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

  const toggleFavorite = (id: number) => {
    // Logique pour basculer le favori
    console.log("Toggle favorite:", id);
  };

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
                  <Building2 className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
                  Nos salles
                </h1>
              </div>
              <p className="text-blue-100 text-lg sm:text-xl max-w-2xl">
                Découvrez et réservez nos espaces de travail modernes et équipés
              </p>

              {/* Statistiques rapides */}
              <div className="flex flex-wrap gap-4 pt-4">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                  <CheckCircle2 className="h-4 w-4 text-green-300" />
                  <span className="text-white text-sm font-medium">
                    {rooms.filter((r) => r.status === "disponible").length}{" "}
                    Disponibles
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                  <AlertCircle className="h-4 w-4 text-yellow-300" />
                  <span className="text-white text-sm font-medium">
                    {rooms.filter((r) => r.status === "occupée").length}{" "}
                    Occupées
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                  <Users className="h-4 w-4 text-blue-300" />
                  <span className="text-white text-sm font-medium">
                    {rooms.reduce((sum, r) => sum + r.capacity, 0)} Places
                    totales
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                  <Heart className="h-4 w-4 text-pink-300" />
                  <span className="text-white text-sm font-medium">
                    {rooms.filter((r) => r.isFavorite).length} Favoris
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
                className={`bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 h-12 px-6 rounded-xl transition-all duration-200 cursor-pointer ${
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

      {/* Barre de recherche et contrôles */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Recherche */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher une salle..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  <SelectTrigger className="h-9 w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Nom</SelectItem>
                    <SelectItem value="capacity">Capacité</SelectItem>
                    <SelectItem value="occupancy">Occupation</SelectItem>
                    <SelectItem value="rating">Note</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                  }
                  className="h-9 w-9 p-0"
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
                  className="h-8 w-8 p-0"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="h-8 w-8 p-0"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
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
                    <SelectTrigger className="h-10 rounded-lg">
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
                    <SelectTrigger className="h-10 rounded-lg">
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
                    <SelectTrigger className="h-10 rounded-lg">
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {filteredAndSortedRooms.length === 0 ? (
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
              <Button onClick={clearFilters} variant="outline">
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
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
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
                      <Card className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden">
                        <CardHeader className="pb-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3 flex-1 min-w-0">
                              <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg flex-shrink-0">
                                <Building2 className="h-5 w-5 text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <CardTitle className="text-lg font-bold text-slate-900 mb-1 line-clamp-1">
                                  {room.name}
                                </CardTitle>
                                <CardDescription className="text-sm text-slate-500 mb-2">
                                  {room.location}
                                </CardDescription>
                                <div className="flex items-center gap-2">
                                  <Badge
                                    variant={statusConfig.variant}
                                    className="text-xs"
                                  >
                                    <StatusIcon className="h-3 w-3 mr-1" />
                                    {statusConfig.label}
                                  </Badge>
                                  <Badge
                                    variant="outline"
                                    className={`text-xs ${typeConfig.color}`}
                                  >
                                    {typeConfig.icon} {room.type}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 ml-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleFavorite(room.id)}
                                className="h-8 w-8 p-0"
                              >
                                <Heart
                                  className={`h-4 w-4 ${room.isFavorite ? "text-red-500 fill-current" : "text-slate-400"}`}
                                />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                              >
                                <MoreVertical className="h-4 w-4 text-slate-400" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>

                        <CardContent className="space-y-4">
                          {/* Description */}
                          <p className="text-sm text-slate-600 line-clamp-2">
                            {room.description}
                          </p>

                          {/* Détails */}
                          <div className="grid grid-cols-2 gap-3">
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <Users className="h-4 w-4 text-blue-500" />
                              <span className="font-medium">
                                {room.capacity} places
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <Activity className="h-4 w-4 text-green-500" />
                              <span>{room.occupancy}% occupation</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <Star className="h-4 w-4 text-yellow-500" />
                              <span>{room.rating}/5</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <Clock className="h-4 w-4 text-orange-500" />
                              <span>{room.nextBooking}</span>
                            </div>
                          </div>

                          {/* Équipements */}
                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <div className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                                <div className="p-1 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-md">
                                  <Monitor className="h-2.5 w-2.5 text-white" />
                                </div>
                                Équipements
                              </div>
                              <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                                {room.equipment.length}
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {room.equipment.slice(0, 4).map((item, idx) => {
                                const equipmentConfig = getEquipmentIcon(item);
                                const EquipmentIcon = equipmentConfig.icon;
                                const equipmentId = `${room.id}-${item}-${idx}`;
                                const isHovered =
                                  hoveredEquipment === equipmentId;

                                return (
                                  <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    transition={{
                                      delay: idx * 0.1,
                                      type: "spring",
                                      stiffness: 200,
                                      damping: 20,
                                    }}
                                    whileHover={{
                                      scale: 1.05,
                                      y: -2,
                                      transition: { duration: 0.2 },
                                    }}
                                    className={`group relative flex items-center gap-1.5 px-3 py-2 rounded-xl ${equipmentConfig.bgColor} ${equipmentConfig.borderColor} border hover:shadow-md transition-all duration-300 cursor-pointer`}
                                    onMouseEnter={() =>
                                      setHoveredEquipment(equipmentId)
                                    }
                                    onMouseLeave={() =>
                                      setHoveredEquipment(null)
                                    }
                                  >
                                    <div
                                      className={`p-1 rounded-md ${equipmentConfig.bgColor.replace("50", "100")}`}
                                    >
                                      <EquipmentIcon
                                        className={`h-3 w-3 ${equipmentConfig.color}`}
                                      />
                                    </div>
                                    <span className="text-xs font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">
                                      {item}
                                    </span>

                                    {/* Tooltip */}
                                    {isHovered && (
                                      <motion.div
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 5 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-xs rounded-md whitespace-nowrap z-20"
                                      >
                                        {equipmentConfig.description}
                                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-900"></div>
                                      </motion.div>
                                    )}
                                  </motion.div>
                                );
                              })}
                              {room.equipment.length > 4 && (
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.8, y: 10 }}
                                  animate={{ opacity: 1, scale: 1, y: 0 }}
                                  transition={{
                                    delay: 0.4,
                                    type: "spring",
                                    stiffness: 200,
                                    damping: 20,
                                  }}
                                  whileHover={{
                                    scale: 1.05,
                                    y: -2,
                                    transition: { duration: 0.2 },
                                  }}
                                  className="group relative flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-slate-100 to-slate-200 border border-slate-300 hover:shadow-md transition-all duration-300 cursor-pointer"
                                  onMouseEnter={() =>
                                    setHoveredEquipment(
                                      `${room.id}-more-${room.equipment.length}`
                                    )
                                  }
                                  onMouseLeave={() => setHoveredEquipment(null)}
                                >
                                  <div className="p-1 rounded-md bg-slate-200">
                                    <Plus className="h-3 w-3 text-slate-600" />
                                  </div>
                                  <span className="text-xs font-semibold text-slate-600 group-hover:text-slate-800 transition-colors">
                                    +{room.equipment.length - 4}
                                  </span>

                                  {/* Tooltip pour les équipements supplémentaires */}
                                  {hoveredEquipment ===
                                    `${room.id}-more-${room.equipment.length}` && (
                                    <motion.div
                                      initial={{ opacity: 0, y: 5 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, y: 5 }}
                                      transition={{ duration: 0.2 }}
                                      className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-xs rounded-md whitespace-nowrap z-20"
                                    >
                                      {room.equipment.slice(4).join(", ")}
                                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-900"></div>
                                    </motion.div>
                                  )}
                                </motion.div>
                              )}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                            <div className="flex items-center gap-2">
                              <Link href={`/rooms/${room.id}`}>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-8"
                                >
                                  <Eye className="h-3 w-3 mr-1" />
                                  Voir
                                </Button>
                              </Link>
                            </div>
                            <Link href={`/bookings/new?room=${room.id}`}>
                              <Button
                                size="sm"
                                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white h-8"
                                disabled={room.status === "occupée"}
                              >
                                Réserver
                              </Button>
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-4">
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
                        duration: 0.5,
                        delay: index * 0.05,
                        ease: "easeOut",
                      }}
                      whileHover={{ x: 4 }}
                      className="group"
                    >
                      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 flex-1 min-w-0">
                              <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg flex-shrink-0">
                                <Building2 className="h-5 w-5 text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-2">
                                  <h3 className="text-lg font-bold text-slate-900 truncate">
                                    {room.name}
                                  </h3>
                                  <Badge
                                    variant={statusConfig.variant}
                                    className="text-xs"
                                  >
                                    <StatusIcon className="h-3 w-3 mr-1" />
                                    {statusConfig.label}
                                  </Badge>
                                  <Badge
                                    variant="outline"
                                    className={`text-xs ${typeConfig.color}`}
                                  >
                                    {typeConfig.icon} {room.type}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-slate-600 mb-3">
                                  <div className="flex items-center gap-1">
                                    <Users className="h-4 w-4 text-blue-500" />
                                    <span>{room.capacity} places</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <MapPin className="h-4 w-4 text-green-500" />
                                    <span>{room.location}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Star className="h-4 w-4 text-yellow-500" />
                                    <span>{room.rating}/5</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-4 w-4 text-orange-500" />
                                    <span>{room.nextBooking}</span>
                                  </div>
                                </div>

                                {/* Équipements pour la vue liste */}
                                <div className="flex items-center gap-3">
                                  <div className="flex items-center gap-1.5">
                                    <div className="p-1 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-md">
                                      <Monitor className="h-2.5 w-2.5 text-white" />
                                    </div>
                                    <span className="text-xs font-semibold text-slate-600">
                                      Équipements
                                    </span>
                                    <span className="text-xs text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-full">
                                      {room.equipment.length}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    {room.equipment
                                      .slice(0, 4)
                                      .map((item, idx) => {
                                        const equipmentConfig =
                                          getEquipmentIcon(item);
                                        const EquipmentIcon =
                                          equipmentConfig.icon;
                                        const equipmentId = `${room.id}-list-${item}-${idx}`;
                                        const isHovered =
                                          hoveredEquipment === equipmentId;

                                        return (
                                          <motion.div
                                            key={idx}
                                            initial={{
                                              opacity: 0,
                                              scale: 0.8,
                                              x: -10,
                                            }}
                                            animate={{
                                              opacity: 1,
                                              scale: 1,
                                              x: 0,
                                            }}
                                            transition={{
                                              delay: idx * 0.05,
                                              type: "spring",
                                              stiffness: 300,
                                              damping: 25,
                                            }}
                                            whileHover={{
                                              scale: 1.1,
                                              transition: { duration: 0.15 },
                                            }}
                                            className={`group relative flex items-center gap-1 px-2 py-1.5 rounded-lg ${equipmentConfig.bgColor} ${equipmentConfig.borderColor} border hover:shadow-sm transition-all duration-200 cursor-pointer`}
                                            onMouseEnter={() =>
                                              setHoveredEquipment(equipmentId)
                                            }
                                            onMouseLeave={() =>
                                              setHoveredEquipment(null)
                                            }
                                          >
                                            <div
                                              className={`p-0.5 rounded-sm ${equipmentConfig.bgColor.replace("50", "100")}`}
                                            >
                                              <EquipmentIcon
                                                className={`h-2.5 w-2.5 ${equipmentConfig.color}`}
                                              />
                                            </div>
                                            <span className="text-xs font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">
                                              {item}
                                            </span>

                                            {/* Tooltip compact */}
                                            {isHovered && (
                                              <motion.div
                                                initial={{ opacity: 0, y: 3 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 3 }}
                                                transition={{ duration: 0.15 }}
                                                className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-slate-900 text-white text-xs rounded-md whitespace-nowrap z-20"
                                              >
                                                {equipmentConfig.description}
                                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-slate-900"></div>
                                              </motion.div>
                                            )}
                                          </motion.div>
                                        );
                                      })}
                                    {room.equipment.length > 4 && (
                                      <motion.div
                                        initial={{
                                          opacity: 0,
                                          scale: 0.8,
                                          x: -10,
                                        }}
                                        animate={{ opacity: 1, scale: 1, x: 0 }}
                                        transition={{
                                          delay: 0.2,
                                          type: "spring",
                                          stiffness: 300,
                                          damping: 25,
                                        }}
                                        whileHover={{
                                          scale: 1.1,
                                          transition: { duration: 0.15 },
                                        }}
                                        className="group relative flex items-center gap-1 px-2 py-1.5 rounded-lg bg-gradient-to-r from-slate-100 to-slate-200 border border-slate-300 hover:shadow-sm transition-all duration-200 cursor-pointer"
                                        onMouseEnter={() =>
                                          setHoveredEquipment(
                                            `${room.id}-list-more-${room.equipment.length}`
                                          )
                                        }
                                        onMouseLeave={() =>
                                          setHoveredEquipment(null)
                                        }
                                      >
                                        <div className="p-0.5 rounded-sm bg-slate-200">
                                          <Plus className="h-2.5 w-2.5 text-slate-600" />
                                        </div>
                                        <span className="text-xs font-semibold text-slate-600 group-hover:text-slate-800 transition-colors">
                                          +{room.equipment.length - 4}
                                        </span>

                                        {/* Tooltip pour les équipements supplémentaires */}
                                        {hoveredEquipment ===
                                          `${room.id}-list-more-${room.equipment.length}` && (
                                          <motion.div
                                            initial={{ opacity: 0, y: 3 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 3 }}
                                            transition={{ duration: 0.15 }}
                                            className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-slate-900 text-white text-xs rounded-md whitespace-nowrap z-20"
                                          >
                                            {room.equipment.slice(4).join(", ")}
                                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-slate-900"></div>
                                          </motion.div>
                                        )}
                                      </motion.div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleFavorite(room.id)}
                                className="h-8 w-8 p-0"
                              >
                                <Heart
                                  className={`h-4 w-4 ${room.isFavorite ? "text-red-500 fill-current" : "text-slate-400"}`}
                                />
                              </Button>
                              <Link href={`/rooms/${room.id}`}>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-8"
                                >
                                  <Eye className="h-3 w-3 mr-1" />
                                  Voir
                                </Button>
                              </Link>
                              <Link href={`/bookings/new?room=${room.id}`}>
                                <Button
                                  size="sm"
                                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white h-8"
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
