"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Calendar,
  Clock,
  Users,
  MapPin,
  MoreVertical,
  Edit,
  Trash2,
  Download,
} from "lucide-react";
import Link from "next/link";

const bookings = [
  {
    id: 1,
    room: "Salle de conférence A",
    date: "2024-01-15",
    time: "14:00 - 16:00",
    participants: 8,
    status: "confirmé",
    location: "Étage 2, Bureau 201",
  },
  {
    id: 2,
    room: "Salle de réunion B",
    date: "2024-01-16",
    time: "10:00 - 11:30",
    participants: 5,
    status: "en attente",
    location: "Étage 1, Bureau 105",
  },
  {
    id: 3,
    room: "Espace créatif",
    date: "2024-01-17",
    time: "09:00 - 12:00",
    participants: 6,
    status: "confirmé",
    location: "Étage 3, Bureau 301",
  },
];

export default function MyBookingsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Mes réservations
              </h1>
              <p className="text-slate-600 mt-2">
                Gérez vos réservations de salles
              </p>
            </div>
            <Link href="/bookings/new">
              <Button className="bg-slate-900 hover:bg-slate-800 text-white">
                <Calendar className="h-4 w-4 mr-2" />
                Nouvelle réservation
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Bookings List */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="space-y-6">
          {bookings.map((booking, index) => (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.3,
                delay: index * 0.05,
                ease: "easeOut",
              }}
            >
              <Card className="hover-lift border-slate-200 gpu-accelerated">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        <h3 className="text-xl font-semibold text-slate-900">
                          {booking.room}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            booking.status === "confirmé"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {booking.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-slate-600">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>{booking.date}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2" />
                          <span>{booking.time}</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2" />
                          <span>{booking.participants} participants</span>
                        </div>
                      </div>

                      <div className="flex items-center mt-4 text-slate-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{booking.location}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-6">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-slate-200"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Export
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-slate-200"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Modifier
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-red-200 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Annuler
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Empty state if no bookings */}
        {bookings.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="text-center py-12"
          >
            <Calendar className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              Aucune réservation
            </h3>
            <p className="text-slate-600 mb-6">
              Vous n'avez pas encore de réservations. Créez votre première
              réservation !
            </p>
            <Link href="/bookings/new">
              <Button className="bg-slate-900 hover:bg-slate-800 text-white">
                <Calendar className="h-4 w-4 mr-2" />
                Nouvelle réservation
              </Button>
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}
