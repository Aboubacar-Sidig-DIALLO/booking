"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
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
  Calendar,
  Clock,
  Users,
  MapPin,
  Edit,
  Trash2,
  Download,
  Plus,
  CheckCircle2,
  AlertCircle,
  Building2,
  Filter,
  Search,
  X,
  Eye,
  MoreVertical,
  SortAsc,
  SortDesc,
  Heart,
  Timer,
  List,
  Grid,
} from "lucide-react";
import Link from "next/link";
import { EmptyState } from "@/components/common/EmptyState";
import { useThemeColor } from "@/hooks/useThemeColor";

const bookings = [
  {
    id: 1,
    title: "Réunion équipe marketing",
    room: "Salle de conférence A",
    date: "2024-01-15",
    time: "14:00 - 16:00",
    participants: 8,
    status: "confirmé",
    location: "Étage 2, Bureau 201",
    type: "conférence",
    priority: "haute",
    description: "Présentation des résultats Q4 et planification Q1",
    isFavorite: true,
    createdAt: "2024-01-10T10:30:00Z",
    equipment: ["Écran", "WiFi", "Projecteur"],
  },
  {
    id: 2,
    title: "Formation nouveaux employés",
    room: "Salle de réunion B",
    date: "2024-01-16",
    time: "10:00 - 11:30",
    participants: 5,
    status: "en attente",
    location: "Étage 1, Bureau 105",
    type: "réunion",
    priority: "moyenne",
    description: "Session d'intégration pour les nouveaux arrivants",
    isFavorite: false,
    createdAt: "2024-01-12T14:15:00Z",
    equipment: ["Écran", "WiFi"],
  },
  {
    id: 3,
    title: "Atelier créatif",
    room: "Espace créatif",
    date: "2024-01-17",
    time: "09:00 - 12:00",
    participants: 6,
    status: "confirmé",
    location: "Étage 3, Bureau 301",
    type: "atelier",
    priority: "basse",
    description: "Brainstorming pour la nouvelle campagne publicitaire",
    isFavorite: true,
    createdAt: "2024-01-08T09:00:00Z",
    equipment: ["WiFi", "Café", "Tableau blanc"],
  },
  {
    id: 4,
    title: "Présentation client",
    room: "Salle de formation",
    date: "2024-01-18",
    time: "15:00 - 17:00",
    participants: 12,
    status: "confirmé",
    location: "Étage 1, Bureau 120",
    type: "présentation",
    priority: "haute",
    description: "Démonstration produit pour client important",
    isFavorite: false,
    createdAt: "2024-01-11T16:45:00Z",
    equipment: ["Écran", "WiFi", "Projecteur", "Micro"],
  },
  {
    id: 5,
    title: "Réunion hebdomadaire",
    room: "Salle de réunion C",
    date: "2024-01-19",
    time: "09:30 - 10:30",
    participants: 4,
    status: "annulé",
    location: "Étage 2, Bureau 205",
    type: "réunion",
    priority: "moyenne",
    description: "Point hebdomadaire équipe développement",
    isFavorite: false,
    createdAt: "2024-01-09T11:20:00Z",
    equipment: ["Écran", "WiFi"],
  },
];

