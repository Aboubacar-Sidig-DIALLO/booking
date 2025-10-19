"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Search,
  Building2,
  Calendar,
  Users,
  Clock,
  MapPin,
  Heart,
  Eye,
  X,
} from "lucide-react";
import Link from "next/link";

// Données simulées pour la recherche
const searchData = {
  rooms: [
    {
      id: 1,
      name: "Salle de conférence A",
      capacity: 12,
      status: "disponible",
      location: "Étage 2, Bureau 201",
      equipment: ["Écran", "WiFi", "Projecteur"],
      occupancy: 85,
      isFavorite: true,
    },
    {
      id: 2,
      name: "Salle de réunion B",
      capacity: 8,
      status: "occupée",
      location: "Étage 1, Bureau 105",
      equipment: ["Écran", "WiFi"],
      occupancy: 92,
      isFavorite: false,
    },
    {
      id: 3,
      name: "Espace créatif",
      capacity: 6,
      status: "disponible",
      location: "Étage 3, Bureau 301",
      equipment: ["WiFi", "Café"],
      occupancy: 67,
      isFavorite: true,
    },
  ],
  bookings: [
    {
      id: 1,
      title: "Réunion équipe marketing",
      room: "Salle de conférence A",
      date: "2024-01-15",
      time: "14:00 - 16:00",
      participants: 8,
      status: "confirmé",
    },
    {
      id: 2,
      title: "Brainstorming créatif",
      room: "Espace créatif",
      date: "2024-01-16",
      time: "09:00 - 12:00",
      participants: 6,
      status: "en attente",
    },
  ],
  users: [
    {
      id: 1,
      name: "Marie Dubois",
      email: "marie.dubois@company.com",
      role: "Manager",
      department: "Marketing",
    },
    {
      id: 2,
      name: "Jean Martin",
      email: "jean.martin@company.com",
      role: "Employee",
      department: "IT",
    },
  ],
};

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GlobalSearchModal({
  isOpen,
  onClose,
}: GlobalSearchModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [searchResults, setSearchResults] = useState({
    rooms: [],
    bookings: [],
    users: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const tabs = [
    { id: "all", label: "Tout", icon: Search },
    { id: "rooms", label: "Salles", icon: Building2 },
    { id: "bookings", label: "Réservations", icon: Calendar },
    { id: "users", label: "Utilisateurs", icon: Users },
  ];

  // Focus sur l'input quand le modal s'ouvre
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Recherche simulée
  useEffect(() => {
    if (searchTerm.length < 2) {
      setSearchResults({ rooms: [], bookings: [], users: [] });
      return;
    }

    setIsLoading(true);

    // Simuler un délai de recherche
    const timeout = setTimeout(() => {
      const term = searchTerm.toLowerCase();

      const filteredRooms = searchData.rooms.filter(
        (room) =>
          room.name.toLowerCase().includes(term) ||
          room.location.toLowerCase().includes(term) ||
          room.equipment.some((eq) => eq.toLowerCase().includes(term))
      );

      const filteredBookings = searchData.bookings.filter(
        (booking) =>
          booking.title.toLowerCase().includes(term) ||
          booking.room.toLowerCase().includes(term)
      );

      const filteredUsers = searchData.users.filter(
        (user) =>
          user.name.toLowerCase().includes(term) ||
          user.email.toLowerCase().includes(term) ||
          user.department.toLowerCase().includes(term)
      );

      setSearchResults({
        rooms: filteredRooms,
        bookings: filteredBookings,
        users: filteredUsers,
      });

      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchTerm]);

  const getTotalResults = () => {
    return (
      searchResults.rooms.length +
      searchResults.bookings.length +
      searchResults.users.length
    );
  };

  const getFilteredResults = () => {
    if (activeTab === "all") {
      return {
        rooms: searchResults.rooms,
        bookings: searchResults.bookings,
        users: searchResults.users,
      };
    }

    return {
      rooms: activeTab === "rooms" ? searchResults.rooms : [],
      bookings: activeTab === "bookings" ? searchResults.bookings : [],
      users: activeTab === "users" ? searchResults.users : [],
    };
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="absolute top-20 left-1/2 transform -translate-x-1/2 w-full max-w-2xl mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
          {/* Header de recherche */}
          <div className="p-6 border-b border-slate-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Rechercher des salles, réservations, utilisateurs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full pl-10 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Onglets */}
            <div className="flex gap-2 mt-4">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <Button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                    {tab.id !== "all" && (
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          isActive ? "bg-white/20" : "bg-slate-200"
                        }`}
                      >
                        {tab.id === "rooms"
                          ? searchResults.rooms.length
                          : tab.id === "bookings"
                            ? searchResults.bookings.length
                            : tab.id === "users"
                              ? searchResults.users.length
                              : 0}
                      </span>
                    )}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Résultats de recherche */}
          <div className="max-h-96 overflow-y-auto">
            {searchTerm.length < 2 ? (
              <div className="p-8 text-center">
                <div className="h-16 w-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Recherche globale
                </h3>
                <p className="text-slate-600">
                  Tapez au moins 2 caractères pour commencer la recherche
                </p>
              </div>
            ) : isLoading ? (
              <div className="p-8 text-center">
                <div className="h-16 w-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <Search className="h-8 w-8 text-blue-600" />
                  </motion.div>
                </div>
                <p className="text-slate-600">Recherche en cours...</p>
              </div>
            ) : getTotalResults() === 0 ? (
              <div className="p-8 text-center">
                <div className="h-16 w-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Aucun résultat trouvé
                </h3>
                <p className="text-slate-600">
                  Aucun élément ne correspond à votre recherche "{searchTerm}"
                </p>
              </div>
            ) : (
              <div className="p-4">
                <AnimatePresence>
                  {getFilteredResults().rooms.map((room, index) => (
                    <motion.div
                      key={`room-${room.id}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-4 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                          <Building2 className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-900">
                            {room.name}
                          </h4>
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Users className="h-3 w-3" />
                            <span>{room.capacity} places</span>
                            <span className="text-slate-400">•</span>
                            <MapPin className="h-3 w-3" />
                            <span>{room.location}</span>
                            <span className="text-slate-400">•</span>
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                room.status === "disponible"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {room.status}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <Heart
                              className={`h-4 w-4 ${room.isFavorite ? "text-red-500 fill-current" : "text-slate-400"}`}
                            />
                          </Button>
                          <Link href={`/rooms/${room.id}`}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <Eye className="h-4 w-4 text-slate-400" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {getFilteredResults().bookings.map((booking, index) => (
                    <motion.div
                      key={`booking-${booking.id}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-4 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                          <Calendar className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-900">
                            {booking.title}
                          </h4>
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Building2 className="h-3 w-3" />
                            <span>{booking.room}</span>
                            <span className="text-slate-400">•</span>
                            <Clock className="h-3 w-3" />
                            <span>
                              {booking.date} {booking.time}
                            </span>
                            <span className="text-slate-400">•</span>
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                booking.status === "confirmé"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {booking.status}
                            </span>
                          </div>
                        </div>
                        <Link href={`/bookings/${booking.id}`}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <Eye className="h-4 w-4 text-slate-400" />
                          </Button>
                        </Link>
                      </div>
                    </motion.div>
                  ))}

                  {getFilteredResults().users.map((user, index) => (
                    <motion.div
                      key={`user-${user.id}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-4 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-gradient-to-br from-purple-500 to-violet-600 rounded-lg flex items-center justify-center">
                          <Users className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-900">
                            {user.name}
                          </h4>
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <span>{user.email}</span>
                            <span className="text-slate-400">•</span>
                            <span>{user.role}</span>
                            <span className="text-slate-400">•</span>
                            <span>{user.department}</span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <Eye className="h-4 w-4 text-slate-400" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Footer avec raccourcis */}
          <div className="p-4 bg-slate-50 border-t border-slate-200">
            <div className="flex items-center justify-between text-sm text-slate-600">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <kbd className="px-2 py-1 bg-white border border-slate-200 rounded text-xs">
                    Esc
                  </kbd>
                  <span>pour fermer</span>
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-2 py-1 bg-white border border-slate-200 rounded text-xs">
                    ↑↓
                  </kbd>
                  <span>pour naviguer</span>
                </span>
              </div>
              <span className="text-xs">
                {getTotalResults()} résultat{getTotalResults() > 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
