"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Building,
  Shield,
  BarChart3,
  SkipForward,
} from "lucide-react";
import SkipConfirmationModal from "./SkipConfirmationModal";

interface OnboardingProps {
  onComplete: () => void;
}

const onboardingSteps = [
  {
    id: 1,
    title: "Bienvenue sur BookSpace",
    subtitle: "Votre solution de réservation intelligente",
    description:
      "Simplifiez la gestion de vos espaces de travail avec une plateforme moderne et intuitive.",
    icon: Building,
    color: "bg-blue-500",
    gradient: "from-blue-500 to-blue-600",
    features: [
      "Réservation en quelques clics",
      "Interface moderne et élégante",
      "Notifications en temps réel",
    ],
  },
  {
    id: 2,
    title: "Réservez facilement",
    subtitle: "Trouvez et réservez vos espaces",
    description:
      "Parcourez les salles disponibles, consultez les équipements et réservez en un instant.",
    icon: Calendar,
    color: "bg-green-500",
    gradient: "from-green-500 to-green-600",
    features: [
      "Vue d'ensemble des salles",
      "Équipements détaillés",
      "Disponibilité en temps réel",
    ],
  },
  {
    id: 3,
    title: "Gérez vos réservations",
    subtitle: "Suivez et organisez vos créneaux",
    description:
      "Consultez vos réservations, modifiez-les si nécessaire et recevez des rappels automatiques.",
    icon: Clock,
    color: "bg-purple-500",
    gradient: "from-purple-500 to-purple-600",
    features: [
      "Historique complet",
      "Modifications rapides",
      "Rappels automatiques",
    ],
  },
  {
    id: 4,
    title: "Analytics avancés",
    subtitle: "Optimisez l'utilisation de vos espaces",
    description:
      "Analysez les tendances d'utilisation et optimisez la gestion de vos ressources.",
    icon: BarChart3,
    color: "bg-orange-500",
    gradient: "from-orange-500 to-orange-600",
    features: [
      "Rapports détaillés",
      "Tendances d'utilisation",
      "Optimisation des ressources",
    ],
  },
  {
    id: 5,
    title: "Sécurité et fiabilité",
    subtitle: "Vos données sont protégées",
    description:
      "Profitez d'une plateforme sécurisée avec des sauvegardes automatiques et une disponibilité garantie.",
    icon: Shield,
    color: "bg-red-500",
    gradient: "from-red-500 to-red-600",
    features: [
      "Données sécurisées",
      "Sauvegardes automatiques",
      "Disponibilité 24/7",
    ],
  },
];

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const [showSkipModal, setShowSkipModal] = useState(false);

  const currentStepData = onboardingSteps[currentStep];
  const isLastStep = currentStep === onboardingSteps.length - 1;
  const isFirstStep = currentStep === 0;

  // Génère une configuration stable pour les particules
  const particles = useMemo(() => {
    return Array.from({ length: 25 }).map((_, i) => ({
      id: `particle-${i}`,
      left: `${(i * 37) % 100}%`, // position déterministe
      top: `${(i * 53) % 100}%`, // position déterministe
      duration: 3 + ((i * 17) % 200) / 100, // 3 à 5s
      delay: ((i * 29) % 200) / 100, // 0 à 2s
      size: 1 + ((i * 7) % 3), // 1 à 3px
      color:
        i % 3 === 0
          ? "bg-blue-200"
          : i % 3 === 1
            ? "bg-purple-200"
            : "bg-indigo-200",
    }));
  }, []);

  const nextStep = () => {
    if (isLastStep) {
      handleComplete();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (!isFirstStep) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        onComplete();
      }, 300);
    }, 500);
  };

  const skipOnboarding = () => {
    setShowSkipModal(true);
  };

  const confirmSkip = () => {
    setShowSkipModal(false);
    handleComplete();
  };

  const cancelSkip = () => {
    setShowSkipModal(false);
  };

  // Auto-advance après 15 secondes d'inactivité
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isExiting && !showSkipModal) {
        nextStep();
      }
    }, 15000);

    return () => clearTimeout(timer);
  }, [currentStep, isExiting, showSkipModal]);

  // Raccourcis clavier
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (showSkipModal) return;

      switch (event.key) {
        case "ArrowRight":
        case " ":
          event.preventDefault();
          nextStep();
          break;
        case "ArrowLeft":
          event.preventDefault();
          prevStep();
          break;
        case "Escape":
          event.preventDefault();
          skipOnboarding();
          break;
        case "Enter":
          event.preventDefault();
          nextStep();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentStep, showSkipModal]);

  if (!isVisible) {
    return null;
  }

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={`onboarding-shell-${currentStep}-${isExiting ? "exit" : "enter"}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 bg-white overflow-hidden"
        >
          {/* Background animé avec gradients */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50" />

          {/* Formes géométriques décoratives */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-200/20 to-indigo-200/20 rounded-full blur-2xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.2, 0.4, 0.2],
                rotate: [0, 180, 360],
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full blur-2xl"
              animate={{
                scale: [1.2, 1, 1.2],
                opacity: [0.3, 0.1, 0.3],
                rotate: [360, 180, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
            />
            <motion.div
              className="absolute bottom-20 left-1/3 w-40 h-40 bg-gradient-to-br from-green-200/20 to-blue-200/20 rounded-full blur-2xl"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.1, 0.3, 0.1],
                rotate: [0, -180, -360],
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
            {particles.map((p) => (
              <motion.div
                key={p.id}
                className={`absolute ${p.color} rounded-full opacity-40`}
                style={{
                  left: p.left,
                  top: p.top,
                  width: `${p.size}px`,
                  height: `${p.size}px`,
                }}
                animate={{
                  y: [0, -40, 0],
                  opacity: [0.4, 0.1, 0.4],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: p.duration,
                  repeat: Infinity,
                  delay: p.delay,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>

          {/* Header avec progression */}
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute top-0 left-0 right-0 z-10 bg-white/90 backdrop-blur-md border-b border-slate-200"
          >
            <div className="max-w-4xl mx-auto px-6 py-4">
              <div className="flex items-center justify-between">
                <motion.div
                  className="flex items-center space-x-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-slate-900 to-slate-700 flex items-center justify-center shadow-lg">
                    <Calendar className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-lg font-bold text-slate-900 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    BookSpace
                  </span>
                </motion.div>

                <div className="flex items-center space-x-6">
                  {/* Barre de progression améliorée */}
                  <div className="flex items-center space-x-2">
                    {onboardingSteps.map((_, index) => (
                      <motion.div
                        key={`progress-${index}`}
                        className={`h-2 rounded-full transition-all duration-500 ${
                          index <= currentStep ? "bg-slate-900" : "bg-slate-200"
                        }`}
                        initial={{ width: 8 }}
                        animate={{
                          width: index <= currentStep ? 32 : 8,
                          backgroundColor:
                            index <= currentStep ? "#0f172a" : "#e2e8f0",
                        }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      />
                    ))}
                  </div>

                  {/* Bouton skip amélioré */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={skipOnboarding}
                    className="text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-all duration-200 group"
                  >
                    <SkipForward className="h-4 w-4 mr-2 group-hover:translate-x-1 transition-transform" />
                    Passer
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contenu principal */}
          <div className="pt-24 h-full flex items-center justify-center px-6">
            <div className="max-w-7xl mx-auto w-full">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                {/* Contenu textuel */}
                <motion.div
                  key={`content-${currentStep}`}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 1, x: 50 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="space-y-8 justify-self-start lg:col-span-7"
                >
                  <div className="space-y-4 max-w-xl">
                    <motion.div
                      key={`header-${currentStep}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1, duration: 0.5 }}
                      className="flex items-center space-x-4"
                    >
                      <motion.div
                        key={`icon-${currentStep}`}
                        className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${currentStepData.gradient} flex items-center justify-center shadow-xl`}
                        whileHover={{ scale: 1.05, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <currentStepData.icon className="h-8 w-8 text-white" />
                      </motion.div>
                      <div>
                        <h1 className="text-4xl font-bold text-slate-900 leading-tight">
                          {currentStepData.title}
                        </h1>
                        <p className="text-xl text-slate-600 font-medium">
                          {currentStepData.subtitle}
                        </p>
                      </div>
                    </motion.div>

                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                      className="text-slate-600 text-lg leading-relaxed max-w-xl"
                    >
                      {currentStepData.description}
                    </motion.p>
                  </div>

                  {/* Liste des fonctionnalités améliorée */}
                  <motion.div
                    key={`features-${currentStep}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="space-y-4"
                  >
                    {currentStepData.features.map((feature, index) => (
                      <motion.div
                        key={`feature-${currentStep}-${index}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + index * 0.1, duration: 0.4 }}
                        className="flex items-center space-x-4 group"
                      >
                        <motion.div
                          key={`check-${currentStep}-${index}`}
                          className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 group-hover:bg-green-200 transition-colors"
                          whileHover={{ scale: 1.1 }}
                        >
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </motion.div>
                        <span className="text-slate-700 text-lg group-hover:text-slate-900 transition-colors">
                          {feature}
                        </span>
                      </motion.div>
                    ))}
                  </motion.div>

                  {/* Boutons de navigation améliorés */}
                  <motion.div
                    key={`navigation-${currentStep}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="flex items-center justify-between pt-8"
                  >
                    <Button
                      variant="outline"
                      onClick={prevStep}
                      disabled={isFirstStep}
                      className="border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Précédent
                    </Button>

                    {/* Indicateur de progression textuel */}
                    <span className="text-sm text-slate-500 text-center font-medium">
                      {currentStep + 1} sur {onboardingSteps.length}
                    </span>

                    <div className="flex items-center space-x-4">
                      <Button
                        onClick={nextStep}
                        className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 group"
                      >
                        {isLastStep ? "Commencer" : "Suivant"}
                        <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>

                    {/* Indications de raccourcis compactes */}
                  </motion.div>

                  <motion.div
                    key={`shortcuts-${currentStep}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="hidden md:flex items-center space-x-4 text-xs text-slate-400"
                  >
                    <span className="flex items-center space-x-1">
                      <kbd className="px-2 py-1 bg-slate-100 rounded text-slate-600">
                        ←
                      </kbd>
                      <span>Précédent</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <kbd className="px-2 py-1 bg-slate-100 rounded text-slate-600">
                        →
                      </kbd>
                      <span>Suivant</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <kbd className="px-2 py-1 bg-slate-100 rounded text-slate-600">
                        Esc
                      </kbd>
                      <span>Passer</span>
                    </span>
                  </motion.div>
                </motion.div>

                {/* Illustration améliorée */}
                <motion.div
                  key={`illustration-${currentStep}`}
                  initial={{ opacity: 0, scale: 0.8, rotateY: -15 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  exit={{ opacity: 0, scale: 0.8, rotateY: 15 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="flex items-center justify-center perspective-1000 lg:justify-self-start lg:col-span-5"
                >
                  <div className="relative">
                    {/* Fond décoratif animé */}
                    <motion.div
                      key={`bg-decoration-${currentStep}`}
                      className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl"
                      animate={{ rotate: [0, 1, -1, 0] }}
                      transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />

                    {/* Contenu de l'illustration */}
                    <div className="relative bg-white rounded-3xl p-8 shadow-2xl border border-slate-100">
                      {currentStep === 0 && (
                        <motion.div
                          key="welcome-illustration"
                          className="space-y-6"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                        >
                          <div className="flex items-center justify-center">
                            <motion.div
                              key="welcome-icon"
                              className="h-24 w-24 rounded-3xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-xl"
                              animate={{ rotate: [0, 5, -5, 0] }}
                              transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut",
                              }}
                            >
                              <Building className="h-12 w-12 text-white" />
                            </motion.div>
                          </div>
                          <div className="text-center space-y-2">
                            <h3 className="text-2xl font-bold text-slate-900 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                              BookSpace
                            </h3>
                            <p className="text-slate-600">
                              Système de réservation intelligent
                            </p>
                          </div>
                        </motion.div>
                      )}

                      {currentStep === 1 && (
                        <motion.div
                          key="rooms-illustration"
                          className="space-y-4"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                        >
                          <div className="grid grid-cols-2 gap-3">
                            {[1, 2, 3, 4].map((i) => (
                              <motion.div
                                key={`room-card-${i}`}
                                className="h-16 bg-slate-100 rounded-xl flex items-center justify-center hover:bg-slate-200 transition-colors"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.4 + i * 0.1 }}
                                whileHover={{ scale: 1.05 }}
                              >
                                <Calendar className="h-6 w-6 text-slate-600" />
                              </motion.div>
                            ))}
                          </div>
                          <div className="text-center">
                            <h3 className="font-semibold text-slate-900">
                              Salles disponibles
                            </h3>
                            <p className="text-sm text-slate-600">
                              Réservez en un clic
                            </p>
                          </div>
                        </motion.div>
                      )}

                      {currentStep === 2 && (
                        <motion.div
                          key="bookings-illustration"
                          className="space-y-4"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                        >
                          <div className="space-y-3">
                            {[1, 2, 3].map((i) => (
                              <motion.div
                                key={`booking-item-${i}`}
                                className="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 + i * 0.1 }}
                              >
                                <Clock className="h-5 w-5 text-slate-600" />
                                <div className="flex-1">
                                  <div className="h-3 bg-slate-200 rounded w-3/4 mb-1" />
                                  <div className="h-2 bg-slate-200 rounded w-1/2" />
                                </div>
                              </motion.div>
                            ))}
                          </div>
                          <div className="text-center">
                            <h3 className="font-semibold text-slate-900">
                              Mes réservations
                            </h3>
                            <p className="text-sm text-slate-600">
                              Gérez facilement
                            </p>
                          </div>
                        </motion.div>
                      )}

                      {currentStep === 3 && (
                        <motion.div
                          key="analytics-illustration"
                          className="space-y-4"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                        >
                          <motion.div
                            key="analytics-chart"
                            className="h-32 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center"
                            animate={{ scale: [1, 1.02, 1] }}
                            transition={{
                              duration: 3,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                          >
                            <BarChart3 className="h-12 w-12 text-orange-600" />
                          </motion.div>
                          <div className="text-center">
                            <h3 className="font-semibold text-slate-900">
                              Analytics
                            </h3>
                            <p className="text-sm text-slate-600">
                              Données en temps réel
                            </p>
                          </div>
                        </motion.div>
                      )}

                      {currentStep === 4 && (
                        <motion.div
                          key="security-illustration"
                          className="space-y-4"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                        >
                          <motion.div
                            key="security-shield"
                            className="h-24 bg-gradient-to-br from-red-100 to-red-200 rounded-xl flex items-center justify-center"
                            animate={{ rotate: [0, 2, -2, 0] }}
                            transition={{
                              duration: 4,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                          >
                            <Shield className="h-10 w-10 text-red-600" />
                          </motion.div>
                          <div className="text-center">
                            <h3 className="font-semibold text-slate-900">
                              Sécurisé
                            </h3>
                            <p className="text-sm text-slate-600">
                              Données protégées
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Modal de confirmation pour skip (hors AnimatePresence principal) */}
      <SkipConfirmationModal
        isOpen={showSkipModal}
        onConfirm={confirmSkip}
        onCancel={cancelSkip}
      />
    </>
  );
}