const getStatusConfig = (status: string) => {
  switch (status) {
    case "confirmé":
      return {
        icon: CheckCircle2,
        variant: "success" as const,
        color: "bg-gradient-to-r from-green-500 to-emerald-500",
        textColor: "text-white",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
        label: "Confirmé",
      };
    case "en attente":
      return {
        icon: AlertCircle,
        variant: "warning" as const,
        color: "bg-gradient-to-r from-yellow-500 to-orange-500",
        textColor: "text-white",
        bgColor: "bg-yellow-50",
        borderColor: "border-yellow-200",
        label: "En attente",
      };
    case "annulé":
      return {
        icon: Trash2,
        variant: "destructive" as const,
        color: "bg-gradient-to-r from-red-500 to-pink-500",
        textColor: "text-white",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        label: "Annulé",
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

const getPriorityConfig = (priority: string) => {
  switch (priority) {
    case "haute":
      return {
        color: "bg-red-100 text-red-800 border-red-200",
        icon: "🔴",
      };
    case "moyenne":
      return {
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        icon: "🟡",
      };
    case "basse":
      return {
        color: "bg-green-100 text-green-800 border-green-200",
        icon: "🟢",
      };
    default:
      return {
        color: "bg-gray-100 text-gray-800 border-gray-200",
        icon: "⚪",
      };
  }
};

export default function MyBookingsPage() {
  const theme = useThemeColor();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<
    "date" | "title" | "priority" | "status"
  >("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Filtrer et trier les réservations
  const filteredAndSortedBookings = useMemo(() => {
    let filtered = bookings.filter((booking) => {
      const statusMatch =
        statusFilter === "all" || booking.status === statusFilter;
      const typeMatch = typeFilter === "all" || booking.type === typeFilter;
      const priorityMatch =
        priorityFilter === "all" || booking.priority === priorityFilter;
      const searchMatch =
        searchQuery === "" ||
        booking.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.room.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.description.toLowerCase().includes(searchQuery.toLowerCase());

      return statusMatch && typeMatch && priorityMatch && searchMatch;
    });

    // Trier les résultats
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "date":
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case "title":
          comparison = a.title.localeCompare(b.title);
          break;
        case "priority":
          const priorityOrder = { haute: 3, moyenne: 2, basse: 1 };
          comparison =
            (priorityOrder[b.priority as keyof typeof priorityOrder] || 0) -
            (priorityOrder[a.priority as keyof typeof priorityOrder] || 0);
          break;
        case "status":
          const statusOrder = { confirmé: 3, "en attente": 2, annulé: 1 };
          comparison =
            (statusOrder[b.status as keyof typeof statusOrder] || 0) -
            (statusOrder[a.status as keyof typeof statusOrder] || 0);
          break;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [
    statusFilter,
    typeFilter,
    priorityFilter,
    searchQuery,
    sortBy,
    sortOrder,
  ]);

  const clearFilters = () => {
    setStatusFilter("all");
    setTypeFilter("all");
    setPriorityFilter("all");
    setSearchQuery("");
  };

  const hasActiveFilters =
    statusFilter !== "all" ||
    typeFilter !== "all" ||
    priorityFilter !== "all" ||
    searchQuery !== "";

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simuler un appel API
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const toggleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const toggleFavorite = (id: number) => {
    // Logique pour basculer le favori
    console.log("Toggle favorite:", id);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getTimeUntilBooking = (dateString: string, timeString: string) => {
    const [startTime] = timeString.split(" - ");
    const bookingDateTime = new Date(`${dateString}T${startTime}`);
    const now = new Date();
    const diffMs = bookingDateTime.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "Passé";
    if (diffDays === 0) return "Aujourd'hui";
    if (diffDays === 1) return "Demain";
    return `Dans ${diffDays} jours`;
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${theme.bgFrom} via-white ${theme.bgTo}`}
    >
      {/* Header moderne avec gradient */}
      <div className={`relative overflow-hidden ${theme.headerBg}`}>
        <div className="absolute inset-0 bg-black/10"></div>
        <div className={`absolute inset-0 ${theme.headerBg} opacity-90`}></div>

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
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
                  Mes réservations
                </h1>
              </div>
              <p className={`${theme.textLight} text-lg sm:text-xl max-w-2xl`}>
                Gérez et suivez toutes vos réservations de salles en un seul
                endroit
              </p>

              {/* Statistiques rapides */}
              <div className="flex flex-wrap gap-4 pt-4">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                  <CheckCircle2 className="h-4 w-4 text-green-300" />
                  <span className="text-white text-sm font-medium">
                    {bookings.filter((b) => b.status === "confirmé").length}{" "}
                    Confirmées
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                  <AlertCircle className="h-4 w-4 text-yellow-300" />
                  <span className="text-white text-sm font-medium">
                    {bookings.filter((b) => b.status === "en attente").length}{" "}
                    En attente
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                  <Users className="h-4 w-4 text-blue-300" />
                  <span className="text-white text-sm font-medium">
                    {bookings.reduce((sum, b) => sum + b.participants, 0)}{" "}
                    Participants
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                  <Heart className="h-4 w-4 text-pink-300" />
                  <span className="text-white text-sm font-medium">
                    {bookings.filter((b) => b.isFavorite).length} Favoris
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
                <Button
                  className={`bg-gradient-to-r from-white to-white/90 ${theme.text} hover:from-white hover:to-white shadow-lg hover:shadow-xl h-12 px-6 rounded-xl font-semibold`}
                >
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
                placeholder="Rechercher une réservation..."
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
                  <SelectTrigger className="h-9 w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="title">Titre</SelectItem>
                    <SelectItem value="priority">Priorité</SelectItem>
                    <SelectItem value="status">Statut</SelectItem>
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
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="h-8 w-8 p-0"
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="h-8 w-8 p-0"
                >
                  <Grid className="h-4 w-4" />
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
                      ({filteredAndSortedBookings.length} résultat
                      {filteredAndSortedBookings.length > 1 ? "s" : ""})
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
                      <SelectItem value="confirmé">Confirmé</SelectItem>
                      <SelectItem value="en attente">En attente</SelectItem>
                      <SelectItem value="annulé">Annulé</SelectItem>
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
                      <SelectItem value="présentation">Présentation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Filtre par priorité */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Priorité
                  </label>
                  <Select
                    value={priorityFilter}
                    onValueChange={setPriorityFilter}
                  >
                    <SelectTrigger className="h-10 rounded-lg">
                      <SelectValue placeholder="Toutes les priorités" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les priorités</SelectItem>
                      <SelectItem value="haute">Haute</SelectItem>
                      <SelectItem value="moyenne">Moyenne</SelectItem>
                      <SelectItem value="basse">Basse</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Section principale des réservations */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {filteredAndSortedBookings.length === 0 ? (
          <EmptyState
            title="Aucune réservation trouvée"
            description={
              hasActiveFilters
                ? "Aucune réservation ne correspond à vos critères de filtrage. Essayez de modifier vos filtres."
                : "Vous n'avez pas encore de réservations. Créez votre première réservation et commencez à organiser vos réunions !"
            }
            action={
              hasActiveFilters ? (
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button onClick={clearFilters} variant="default">
                    <X className="h-4 w-4 mr-2" />
                    Effacer les filtres
                  </Button>
                  <Button
                    onClick={() => setShowFilters(true)}
                    variant="outline"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Modifier les filtres
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href="/bookings/new">
                    <Button variant="default">
                      <Plus className="h-4 w-4 mr-2" />
                      Nouvelle réservation
                    </Button>
                  </Link>
                  <Link href="/rooms">
                    <Button variant="outline">
                      <Building2 className="h-4 w-4 mr-2" />
                      Explorer les salles
                    </Button>
                  </Link>
                </div>
              )
            }
          />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-6"
          >
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredAndSortedBookings.map((booking, index) => {
                  const statusConfig = getStatusConfig(booking.status);
                  const priorityConfig = getPriorityConfig(booking.priority);
                  const StatusIcon = statusConfig.icon;

                  return (
                    <motion.div
                      key={booking.id}
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
                              <div
                                className={`p-2 ${theme.iconBg} rounded-xl shadow-lg flex-shrink-0`}
                              >
                                <Building2 className="h-5 w-5 text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <CardTitle className="text-lg font-bold text-slate-900 mb-1 line-clamp-1">
                                  {booking.title}
                                </CardTitle>
                                <CardDescription className="text-sm text-slate-500 mb-2">
                                  {booking.room} • {booking.location}
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
                                    className={`text-xs ${priorityConfig.color}`}
                                  >
                                    {priorityConfig.icon} {booking.priority}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 ml-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleFavorite(booking.id)}
                                className="h-8 w-8 p-0"
                              >
                                <Heart
                                  className={`h-4 w-4 ${
                                    booking.isFavorite
                                      ? "text-red-500 fill-current"
                                      : "text-slate-400"
                                  }`}
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
                          {booking.description && (
                            <p className="text-sm text-slate-600 line-clamp-2">
                              {booking.description}
                            </p>
                          )}

                          {/* Détails */}
                          <div className="grid grid-cols-2 gap-3">
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <Calendar className="h-4 w-4 text-blue-500" />
                              <span className="font-medium">
                                {formatDate(booking.date)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <Clock className="h-4 w-4 text-green-500" />
                              <span className="font-medium">
                                {booking.time}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <Users className="h-4 w-4 text-purple-500" />
                              <span>{booking.participants} participants</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <Timer className="h-4 w-4 text-orange-500" />
                              <span>
                                {getTimeUntilBooking(
                                  booking.date,
                                  booking.time
                                )}
                              </span>
                            </div>
                          </div>

                          {/* Équipements */}
                          {booking.equipment &&
                            booking.equipment.length > 0 && (
                              <div>
                                <p className="text-xs text-slate-500 mb-2">
                                  Équipements
                                </p>
                                <div className="flex flex-wrap gap-1">
                                  {booking.equipment
                                    .slice(0, 3)
                                    .map((item, idx) => (
                                      <Badge
                                        key={idx}
                                        variant="secondary"
                                        className="text-xs"
                                      >
                                        {item}
                                      </Badge>
                                    ))}
                                  {booking.equipment.length > 3 && (
                                    <Badge
                                      variant="secondary"
                                      className="text-xs"
                                    >
                                      +{booking.equipment.length - 3}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            )}

                          {/* Actions */}
                          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8"
                              >
                                <Eye className="h-3 w-3 mr-1" />
                                Voir
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8"
                              >
                                <Edit className="h-3 w-3 mr-1" />
                                Modifier
                              </Button>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8"
                              >
                                <Download className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAndSortedBookings.map((booking, index) => {
                  const statusConfig = getStatusConfig(booking.status);
                  const priorityConfig = getPriorityConfig(booking.priority);
                  const StatusIcon = statusConfig.icon;

                  return (
                    <motion.div
                      key={booking.id}
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
                              <div
                                className={`p-2 ${theme.iconBg} rounded-xl shadow-lg flex-shrink-0`}
                              >
                                <Building2 className="h-5 w-5 text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-2">
                                  <h3 className="text-lg font-bold text-slate-900 truncate">
                                    {booking.title}
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
                                    className={`text-xs ${priorityConfig.color}`}
                                  >
                                    {priorityConfig.icon} {booking.priority}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-slate-600">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4 text-blue-500" />
                                    <span>{formatDate(booking.date)}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-4 w-4 text-green-500" />
                                    <span>{booking.time}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Users className="h-4 w-4 text-purple-500" />
                                    <span>
                                      {booking.participants} participants
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <MapPin className="h-4 w-4 text-orange-500" />
                                    <span>{booking.room}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleFavorite(booking.id)}
                                className="h-8 w-8 p-0"
                              >
                                <Heart
                                  className={`h-4 w-4 ${
                                    booking.isFavorite
                                      ? "text-red-500 fill-current"
                                      : "text-slate-400"
                                  }`}
                                />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8"
                              >
                                <Eye className="h-3 w-3 mr-1" />
                                Voir
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8"
                              >
                                <Edit className="h-3 w-3 mr-1" />
                                Modifier
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8"
                              >
                                <Download className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
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
