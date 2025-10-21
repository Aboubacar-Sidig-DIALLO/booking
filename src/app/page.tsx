"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  Users,
  Calendar,
  Shield,
  Zap,
  CheckCircle,
  ArrowRight,
  Star,
  Globe,
  BarChart3,
  Settings,
  Sparkles,
  Clock,
  Smartphone,
  TrendingUp,
  Heart,
  Rocket,
  Target,
  Lock,
  Gift,
  Headphones,
} from "lucide-react";
import Link from "next/link";
import { useTenant } from "@/contexts/tenant-context";

const features = [
  {
    icon: Calendar,
    title: "Réservation Intelligente",
    description:
      "Système de réservation avancé avec gestion des conflits et notifications automatiques",
    color: "blue",
    gradient: "from-blue-500 to-blue-600",
    bgGradient: "from-blue-50 to-blue-100",
  },
  {
    icon: Users,
    title: "Gestion d'Équipe",
    description:
      "Invitez votre équipe, gérez les permissions et collaborez efficacement",
    color: "green",
    gradient: "from-green-500 to-green-600",
    bgGradient: "from-green-50 to-green-100",
  },
  {
    icon: BarChart3,
    title: "Analytics Avancés",
    description:
      "Tableaux de bord détaillés et rapports d'utilisation pour optimiser vos espaces",
    color: "purple",
    gradient: "from-purple-500 to-purple-600",
    bgGradient: "from-purple-50 to-purple-100",
  },
  {
    icon: Shield,
    title: "Sécurité Enterprise",
    description:
      "Isolation complète des données, audit trail et conformité RGPD",
    color: "red",
    gradient: "from-red-500 to-red-600",
    bgGradient: "from-red-50 to-red-100",
  },
  {
    icon: Zap,
    title: "Intégrations",
    description:
      "Connectez-vous à vos outils existants : calendrier, Slack, Teams, etc.",
    color: "yellow",
    gradient: "from-yellow-500 to-yellow-600",
    bgGradient: "from-yellow-50 to-yellow-100",
  },
  {
    icon: Settings,
    title: "Personnalisation",
    description:
      "Adaptez l'interface à votre marque avec couleurs, logo et domaines personnalisés",
    color: "indigo",
    gradient: "from-indigo-500 to-indigo-600",
    bgGradient: "from-indigo-50 to-indigo-100",
  },
];

const stats = [
  {
    icon: Gift,
    value: "100%",
    label: "Gratuit",
    color: "blue",
    description: "Sans frais cachés",
  },
  {
    icon: Headphones,
    value: "24/7",
    label: "Support",
    color: "green",
    description: "Assistance continue",
  },
  {
    icon: Settings,
    value: "5min",
    label: "Configuration",
    color: "purple",
    description: "Mise en place rapide",
  },
  // {
  //   icon: Lock,
  //   value: "RGPD",
  //   label: "Conforme",
  //   color: "orange",
  //   description: "Sécurité garantie",
  // },
];

const benefits = [
  {
    icon: Clock,
    title: "Gain de temps",
    description: "Réduisez de 80% le temps passé à gérer les réservations",
    color: "blue",
  },
  {
    icon: TrendingUp,
    title: "Optimisation",
    description: "Augmentez l'utilisation de vos espaces de 40%",
    color: "green",
  },
  {
    icon: Smartphone,
    title: "Mobile-first",
    description: "Interface responsive optimisée pour tous les appareils",
    color: "purple",
  },
  {
    icon: Lock,
    title: "Sécurité",
    description: "Données chiffrées et conformité RGPD garantie",
    color: "red",
  },
];

