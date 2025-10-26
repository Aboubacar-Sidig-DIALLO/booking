"use client";

import { useState, useEffect } from "react";
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
  Shield,
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Plus,
  Edit,
  Trash2,
  Eye,
  Globe,
  Database,
  Wrench,
  Download,
  Server,
  Bell,
  LogOut,
  Lock,
} from "lucide-react";

// Données simulées pour les statistiques
const stats = {
  totalRooms: 24,
  activeBookings: 156,
  totalUsers: 89,
  systemUptime: "99.9%",
  monthlyRevenue: 12500,
  averageRating: 4.7,
};

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
        icon: Clock,
      };
  }
};

const getAlertConfig = (type: string) => {
  switch (type) {
    case "warning":
      return {
        color: "bg-yellow-50 border-yellow-200",
        iconColor: "text-yellow-600",
        icon: AlertTriangle,
      };
    case "info":
      return {
        color: "bg-blue-50 border-blue-200",
        iconColor: "text-blue-600",
        icon: Bell,
      };
    case "success":
      return {
        color: "bg-green-50 border-green-200",
        iconColor: "text-green-600",
        icon: CheckCircle,
      };
    default:
      return {
        color: "bg-gray-50 border-gray-200",
        iconColor: "text-gray-600",
        icon: Bell,
      };
  }
};

