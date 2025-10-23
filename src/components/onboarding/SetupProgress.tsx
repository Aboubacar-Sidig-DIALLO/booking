"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  CheckCircle,
  Sparkles,
  Zap,
  Shield,
  Users,
  Calendar,
  Settings,
  Loader2,
  Rocket,
  Database,
  Server,
  Activity,
  TrendingUp,
  BarChart3,
  Target,
} from "lucide-react";
import { BrandName } from "@/components/ui/BrandName";

interface SetupProgressProps {
  companyName: string;
  companySlug: string;
  onComplete: () => void;
}

const setupSteps = [
  {
    id: 1,
    title: "Configuration de l'espace",
    description: "Création de votre environnement de travail personnalisé",
    icon: Building2,
    color: "blue",
    duration: 2000,
  },
  {
    id: 2,
    title: "Initialisation des données",
    description: "Préparation de votre base de données sécurisée",
    icon: Database,
    color: "green",
    duration: 2500,
  },
  {
    id: 3,
    title: "Configuration des services",
    description: "Mise en place des services de réservation",
    icon: Server,
    color: "purple",
    duration: 3000,
  },
  {
    id: 4,
    title: "Optimisation des performances",
    description: "Amélioration de la vitesse et de la fiabilité",
    icon: Zap,
    color: "orange",
    duration: 2000,
  },
  {
    id: 5,
    title: "Tests de sécurité",
    description: "Vérification de la sécurité de votre espace",
    icon: Shield,
    color: "red",
    duration: 2500,
  },
  {
    id: 6,
    title: "Finalisation",
    description: "Derniers ajustements avant activation",
    icon: CheckCircle,
    color: "emerald",
    duration: 1500,
  },
];

const funFacts = [
  "💡 Saviez-vous que BookSpace peut gérer jusqu'à 10 000 réservations simultanées ?",
  "🚀 Notre système traite plus de 1 million de requêtes par jour !",
  "🔒 Vos données sont chiffrées avec un cryptage AES-256 de niveau militaire",
  "⚡ La plateforme répond en moins de 100ms en moyenne",
  "🌍 BookSpace est utilisé dans plus de 50 pays à travers le monde",
  "📊 Nos analytics peuvent prédire les pics d'utilisation avec 95% de précision",
  "🎯 L'interface a été optimisée pour réduire le temps de réservation de 80%",
  "🛡️ Nous avons une disponibilité de 99.9% garantie",
];

const tips = [
  {
    icon: Calendar,
    title: "Conseil Pro",
    description:
      "Configurez des réservations récurrentes pour vos réunions hebdomadaires",
    color: "blue",
  },
  {
    icon: Users,
    title: "Collaboration",
    description:
      "Invitez votre équipe dès maintenant pour une meilleure coordination",
    color: "green",
  },
  {
    icon: BarChart3,
    title: "Analytics",
    description:
      "Consultez vos rapports d'utilisation pour optimiser vos espaces",
    color: "purple",
  },
  {
    icon: Settings,
    title: "Personnalisation",
    description: "Adaptez l'interface à votre marque avec vos couleurs et logo",
    color: "orange",
  },
];

