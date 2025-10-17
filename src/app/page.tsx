"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Plus,
  ArrowRight,
  Users,
  Clock,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Design épuré */}
      <div className="relative">
        {/* Background subtil */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white" />

        <div className="relative max-w-7xl mx-auto px-6 py-24 sm:py-32 lg:px-8">
          <div className="text-center">
            {/* Logo et branding minimaliste */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="flex items-center justify-center mb-8"
            >
              <div className="h-12 w-12 rounded-xl bg-slate-900 flex items-center justify-center mr-3">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-2xl font-bold text-slate-900">ReservApp</h1>
                <p className="text-sm text-slate-600">
                  Système de réservation intelligent
                </p>
              </div>
            </motion.div>

            {/* Titre principal */}
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05, ease: "easeOut" }}
              className="text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl"
            >
              Gérez vos réservations avec{" "}
              <span className="text-slate-600">élégance</span>
            </motion.h2>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
              className="mt-6 text-lg leading-8 text-slate-600 max-w-2xl mx-auto"
            >
              Une plateforme moderne pour réserver et gérer vos espaces de
              travail. Interface intuitive, notifications en temps réel et
              analytics avancés.
            </motion.p>

            {/* Boutons d'action */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15, ease: "easeOut" }}
              className="mt-10 flex items-center justify-center gap-x-6"
            >
              <Link href="/bookings/new">
                <Button
                  size="lg"
                  className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-lg font-medium"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Nouvelle réservation
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              <Link href="/rooms">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-slate-300 text-slate-700 hover:bg-slate-50 px-8 py-3 rounded-lg font-medium"
                >
                  <Users className="h-5 w-5 mr-2" />
                  Explorer les salles
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Section des fonctionnalités */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">
              Fonctionnalités principales
            </h3>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Découvrez les outils qui simplifient la gestion de vos
              réservations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Réservation rapide */}
            <Link href="/bookings/new">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.05, ease: "easeOut" }}
                className="text-center p-8 rounded-2xl border border-slate-200 hover:border-slate-300 hover-lift cursor-pointer gpu-accelerated"
              >
                <div className="h-12 w-12 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-6 w-6 text-slate-700" />
                </div>
                <h4 className="text-lg font-semibold text-slate-900 mb-2">
                  Réservation rapide
                </h4>
                <p className="text-slate-600">
                  Réservez une salle en quelques clics avec notre interface
                  intuitive
                </p>
              </motion.div>
            </Link>

            {/* Gestion en temps réel */}
            <Link href="/my-bookings">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1, ease: "easeOut" }}
                className="text-center p-8 rounded-2xl border border-slate-200 hover:border-slate-300 hover-lift cursor-pointer gpu-accelerated"
              >
                <div className="h-12 w-12 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-6 w-6 text-slate-700" />
                </div>
                <h4 className="text-lg font-semibold text-slate-900 mb-2">
                  Temps réel
                </h4>
                <p className="text-slate-600">
                  Suivez vos réservations en temps réel avec des notifications
                  instantanées
                </p>
              </motion.div>
            </Link>

            {/* Analytics */}
            <Link href="/reports">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.15, ease: "easeOut" }}
                className="text-center p-8 rounded-2xl border border-slate-200 hover:border-slate-300 hover-lift cursor-pointer gpu-accelerated"
              >
                <div className="h-12 w-12 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-6 w-6 text-slate-700" />
                </div>
                <h4 className="text-lg font-semibold text-slate-900 mb-2">
                  Analytics avancés
                </h4>
                <p className="text-slate-600">
                  Analysez l'utilisation de vos espaces avec des rapports
                  détaillés
                </p>
              </motion.div>
            </Link>
          </div>
        </div>
      </div>

      {/* Section CTA finale */}
      <div className="bg-slate-50 py-16">
        <div className="max-w-4xl mx-auto text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <h3 className="text-2xl font-bold text-slate-900 mb-4">
              Prêt à commencer ?
            </h3>
            <p className="text-slate-600 mb-8">
              Rejoignez des milliers d'utilisateurs qui simplifient déjà leur
              gestion de réservations
            </p>
            <Link href="/bookings/new">
              <Button
                size="lg"
                className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-lg font-medium"
              >
                Commencer maintenant
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
