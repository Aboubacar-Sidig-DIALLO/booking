"use client";

import { motion } from "framer-motion";
import BookingWizard from "@/components/booking/BookingWizard";
import { Calendar, Plus, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NewBookingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header moderne et élégant avec effet de flou */}
      <div className="sticky top-0 z-20 border-b border-slate-200/60 shadow-sm">
        {/* Fond flouté avec overlay */}
        <div className="absolute inset-0 bg-white/70 backdrop-blur-2xl backdrop-saturate-150"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20"></div>

        <div className="relative max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Navigation et titre */}
            <div className="flex items-center space-x-6">
              <Link href="/my-bookings">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full px-4 py-2 transition-all duration-200"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Mes réservations</span>
                  <span className="sm:hidden">Retour</span>
                </Button>
              </Link>

              <div className="flex items-center space-x-4">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                  className="h-12 w-12 bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25"
                >
                  <Plus className="h-6 w-6 text-white" />
                </motion.div>
                <div>
                  <motion.h1
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent"
                  >
                    Nouvelle réservation
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-sm text-slate-600 font-medium"
                  >
                    🚀 Assistant intelligent • Suggestions personnalisées
                  </motion.p>
                </div>
              </div>
            </div>

            {/* Actions rapides */}
            <div className="hidden lg:flex items-center space-x-3">
              <div className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-emerald-50 to-green-50 rounded-full border border-emerald-200">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-emerald-700">
                  En ligne
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full border-slate-300 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Aide
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal avec animations */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden"
        >
          {/* Header de la carte moderne */}
          <div className="relative overflow-hidden">
            {/* Gradient de fond avec pattern moderne */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700"></div>
            <div className="absolute inset-0 opacity-20">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `radial-gradient(circle at 25% 25%, white 2px, transparent 2px), radial-gradient(circle at 75% 75%, white 2px, transparent 2px)`,
                  backgroundSize: "60px 60px",
                  backgroundPosition: "0 0, 30px 30px",
                }}
              ></div>
            </div>

            <div className="relative px-8 py-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <motion.div
                    initial={{ scale: 0, rotate: -90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 150, delay: 0.5 }}
                    className="h-16 w-16 bg-white/15 rounded-3xl flex items-center justify-center backdrop-blur-md border border-white/20 shadow-2xl"
                  >
                    <Calendar className="h-8 w-8 text-white" />
                  </motion.div>
                  <div>
                    <motion.h2
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="text-3xl font-bold text-white mb-1"
                    >
                      Assistant de réservation
                    </motion.h2>
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                      className="text-blue-100 font-medium"
                    >
                      ✨ Trouvez la salle parfaite en quelques clics
                    </motion.p>
                  </div>
                </div>

                {/* Indicateur de statut */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 }}
                  className="hidden md:flex items-center space-x-2 px-4 py-2 bg-white/10 rounded-full backdrop-blur-md border border-white/20"
                >
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-white">
                      Système actif
                    </span>
                  </div>
                </motion.div>
              </div>

              {/* Barre de progression subtile */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 1, duration: 1.5, ease: "easeOut" }}
                className="mt-6 h-1 bg-gradient-to-r from-white/20 via-white/40 to-white/20 rounded-full overflow-hidden"
              >
                <div className="h-full bg-gradient-to-r from-transparent via-white/60 to-transparent animate-pulse"></div>
              </motion.div>
            </div>
          </div>

          {/* Contenu du wizard */}
          <div className="p-8">
            <BookingWizard />
          </div>
        </motion.div>
      </main>
    </div>
  );
}
