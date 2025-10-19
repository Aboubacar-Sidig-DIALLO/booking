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
import { Badge } from "@/components/ui/badge";
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
  Download,
  Eye,
  Globe,
  Database,
  Server,
  Lock,
  Bell,
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
    bookings: 24,
    revenue: 2400,
    lastMaintenance: "2024-01-10",
    nextMaintenance: "2024-02-10",
  },
  {
    id: 2,
    name: "Salle de réunion B",
    capacity: 8,
    status: "maintenance",
    bookings: 18,
    revenue: 1800,
    lastMaintenance: "2024-01-15",
    nextMaintenance: "2024-01-25",
  },
  {
    id: 3,
    name: "Espace créatif",
    capacity: 6,
    status: "active",
    bookings: 31,
    revenue: 3100,
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
    role: "Manager",
    lastLogin: "2024-01-15",
    bookings: 12,
    status: "active",
  },
  {
    id: 2,
    name: "Jean Martin",
    email: "jean.martin@company.com",
    role: "Employee",
    lastLogin: "2024-01-14",
    bookings: 8,
    status: "active",
  },
  {
    id: 3,
    name: "Sophie Laurent",
    email: "sophie.laurent@company.com",
    role: "Admin",
    lastLogin: "2024-01-15",
    bookings: 25,
    status: "active",
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

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Navigation par onglets */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                >
                  <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-600">
                            Salles totales
                          </p>
                          <p className="text-3xl font-bold text-slate-900">
                            {stats.totalRooms}
                          </p>
                        </div>
                        <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
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
                >
                  <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-600">
                            Réservations actives
                          </p>
                          <p className="text-3xl font-bold text-slate-900">
                            {stats.activeBookings}
                          </p>
                        </div>
                        <div className="h-12 w-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
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
                >
                  <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-600">
                            Utilisateurs
                          </p>
                          <p className="text-3xl font-bold text-slate-900">
                            {stats.totalUsers}
                          </p>
                        </div>
                        <div className="h-12 w-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center">
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
                >
                  <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-600">
                            Revenus mensuels
                          </p>
                          <p className="text-3xl font-bold text-slate-900">
                            €{stats.monthlyRevenue.toLocaleString()}
                          </p>
                        </div>
                        <div className="h-12 w-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center">
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
                    <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white cursor-pointer">
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter une salle
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
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
                          className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                              <Building2 className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-slate-900">
                                {room.name}
                              </h4>
                              <div className="flex items-center gap-4 text-sm text-slate-600">
                                <span>{room.capacity} places</span>
                                <span>{room.bookings} réservations</span>
                                <span>€{room.revenue}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge className={`${statusConfig.color} text-xs`}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {room.status}
                            </Badge>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 cursor-pointer"
                              >
                                <Eye className="h-4 w-4 text-slate-400" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 cursor-pointer"
                              >
                                <Edit className="h-4 w-4 text-slate-400" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 cursor-pointer"
                              >
                                <Trash2 className="h-4 w-4 text-red-400" />
                              </Button>
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
                    <Button className="bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white cursor-pointer">
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter un utilisateur
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentUsers.map((user, index) => (
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
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 cursor-pointer"
                            >
                              <Eye className="h-4 w-4 text-slate-400" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 cursor-pointer"
                            >
                              <Edit className="h-4 w-4 text-slate-400" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 cursor-pointer"
                            >
                              <Trash2 className="h-4 w-4 text-red-400" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
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
      </div>
    </div>
  );
}