const testimonials = [
  {
    name: "Marie Dubois",
    company: "TechCorp",
    role: "Directrice des Opérations",
    content:
      "ReservApp a révolutionné la gestion de nos salles de réunion. L'interface est intuitive et les analytics nous aident à optimiser l'utilisation de nos espaces.",
    rating: 5,
  },
  {
    name: "Jean Martin",
    company: "InnovateLab",
    role: "CEO",
    content:
      "La fonctionnalité multi-tenant nous permet de gérer plusieurs sites facilement. L'intégration avec nos outils existants est parfaite.",
    rating: 5,
  },
  {
    name: "Sophie Laurent",
    company: "GlobalConsulting",
    role: "Responsable RH",
    content:
      "L'onboarding de nos équipes est devenu un jeu d'enfant. Les invitations automatiques et la configuration guidée nous font gagner un temps précieux.",
    rating: 5,
  },
];

export default function HomePage() {
  const { tenant, isLoading: tenantLoading } = useTenant();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient || tenantLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  // Si un tenant est détecté, rediriger vers le dashboard
  if (tenant) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">
              Bienvenue sur {tenant.name}
            </h2>
            <p className="text-gray-600 mb-6">
              Vous êtes connecté à votre organisation
            </p>
            <div className="space-y-3">
              <Link href="/dashboard" className="block">
                <Button className="w-full">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Aller au Dashboard
                </Button>
              </Link>
              <Link href="/setup" className="block">
                <Button variant="outline" className="w-full">
                  <Settings className="h-4 w-4 mr-2" />
                  Configuration
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/80 to-indigo-100/90 relative overflow-hidden">
      {/* Background avec effets visuels modernes */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-indigo-600/8 to-purple-600/5"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-transparent via-blue-50/30 to-transparent"></div>
      <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-to-tl from-transparent via-indigo-50/30 to-transparent"></div>

      {/* Cercles flous animés */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "1s" }}
      ></div>
      <div
        className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-br from-indigo-400/15 to-blue-500/15 rounded-full blur-2xl animate-pulse"
        style={{ animationDelay: "2s" }}
      ></div>

      {/* Particules flottantes */}
      <div
        className="absolute top-20 left-20 w-2 h-2 bg-blue-400/40 rounded-full animate-bounce"
        style={{ animationDelay: "0.5s" }}
      ></div>
      <div
        className="absolute top-40 right-32 w-1.5 h-1.5 bg-indigo-400/50 rounded-full animate-bounce"
        style={{ animationDelay: "1.5s" }}
      ></div>
      <div
        className="absolute bottom-32 left-40 w-2.5 h-2.5 bg-purple-400/40 rounded-full animate-bounce"
        style={{ animationDelay: "2.5s" }}
      ></div>
      <div
        className="absolute bottom-20 right-20 w-1 h-1 bg-pink-400/60 rounded-full animate-bounce"
        style={{ animationDelay: "3s" }}
      ></div>
      {/* Hero Section - Design ultra-moderne */}
      <section className="relative overflow-hidden">
        {/* Background avec effets visuels sophistiqués */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/8 via-indigo-600/10 to-purple-600/8"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-blue-50/40 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-indigo-50/30 to-transparent"></div>

        {/* Cercles flous avec animations */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-400/15 to-indigo-500/15 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-purple-400/15 to-pink-500/15 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1.5s" }}
        ></div>
        <div
          className="absolute top-1/3 right-1/3 w-80 h-80 bg-gradient-to-br from-indigo-400/10 to-blue-500/10 rounded-full blur-2xl animate-pulse"
          style={{ animationDelay: "3s" }}
        ></div>

        {/* Effets de lumière */}
        <div
          className="absolute top-1/2 left-1/2 w-32 h-32 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Badge moderne avec animation */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-300 rounded-full text-sm font-black text-blue-800 mb-8 shadow-sm drop-shadow-sm"
                style={{ fontFamily: "Inter, system-ui, sans-serif" }}
              >
                <Sparkles className="h-5 w-5 text-blue-700" />
                <span>Solution Enterprise Moderne</span>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
              </motion.div>

              {/* Titre principal avec dégradé moderne */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-5xl sm:text-6xl lg:text-7xl font-black text-slate-800 mb-8 leading-tight tracking-tight drop-shadow-sm"
                style={{ fontFamily: "Inter, system-ui, sans-serif" }}
              >
                Gérez vos{" "}
                <span className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 bg-clip-text text-transparent font-black drop-shadow-sm">
                  salles de réunion
                </span>{" "}
                avec intelligence
              </motion.h1>

              {/* Sous-titre moderne */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-xl sm:text-2xl text-slate-700 mb-12 max-w-4xl mx-auto leading-relaxed font-medium tracking-wide drop-shadow-sm"
                style={{ fontFamily: "Inter, system-ui, sans-serif" }}
              >
                ReservApp révolutionne la gestion des espaces de travail avec
                une solution
                <span className="font-semibold text-blue-700">
                  {" "}
                  intelligente
                </span>
                ,
                <span className="font-semibold text-indigo-700">
                  {" "}
                  sécurisée
                </span>{" "}
                et
                <span className="font-semibold text-purple-700">
                  {" "}
                  intuitive
                </span>
              </motion.p>

              {/* Boutons d'action modernes */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-6 justify-center mb-16"
              >
                <Link href="/onboarding">
                  <Button
                    size="lg"
                    className="group bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white shadow-xl hover:shadow-2xl transition-all duration-300 px-8 py-4 text-lg font-black rounded-2xl tracking-wide drop-shadow-sm"
                    style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                  >
                    <Rocket className="h-6 w-6 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                    Créer mon organisation
                    <ArrowRight className="h-6 w-6 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </Link>
                <Link href="/multitenant-demo">
                  <Button
                    size="lg"
                    variant="outline"
                    className="group border-2 border-slate-400 hover:border-blue-600 hover:bg-blue-50 text-slate-800 hover:text-blue-800 px-8 py-4 text-lg font-black rounded-2xl transition-all duration-300 tracking-wide drop-shadow-sm"
                    style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                  >
                    <Globe className="h-6 w-6 mr-3 group-hover:scale-110 transition-transform duration-300" />
                    Voir la démo
                  </Button>
                </Link>
              </motion.div>

              {/* Statistiques impressionnantes */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="grid grid-cols-2 md:grid-cols-3 gap-8 max-w-3xl mx-auto"
              >
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                    className="text-center group bg-gradient-to-br from-white via-slate-50 to-white border border-slate-200/50 rounded-3xl p-4 shadow-xl hover:shadow-2xl transition-all duration-700 group-hover:-translate-y-2 group-hover:scale-[1.02] overflow-hidden backdrop-blur-sm relative"
                  >
                    {/* Effet de brillance au hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                    {/* Bordure animée */}
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-indigo-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-sm"></div>

                    <div className="relative z-10">
                      <div className="inline-flex items-center justify-center w-15 h-15 bg-gradient-to-br from-white to-slate-50 rounded-3xl shadow-xl group-hover:shadow-2xl transition-all duration-300 mb-6 group-hover:scale-110 group-hover:rotate-3">
                        <stat.icon
                          className={`h-8 w-8 text-${stat.color}-600 group-hover:text-${stat.color}-700 transition-colors duration-300`}
                        />
                      </div>
                      <div
                        className="text-4xl font-black text-slate-800 mb-3 drop-shadow-sm group-hover:text-blue-700 transition-colors duration-300"
                        style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                      >
                        {stat.value}
                      </div>
                      <div
                        className="text-lg font-black text-slate-800 mb-2 tracking-wide drop-shadow-sm group-hover:text-blue-600 transition-colors duration-300"
                        style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                      >
                        {stat.label}
                      </div>
                      <div
                        className="text-sm font-medium text-slate-600 tracking-wide drop-shadow-sm group-hover:text-slate-700 transition-colors duration-300"
                        style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                      >
                        {stat.description}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section - Cartes ultra-modernes */}
      <section className="py-24 bg-gradient-to-br from-white/90 via-slate-50/95 to-blue-50/90 relative overflow-hidden backdrop-blur-sm">
        {/* Background avec effets sophistiqués */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/60 via-indigo-50/40 to-purple-50/60"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/50 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-blue-50/30 to-transparent"></div>

        {/* Cercles flous décoratifs */}
        <div className="absolute top-0 left-0 w-80 h-80 bg-gradient-to-br from-blue-300/20 to-indigo-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-br from-purple-300/20 to-pink-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-br from-indigo-300/15 to-blue-400/15 rounded-full blur-2xl"></div>

        {/* Particules subtiles */}
        <div className="absolute top-32 left-32 w-1 h-1 bg-blue-400/60 rounded-full animate-pulse"></div>
        <div
          className="absolute top-64 right-48 w-1.5 h-1.5 bg-indigo-400/50 rounded-full animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-48 left-64 w-1 h-1 bg-purple-400/60 rounded-full animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge
                className="mb-6 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-blue-300 text-sm font-black tracking-wide drop-shadow-sm"
                style={{ fontFamily: "Inter, system-ui, sans-serif" }}
              >
                <Target className="h-5 w-5 mr-2" />
                Fonctionnalités Enterprise
              </Badge>
              <h2
                className="text-4xl sm:text-5xl font-black text-slate-800 mb-6 leading-tight tracking-tight drop-shadow-sm"
                style={{ fontFamily: "Inter, system-ui, sans-serif" }}
              >
                Une solution{" "}
                <span className="bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent font-black drop-shadow-sm">
                  complète
                </span>{" "}
                pour votre entreprise
              </h2>
              <p
                className="text-xl text-slate-700 max-w-3xl mx-auto leading-relaxed font-medium tracking-wide drop-shadow-sm"
                style={{ fontFamily: "Inter, system-ui, sans-serif" }}
              >
                Découvrez les fonctionnalités avancées qui transforment la
                gestion de vos espaces de travail
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <div className="relative h-full bg-gradient-to-br from-white via-slate-50 to-white border border-slate-200/50 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-700 group-hover:-translate-y-3 group-hover:scale-[1.02] overflow-hidden backdrop-blur-sm">
                  {/* Effet de brillance au hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                  {/* Bordure animée */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-indigo-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-sm"></div>

                  {/* Icône avec dégradé moderne */}
                  <div className="relative mb-6 z-10">
                    <div
                      className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br ${feature.bgGradient} rounded-3xl shadow-2xl group-hover:shadow-3xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3`}
                    >
                      <feature.icon
                        className={`h-10 w-10 text-${feature.color}-600 group-hover:text-${feature.color}-700 transition-colors duration-300`}
                      />
                    </div>
                  </div>

                  <div className="relative z-10">
                    <h3
                      className="text-2xl font-black text-slate-800 mb-4 group-hover:text-blue-700 transition-colors duration-300 leading-tight tracking-tight drop-shadow-sm"
                      style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                    >
                      {feature.title}
                    </h3>
                    <p
                      className="text-slate-700 leading-relaxed group-hover:text-slate-800 transition-colors duration-300 text-lg font-medium tracking-wide drop-shadow-sm"
                      style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                    >
                      {feature.description}
                    </p>

                    {/* Indicateur de progression moderne */}
                    <div className="mt-8 flex items-center justify-between">
                      <div
                        className="flex items-center gap-3 text-sm text-slate-600 group-hover:text-blue-700 transition-colors duration-300 font-medium tracking-wide drop-shadow-sm"
                        style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                      >
                        <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-green-500 rounded-full animate-pulse shadow-sm"></div>
                        <span>Disponible maintenant</span>
                      </div>
                      <div className="w-8 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section - Design moderne */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
        {/* Background avec effets sophistiqués */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/15 via-indigo-600/20 to-purple-600/15"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-blue-500/10 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-indigo-500/10 to-transparent"></div>

        {/* Motif de points subtil */}
        <div className="absolute top-0 left-0 w-full h-full opacity-20">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5"></div>
        </div>

        {/* Cercles flous avec animations */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-indigo-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-pink-600/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 w-80 h-80 bg-gradient-to-br from-indigo-500/15 to-blue-600/15 rounded-full blur-2xl animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>

        {/* Effets de lumière */}
        <div
          className="absolute top-1/3 right-1/3 w-64 h-64 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-2xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-1/3 left-1/3 w-48 h-48 bg-gradient-to-br from-white/8 to-transparent rounded-full blur-xl animate-pulse"
          style={{ animationDelay: "3s" }}
        ></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge
                className="mb-6 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 text-blue-100 border-blue-400/30 text-sm font-black tracking-wide drop-shadow-sm"
                style={{ fontFamily: "Inter, system-ui, sans-serif" }}
              >
                <Heart className="h-5 w-5 mr-2" />
                Pourquoi choisir ReservApp ?
              </Badge>
              <h2
                className="text-4xl sm:text-5xl font-black text-white mb-6 leading-tight tracking-tight drop-shadow-lg"
                style={{ fontFamily: "Inter, system-ui, sans-serif" }}
              >
                Des{" "}
                <span className="bg-gradient-to-r from-blue-300 to-indigo-300 bg-clip-text text-transparent font-black drop-shadow-lg">
                  résultats
                </span>{" "}
                mesurables
              </h2>
              <p
                className="text-xl text-blue-50 max-w-3xl mx-auto leading-relaxed font-medium tracking-wide drop-shadow-sm"
                style={{ fontFamily: "Inter, system-ui, sans-serif" }}
              >
                Découvrez les bénéfices concrets de notre solution pour votre
                organisation
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <div className="relative h-full bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm border border-white/30 rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-700 group-hover:-translate-y-3 group-hover:scale-[1.02] overflow-hidden">
                  {/* Effet de brillance */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                  {/* Bordure animée */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/30 via-indigo-500/30 to-purple-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-sm"></div>

                  <div className="relative z-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-white/30 to-white/10 rounded-3xl shadow-2xl group-hover:shadow-3xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 mb-8">
                      <benefit.icon className="h-10 w-10 text-white group-hover:text-blue-200 transition-colors duration-300" />
                    </div>

                    <h3
                      className="text-2xl font-black text-white mb-6 group-hover:text-blue-200 transition-colors duration-300 leading-tight tracking-tight drop-shadow-lg"
                      style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                    >
                      {benefit.title}
                    </h3>
                    <p
                      className="text-blue-50 leading-relaxed group-hover:text-white transition-colors duration-300 text-lg font-medium tracking-wide drop-shadow-sm"
                      style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                    >
                      {benefit.description}
                    </p>

                    {/* Indicateur de progression moderne */}
                    <div className="mt-8 flex items-center justify-between">
                      <div
                        className="flex items-center gap-3 text-sm text-blue-100 group-hover:text-white transition-colors duration-300 font-medium tracking-wide drop-shadow-sm"
                        style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                      >
                        <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full animate-pulse shadow-sm"></div>
                        <span>Résultat prouvé</span>
                      </div>
                      <div className="w-8 h-1 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section - Design moderne */}
      <section className="py-24 bg-gradient-to-br from-white/95 via-slate-50/98 to-blue-50/95 relative overflow-hidden backdrop-blur-sm">
        {/* Background avec effets sophistiqués */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 via-emerald-50/40 to-teal-50/50"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/60 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-green-50/30 to-transparent"></div>

        {/* Cercles flous décoratifs */}
        <div className="absolute top-0 left-0 w-80 h-80 bg-gradient-to-br from-green-300/20 to-emerald-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-br from-teal-300/20 to-cyan-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-br from-emerald-300/15 to-green-400/15 rounded-full blur-2xl"></div>

        {/* Particules subtiles */}
        <div className="absolute top-32 left-32 w-1 h-1 bg-green-400/60 rounded-full animate-pulse"></div>
        <div
          className="absolute top-64 right-48 w-1.5 h-1.5 bg-emerald-400/50 rounded-full animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-48 left-64 w-1 h-1 bg-teal-400/60 rounded-full animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge
                className="mb-6 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-300 text-sm font-black tracking-wide drop-shadow-sm"
                style={{ fontFamily: "Inter, system-ui, sans-serif" }}
              >
                <Star className="h-5 w-5 mr-2" />
                Témoignages clients
              </Badge>
              <h2
                className="text-4xl sm:text-5xl font-black text-slate-800 mb-6 leading-tight tracking-tight drop-shadow-sm"
                style={{ fontFamily: "Inter, system-ui, sans-serif" }}
              >
                Ce que disent{" "}
                <span className="bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent font-black drop-shadow-sm">
                  nos clients
                </span>
              </h2>
              <p
                className="text-xl text-slate-700 max-w-3xl mx-auto leading-relaxed font-medium tracking-wide drop-shadow-sm"
                style={{ fontFamily: "Inter, system-ui, sans-serif" }}
              >
                Découvrez comment ReservApp transforme la gestion des espaces de
                travail dans les entreprises
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <div className="relative h-full bg-gradient-to-br from-white via-slate-50 to-white border border-slate-200/50 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-700 group-hover:-translate-y-3 group-hover:scale-[1.02] overflow-hidden backdrop-blur-sm">
                  {/* Effet de brillance */}
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                  {/* Bordure animée */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-green-500/20 via-emerald-500/20 to-teal-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-sm"></div>

                  <div className="relative z-10">
                    {/* Étoiles avec animation */}
                    <div className="flex items-center gap-1 mb-8">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.3, delay: 0.5 + i * 0.1 }}
                        >
                          <Star className="h-6 w-6 text-yellow-400 fill-current drop-shadow-sm" />
                        </motion.div>
                      ))}
                    </div>

                    {/* Citation avec guillemets stylisés */}
                    <div className="relative mb-8">
                      <div className="absolute -top-6 -left-4 text-8xl text-green-200 font-serif leading-none opacity-60">
                        "
                      </div>
                      <p
                        className="text-slate-700 italic text-xl leading-relaxed relative z-10 font-medium tracking-wide drop-shadow-sm"
                        style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                      >
                        {testimonial.content}
                      </p>
                      <div className="absolute -bottom-6 -right-4 text-8xl text-green-200 font-serif leading-none opacity-60">
                        "
                      </div>
                    </div>

                    {/* Informations client */}
                    <div className="border-t border-slate-200/50 pt-8">
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                          {testimonial.name.charAt(0)}
                        </div>
                        <div>
                          <p
                            className="font-black text-slate-800 text-xl mb-1 tracking-tight drop-shadow-sm"
                            style={{
                              fontFamily: "Inter, system-ui, sans-serif",
                            }}
                          >
                            {testimonial.name}
                          </p>
                          <p
                            className="text-slate-700 font-semibold text-lg mb-1 tracking-wide drop-shadow-sm"
                            style={{
                              fontFamily: "Inter, system-ui, sans-serif",
                            }}
                          >
                            {testimonial.role}
                          </p>
                          <p
                            className="text-green-700 font-bold text-lg tracking-wide drop-shadow-sm"
                            style={{
                              fontFamily: "Inter, system-ui, sans-serif",
                            }}
                          >
                            {testimonial.company}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Design ultra-moderne */}
      <section className="py-24 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 relative overflow-hidden">
        {/* Background avec effets visuels sophistiqués */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/95 via-indigo-600/95 to-purple-600/95"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-blue-500/20 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-indigo-500/20 to-transparent"></div>

        {/* Motif de points subtil */}
        <div className="absolute top-0 left-0 w-full h-full opacity-30">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/10"></div>
        </div>

        {/* Cercles flous avec animations */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-white/15 to-blue-400/15 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-white/15 to-purple-400/15 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 w-80 h-80 bg-gradient-to-br from-white/10 to-indigo-400/10 rounded-full blur-2xl animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>

        {/* Effets de lumière */}
        <div
          className="absolute top-1/3 right-1/3 w-64 h-64 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-2xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-1/3 left-1/3 w-48 h-48 bg-gradient-to-br from-white/15 to-transparent rounded-full blur-xl animate-pulse"
          style={{ animationDelay: "3s" }}
        ></div>

        {/* Particules flottantes */}
        <div
          className="absolute top-20 left-20 w-2 h-2 bg-white/40 rounded-full animate-bounce"
          style={{ animationDelay: "0.5s" }}
        ></div>
        <div
          className="absolute top-40 right-32 w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce"
          style={{ animationDelay: "1.5s" }}
        ></div>
        <div
          className="absolute bottom-32 left-40 w-2.5 h-2.5 bg-white/40 rounded-full animate-bounce"
          style={{ animationDelay: "2.5s" }}
        ></div>
        <div
          className="absolute bottom-20 right-20 w-1 h-1 bg-white/60 rounded-full animate-bounce"
          style={{ animationDelay: "3s" }}
        ></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge
              className="mb-8 bg-white/20 text-white border-white/30 backdrop-blur-sm text-sm font-black tracking-wide drop-shadow-sm"
              style={{ fontFamily: "Inter, system-ui, sans-serif" }}
            >
              <Rocket className="h-5 w-5 mr-2" />
              Prêt à commencer ?
            </Badge>

            <h2
              className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-8 leading-tight tracking-tight drop-shadow-lg"
              style={{ fontFamily: "Inter, system-ui, sans-serif" }}
            >
              Transformez votre{" "}
              <span className="bg-gradient-to-r from-yellow-200 to-orange-200 bg-clip-text text-transparent font-black drop-shadow-lg">
                gestion d'espaces
              </span>{" "}
              dès aujourd'hui
            </h2>

            <p
              className="text-xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed font-medium tracking-wide drop-shadow-sm"
              style={{ fontFamily: "Inter, system-ui, sans-serif" }}
            >
              Rejoignez des centaines d'entreprises qui font confiance à
              ReservApp pour optimiser leurs espaces de travail
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/onboarding">
                <Button
                  size="lg"
                  className="group bg-white text-blue-600 hover:bg-gray-100 shadow-2xl hover:shadow-3xl transition-all duration-300 px-8 py-4 text-lg font-black rounded-2xl tracking-wide drop-shadow-sm"
                >
                  <Building2 className="h-7 w-7 mr-3 group-hover:scale-110 transition-transform duration-300" />
                  Créer mon organisation
                  <ArrowRight className="h-7 w-7 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </Link>
              <Link href="/auth/tenant-selection">
                <Button
                  size="lg"
                  variant="outline"
                  className="group border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 backdrop-blur-sm px-8 py-4 text-lg font-black rounded-2xl transition-all duration-300 tracking-wide drop-shadow-sm"
                >
                  <Globe className="h-7 w-7 mr-3 group-hover:scale-110 transition-transform duration-300" />
                  Tester la démo
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer - Design moderne */}
      <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-16 relative overflow-hidden">
        {/* Background avec effets sophistiqués */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/8 via-indigo-600/10 to-purple-600/8"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-blue-500/5 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-indigo-500/5 to-transparent"></div>

        {/* Motif de points subtil */}
        <div className="absolute top-0 left-0 w-full h-full opacity-20">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5"></div>
        </div>

        {/* Cercles flous décoratifs */}
        <div className="absolute top-0 left-0 w-80 h-80 bg-gradient-to-br from-blue-500/10 to-indigo-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-br from-purple-500/10 to-pink-600/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-br from-indigo-500/8 to-blue-600/8 rounded-full blur-2xl"></div>

        {/* Particules subtiles */}
        <div className="absolute top-32 left-32 w-1 h-1 bg-blue-400/40 rounded-full animate-pulse"></div>
        <div
          className="absolute top-64 right-48 w-1.5 h-1.5 bg-indigo-400/30 rounded-full animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-48 left-64 w-1 h-1 bg-purple-400/40 rounded-full animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* Logo et description */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                  <Building2 className="h-8 w-8 text-white" />
                </div>
                <span
                  className="text-2xl font-black tracking-tight drop-shadow-sm"
                  style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                >
                  ReservApp
                </span>
              </div>
              <p
                className="text-slate-300 leading-relaxed mb-6 text-base font-medium tracking-wide drop-shadow-sm"
                style={{ fontFamily: "Inter, system-ui, sans-serif" }}
              >
                La solution moderne pour la gestion intelligente des espaces de
                travail. Sécurisée, intuitive et performante.
              </p>
              <div
                className="flex items-center gap-2 text-sm text-slate-300 font-medium tracking-wide drop-shadow-sm"
                style={{ fontFamily: "Inter, system-ui, sans-serif" }}
              >
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Système opérationnel</span>
              </div>
            </div>

            {/* Produit */}
            <div>
              <h3
                className="font-black text-lg mb-6 text-white tracking-tight drop-shadow-sm"
                style={{ fontFamily: "Inter, system-ui, sans-serif" }}
              >
                Produit
              </h3>
              <ul className="space-y-3 text-slate-300">
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors duration-200 flex items-center gap-2"
                  >
                    <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    Fonctionnalités
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors duration-200 flex items-center gap-2"
                  >
                    <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    API & Intégrations
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors duration-200 flex items-center gap-2"
                  >
                    <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    Sécurité
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors duration-200 flex items-center gap-2"
                  >
                    <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    Roadmap
                  </a>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3
                className="font-black text-lg mb-6 text-white tracking-tight drop-shadow-sm"
                style={{ fontFamily: "Inter, system-ui, sans-serif" }}
              >
                Support
              </h3>
              <ul className="space-y-3 text-slate-300">
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors duration-200 flex items-center gap-2"
                  >
                    <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors duration-200 flex items-center gap-2"
                  >
                    <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    Centre d'aide
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors duration-200 flex items-center gap-2"
                  >
                    <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    Contact
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors duration-200 flex items-center gap-2"
                  >
                    <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    Statut
                  </a>
                </li>
              </ul>
            </div>

            {/* Légal */}
            <div>
              <h3
                className="font-black text-lg mb-6 text-white tracking-tight drop-shadow-sm"
                style={{ fontFamily: "Inter, system-ui, sans-serif" }}
              >
                Légal
              </h3>
              <ul className="space-y-3 text-slate-300">
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors duration-200 flex items-center gap-2"
                  >
                    <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    Conditions d'utilisation
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors duration-200 flex items-center gap-2"
                  >
                    <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    Politique de confidentialité
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors duration-200 flex items-center gap-2"
                  >
                    <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    RGPD
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors duration-200 flex items-center gap-2"
                  >
                    <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    Sécurité
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Ligne de séparation et copyright */}
          <div className="border-t border-slate-700 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p
                className="text-slate-300 text-base font-medium tracking-wide drop-shadow-sm"
                style={{ fontFamily: "Inter, system-ui, sans-serif" }}
              >
                &copy; 2024 ReservApp. Tous droits réservés.
              </p>
              <div
                className="flex items-center gap-4 text-base text-slate-300 font-medium tracking-wide drop-shadow-sm"
                style={{ fontFamily: "Inter, system-ui, sans-serif" }}
              >
                <span>Fait avec</span>
                <Heart className="h-5 w-5 text-red-500 fill-current" />
                <span>en France</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
