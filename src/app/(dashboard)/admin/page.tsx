"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { ConfirmationModal } from "@/components/admin/ConfirmationModal";
import { RoomFormModal } from "@/components/admin/RoomFormModal";
import { RoomDetailsModal } from "@/components/admin/RoomDetailsModal";
import { MaintenanceModal } from "@/components/admin/MaintenanceModal";
import { UserFormModal } from "@/components/admin/UserFormModal";
import { UserDetailsModal } from "@/components/admin/UserDetailsModal";
import { EmptyState } from "@/components/admin/EmptyState";
import { EquipmentManagement } from "@/components/admin/EquipmentManagement";
import { BookingManagement } from "@/components/admin/BookingManagement";
import {
  useAdminStats,
  useAdminRooms,
  useCreateRoom,
  useUpdateRoom,
  useDeleteRoom,
  useMaintenanceRoom,
  useCancelMaintenance,
  useAdminUsers,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
} from "@/hooks/use-admin-queries";
import { Button } from "@/components/ui/button";
import { LoadingDots } from "@/components/ui/LoadingDots";
import { RoomSkeleton } from "@/components/admin/RoomSkeleton";
import { UserSkeleton } from "@/components/admin/UserSkeleton";
import { StatsCardsSkeleton } from "@/components/admin/StatsCardsSkeleton";
import { SystemAlertsSkeleton } from "@/components/admin/SystemAlertsSkeleton";
import { RoomFilterSidebar } from "@/components/admin/RoomFilterSidebar";
import { UserFilterSidebar } from "@/components/admin/UserFilterSidebar";
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
  TooltipArrow,
} from "@/components/ui/tooltip";
import {
  Settings,
  Building2,
  Users,
  BarChart3,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Plus,
  Edit,
  Trash2,
  Eye,
  Wrench,
  Bell,
  LogOut,
  Calendar as CalendarIcon,
  Clock,
  Monitor,
  Tv,
  Mic,
  Video,
  Wifi,
  Phone,
  Square as Whiteboard,
  Thermometer,
  Lightbulb,
  Table,
  Coffee,
  Presentation,
  Laptop,
  Shield,
  Building2 as BuildingIcon,
  Waves,
  Plug,
  Sofa,
} from "lucide-react";

// Interface pour les statistiques
interface Stats {
  totalRooms: number;
  activeRooms: number;
  maintenanceRooms: number;
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  activeBookings: number;
  pendingUsers: number;
}

// Données simulées pour les salles
const rooms = [
  {
    id: 1,
    name: "Salle de conférence A",
    capacity: 12,
    status: "active",
    location: "Bâtiment A, 2ème étage",
    description:
      "Salle spacieuse idéale pour les conférences et présentations importantes",
    equipment: [
      "Projecteur",
      "Écran",
      "Système audio",
      "Microphone",
      "WiFi",
      "Climatisation",
    ],
    bookings: 24,
    lastMaintenance: "2024-01-10",
    nextMaintenance: "2024-02-10",
  },
  {
    id: 2,
    name: "Salle de réunion B",
    capacity: 8,
    status: "maintenance",
    location: "Bâtiment B, 1er étage",
    description: "Salle de réunion moderne avec équipements de vidéoconférence",
    equipment: [
      "Tableau blanc",
      "Caméra",
      "Vidéoconférence",
      "WiFi",
      "Climatisation",
    ],
    bookings: 18,
    lastMaintenance: "2024-01-15",
    nextMaintenance: "2024-01-25",
  },
  {
    id: 3,
    name: "Espace créatif",
    capacity: 6,
    status: "active",
    location: "Bâtiment C, Rez-de-chaussée",
    description: "Espace flexible pour brainstorming et sessions créatives",
    equipment: [
      "Tableau interactif",
      "Tables mobiles",
      "Chaises confortables",
      "WiFi",
      "Éclairage dimmable",
    ],
    bookings: 31,
    lastMaintenance: "2024-01-08",
    nextMaintenance: "2024-02-08",
  },
];

// Données simulées pour les utilisateurs récents
const recentUsers = [
  {
    id: 1,
    name: "Marie Dubois",
    email: "marie.dubois@company.com",
    role: "manager",
    department: "Ressources Humaines",
    phone: "+33 1 23 45 67 89",
    location: "Paris, France",
    lastLogin: "2024-01-15",
    bookings: 12,
    status: "active",
    notes: "Manager expérimentée avec 5 ans d'ancienneté",
    createdAt: "2023-06-15",
  },
  {
    id: 2,
    name: "Jean Martin",
    email: "jean.martin@company.com",
    role: "user",
    department: "Développement",
    phone: "+33 1 23 45 67 90",
    location: "Lyon, France",
    lastLogin: "2024-01-14",
    bookings: 8,
    status: "active",
    notes: "Développeur senior spécialisé en React",
    createdAt: "2023-08-20",
  },
  {
    id: 3,
    name: "Sophie Laurent",
    email: "sophie.laurent@company.com",
    role: "admin",
    department: "Direction",
    phone: "+33 1 23 45 67 91",
    location: "Paris, France",
    lastLogin: "2024-01-15",
    bookings: 25,
    status: "active",
    notes: "Directrice technique, responsable de l'architecture système",
    createdAt: "2023-01-10",
  },
];

// Données simulées pour les alertes système
const systemAlerts = [
  {
    id: 1,
    type: "warning",
    title: "Maintenance programmée",
    message: "La Salle B nécessite une maintenance le 25 janvier",
    timestamp: "2024-01-15 10:30",
    priority: "medium",
  },
  {
    id: 2,
    type: "info",
    title: "Nouveau utilisateur",
    message: "Pierre Dubois s'est inscrit sur la plateforme",
    timestamp: "2024-01-15 09:15",
    priority: "low",
  },
  {
    id: 3,
    type: "success",
    title: "Mise à jour réussie",
    message: "Le système a été mis à jour avec succès",
    timestamp: "2024-01-14 16:45",
    priority: "low",
  },
];

const getStatusConfig = (status: string) => {
  switch (status) {
    case "active":
      return {
        color: "bg-green-100 text-green-800",
        icon: CheckCircle,
      };
    case "maintenance":
      return {
        color: "bg-yellow-100 text-yellow-800",
        icon: AlertTriangle,
      };
    case "inactive":
      return {
        color: "bg-red-100 text-red-800",
        icon: AlertTriangle,
      };
    default:
      return {
        color: "bg-gray-100 text-gray-800",
        icon: Bell,
      };
  }
};