export default function AdminPage() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedTab, setSelectedTab] = useState("overview");
  const router = useRouter();

  // États pour la gestion des salles
  const [rooms, setRooms] = useState([
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
      description:
        "Salle de réunion moderne avec équipements de vidéoconférence",
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
      maintenanceReason:
        "Réparation du système de climatisation et mise à jour des équipements de vidéoconférence",
      maintenanceEndDate: "2024-01-25",
      maintenanceEndTime: "14:00",
      maintenanceEquipment: ["Climatisation", "Vidéoconférence"],
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
  ]);

  // États pour les modales
  const [showRoomForm, setShowRoomForm] = useState(false);
  const [showRoomDetails, setShowRoomDetails] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // États pour les modales utilisateur
  const [users, setUsers] = useState(recentUsers);
  const [showUserForm, setShowUserForm] = useState(false);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [showUserDeleteConfirm, setShowUserDeleteConfirm] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Charger les données depuis l'API au montage
  useEffect(() => {
    const loadData = async () => {
      try {
        // Charger les salles
        const roomsResponse = await fetch("/api/admin/rooms");
        if (roomsResponse.ok) {
          const roomsData = await roomsResponse.json();
          setRooms(roomsData);
        }

        // Charger les utilisateurs
        const usersResponse = await fetch("/api/admin/users");
        if (usersResponse.ok) {
          const usersData = await usersResponse.json();
          setUsers(usersData);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
      }
    };

    loadData();
  }, []);

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

  const handleMaintenanceSubmit = async (data: any) => {
    setIsLoading(true);

    // Simuler une requête API
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mettre à jour la salle avec les informations de maintenance
    setRooms(
      rooms.map((room) =>
        room.id === selectedRoom.id
          ? {
              ...room,
              status: "maintenance",
              maintenanceReason: data.reason,
              maintenanceEndDate: data.endDate,
              maintenanceEndTime: data.endTime,
              maintenanceEquipment: data.equipment || [],
            }
          : room
      )
    );

    setIsLoading(false);
    setShowMaintenanceModal(false);
    setSelectedRoom(null);
  };

  const handleRoomFormSubmit = async (data: any) => {
    setIsLoading(true);

    try {
      if (selectedRoom) {
        // Modification
        const response = await fetch("/api/admin/rooms", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...data, id: selectedRoom.id }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const errorMessage =
            errorData.error || "Erreur lors de la modification de la salle";
          throw new Error(errorMessage);
        }

        const updatedRoom = await response.json();
        setRooms(
          rooms.map((room) =>
            room.id === selectedRoom.id ? updatedRoom : room
          )
        );
      } else {
        // Création
        const response = await fetch("/api/admin/rooms", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const errorMessage =
            errorData.error || "Erreur lors de la création de la salle";
          throw new Error(errorMessage);
        }

        const newRoom = await response.json();
        setRooms([...rooms, newRoom]);
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Une erreur est survenue. Veuillez réessayer."
      );
    } finally {
      setIsLoading(false);
      setShowRoomForm(false);
      setSelectedRoom(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedRoom) return;

    setIsLoading(true);

    try {
      const response = await fetch(`/api/admin/rooms?id=${selectedRoom.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage =
          errorData.error || "Erreur lors de la suppression de la salle";
        throw new Error(errorMessage);
      }

      setRooms(rooms.filter((room) => room.id !== selectedRoom.id));
    } catch (error) {
      console.error("Erreur:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Une erreur est survenue. Veuillez réessayer."
      );
    } finally {
      setIsLoading(false);
      setShowDeleteConfirm(false);
      setSelectedRoom(null);
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
    setIsLoading(true);

    try {
      if (selectedUser) {
        // Modification
        const response = await fetch("/api/admin/users", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...data, id: selectedUser.id }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const errorMessage =
            errorData.error ||
            "Erreur lors de la modification de l'utilisateur";
          throw new Error(errorMessage);
        }

        const updatedUser = await response.json();
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === selectedUser.id ? updatedUser : user
          )
        );
      } else {
        // Création
        console.log("Création utilisateur avec données:", data);
        const response = await fetch("/api/admin/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Error response:", errorText);

          let errorMessage = "Erreur lors de la création de l'utilisateur";
          try {
            const errorData = JSON.parse(errorText);
            errorMessage = errorData.error || errorMessage;
          } catch (e) {
            errorMessage = errorText || errorMessage;
          }

          throw new Error(errorMessage);
        }

        const newUser = await response.json();
        setUsers((prevUsers) => [...prevUsers, newUser]);
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Une erreur est survenue. Veuillez réessayer."
      );
    } finally {
      setIsLoading(false);
      setShowUserForm(false);
      setSelectedUser(null);
    }
  };

  const handleConfirmUserDelete = async () => {
    if (!selectedUser) return;

    setIsLoading(true);

    try {
      const response = await fetch(`/api/admin/users?id=${selectedUser.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage =
          errorData.error || "Erreur lors de la suppression de l'utilisateur";
        throw new Error(errorMessage);
      }

      setUsers((prevUsers) =>
        prevUsers.filter((user) => user.id !== selectedUser.id)
      );
    } catch (error) {
      console.error("Erreur:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Une erreur est survenue. Veuillez réessayer."
      );
    } finally {
      setIsLoading(false);
      setShowUserDeleteConfirm(false);
      setSelectedUser(null);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const tabs = [
    { id: "overview", label: "Vue d'ensemble", icon: BarChart3 },
    { id: "rooms", label: "Gestion des salles", icon: Building2 },
    { id: "users", label: "Utilisateurs", icon: Users },
    { id: "system", label: "Système", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-blue-50/50">
      {/* Header moderne avec gradient */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/90 via-blue-600/90 to-purple-600/90"></div>

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
                  <Settings className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
                  Administration
                </h1>
              </div>
              <p className="text-blue-100 text-lg sm:text-xl max-w-2xl">
                Tableau de bord administrateur - Gestion complète du système
              </p>

              {/* Informations système */}
              <div className="flex flex-wrap gap-4 pt-4">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                  <Clock className="h-4 w-4 text-blue-300" />
                  <span className="text-white text-sm font-medium">
                    {formatTime(currentTime)}
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                  <Server className="h-4 w-4 text-green-300" />
                  <span className="text-white text-sm font-medium">
                    Système opérationnel
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                  <Shield className="h-4 w-4 text-purple-300" />
                  <span className="text-white text-sm font-medium">
                    Sécurité active
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
              <Button className="bg-gradient-to-r from-white to-blue-50 text-blue-600 hover:from-blue-50 hover:to-white shadow-lg hover:shadow-xl h-12 px-6 rounded-xl font-semibold">
                <Download className="h-4 w-4 mr-2" />
                Exporter les données
              </Button>
              <Button
                onClick={handleLogout}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl h-12 px-6 rounded-xl font-semibold"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Se déconnecter
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
                        ? "bg-gradient-to-r from-indigo-500 to-blue-600 text-white shadow-lg"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
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
                className="space-y-6"
              >
                {/* Statistiques principales */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="group"
                  >
                    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 hover:border-blue-300 transition-all duration-300 hover:shadow-lg hover:shadow-blue-100/50">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <TooltipProvider>
                              <Tooltip delayDuration={200}>
                                <TooltipTrigger asChild>
                                  <p className="text-sm font-medium text-slate-600 cursor-help hover:text-blue-600 transition-colors">
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
                            <p className="text-3xl font-bold text-slate-900 mt-1">
                              {stats.totalRooms}
                            </p>
                            <div className="flex items-center gap-1 mt-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                              <span className="text-xs text-green-600 font-medium">
                                Toutes opérationnelles
                              </span>
                            </div>
                          </div>
                          <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                            <Building2 className="h-6 w-6 text-white" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    whileHover={{ scale: 1.02 }}
                    className="group"
                  >
                    <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 hover:border-green-300 transition-all duration-300 hover:shadow-lg hover:shadow-green-100/50">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <TooltipProvider>
                              <Tooltip delayDuration={200}>
                                <TooltipTrigger asChild>
                                  <p className="text-sm font-medium text-slate-600 cursor-help hover:text-green-600 transition-colors">
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
                            <p className="text-3xl font-bold text-slate-900 mt-1">
                              {stats.activeBookings}
                            </p>
                            <div className="flex items-center gap-1 mt-2">
                              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                              <span className="text-xs text-blue-600 font-medium">
                                En cours
                              </span>
                            </div>
                          </div>
                          <div className="h-12 w-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                            <Calendar className="h-6 w-6 text-white" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    whileHover={{ scale: 1.02 }}
                    className="group"
                  >
                    <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200 hover:border-purple-300 transition-all duration-300 hover:shadow-lg hover:shadow-purple-100/50">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <TooltipProvider>
                              <Tooltip delayDuration={200}>
                                <TooltipTrigger asChild>
                                  <p className="text-sm font-medium text-slate-600 cursor-help hover:text-purple-600 transition-colors">
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
                            <p className="text-3xl font-bold text-slate-900 mt-1">
                              {stats.totalUsers}
                            </p>
                            <div className="flex items-center gap-1 mt-2">
                              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                              <span className="text-xs text-purple-600 font-medium">
                                Actifs
                              </span>
                            </div>
                          </div>
                          <div className="h-12 w-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                            <Users className="h-6 w-6 text-white" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    whileHover={{ scale: 1.02 }}
                    className="group"
                  >
                    <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200 hover:border-orange-300 transition-all duration-300 hover:shadow-lg hover:shadow-orange-100/50">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <TooltipProvider>
                              <Tooltip delayDuration={200}>
                                <TooltipTrigger asChild>
                                  <p className="text-sm font-medium text-slate-600 cursor-help hover:text-orange-600 transition-colors">
                                    Revenus mensuels
                                  </p>
                                </TooltipTrigger>
                                <TooltipContent
                                  side="top"
                                  className="font-medium"
                                >
                                  <div className="text-center">
                                    <p className="font-semibold text-gray-900 mb-1">
                                      Chiffre d'affaires
                                    </p>
                                    <p className="text-xs text-gray-600">
                                      Revenus du mois en cours
                                    </p>
                                  </div>
                                  <TooltipArrow />
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <p className="text-3xl font-bold text-slate-900 mt-1">
                              €{stats.monthlyRevenue.toLocaleString()}
                            </p>
                            <div className="flex items-center gap-1 mt-2">
                              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                              <span className="text-xs text-orange-600 font-medium">
                                +12% ce mois
                              </span>
                            </div>
                          </div>
                          <div className="h-12 w-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                            <TrendingUp className="h-6 w-6 text-white" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>

                {/* Alertes système */}
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
                      <div className="space-y-3">
                        {systemAlerts.map((alert, index) => {
                          const alertConfig = getAlertConfig(alert.type);
                          const Icon = alertConfig.icon;
                          return (
                            <motion.div
                              key={alert.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className={`p-4 rounded-lg border ${alertConfig.color}`}
                            >
                              <div className="flex items-start gap-3">
                                <Icon
                                  className={`h-5 w-5 ${alertConfig.iconColor} mt-0.5`}
                                />
                                <div className="flex-1">
                                  <h4 className="font-semibold text-slate-900 mb-1">
                                    {alert.title}
                                  </h4>
                                  <p className="text-sm text-slate-600 mb-2">
                                    {alert.message}
                                  </p>
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs text-slate-500">
                                      {alert.timestamp}
                                    </span>
                                    <Badge
                                      className={`text-xs ${
                                        alert.priority === "high"
                                          ? "bg-red-100 text-red-800"
                                          : alert.priority === "medium"
                                            ? "bg-yellow-100 text-yellow-800"
                                            : "bg-green-100 text-green-800"
                                      }`}
                                    >
                                      {alert.priority}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
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
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Building2 className="h-5 w-5 text-blue-600" />
                          Gestion des salles
                        </CardTitle>
                        <CardDescription>
                          Gérez toutes les salles du système
                        </CardDescription>
                      </div>
                      <Button
                        onClick={handleAddRoom}
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white cursor-pointer"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Ajouter une salle
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {rooms.length === 0 ? (
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
                            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Créer ma première salle
                          </Button>
                        }
                        iconColor="text-blue-400"
                        gradientFrom="from-blue-100"
                        gradientTo="to-indigo-50"
                      />
                    ) : (
                      <div className="space-y-4">
                        {rooms.map((room, index) => {
                          const statusConfig = getStatusConfig(room.status);
                          const StatusIcon = statusConfig.icon;
                          return (
                            <motion.div
                              key={room.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              whileHover={{ scale: 1.01 }}
                              className="group flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl hover:from-slate-100 hover:to-slate-200 transition-all duration-300 hover:shadow-md border border-slate-200 hover:border-slate-300"
                            >
                              <div className="flex items-center gap-4">
                                <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                  <Building2 className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                  <h4 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                                    {room.name}
                                  </h4>
                                  <div className="flex items-center gap-4 text-sm text-slate-600">
                                    <TooltipProvider>
                                      <Tooltip delayDuration={200}>
                                        <TooltipTrigger asChild>
                                          <span className="cursor-help hover:text-blue-600 transition-colors font-medium">
                                            {room.capacity} places
                                          </span>
                                        </TooltipTrigger>
                                        <TooltipContent
                                          side="top"
                                          className="font-medium"
                                        >
                                          <div className="text-center">
                                            <p className="font-semibold text-gray-900 mb-1">
                                              Capacité maximale
                                            </p>
                                            <p className="text-xs text-gray-600">
                                              Nombre de personnes pouvant être
                                              accueillies
                                            </p>
                                          </div>
                                          <TooltipArrow />
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                    <TooltipProvider>
                                      <Tooltip delayDuration={200}>
                                        <TooltipTrigger asChild>
                                          <span className="cursor-help hover:text-green-600 transition-colors font-medium">
                                            {room.bookings} réservations
                                          </span>
                                        </TooltipTrigger>
                                        <TooltipContent
                                          side="top"
                                          className="font-medium"
                                        >
                                          <div className="text-center">
                                            <p className="font-semibold text-gray-900 mb-1">
                                              Réservations totales
                                            </p>
                                            <p className="text-xs text-gray-600">
                                              Nombre de réservations effectuées
                                            </p>
                                          </div>
                                          <TooltipArrow />
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                    <TooltipProvider>
                                      <Tooltip delayDuration={200}>
                                        <TooltipTrigger asChild>
                                          <span className="cursor-help hover:text-purple-600 transition-colors font-medium">
                                            {room.equipment?.length || 0}{" "}
                                            équipements
                                          </span>
                                        </TooltipTrigger>
                                        <TooltipContent
                                          side="top"
                                          className="font-medium"
                                        >
                                          <div className="text-center">
                                            <p className="font-semibold text-gray-900 mb-1">
                                              Équipements disponibles
                                            </p>
                                            <p className="text-xs text-gray-600">
                                              Nombre d'équipements dans la salle
                                            </p>
                                          </div>
                                          <TooltipArrow />
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <Badge
                                  className={`${statusConfig.color} text-xs`}
                                >
                                  <StatusIcon className="h-3 w-3 mr-1" />
                                  {room.status}
                                </Badge>
                                <div className="flex gap-1">
                                  <TooltipProvider>
                                    <Tooltip delayDuration={200}>
                                      <TooltipTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="h-8 w-8 p-0 cursor-pointer hover:bg-blue-50 hover:scale-110 transition-all duration-200"
                                          onClick={() => handleViewRoom(room)}
                                        >
                                          <Eye className="h-4 w-4 text-blue-500" />
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
                                            Consulter les informations complètes
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
                                          className="h-8 w-8 p-0 cursor-pointer hover:bg-green-50 hover:scale-110 transition-all duration-200"
                                          onClick={() => handleEditRoom(room)}
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
                                            Éditer les informations de la salle
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
                                          className="h-8 w-8 p-0 cursor-pointer hover:bg-orange-50 hover:scale-110 transition-all duration-200 disabled:hover:scale-100 disabled:opacity-50"
                                          onClick={() =>
                                            handleMaintenanceRoom(room)
                                          }
                                          disabled={
                                            room.status === "maintenance"
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
                                            {room.status === "maintenance"
                                              ? "En maintenance"
                                              : "Mettre en maintenance"}
                                          </p>
                                          <p className="text-xs text-gray-600">
                                            {room.status === "maintenance"
                                              ? "Cette salle est actuellement en maintenance"
                                              : "Programmer une maintenance pour cette salle"}
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
                                          className="h-8 w-8 p-0 cursor-pointer hover:bg-red-50 hover:scale-110 transition-all duration-200"
                                          onClick={() => handleDeleteRoom(room)}
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
                    )}
                  </CardContent>
                </Card>
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
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Users className="h-5 w-5 text-purple-600" />
                          Gestion des utilisateurs
                        </CardTitle>
                        <CardDescription>
                          Gérez les utilisateurs et leurs permissions
                        </CardDescription>
                      </div>
                      {users.length > 0 && (
                        <Button
                          onClick={handleAddUser}
                          className="bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white cursor-pointer"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Ajouter un utilisateur
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {users.length === 0 ? (
                      <EmptyState
                        icon={Users}
                        title="Aucun utilisateur"
                        description="Il n'y a aucun utilisateur à afficher pour le moment. Commencez par ajouter votre premier utilisateur !"
                        action={
                          <Button
                            onClick={handleAddUser}
                            className="bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Ajouter mon premier utilisateur
                          </Button>
                        }
                        iconColor="text-purple-400"
                        gradientFrom="from-purple-100"
                        gradientTo="to-violet-50"
                      />
                    ) : (
                      <div className="space-y-4">
                        {users.map((user, index) => (
                          <motion.div
                            key={user.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                          >
                            <div className="flex items-center gap-4">
                              <div className="h-12 w-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center">
                                <Users className="h-6 w-6 text-white" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-slate-900">
                                  {user.name}
                                </h4>
                                <div className="flex items-center gap-4 text-sm text-slate-600">
                                  <span>{user.email}</span>
                                  <span>{user.role}</span>
                                  <span>{user.bookings} réservations</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Badge className="bg-green-100 text-green-800 text-xs">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                {user.status}
                              </Badge>
                              <div className="flex gap-1">
                                <TooltipProvider>
                                  <Tooltip delayDuration={200}>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 p-0 cursor-pointer hover:bg-blue-50 hover:scale-110 transition-all duration-200"
                                        onClick={() => handleViewUser(user)}
                                      >
                                        <Eye className="h-4 w-4 text-blue-500" />
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
                                          Consulter le profil utilisateur
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
                                        className="h-8 w-8 p-0 cursor-pointer hover:bg-green-50 hover:scale-110 transition-all duration-200"
                                        onClick={() => handleEditUser(user)}
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
                                          Modifier l'utilisateur
                                        </p>
                                        <p className="text-xs text-gray-600">
                                          Éditer les informations utilisateur
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
                                        className="h-8 w-8 p-0 cursor-pointer hover:bg-red-50 hover:scale-110 transition-all duration-200"
                                        onClick={() => handleDeleteUser(user)}
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
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {selectedTab === "system" && (
              <motion.div
                key="system"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Server className="h-5 w-5 text-green-600" />
                        État du système
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-medium text-slate-900">
                              Serveur principal
                            </span>
                          </div>
                          <span className="text-sm font-bold text-green-600">
                            Opérationnel
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Database className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-medium text-slate-900">
                              Base de données
                            </span>
                          </div>
                          <span className="text-sm font-bold text-green-600">
                            Opérationnel
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-medium text-slate-900">
                              API
                            </span>
                          </div>
                          <span className="text-sm font-bold text-green-600">
                            Opérationnel
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-blue-600" />
                        Sécurité
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Lock className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-medium text-slate-900">
                              Chiffrement
                            </span>
                          </div>
                          <span className="text-sm font-bold text-blue-600">
                            Actif
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-medium text-slate-900">
                              Firewall
                            </span>
                          </div>
                          <span className="text-sm font-bold text-blue-600">
                            Actif
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Activity className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-medium text-slate-900">
                              Monitoring
                            </span>
                          </div>
                          <span className="text-sm font-bold text-blue-600">
                            Actif
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </TooltipProvider>
      </div>

      {/* Modales */}
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
          isLoading={isLoading}
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
  );
}
