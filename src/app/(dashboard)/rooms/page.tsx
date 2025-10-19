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
import { Users, Clock, Plus, Search, Filter } from "lucide-react";
import Link from "next/link";

const rooms = [
  {
    id: 1,
    name: "Salle de conférence A",
    capacity: 12,
    equipment: ["Écran", "WiFi", "Projecteur"],
    status: "disponible",
    nextBooking: "14:00 - 16:00",
  },
  {
    id: 2,
    name: "Salle de réunion B",
    capacity: 8,
    equipment: ["Écran", "WiFi"],
    status: "occupée",
    nextBooking: "10:00 - 11:30",
  },
  {
    id: 3,
    name: "Espace créatif",
    capacity: 6,
    equipment: ["WiFi", "Café"],
    status: "disponible",
    nextBooking: "09:00 - 12:00",
  },
  {
    id: 4,
    name: "Salle de formation",
    capacity: 20,
    equipment: ["Écran", "WiFi", "Projecteur", "Café"],
    status: "disponible",
    nextBooking: "15:00 - 17:00",
  },
];

export default function RoomsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Salles</h1>
              <p className="text-slate-600 mt-2">
                Gérez et réservez vos espaces de travail
              </p>
            </div>
            <Link href="/bookings/new">
              <Button className="bg-slate-900 hover:bg-slate-800 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle réservation
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="border-b border-slate-200 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher une salle..."
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              />
            </div>
            <Button
              variant="outline"
              className="border-slate-200 cursor-pointer"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filtres
            </Button>
          </div>
        </div>
      </div>

      {/* Rooms Grid */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room, index) => (
            <motion.div
              key={room.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.3,
                delay: index * 0.05,
                ease: "easeOut",
              }}
            >
              <Card className="hover-lift border-slate-200 gpu-accelerated">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg text-slate-900">
                      {room.name}
                    </CardTitle>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        room.status === "disponible"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {room.status}
                    </span>
                  </div>
                  <CardDescription className="flex items-center text-slate-600">
                    <Users className="h-4 w-4 mr-1" />
                    {room.capacity} personnes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Equipment */}
                    <div>
                      <h4 className="text-sm font-medium text-slate-900 mb-2">
                        Équipements
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {room.equipment.map((item, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded-md"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Next booking */}
                    <div className="flex items-center text-sm text-slate-600">
                      <Clock className="h-4 w-4 mr-2" />
                      Prochaine réservation: {room.nextBooking}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Link href={`/rooms/${room.id}`} className="flex-1">
                        <Button
                          variant="outline"
                          className="w-full border-slate-200 text-slate-700 cursor-pointer"
                        >
                          Voir détails
                        </Button>
                      </Link>
                      <Link href={`/bookings/new?room=${room.id}`}>
                        <Button
                          className="bg-slate-900 hover:bg-slate-800 text-white cursor-pointer"
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
          ))}
        </div>
      </div>
    </div>
  );
}
