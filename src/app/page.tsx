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
  Zap,
  Shield,
  BarChart3,
  Star,
  TrendingUp,
  Smartphone,
  Globe,
  Award,
  Target,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import Onboarding from "@/components/onboarding/Onboarding";
import { useOnboarding } from "@/hooks/useOnboarding";
import { Settings } from "lucide-react";

function HomeContent() {
  const { hasSeenOnboarding, resetOnboarding } = useOnboarding();

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Bouton de réinitialisation de l'onboarding (dev only) */}
      <div className="fixed top-4 right-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={resetOnboarding}
          className="bg-white border-slate-200 text-slate-600 hover:text-slate-900"
          title="Réinitialiser l'onboarding"
        >
          <Settings className="h-4 w-4 mr-2" />
          Voir l'onboarding
        </Button>
      </div>

      {/* Hero Section - Design moderne et convaincant */}
      <div className="relative min-h-screen overflow-hidden">
        {/* Background avec effets visuels sophistiqués */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50" />

        {/* Grille de fond animée */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(59,130,246,0.1)_50%,transparent_100%)] bg-[length:200px_200px] animate-pulse" />
        </div>

        {/* Formes géométriques flottantes */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Cercles décoratifs */}
          <motion.div
            className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-full blur-xl"
            animate={{
              x: [0, 50, 0],
              y: [0, -30, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-lg"
            animate={{
              x: [0, -40, 0],
              y: [0, 40, 0],
              scale: [1, 0.8, 1],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          />
          <motion.div
            className="absolute bottom-32 left-1/4 w-40 h-40 bg-gradient-to-r from-green-400/20 to-emerald-400/20 rounded-full blur-2xl"
            animate={{
              x: [0, 60, 0],
              y: [0, -50, 0],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
          />
        </div>

        {/* Particules flottantes améliorées */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={`hero-particle-${i}`}
              className={`absolute rounded-full ${
                i % 3 === 0
                  ? "w-2 h-2 bg-blue-300/60"
                  : i % 3 === 1
                    ? "w-1 h-1 bg-indigo-300/80"
                    : "w-1.5 h-1.5 bg-purple-300/50"
              }`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -40, 0],
                x: [0, Math.random() * 20 - 10, 0],
                opacity: [0.6, 0.1, 0.6],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 5 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 3,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        {/* Contenu principal */}
        <div className="relative max-w-7xl mx-auto px-6 py-20 sm:py-32 lg:px-8">
          <div className="text-center">
            {/* Badge de confiance */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-full px-4 py-2 mb-8"
            >
              <Star className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">
                Plus de 10,000 utilisateurs satisfaits
              </span>
              <Sparkles className="h-4 w-4 text-blue-600" />
            </motion.div>

            {/* Titre principal impactant */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 mb-6"
            >
              Révolutionnez vos{" "}
              <motion.span
                className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{
                  backgroundSize: "200% 200%",
                }}
              >
                réservations
              </motion.span>
            </motion.h1>

            {/* Sous-titre persuasif */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="text-xl sm:text-2xl text-slate-600 max-w-4xl mx-auto mb-8 leading-relaxed"
            >
              L'avenir de la gestion d'espaces commence ici.
              <span className="font-semibold text-slate-800">
                {" "}
                Économisez 80% de votre temps
              </span>{" "}
              avec notre plateforme intelligente de réservation.
            </motion.p>

            {/* Statistiques convaincantes */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
              className="flex flex-wrap justify-center gap-8 mb-12"
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-slate-900">98%</div>
                <div className="text-sm text-slate-600">
                  Satisfaction client
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-slate-900">-80%</div>
                <div className="text-sm text-slate-600">Temps de gestion</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-slate-900">24/7</div>
                <div className="text-sm text-slate-600">Disponibilité</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-slate-900">99.9%</div>
                <div className="text-sm text-slate-600">Fiabilité</div>
              </div>
            </motion.div>

            {/* Boutons d'action améliorés */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-16"
            >
              <Link href="/bookings/new">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Button
                    size="lg"
                    className="relative bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 group overflow-hidden"
                  >
                    {/* Effet de brillance */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      initial={{ x: "-100%" }}
                      animate={{ x: "100%" }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 3,
                        ease: "easeInOut",
                      }}
                    />
                    <Zap className="h-5 w-5 mr-2 relative z-10" />
                    <span className="relative z-10">
                      Commencer gratuitement
                    </span>
                    <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform relative z-10" />
                  </Button>
                </motion.div>
              </Link>
              <Link href="/rooms">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-2 border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 backdrop-blur-sm hover:shadow-lg"
                  >
                    <Globe className="h-5 w-5 mr-2" />
                    Voir la démo
                  </Button>
                </motion.div>
              </Link>
            </motion.div>

            {/* Témoignage client */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
              className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200 max-w-2xl mx-auto"
            >
              <div className="flex items-center justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <blockquote className="text-lg text-slate-700 italic mb-4">
                "ReservApp a transformé notre façon de gérer les espaces. Ce qui
                prenait des heures se fait maintenant en minutes."
              </blockquote>
              <div className="flex items-center justify-center space-x-3">
                <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">M</span>
                </div>
                <div className="text-left">
                  <div className="font-semibold text-slate-900">
                    Marie Dubois
                  </div>
                  <div className="text-sm text-slate-600">
                    Directrice des Opérations
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Section des avantages - Design moderne */}
      <div className="py-24 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 rounded-full px-4 py-2 mb-6"
            >
              <Award className="h-4 w-4" />
              <span className="text-sm font-semibold">
                Pourquoi choisir ReservApp ?
              </span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6"
            >
              Des avantages qui font la différence
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-slate-600 max-w-3xl mx-auto"
            >
              Découvrez comment ReservApp transforme votre gestion d'espaces en
              une expérience fluide et efficace
            </motion.p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Gain de temps */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="group relative"
              whileHover={{ y: -5 }}
            >
              {/* Fond décoratif animé */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl"
                animate={{ rotate: [0, 1, -1, 0] }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              {/* Contenu de la carte */}
              <div className="relative bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 h-80 flex flex-col justify-between hover:shadow-3xl transition-all duration-300">
                <div className="flex-shrink-0">
                  <motion.div
                    className="h-12 w-12 sm:h-16 sm:w-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center mb-4 sm:mb-6 shadow-xl"
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Zap className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                  </motion.div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-3 sm:mb-4">
                    Gain de temps spectaculaire
                  </h3>
                </div>
                <div className="flex-grow flex flex-col justify-center">
                  <p className="text-sm sm:text-base text-slate-600 mb-4 sm:mb-6">
                    Réduisez de 80% le temps passé à gérer vos réservations.
                    Notre interface intuitive vous fait gagner des heures chaque
                    semaine.
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <div className="flex items-center text-blue-600 font-semibold text-sm sm:text-base">
                    <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                    +300% d'efficacité
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Sécurité avancée */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="group relative"
              whileHover={{ y: -5 }}
            >
              {/* Fond décoratif animé */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-green-100 to-emerald-100 rounded-3xl"
                animate={{ rotate: [0, 1, -1, 0] }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              {/* Contenu de la carte */}
              <div className="relative bg-white rounded-3xl p-8 shadow-2xl border border-slate-100 h-80 flex flex-col justify-between">
                <div className="flex-shrink-0">
                  <motion.div
                    className="h-16 w-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center mb-6 shadow-xl"
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Shield className="h-8 w-8 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">
                    Sécurité de niveau entreprise
                  </h3>
                </div>
                <div className="flex-grow flex flex-col justify-center">
                  <p className="text-slate-600 mb-6">
                    Vos données sont protégées par un chiffrement de niveau
                    militaire. Conformité RGPD garantie et sauvegardes
                    automatiques.
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <div className="flex items-center text-green-600 font-semibold">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    99.9% de disponibilité
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Analytics intelligents */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="group relative"
            >
              {/* Fond décoratif animé */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-purple-100 to-violet-100 rounded-3xl"
                animate={{ rotate: [0, 1, -1, 0] }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              {/* Contenu de la carte */}
              <div className="relative bg-white rounded-3xl p-8 shadow-2xl border border-slate-100 h-80 flex flex-col justify-between">
                <div className="flex-shrink-0">
                  <motion.div
                    className="h-16 w-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-3xl flex items-center justify-center mb-6 shadow-xl"
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <BarChart3 className="h-8 w-8 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">
                    Analytics prédictifs
                  </h3>
                </div>
                <div className="flex-grow flex flex-col justify-center">
                  <p className="text-slate-600 mb-6">
                    Optimisez l'utilisation de vos espaces avec des insights en
                    temps réel. Prédictions et recommandations personnalisées.
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <div className="flex items-center text-purple-600 font-semibold">
                    <Target className="h-4 w-4 mr-2" />
                    Prédictions IA
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Interface moderne */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="group relative"
            >
              {/* Fond décoratif animé */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-orange-100 to-amber-100 rounded-3xl"
                animate={{ rotate: [0, 1, -1, 0] }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              {/* Contenu de la carte */}
              <div className="relative bg-white rounded-3xl p-8 shadow-2xl border border-slate-100 h-80 flex flex-col justify-between">
                <div className="flex-shrink-0">
                  <motion.div
                    className="h-16 w-16 bg-gradient-to-br from-orange-500 to-amber-600 rounded-3xl flex items-center justify-center mb-6 shadow-xl"
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Smartphone className="h-8 w-8 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">
                    Interface intuitive
                  </h3>
                </div>
                <div className="flex-grow flex flex-col justify-center">
                  <p className="text-slate-600 mb-6">
                    Design moderne et responsive. Accessible sur tous vos
                    appareils avec une expérience utilisateur exceptionnelle.
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <div className="flex items-center text-orange-600 font-semibold">
                    <Users className="h-4 w-4 mr-2" />
                    Multi-plateforme
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Temps réel */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="group relative"
            >
              {/* Fond décoratif animé */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-red-100 to-rose-100 rounded-3xl"
                animate={{ rotate: [0, 1, -1, 0] }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              {/* Contenu de la carte */}
              <div className="relative bg-white rounded-3xl p-8 shadow-2xl border border-slate-100 h-80 flex flex-col justify-between">
                <div className="flex-shrink-0">
                  <motion.div
                    className="h-16 w-16 bg-gradient-to-br from-red-500 to-rose-600 rounded-3xl flex items-center justify-center mb-6 shadow-xl"
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Clock className="h-8 w-8 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">
                    Synchronisation temps réel
                  </h3>
                </div>
                <div className="flex-grow flex flex-col justify-center">
                  <p className="text-slate-600 mb-6">
                    Mises à jour instantanées sur tous les appareils.
                    Notifications push et alertes intelligentes.
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <div className="flex items-center text-red-600 font-semibold">
                    <Globe className="h-4 w-4 mr-2" />
                    Temps réel
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Support expert */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="group relative"
            >
              {/* Fond décoratif animé */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-3xl"
                animate={{ rotate: [0, 1, -1, 0] }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              {/* Contenu de la carte */}
              <div className="relative bg-white rounded-3xl p-8 shadow-2xl border border-slate-100 h-80 flex flex-col justify-between">
                <div className="flex-shrink-0">
                  <motion.div
                    className="h-16 w-16 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-3xl flex items-center justify-center mb-6 shadow-xl"
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Award className="h-8 w-8 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">
                    Support expert 24/7
                  </h3>
                </div>
                <div className="flex-grow flex flex-col justify-center">
                  <p className="text-slate-600 mb-6">
                    Équipe d'experts dédiée à votre succès. Formation
                    personnalisée et accompagnement continu.
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <div className="flex items-center text-indigo-600 font-semibold">
                    <Star className="h-4 w-4 mr-2" />
                    Support premium
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Section CTA finale - Convaincante */}
      <div className="relative py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 overflow-hidden">
        {/* Background avec effets */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-600/20" />
        <div className="absolute inset-0 opacity-30">
          <div className="w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge d'urgence */}
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full px-6 py-3 mb-8 shadow-lg">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-bold">OFFRE LIMITÉE</span>
              <Sparkles className="h-4 w-4" />
            </div>

            {/* Titre principal */}
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              Prêt à transformer votre{" "}
              <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                gestion d'espaces ?
              </span>
            </h2>

            {/* Sous-titre persuasif */}
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-12 leading-relaxed">
              Rejoignez plus de{" "}
              <span className="font-bold text-white">10,000 entreprises</span>{" "}
              qui ont déjà révolutionné leur gestion de réservations.
              <span className="block mt-2 text-lg">
                Commencez gratuitement dès aujourd'hui !
              </span>
            </p>

            {/* Statistiques de conversion */}
            <div className="flex flex-wrap justify-center gap-8 mb-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">2 min</div>
                <div className="text-sm text-blue-200">Configuration</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">Gratuit</div>
                <div className="text-sm text-blue-200">30 premiers jours</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">24/7</div>
                <div className="text-sm text-blue-200">Support inclus</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">ROI</div>
                <div className="text-sm text-blue-200">En 2 semaines</div>
              </div>
            </div>

            {/* Boutons d'action puissants */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-12">
              <Link href="/bookings/new">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Button
                    size="lg"
                    className="relative bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-8 sm:px-12 py-4 sm:py-5 rounded-2xl font-bold text-lg sm:text-xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 group overflow-hidden"
                  >
                    {/* Effet de brillance */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      initial={{ x: "-100%" }}
                      animate={{ x: "100%" }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 4,
                        ease: "easeInOut",
                      }}
                    />
                    <Zap className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3 relative z-10" />
                    <span className="relative z-10">Commencer maintenant</span>
                    <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 ml-2 sm:ml-3 group-hover:translate-x-2 transition-transform relative z-10" />
                  </Button>
                </motion.div>
              </Link>
              <Link href="/rooms">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 px-6 sm:px-8 py-4 sm:py-5 rounded-2xl font-bold text-base sm:text-lg transition-all duration-300 backdrop-blur-sm"
                  >
                    <Globe className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    Voir la démo
                  </Button>
                </motion.div>
              </Link>
            </div>

            {/* Garantie de satisfaction */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-4xl mx-auto border border-white/20">
              <div className="flex items-center justify-center space-x-4 mb-4">
                <Shield className="h-8 w-8 text-green-400" />
                <h3 className="text-2xl font-bold text-white">
                  Garantie satisfait ou remboursé
                </h3>
              </div>
              <p className="text-blue-100 text-lg">
                Si vous n'êtes pas entièrement satisfait dans les 30 premiers
                jours, nous vous remboursons intégralement. Aucune question
                posée.
              </p>
            </div>

            {/* Témoignages clients */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
              >
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-blue-100 italic mb-4">
                  "ReservApp a réduit notre temps de gestion de 80%. Incroyable
                  !"
                </p>
                <div className="text-white font-semibold">
                  - Jean Martin, CEO
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
              >
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-blue-100 italic mb-4">
                  "Interface intuitive et support exceptionnel. Je recommande !"
                </p>
                <div className="text-white font-semibold">
                  - Sophie Laurent, Manager
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
              >
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-blue-100 italic mb-4">
                  "ROI visible dès la première semaine. Un investissement
                  rentable."
                </p>
                <div className="text-white font-semibold">
                  - Pierre Dubois, Directeur
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const { isOnboardingActive, completeOnboarding, isReady } = useOnboarding();

  // Afficher l'onboarding si c'est la première visite
  if (isOnboardingActive) {
    return <Onboarding onComplete={completeOnboarding} />;
  }

  // Afficher un loader pendant l'initialisation
  if (!isReady) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return <HomeContent />;
}
