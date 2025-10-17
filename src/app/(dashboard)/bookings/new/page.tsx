"use client";

import { motion } from "framer-motion";
import BookingWizard from "@/components/booking/BookingWizard";
import { Calendar, Plus, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NewBookingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header moderne avec navigation */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/my-bookings">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour
                </Button>
              </Link>
              <div className="flex items-center space-x-3">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                  className="h-10 w-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg"
                >
                  <Plus className="h-5 w-5 text-white" />
                </motion.div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900">
                    Nouvelle réservation
                  </h1>
                  <p className="text-sm text-slate-600">
                    Créez une réservation en quelques étapes
                  </p>
                </div>
              </div>
            </div>

            {/* Indicateur de progression */}
            <div className="hidden md:flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-slate-700">
                  Assistant intelligent
                </span>
              </div>
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
          {/* Header de la carte */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Assistant de réservation
                </h2>
                <p className="text-blue-100">
                  Configurez votre réservation étape par étape
                </p>
              </div>
            </div>
          </div>

          {/* Contenu du wizard */}
          <div className="p-8">
            <BookingWizard />
          </div>
        </motion.div>

        {/* Conseils et aide */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
            <div className="h-10 w-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-4">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">
              Sélection rapide
            </h3>
            <p className="text-sm text-slate-600">
              Choisissez votre salle et votre créneau en quelques clics
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
            <div className="h-10 w-10 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center mb-4">
              <Plus className="h-5 w-5 text-white" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">
              Personnalisation
            </h3>
            <p className="text-sm text-slate-600">
              Ajoutez des participants et configurez les options avancées
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
            <div className="h-10 w-10 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center mb-4">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Confirmation</h3>
            <p className="text-sm text-slate-600">
              Vérifiez et confirmez votre réservation en toute sécurité
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