const getRoomStatusStyle = (room: any) => {
  // Vérifier d'abord si en maintenance
  if (room.isMaintenance || !room.isActive) {
    return {
      bgColor: "bg-red-50",
      borderColor: "border-red-300",
      iconColor: "text-red-600",
      textColor: "text-red-900",
      label: "En maintenance",
      icon: Wrench,
    };
  }

  // Vérifier si occupée
  if (room.isOccupied || room.currentBooking) {
    return {
      bgColor: "bg-orange-50",
      borderColor: "border-orange-300",
      iconColor: "text-orange-600",
      textColor: "text-orange-900",
      label: "Occupée",
      icon: Clock,
    };
  }

  // Sinon disponible
  return {
    bgColor: "bg-green-50",
    borderColor: "border-green-300",
    iconColor: "text-green-600",
    textColor: "text-green-900",
    label: "Disponible",
    icon: CheckCircle,
  };
};

const calculateTimeRemaining = (booking: any) => {
  if (!booking?.end) return null;

  const now = new Date();
  const endTime = new Date(booking.end);
  const diff = endTime.getTime() - now.getTime();

  if (diff <= 0) return null;

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  return { hours, minutes };
};

const getAlertConfig = (type: string) => {
  switch (type) {
    case "warning":
      return {
        color: "bg-yellow-50 border-yellow-200",
        iconColor: "text-yellow-600",
        iconBgColor: "bg-yellow-100",
        icon: AlertTriangle,
      };
    case "info":
      return {
        color: "bg-blue-50 border-blue-200",
        iconColor: "text-blue-600",
        iconBgColor: "bg-blue-100",
        icon: Bell,
      };
    case "success":
      return {
        color: "bg-green-50 border-green-200",
        iconColor: "text-green-600",
        iconBgColor: "bg-green-100",
        icon: CheckCircle,
      };
    default:
      return {
        color: "bg-gray-50 border-gray-200",
        iconColor: "text-gray-600",
        iconBgColor: "bg-gray-100",
        icon: Bell,
      };
  }
};

// Mapping des équipements vers leurs icônes
const getEquipmentIcon = (equipmentName: string) => {
  const equipmentMap: { [key: string]: any } = {
    Monitor: Monitor,
    Ecran: Monitor,
    Écran: Monitor,
    TV: Tv,
    Tv: Tv,
    Présentation: Presentation,
    Presentation: Presentation,
    Micro: Mic,
    Mic: Mic,
    Microphone: Mic,
    Vidéo: Video,
    Video: Video,
    Caméra: Video,
    Camera: Video,
    WiFi: Wifi,
    Wifi: Wifi,
    "Tableau blanc": Whiteboard,
    Laptop: Laptop,
    Ordinateur: Laptop,
    Portable: Laptop,
    "Chaises confortables": Sofa,
    "Chaise confortable": Sofa,
    Chaise: Sofa,
    Chaises: Sofa,
    Phone: Phone,
    Users: Users,
    Thermomètre: Thermometer,
    Thermometer: Thermometer,
    Éclairage: Lightbulb,
    Lightbulb: Lightbulb,
    Table: Table,
    Café: Coffee,
    Coffee: Coffee,
    Security: Shield,
    Shield: Shield,
    Building: BuildingIcon,
    Plug: Plug,
    Waves: Waves,
    Settings: Settings,
    Climatisation: Thermometer,
    "Système audio": Phone,
    Projecteur: Monitor,
  };

  return equipmentMap[equipmentName] || Settings;
};