export default function SetupProgress({
  companyName,
  companySlug,
  onComplete,
}: SetupProgressProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [currentFact, setCurrentFact] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  // Animation des étapes
  useEffect(() => {
    const timer = setInterval(() => {
      if (currentStep < setupSteps.length) {
        const step = setupSteps[currentStep];

        // Marquer l'étape comme terminée après sa durée
        setTimeout(() => {
          setCompletedSteps((prev) => [...prev, currentStep]);
          setProgress(((currentStep + 1) / setupSteps.length) * 100);

          if (currentStep === setupSteps.length - 1) {
            setIsComplete(true);
            setTimeout(() => {
              onComplete();
            }, 2000);
          } else {
            setCurrentStep((prev) => prev + 1);
          }
        }, step.duration);
      }
    }, 100);

    return () => clearInterval(timer);
  }, [currentStep, onComplete]);

  // Rotation des faits amusants
  useEffect(() => {
    const factTimer = setInterval(() => {
      setCurrentFact((prev) => (prev + 1) % funFacts.length);
    }, 4000);

    return () => clearInterval(factTimer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contenu principal */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <div className="flex items-center justify-center gap-4 mb-6">
                <motion.div
                  className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-xl"
                  animate={{
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Rocket className="h-8 w-8 text-white" />
                </motion.div>
                <div>
                  <BrandName size="2xl" glow />
                  <p className="text-slate-600 font-medium">
                    Configuration en cours
                  </p>
                </div>
              </div>

              <h1 className="text-3xl font-bold text-slate-900 mb-4">
                Bienvenue chez{" "}
                <span className="text-blue-600">{companyName}</span> !
              </h1>
              <p className="text-xl text-slate-700 mb-6">
                Nous préparons votre espace de gestion de salles personnalisé
              </p>

              {/* Badge de progression */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-full text-sm text-blue-700 font-medium">
                <Activity className="h-4 w-4 animate-pulse" />
                <span>Configuration en cours...</span>
              </div>
            </motion.div>

            {/* Barre de progression principale */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl p-6 shadow-xl border border-slate-200"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-900">
                  Progression de la configuration
                </h2>
                <span className="text-sm font-medium text-slate-600">
                  {Math.round(progress)}%
                </span>
              </div>

              <div className="relative mb-6">
                <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                  <motion.div
                    className="bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 h-3 rounded-full shadow-sm"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </div>
                <div className="flex justify-between mt-2">
                  {setupSteps.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        completedSteps.includes(index)
                          ? "bg-green-500"
                          : index === currentStep
                            ? "bg-blue-500"
                            : "bg-slate-300"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Étapes détaillées */}
              <div className="space-y-3">
                {setupSteps.map((step, index) => {
                  const isCompleted = completedSteps.includes(index);
                  const isCurrent = index === currentStep;
                  const Icon = step.icon;

                  return (
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-300 ${
                        isCompleted
                          ? "bg-green-50 border border-green-200"
                          : isCurrent
                            ? "bg-blue-50 border border-blue-200"
                            : "bg-slate-50 border border-slate-200"
                      }`}
                    >
                      <div
                        className={`p-2 rounded-lg ${
                          isCompleted
                            ? "bg-green-500"
                            : isCurrent
                              ? "bg-blue-500"
                              : "bg-slate-300"
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle className="h-5 w-5 text-white" />
                        ) : isCurrent ? (
                          <Loader2 className="h-5 w-5 text-white animate-spin" />
                        ) : (
                          <Icon className="h-5 w-5 text-white" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3
                          className={`font-semibold ${
                            isCompleted
                              ? "text-green-800"
                              : isCurrent
                                ? "text-blue-800"
                                : "text-slate-600"
                          }`}
                        >
                          {step.title}
                        </h3>
                        <p
                          className={`text-sm ${
                            isCompleted
                              ? "text-green-600"
                              : isCurrent
                                ? "text-blue-600"
                                : "text-slate-500"
                          }`}
                        >
                          {step.description}
                        </p>
                      </div>
                      {isCurrent && (
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        >
                          <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Message de fin */}
            <AnimatePresence>
              {isComplete && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mb-4"
                  >
                    <CheckCircle className="h-8 w-8 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-green-800 mb-2">
                    Configuration terminée !
                  </h3>
                  <p className="text-green-700 mb-4">
                    Votre espace {companyName} est maintenant prêt. Redirection
                    en cours...
                  </p>
                  <div className="flex items-center justify-center gap-2 text-green-600">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm font-medium">Redirection...</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar avec informations utiles */}
          <div className="space-y-6">
            {/* Faits amusants */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-2xl p-6 shadow-xl border border-slate-200"
            >
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-yellow-500" />
                <h3 className="font-semibold text-slate-900">
                  Le saviez-vous ?
                </h3>
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentFact}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5 }}
                  className="text-sm text-slate-700"
                >
                  {funFacts[currentFact]}
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* Conseils utiles */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-white rounded-2xl p-6 shadow-xl border border-slate-200"
            >
              <div className="flex items-center gap-2 mb-4">
                <Target className="h-5 w-5 text-blue-500" />
                <h3 className="font-semibold text-slate-900">
                  Conseils utiles
                </h3>
              </div>
              <div className="space-y-4">
                {tips.map((tip, index) => {
                  const Icon = tip.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                      className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                    >
                      <div className={`p-2 rounded-lg bg-${tip.color}-100`}>
                        <Icon className={`h-4 w-4 text-${tip.color}-600`} />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-slate-900 mb-1">
                          {tip.title}
                        </h4>
                        <p className="text-xs text-slate-600">
                          {tip.description}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Statistiques */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200"
            >
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-blue-900">Statistiques</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-700">
                    Organisations créées
                  </span>
                  <span className="text-sm font-bold text-blue-900">
                    +1,247
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-700">
                    Réservations traitées
                  </span>
                  <span className="text-sm font-bold text-blue-900">+50K</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-700">
                    Temps moyen de config
                  </span>
                  <span className="text-sm font-bold text-blue-900">
                    2.3 min
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