export default function AdminPage() {
  // Initialiser avec l'onglet sauvegardé dans localStorage ou "overview" par défaut
  const [selectedTab, setSelectedTab] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("admin-selected-tab") || "overview";
    }
    return "overview";
  });
  const router = useRouter();

  // Sauvegarder l'onglet dans localStorage quand il change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("admin-selected-tab", selectedTab);
    }
  }, [selectedTab]);

  // TanStack Query hooks pour les données
  const { data: stats, isLoading: isLoadingStats } = useAdminStats();
  const { data: rooms = [], isLoading: isLoadingRooms } = useAdminRooms();
  const { data: users = recentUsers, isLoading: isLoadingUsers } =
    useAdminUsers();

  // Mutations pour les opérations
  const createRoomMutation = useCreateRoom();
  const updateRoomMutation = useUpdateRoom();
  const deleteRoomMutation = useDeleteRoom();
  const maintenanceRoomMutation = useMaintenanceRoom();
  const cancelMaintenanceMutation = useCancelMaintenance();
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();

  // État pour le filtre des utilisateurs
  const [userFilter, setUserFilter] = useState<"all" | "active" | "inactive">(
    "all"
  );

  // État pour le filtre des salles
  const [roomFilter, setRoomFilter] = useState<
    "all" | "available" | "occupied" | "maintenance"
  >("all");

  // États pour les modales
  const [showRoomForm, setShowRoomForm] = useState(false);
  const [showRoomDetails, setShowRoomDetails] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Stats par défaut si données non chargées
  const statsData = stats || {
    totalRooms: 0,
    activeRooms: 0,
    maintenanceRooms: 0,
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    activeBookings: 0,
    pendingUsers: 0,
  };

  // Optimisation : Utilisateurs filtrés avec useMemo
  const filteredUsers = useMemo(() => {
    if (userFilter === "all") return users;
    if (userFilter === "active") {
      return users.filter((user: any) => user.status === "active");
    }
    if (userFilter === "inactive") {
      return users.filter((user: any) => user.status !== "active");
    }
    return users;
  }, [users, userFilter]);

  // Optimisation : Salles filtrées avec useMemo
  const filteredRooms = useMemo(() => {
    if (roomFilter === "all") return rooms;
    if (roomFilter === "available") {
      return rooms.filter(
        (r: any) => r.isActive && !r.isOccupied && !r.isMaintenance
      );
    }
    if (roomFilter === "occupied") {
      return rooms.filter((r: any) => r.isOccupied && !r.isMaintenance);
    }
    if (roomFilter === "maintenance") {
      return rooms.filter((r: any) => r.isMaintenance || !r.isActive);
    }
    return rooms;
  }, [rooms, roomFilter]);

  const [showUserForm, setShowUserForm] = useState(false);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [showUserDeleteConfirm, setShowUserDeleteConfirm] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  // Utiliser les données depuis les hooks

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  // Fonctions pour la gestion des salles
  const handleAddRoom = () => {
    setSelectedRoom(null);
    setShowRoomForm(true);
  };

  const handleEditRoom = (room: any) => {
    setSelectedRoom(room);
    setShowRoomForm(true);
  };

  const handleViewRoom = (room: any) => {
    setSelectedRoom(room);
    setShowRoomDetails(true);
  };

  const handleDeleteRoom = (room: any) => {
    setSelectedRoom(room);
    setShowDeleteConfirm(true);
  };

  const handleMaintenanceRoom = (room: any) => {
    setSelectedRoom(room);
    setShowMaintenanceModal(true);
  };

  const handleCancelMaintenance = async (room: any) => {
    try {
      await cancelMaintenanceMutation.mutateAsync(room.id.toString());
    } catch (error) {
      console.error("Erreur lors de l'annulation de la maintenance:", error);
    }
  };

  const handleMaintenanceSubmit = async (data: any) => {
    if (!selectedRoom) return;

    try {
      await maintenanceRoomMutation.mutateAsync({
        roomId: selectedRoom.id.toString(),
        startImmediately: data.startImmediately,
        startDate: data.startDate || undefined,
        startTime: data.startTime || undefined,
        reason: data.reason,
        endDate: data.endDate,
        endTime: data.endTime,
        equipment: data.equipment || [],
      });

      setShowMaintenanceModal(false);
      setSelectedRoom(null);
    } catch (error) {
      // L'erreur est déjà gérée par la mutation
      console.error("Erreur lors de la mise en maintenance:", error);
    }
  };

  const handleRoomFormSubmit = async (data: any) => {
    try {
      if (selectedRoom) {
        await updateRoomMutation.mutateAsync({ id: selectedRoom.id, ...data });
      } else {
        await createRoomMutation.mutateAsync(data);
      }
      setShowRoomForm(false);
      setSelectedRoom(null);
    } catch (error) {
      // L'erreur est déjà gérée par la mutation
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedRoom) return;

    try {
      await deleteRoomMutation.mutateAsync(selectedRoom.id);
      setShowDeleteConfirm(false);
      setSelectedRoom(null);
    } catch (error) {
      // L'erreur est déjà gérée par la mutation
    }
  };

  // Fonctions pour la gestion des utilisateurs
  const handleAddUser = () => {
    setSelectedUser(null);
    setShowUserForm(true);
  };

  const handleEditUser = (user: any) => {
    setSelectedUser(user);
    setShowUserForm(true);
  };

  const handleViewUser = (user: any) => {
    setSelectedUser(user);
    setShowUserDetails(true);
  };

  const handleDeleteUser = (user: any) => {
    setSelectedUser(user);
    setShowUserDeleteConfirm(true);
  };

  const handleUserFormSubmit = async (data: any) => {
    try {
      if (selectedUser) {
        await updateUserMutation.mutateAsync({ id: selectedUser.id, ...data });
      } else {
        await createUserMutation.mutateAsync(data);
      }
      setShowUserForm(false);
      setSelectedUser(null);
    } catch (error) {
      // L'erreur est déjà gérée par la mutation
    }
  };

  const handleConfirmUserDelete = async () => {
    if (!selectedUser) return;

    try {
      await deleteUserMutation.mutateAsync(selectedUser.id);
      setShowUserDeleteConfirm(false);
      setSelectedUser(null);
    } catch (error) {
      // L'erreur est déjà gérée par la mutation
    }
  };

  const tabs = [
    { id: "overview", label: "Vue d'ensemble", icon: BarChart3 },
    { id: "rooms", label: "Gestion des salles", icon: Building2 },
    { id: "users", label: "Utilisateurs", icon: Users },
    { id: "bookings", label: "Réservations", icon: CalendarIcon },
    { id: "system", label: "Équipements", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-blue-50/50">
      {/* Header moderne avec gradient */}
      <div className="relative overflow-hidden">
        {/* Gradient animé en arrière-plan */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-700">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`,
              backgroundSize: "40px 40px",
            }}
          ></div>
        </div>

        {/* Effets de lumière animés */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="absolute top-0 left-0 w-72 h-72 bg-purple-500/20 rounded-full blur-[120px]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.2 }}
            className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-[140px]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.4, delay: 0.4 }}
            className="absolute bottom-0 left-1/4 w-80 h-80 bg-indigo-500/20 rounded-full blur-[100px]"
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-between gap-6"
          >
            <div className="flex items-center gap-4 sm:gap-5">
              {/* Icône avec effet brillant */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-white/30 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative p-3 sm:p-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl group-hover:bg-white/15 transition-all duration-300">
                  <Settings className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                </div>
              </motion.div>

              <div className="space-y-1">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight bg-gradient-to-r from-white via-blue-50 to-purple-50 bg-clip-text text-transparent drop-shadow-lg">
                  Administration
                </h1>
                <p className="text-blue-50 text-xs sm:text-sm font-medium hidden sm:block">
                  Tableau de bord • Gestion complète
                </p>
              </div>
            </div>

            {/* Bouton de déconnexion amélioré */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={handleLogout}
                className="relative overflow-hidden bg-white/10 hover:bg-white/15 backdrop-blur-xl border border-white/20 text-white shadow-xl hover:shadow-2xl transition-all duration-300 h-10 sm:h-11 px-5 sm:px-6 rounded-xl font-semibold cursor-pointer group"
              >
                {/* Effet brillant au hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>

                <LogOut className="h-4 w-4 sm:h-5 sm:w-5 mr-2 group-hover:rotate-90 transition-transform duration-300 relative z-10" />
                <span className="hidden sm:inline relative z-10 ml-1">
                  Se déconnecter
                </span>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Navigation par onglets */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TooltipProvider>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white rounded-2xl p-2 shadow-lg border border-slate-200 mb-8"
          >
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = selectedTab === tab.id;
                return (
                  <Button
                    key={tab.id}
                    onClick={() => setSelectedTab(tab.id)}
                    variant={isActive ? "default" : "ghost"}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 cursor-pointer ${
                      isActive
                        ? "bg-gradient-to-r from-indigo-500 to-blue-600 text-white shadow-lg hover:cursor-pointer"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 hover:cursor-pointer"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </Button>
                );
              })}
            </div>
          </motion.div>

          {/* Contenu des onglets */}
          <AnimatePresence mode="wait">
            {selectedTab === "overview" && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                {/* Statistiques principales */}
                {isLoadingStats ? (
                  <StatsCardsSkeleton />
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      className="group"
                    >
                      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 hover:border-blue-300 transition-all duration-300 hover:shadow-md hover:shadow-blue-100/50">
                        <CardContent className="p-4 sm:p-5">
                          <div className="flex items-center justify-between">
                            <div>
                              <TooltipProvider>
                                <Tooltip delayDuration={200}>
                                  <TooltipTrigger asChild>
                                    <p className="text-xs sm:text-sm font-semibold text-slate-700 cursor-help hover:text-blue-600 transition-colors">
                                      Salles totales
                                    </p>
                                  </TooltipTrigger>
                                  <TooltipContent
                                    side="top"
                                    className="font-medium"
                                  >
                                    <div className="text-center">
                                      <p className="font-semibold text-gray-900 mb-1">
                                        Salles disponibles
                                      </p>
                                      <p className="text-xs text-gray-600">
                                        Nombre total de salles dans le système
                                      </p>
                                    </div>
                                    <TooltipArrow />
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              <div className="flex items-center mt-1">
                                {isLoadingStats ? (
                                  <LoadingDots size={8} color="#0f172a" />
                                ) : (
                                  <p className="text-2xl sm:text-3xl font-bold text-slate-900">
                                    {statsData.totalRooms}
                                  </p>
                                )}
                              </div>
                              <div className="flex items-center gap-1 mt-1.5">
                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                                <span className="text-xs text-green-600 font-medium">
                                  {statsData.activeRooms} opérationnelles
                                </span>
                              </div>
                            </div>
                            <div className="h-10 w-10 sm:h-12 sm:w-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg sm:rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md">
                              <Building2 className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      className="group"
                    >
                      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 hover:border-green-300 transition-all duration-300 hover:shadow-md hover:shadow-green-100/50">
                        <CardContent className="p-4 sm:p-5">
                          <div className="flex items-center justify-between">
                            <div>
                              <TooltipProvider>
                                <Tooltip delayDuration={200}>
                                  <TooltipTrigger asChild>
                                    <p className="text-xs sm:text-sm font-semibold text-slate-700 cursor-help hover:text-green-600 transition-colors">
                                      Réservations actives
                                    </p>
                                  </TooltipTrigger>
                                  <TooltipContent
                                    side="top"
                                    className="font-medium"
                                  >
                                    <div className="text-center">
                                      <p className="font-semibold text-gray-900 mb-1">
                                        Réservations en cours
                                      </p>
                                      <p className="text-xs text-gray-600">
                                        Réservations actives aujourd'hui
                                      </p>
                                    </div>
                                    <TooltipArrow />
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              <div className="flex items-center mt-1">
                                {isLoadingStats ? (
                                  <LoadingDots size={8} color="#0f172a" />
                                ) : (
                                  <p className="text-2xl sm:text-3xl font-bold text-slate-900">
                                    {statsData.activeBookings}
                                  </p>
                                )}
                              </div>
                              <div className="flex items-center gap-1 mt-1.5">
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                                <span className="text-xs text-blue-600 font-medium">
                                  En cours
                                </span>
                              </div>
                            </div>
                            <div className="h-10 w-10 sm:h-12 sm:w-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg sm:rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md">
                              <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      className="group"
                    >
                      <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-200 hover:border-purple-300 transition-all duration-300 hover:shadow-md hover:shadow-purple-100/50">
                        <CardContent className="p-4 sm:p-5">
                          <div className="flex items-center justify-between">
                            <div>
                              <TooltipProvider>
                                <Tooltip delayDuration={200}>
                                  <TooltipTrigger asChild>
                                    <p className="text-xs sm:text-sm font-semibold text-slate-700 cursor-help hover:text-purple-600 transition-colors">
                                      Utilisateurs
                                    </p>
                                  </TooltipTrigger>
                                  <TooltipContent
                                    side="top"
                                    className="font-medium"
                                  >
                                    <div className="text-center">
                                      <p className="font-semibold text-gray-900 mb-1">
                                        Utilisateurs enregistrés
                                      </p>
                                      <p className="text-xs text-gray-600">
                                        Nombre total d'utilisateurs actifs
                                      </p>
                                    </div>
                                    <TooltipArrow />
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              <div className="flex items-center mt-1">
                                {isLoadingStats ? (
                                  <LoadingDots size={8} color="#0f172a" />
                                ) : (
                                  <p className="text-2xl sm:text-3xl font-bold text-slate-900">
                                    {statsData.totalUsers}
                                  </p>
                                )}
                              </div>
                              <div className="flex items-center gap-2 mt-1.5 whitespace-nowrap overflow-x-auto">
                                <div className="flex items-center gap-1 whitespace-nowrap">
                                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0"></div>
                                  <span className="text-xs text-green-600 font-medium whitespace-nowrap">
                                    {statsData.activeUsers} actifs
                                  </span>
                                </div>
                                <div className="flex items-center gap-1 whitespace-nowrap">
                                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full flex-shrink-0"></div>
                                  <span className="text-xs text-gray-600 font-medium whitespace-nowrap">
                                    {statsData.inactiveUsers} inactifs
                                  </span>
                                </div>
                                <div className="flex items-center gap-1 whitespace-nowrap">
                                  <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full flex-shrink-0"></div>
                                  <span className="text-xs text-yellow-700 font-medium whitespace-nowrap">
                                    {statsData.pendingUsers} en attente
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="h-10 w-10 sm:h-12 sm:w-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-lg sm:rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md">
                              <Users className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      className="group"
                    >
                      <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 hover:border-amber-300 transition-all duration-300 hover:shadow-md hover:shadow-amber-100/50">
                        <CardContent className="p-4 sm:p-5">
                          <div className="flex items-center justify-between">
                            <div>
                              <TooltipProvider>
                                <Tooltip delayDuration={200}>
                                  <TooltipTrigger asChild>
                                    <p className="text-xs sm:text-sm font-semibold text-slate-700 cursor-help hover:text-amber-600 transition-colors">
                                      Salles en maintenance
                                    </p>
                                  </TooltipTrigger>
                                  <TooltipContent
                                    side="top"
                                    className="font-medium"
                                  >
                                    <div className="text-center">
                                      <p className="font-semibold text-gray-900 mb-1">
                                        Maintenance en cours
                                      </p>
                                      <p className="text-xs text-gray-600">
                                        Nombre de salles actuellement en
                                        maintenance
                                      </p>
                                    </div>
                                    <TooltipArrow />
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              <div className="flex items-center mt-1">
                                {isLoadingStats ? (
                                  <LoadingDots size={8} color="#0f172a" />
                                ) : (
                                  <p className="text-2xl sm:text-3xl font-bold text-slate-900">
                                    {statsData.maintenanceRooms}
                                  </p>
                                )}
                              </div>
                              <div className="flex items-center gap-1 mt-1.5">
                                <Wrench className="h-3 w-3 text-amber-600" />
                                <span className="text-xs text-amber-600 font-medium">
                                  Nécessitent attention
                                </span>
                              </div>
                            </div>
                            <div className="h-10 w-10 sm:h-12 sm:w-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg sm:rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md">
                              <Wrench className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </div>
                )}

                {/* Alertes système */}
                {isLoadingStats ? (
                  <SystemAlertsSkeleton />
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Bell className="h-5 w-5 text-orange-600" />
                          Alertes système
                        </CardTitle>
                        <CardDescription>
                          Notifications et alertes importantes
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {systemAlerts.map((alert, index) => {
                            const alertConfig = getAlertConfig(alert.type);
                            const Icon = alertConfig.icon;
                            return (
                              <motion.div
                                key={alert.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className={`p-4 rounded-xl border-2 ${alertConfig.color} hover:shadow-md transition-shadow duration-300`}
                              >
                                <div className="flex items-start gap-3">
                                  <div
                                    className={`h-10 w-10 rounded-lg ${alertConfig.iconBgColor} flex items-center justify-center flex-shrink-0`}
                                  >
                                    <Icon
                                      className={`h-5 w-5 ${alertConfig.iconColor}`}
                                    />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2 mb-1.5">
                                      <h4 className="font-semibold text-slate-900 text-sm leading-tight">
                                        {alert.title}
                                      </h4>
                                      <Badge
                                        className={`text-xs px-2 py-0.5 flex-shrink-0 ${
                                          alert.priority === "high"
                                            ? "bg-red-100 text-red-800 border-red-300"
                                            : alert.priority === "medium"
                                              ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                                              : "bg-green-100 text-green-800 border-green-300"
                                        }`}
                                      >
                                        {alert.priority}
                                      </Badge>
                                    </div>
                                    <p className="text-xs text-slate-600 mb-2.5 leading-relaxed line-clamp-2">
                                      {alert.message}
                                    </p>
                                    <span className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                                      <Clock className="h-3.5 w-3.5" />
                                      {alert.timestamp}
                                    </span>
                                  </div>
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </motion.div>
            )}

            {selectedTab === "rooms" && (
              <motion.div
                key="rooms"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Interface unifiée */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
                  {/* Filtres sur le côté */}
                  <div className="lg:col-span-3">
                    <RoomFilterSidebar
                      roomFilter={roomFilter}
                      setRoomFilter={setRoomFilter}
                      rooms={rooms}
                    />
                  </div>

                  {/* Salles au centre */}
                  <div className="lg:col-span-9">
                    <Card>
                      <CardHeader>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                          <div className="flex-1 min-w-0">
                            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                              <Building2 className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0" />
                              <span className="truncate">
                                Toutes les salles
                              </span>
                            </CardTitle>
                            <CardDescription className="text-xs sm:text-sm mt-1">
                              Vue d'ensemble complète des salles
                            </CardDescription>
                          </div>
                          {rooms.length > 0 && (
                            <Button
                              onClick={handleAddRoom}
                              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 hover:cursor-pointer text-white cursor-pointer w-full sm:w-auto text-xs sm:text-sm h-9 sm:h-10 px-3 sm:px-6"
                            >
                              <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                              <span className="hidden md:inline">
                                Ajouter une salle
                              </span>
                              <span className="md:hidden">Nouvelle salle</span>
                            </Button>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {(() => {
                          // Afficher le skeleton si les données sont en cours de chargement
                          if (isLoadingRooms) {
                            return <RoomSkeleton />;
                          }

                          // Gérer les états vides selon le filtre
                          if (rooms.length === 0) {
                            return (
                              <EmptyState
                                icon={Building2}
                                title="Aucune salle disponible"
                                description="Il n'y a aucune salle à afficher pour le moment. Commencez par créer votre première salle !"
                                action={
                                  <Button
                                    onClick={() => {
                                      setShowRoomForm(true);
                                      setSelectedRoom(null);
                                    }}
                                    className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                                  >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Créer ma première salle
                                  </Button>
                                }
                                iconColor="text-blue-400"
                                gradientFrom="from-blue-100"
                                gradientTo="to-indigo-50"
                              />
                            );
                          }

                          if (filteredRooms.length === 0) {
                            // Messages différents selon le filtre
                            let title = "Aucune salle";
                            let description =
                              "Aucune salle ne correspond au filtre sélectionné.";
                            let icon = Building2;
                            let iconColor = "text-blue-400";
                            let gradientFrom = "from-blue-100";
                            let gradientTo = "to-indigo-50";

                            if (roomFilter === "available") {
                              title = "Aucune salle disponible";
                              description =
                                "Toutes les salles sont soit occupées, soit en maintenance pour le moment. Réessayez plus tard.";
                              icon = CheckCircle;
                              iconColor = "text-green-400";
                              gradientFrom = "from-green-100";
                              gradientTo = "to-emerald-50";
                            } else if (roomFilter === "occupied") {
                              title = "Aucune salle occupée";
                              description =
                                "Aucune salle n'est actuellement occupée. Toutes les salles sont disponibles ou en maintenance.";
                              icon = Clock;
                              iconColor = "text-orange-400";
                              gradientFrom = "from-orange-100";
                              gradientTo = "to-amber-50";
                            } else if (roomFilter === "maintenance") {
                              title = "Aucune salle en maintenance";
                              description =
                                "Excellente nouvelle ! Toutes les salles sont opérationnelles.";
                              icon = Wrench;
                              iconColor = "text-red-400";
                              gradientFrom = "from-red-100";
                              gradientTo = "to-rose-50";
                            }

                            return (
                              <EmptyState
                                icon={icon}
                                title={title}
                                description={description}
                                iconColor={iconColor}
                                gradientFrom={gradientFrom}
                                gradientTo={gradientTo}
                              />
                            );
                          }

                          return (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {filteredRooms.map((room: any, index) => {
                                const style = getRoomStatusStyle(room);
                                const StatusIcon = style.icon;
                                const bookingsCount =
                                  typeof room.bookings === "number"
                                    ? room.bookings
                                    : Array.isArray(room.bookings)
                                      ? room.bookings.length
                                      : 0;
                                const timeRemaining = room.currentBooking
                                  ? calculateTimeRemaining(room.currentBooking)
                                  : null;

                                return (
                                  <motion.div
                                    key={room.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    whileHover={{ scale: 1.01, y: -1 }}
                                    className={`group rounded-xl border-2 ${style.borderColor} ${style.bgColor} p-3 transition-all duration-300 hover:shadow-md`}
                                  >
                                    <div className="flex items-center justify-between gap-2 sm:gap-3">
                                      <div className="flex items-center gap-2.5 sm:gap-3 flex-1 min-w-0">
                                        <div
                                          className={`h-10 w-10 flex-shrink-0 rounded-lg flex items-center justify-center transition-transform duration-300 ${style.bgColor} border-2 ${style.borderColor}`}
                                        >
                                          <StatusIcon
                                            className={`h-5 w-5 ${style.iconColor}`}
                                          />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <h4
                                            className={`font-semibold text-sm sm:text-base leading-tight truncate ${style.textColor}`}
                                          >
                                            {room.name}
                                          </h4>
                                          <div className="flex items-center gap-2 text-xs flex-wrap">
                                            <span
                                              className={`${style.textColor} whitespace-nowrap`}
                                            >
                                              {room.capacity} places
                                            </span>
                                            {timeRemaining && (
                                              <Badge className="bg-orange-100 text-orange-900 border border-orange-300 text-[10px] py-0.5 px-1.5">
                                                <Clock className="h-2.5 w-2.5 mr-0.5" />
                                                {timeRemaining.hours > 0
                                                  ? `${timeRemaining.hours}h`
                                                  : ""}
                                                {timeRemaining.minutes}m
                                              </Badge>
                                            )}
                                          </div>
                                          {/* Equipment icons */}
                                          {((room.equipment &&
                                            room.equipment.length > 0) ||
                                            (room.features &&
                                              room.features.length > 0)) && (
                                            <div className="flex items-center gap-1 mt-1.5 flex-wrap">
                                              {(
                                                room.equipment ||
                                                room.features ||
                                                []
                                              )
                                                .slice(0, 4)
                                                .map(
                                                  (
                                                    equipment: string,
                                                    idx: number
                                                  ) => {
                                                    const IconComponent =
                                                      getEquipmentIcon(
                                                        equipment
                                                      );
                                                    return (
                                                      <TooltipProvider
                                                        key={idx}
                                                      >
                                                        <Tooltip
                                                          delayDuration={200}
                                                        >
                                                          <TooltipTrigger
                                                            asChild
                                                          >
                                                            <div className="p-0.5 bg-slate-100 rounded border border-slate-200 cursor-help">
                                                              <IconComponent className="h-3 w-3 text-slate-600" />
                                                            </div>
                                                          </TooltipTrigger>
                                                          <TooltipContent
                                                            side="top"
                                                            className="font-medium text-xs"
                                                          >
                                                            {equipment}
                                                          </TooltipContent>
                                                        </Tooltip>
                                                      </TooltipProvider>
                                                    );
                                                  }
                                                )}
                                              {(
                                                room.equipment ||
                                                room.features ||
                                                []
                                              ).length > 4 && (
                                                <span className="text-[10px] text-slate-500 px-1">
                                                  +
                                                  {(
                                                    room.equipment ||
                                                    room.features ||
                                                    []
                                                  ).length - 4}
                                                </span>
                                              )}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-1 flex-shrink-0">
                                        <TooltipProvider>
                                          <Tooltip delayDuration={200}>
                                            <TooltipTrigger asChild>
                                              <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 w-8 p-0 cursor-pointer hover:bg-blue-50 hover:text-blue-700 transition-all"
                                                onClick={() =>
                                                  handleViewRoom(room)
                                                }
                                              >
                                                <Eye className="h-4 w-4 text-blue-500" />
                                              </Button>
                                            </TooltipTrigger>
                                            <TooltipContent
                                              side="top"
                                              className="font-medium text-xs"
                                            >
                                              Voir les détails
                                            </TooltipContent>
                                          </Tooltip>
                                        </TooltipProvider>
                                        <TooltipProvider>
                                          <Tooltip delayDuration={200}>
                                            <TooltipTrigger asChild>
                                              <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 w-8 p-0 cursor-pointer hover:bg-green-50 hover:text-green-700 transition-all"
                                                onClick={() =>
                                                  handleEditRoom(room)
                                                }
                                              >
                                                <Edit className="h-4 w-4 text-green-500" />
                                              </Button>
                                            </TooltipTrigger>
                                            <TooltipContent
                                              side="top"
                                              className="font-medium"
                                            >
                                              <div className="text-center">
                                                <p className="font-semibold text-gray-900 mb-1">
                                                  Modifier la salle
                                                </p>
                                                <p className="text-xs text-gray-600">
                                                  Éditer les informations de la
                                                  salle
                                                </p>
                                              </div>
                                              <TooltipArrow />
                                            </TooltipContent>
                                          </Tooltip>
                                        </TooltipProvider>
                                        {!room.isActive ||
                                        room.isMaintenance ? (
                                          // Si en maintenance, afficher le bouton d'annulation
                                          <TooltipProvider>
                                            <Tooltip delayDuration={200}>
                                              <TooltipTrigger asChild>
                                                <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  className="h-9 w-9 sm:h-8 sm:w-8 p-0 cursor-pointer hover:bg-green-50 hover:scale-110 transition-all duration-200"
                                                  onClick={() =>
                                                    handleCancelMaintenance(
                                                      room
                                                    )
                                                  }
                                                >
                                                  <CheckCircle className="h-4 w-4 text-green-600" />
                                                </Button>
                                              </TooltipTrigger>
                                              <TooltipContent
                                                side="top"
                                                className="font-medium"
                                              >
                                                <div className="text-center">
                                                  <p className="font-semibold text-gray-900 mb-1">
                                                    Annuler la maintenance
                                                  </p>
                                                  <p className="text-xs text-gray-600">
                                                    Réactiver la salle
                                                  </p>
                                                </div>
                                                <TooltipArrow />
                                              </TooltipContent>
                                            </Tooltip>
                                          </TooltipProvider>
                                        ) : (
                                          // Sinon, afficher le bouton de mise en maintenance
                                          <TooltipProvider>
                                            <Tooltip delayDuration={200}>
                                              <TooltipTrigger asChild>
                                                <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  className="h-8 w-8 sm:h-8 sm:w-8 p-0 cursor-pointer hover:bg-orange-50 hover:scale-110 transition-all duration-200"
                                                  onClick={() =>
                                                    handleMaintenanceRoom(room)
                                                  }
                                                >
                                                  <Wrench className="h-4 w-4 text-orange-500" />
                                                </Button>
                                              </TooltipTrigger>
                                              <TooltipContent
                                                side="top"
                                                className="font-medium"
                                              >
                                                <div className="text-center">
                                                  <p className="font-semibold text-gray-900 mb-1">
                                                    Mettre en maintenance
                                                  </p>
                                                  <p className="text-xs text-gray-600">
                                                    Programmer une maintenance
                                                    pour cette salle
                                                  </p>
                                                </div>
                                                <TooltipArrow />
                                              </TooltipContent>
                                            </Tooltip>
                                          </TooltipProvider>
                                        )}
                                        <TooltipProvider>
                                          <Tooltip delayDuration={200}>
                                            <TooltipTrigger asChild>
                                              <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 w-8 sm:h-8 sm:w-8 p-0 cursor-pointer hover:bg-red-50 hover:scale-110 transition-all duration-200"
                                                onClick={() =>
                                                  handleDeleteRoom(room)
                                                }
                                              >
                                                <Trash2 className="h-4 w-4 text-red-500" />
                                              </Button>
                                            </TooltipTrigger>
                                            <TooltipContent
                                              side="top"
                                              className="font-medium"
                                            >
                                              <div className="text-center">
                                                <p className="font-semibold text-gray-900 mb-1">
                                                  Supprimer la salle
                                                </p>
                                                <p className="text-xs text-gray-600">
                                                  Cette action est irréversible
                                                </p>
                                              </div>
                                              <TooltipArrow />
                                            </TooltipContent>
                                          </Tooltip>
                                        </TooltipProvider>
                                      </div>
                                    </div>
                                  </motion.div>
                                );
                              })}
                            </div>
                          );
                        })()}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </motion.div>
            )}

            {selectedTab === "users" && (
              <motion.div
                key="users"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
                  {/* Filtres sur le côté */}
                  <div className="lg:col-span-3">
                    <UserFilterSidebar
                      userFilter={userFilter}
                      setUserFilter={setUserFilter}
                      users={users}
                    />
                  </div>

                  {/* Utilisateurs au centre */}
                  <div className="lg:col-span-9">
                    <Card>
                      <CardHeader>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                          <div className="flex-1 min-w-0">
                            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                              <Users className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 flex-shrink-0" />
                              <span className="truncate">
                                Gestion des utilisateurs
                              </span>
                            </CardTitle>
                            <CardDescription className="text-xs sm:text-sm mt-1">
                              Gérez les utilisateurs et leurs permissions
                            </CardDescription>
                          </div>
                          {users.length > 0 && (
                            <Button
                              onClick={handleAddUser}
                              className="bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 hover:cursor-pointer text-white cursor-pointer w-full sm:w-auto text-xs sm:text-sm h-9 sm:h-10 px-3 sm:px-6"
                            >
                              <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                              <span className="hidden md:inline">
                                Ajouter un utilisateur
                              </span>
                              <span className="md:hidden">
                                Nouvel utilisateur
                              </span>
                            </Button>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        {(() => {
                          // Afficher le skeleton si les données sont en cours de chargement
                          if (isLoadingUsers) {
                            return <UserSkeleton />;
                          }

                          if (filteredUsers.length === 0) {
                            // Messages différents selon le filtre
                            let title = "Aucun utilisateur";
                            let description =
                              "Il n'y a aucun utilisateur à afficher pour le moment. Commencez par ajouter votre premier utilisateur !";
                            let actionButton = null;
                            let icon = Users;
                            let iconColor = "text-purple-400";
                            let gradientFrom = "from-purple-100";
                            let gradientTo = "to-violet-50";

                            if (userFilter === "active") {
                              title = "Aucun utilisateur actif";
                              description =
                                "Il n'y a aucun utilisateur actif pour le moment. Les utilisateurs actifs peuvent se connecter et utiliser le système.";
                              icon = CheckCircle;
                              iconColor = "text-green-400";
                              gradientFrom = "from-green-100";
                              gradientTo = "to-emerald-50";
                            } else if (userFilter === "inactive") {
                              title = "Aucun utilisateur inactif";
                              description =
                                "Tous les utilisateurs sont actifs. Excellente nouvelle !";
                              icon = Clock;
                              iconColor = "text-gray-400";
                              gradientFrom = "from-gray-100";
                              gradientTo = "to-slate-50";
                            } else {
                              actionButton = (
                                <Button
                                  onClick={handleAddUser}
                                  className="bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 hover:cursor-pointer text-white shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                                >
                                  <Plus className="h-4 w-4 mr-2" />
                                  Ajouter mon premier utilisateur
                                </Button>
                              );
                            }

                            return (
                              <EmptyState
                                icon={icon}
                                title={title}
                                description={description}
                                action={actionButton}
                                iconColor={iconColor}
                                gradientFrom={gradientFrom}
                                gradientTo={gradientTo}
                              />
                            );
                          }

                          return (
                            <div className="grid grid-cols-1 gap-4">
                              {filteredUsers.map((user, index) => {
                                const userInitials = user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .toUpperCase()
                                  .slice(0, 2);
                                // Calculer le nombre de réservations
                                let bookingsCount = 0;
                                if (
                                  typeof (user as any).bookings === "number"
                                ) {
                                  bookingsCount = (user as any).bookings;
                                } else if (
                                  Array.isArray((user as any).bookings)
                                ) {
                                  bookingsCount = (user as any).bookings.length;
                                }

                                return (
                                  <motion.div
                                    key={user.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    whileHover={{ scale: 1 }}
                                    className="group rounded-xl border-2 border-purple-100 bg-gradient-to-br from-white to-purple-50/30 p-3 sm:p-5 transition-all duration-300 hover:shadow-lg hover:border-purple-200"
                                  >
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                                      <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                                        <div className="h-12 w-12 sm:h-14 sm:w-14 flex-shrink-0 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                                          <span className="text-white font-bold text-base sm:text-lg">
                                            {userInitials}
                                          </span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <div className="flex items-center gap-2 sm:gap-3 mb-1 flex-wrap">
                                            <h4 className="font-semibold text-slate-900 truncate text-sm sm:text-base">
                                              {user.name}
                                            </h4>
                                            <Badge
                                              className={`${
                                                user.status === "active"
                                                  ? "bg-green-100 text-green-800 border-green-300"
                                                  : "bg-gray-100 text-gray-800 border-gray-300"
                                              } text-[10px] sm:text-xs border`}
                                            >
                                              {user.status === "active" ? (
                                                <CheckCircle className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5 sm:mr-1" />
                                              ) : (
                                                <Clock className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5 sm:mr-1" />
                                              )}
                                              {user.status}
                                            </Badge>
                                          </div>
                                          <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-slate-600 flex-wrap">
                                            <span className="truncate max-w-[120px] sm:max-w-xs text-[10px] sm:text-sm">
                                              📧 {user.email}
                                            </span>
                                            <Badge className="bg-purple-100 text-purple-800 border-purple-300 text-[10px] sm:text-xs">
                                              {user.role}
                                            </Badge>
                                            <span className="flex items-center gap-1 text-[10px] sm:text-sm">
                                              📅 {bookingsCount} réservations
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-1 sm:gap-1 flex-shrink-0 justify-start sm:justify-end">
                                        <TooltipProvider>
                                          <Tooltip delayDuration={200}>
                                            <TooltipTrigger asChild>
                                              <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 w-8 sm:h-9 sm:w-9 p-0 cursor-pointer hover:bg-blue-50 hover:scale-110 transition-all duration-200"
                                                onClick={() =>
                                                  handleViewUser(user)
                                                }
                                              >
                                                <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600" />
                                              </Button>
                                            </TooltipTrigger>
                                            <TooltipContent
                                              side="top"
                                              className="font-medium"
                                            >
                                              <div className="text-center">
                                                <p className="font-semibold text-gray-900 mb-1">
                                                  Voir les détails
                                                </p>
                                                <p className="text-xs text-gray-600">
                                                  Consulter le profil
                                                  utilisateur
                                                </p>
                                              </div>
                                              <TooltipArrow />
                                            </TooltipContent>
                                          </Tooltip>
                                        </TooltipProvider>
                                        <TooltipProvider>
                                          <Tooltip delayDuration={200}>
                                            <TooltipTrigger asChild>
                                              <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 w-8 sm:h-9 sm:w-9 p-0 cursor-pointer hover:bg-green-50 hover:scale-110 transition-all duration-200"
                                                onClick={() =>
                                                  handleEditUser(user)
                                                }
                                              >
                                                <Edit className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-600" />
                                              </Button>
                                            </TooltipTrigger>
                                            <TooltipContent
                                              side="top"
                                              className="font-medium"
                                            >
                                              <div className="text-center">
                                                <p className="font-semibold text-gray-900 mb-1">
                                                  Modifier l'utilisateur
                                                </p>
                                                <p className="text-xs text-gray-600">
                                                  Éditer les informations
                                                  utilisateur
                                                </p>
                                              </div>
                                              <TooltipArrow />
                                            </TooltipContent>
                                          </Tooltip>
                                        </TooltipProvider>
                                        <TooltipProvider>
                                          <Tooltip delayDuration={200}>
                                            <TooltipTrigger asChild>
                                              <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 w-8 sm:h-9 sm:w-9 p-0 cursor-pointer hover:bg-red-50 hover:scale-110 transition-all duration-200"
                                                onClick={() =>
                                                  handleDeleteUser(user)
                                                }
                                              >
                                                <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-600" />
                                              </Button>
                                            </TooltipTrigger>
                                            <TooltipContent
                                              side="top"
                                              className="font-medium"
                                            >
                                              <div className="text-center">
                                                <p className="font-semibold text-gray-900 mb-1">
                                                  Supprimer l'utilisateur
                                                </p>
                                                <p className="text-xs text-gray-600">
                                                  Cette action est irréversible
                                                </p>
                                              </div>
                                              <TooltipArrow />
                                            </TooltipContent>
                                          </Tooltip>
                                        </TooltipProvider>
                                      </div>
                                    </div>
                                  </motion.div>
                                );
                              })}
                            </div>
                          );
                        })()}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </motion.div>
            )}

            {selectedTab === "bookings" && (
              <motion.div
                key="bookings"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <BookingManagement />
              </motion.div>
            )}

            {selectedTab === "system" && (
              <motion.div
                key="system"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <EquipmentManagement />
              </motion.div>
            )}
          </AnimatePresence>
        </TooltipProvider>
      </div>

      {/* Modales */}
      <div>
        <RoomFormModal
          isOpen={showRoomForm}
          onClose={() => {
            setShowRoomForm(false);
            setSelectedRoom(null);
          }}
          onSubmit={handleRoomFormSubmit}
          room={selectedRoom || undefined}
          isLoading={isLoading}
        />

        {selectedRoom && (
          <RoomDetailsModal
            isOpen={showRoomDetails}
            onClose={() => {
              setShowRoomDetails(false);
              setSelectedRoom(null);
            }}
            room={selectedRoom}
          />
        )}

        {selectedRoom && (
          <ConfirmationModal
            isOpen={showDeleteConfirm}
            onClose={() => {
              setShowDeleteConfirm(false);
              setSelectedRoom(null);
            }}
            onConfirm={handleConfirmDelete}
            title="Supprimer la salle"
            description={`Êtes-vous sûr de vouloir supprimer la salle "${selectedRoom.name}" ? Cette action est irréversible.`}
            type="delete"
            isLoading={isLoading}
          />
        )}

        {selectedRoom && (
          <MaintenanceModal
            isOpen={showMaintenanceModal}
            onClose={() => {
              setShowMaintenanceModal(false);
              setSelectedRoom(null);
            }}
            onSubmit={handleMaintenanceSubmit}
            room={selectedRoom}
            isLoading={maintenanceRoomMutation.isPending}
          />
        )}

        {/* Modales utilisateur */}
        <UserFormModal
          isOpen={showUserForm}
          onClose={() => {
            setShowUserForm(false);
            setSelectedUser(null);
          }}
          onSubmit={handleUserFormSubmit}
          user={selectedUser}
          isLoading={isLoading}
        />

        {selectedUser && (
          <UserDetailsModal
            isOpen={showUserDetails}
            onClose={() => {
              setShowUserDetails(false);
              setSelectedUser(null);
            }}
            user={selectedUser}
            onEdit={() => {
              setShowUserDetails(false);
              setShowUserForm(true);
            }}
            onDelete={() => {
              setShowUserDetails(false);
              setShowUserDeleteConfirm(true);
            }}
          />
        )}

        <ConfirmationModal
          isOpen={showUserDeleteConfirm}
          onClose={() => {
            setShowUserDeleteConfirm(false);
            setSelectedUser(null);
          }}
          onConfirm={handleConfirmUserDelete}
          title="Supprimer l'utilisateur"
          description={`Êtes-vous sûr de vouloir supprimer l'utilisateur "${selectedUser?.name}" ? Cette action est irréversible.`}
          type="delete"
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
