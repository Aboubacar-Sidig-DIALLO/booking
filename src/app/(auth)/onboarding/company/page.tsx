"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Building2,
  Phone,
  Briefcase,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Loader2,
} from "lucide-react";

interface CompanyData {
  name: string;
  address: string;
  phone: string;
  contactEmail: string;
  industry: string;
  employeeCount: string;
}

const steps = [
  {
    id: 1,
    title: "Informations de base",
    description:
      "Commençons par les informations essentielles de votre entreprise",
    icon: Building2,
    fields: ["name", "address"],
  },
  {
    id: 2,
    title: "Contact",
    description: "Comment pouvons-nous vous contacter ?",
    icon: Phone,
    fields: ["phone", "contactEmail"],
  },
  {
    id: 3,
    title: "Détails supplémentaires",
    description: "Aidez-nous à mieux comprendre votre entreprise",
    icon: Briefcase,
    fields: ["industry", "employeeCount"],
  },
];

const industries = [
  "Technologie",
  "Finance",
  "Santé",
  "Éducation",
  "Immobilier",
  "Commerce",
  "Manufacturing",
  "Services",
  "Consulting",
  "Autre",
];

export default function CompanyOnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [companyData, setCompanyData] = useState<CompanyData>({
    name: "",
    address: "",
    phone: "",
    contactEmail: "",
    industry: "",
    employeeCount: "",
  });

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  const updateField = (field: keyof CompanyData, value: string) => {
    setCompanyData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (isLastStep) {
      handleSubmit();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (!isFirstStep) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/onboarding/company", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...companyData,
          employeeCount: companyData.employeeCount
            ? parseInt(companyData.employeeCount)
            : undefined,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          error.error || "Erreur lors de la création de l'organisation"
        );
      }

      // Rediriger vers le dashboard admin
      router.push("/admin");
    } catch (error) {
      console.error("Erreur:", error);
      alert("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  const isStepValid = () => {
    const requiredFields = currentStepData.fields;
    return requiredFields.every((field) => {
      const value = companyData[field as keyof CompanyData];
      return value && value.trim() !== "";
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden">
      {/* Background décoratif */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full opacity-60 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full opacity-60 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-green-100 to-blue-100 rounded-full opacity-40 blur-3xl" />
      </div>

      {/* Header moderne */}
      <motion.div
        className="relative z-10 bg-white/80 backdrop-blur-md border-b border-slate-200/50 shadow-sm"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <motion.div
              className="flex items-center space-x-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <motion.div
                className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Building2 className="h-6 w-6 text-white" />
              </motion.div>
              <div>
                <span className="text-xl font-bold text-slate-900 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  BookSpace
                </span>
                <p className="text-xs text-slate-500">
                  Configuration entreprise
                </p>
              </div>
            </motion.div>

            {/* Barre de progression moderne */}
            <motion.div
              className="flex items-center space-x-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <span className="text-sm font-medium text-slate-600">
                Étape {currentStep + 1} sur {steps.length}
              </span>
              <div className="w-40 h-3 bg-slate-200 rounded-full overflow-hidden shadow-inner">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full relative"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${((currentStep + 1) / steps.length) * 100}%`,
                  }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Contenu principal moderne */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.95 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <motion.div
              className="relative"
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {/* Effet de brillance */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-indigo-500/10 rounded-3xl blur-xl" />

              <Card className="relative shadow-2xl border-0 bg-white/90 backdrop-blur-md overflow-hidden">
                <CardHeader className="text-center pb-8 bg-gradient-to-r from-slate-50 to-blue-50">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="mx-auto mb-6"
                  >
                    <motion.div
                      className="h-20 w-20 rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-xl"
                      whileHover={{ scale: 1.05, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <currentStepData.icon className="h-10 w-10 text-white" />
                    </motion.div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <CardTitle className="text-4xl font-bold text-slate-900 mb-3">
                      {currentStepData.title}
                    </CardTitle>
                    <CardDescription className="text-xl text-slate-600 leading-relaxed">
                      {currentStepData.description}
                    </CardDescription>
                  </motion.div>
                </CardHeader>

                <CardContent className="space-y-8 p-8">
                  {/* Champs du formulaire */}
                  <div className="space-y-4">
                    {currentStepData.fields.includes("name") && (
                      <div className="space-y-2">
                        <Label
                          htmlFor="name"
                          className="text-sm font-medium text-slate-700"
                        >
                          Nom de l'entreprise *
                        </Label>
                        <Input
                          id="name"
                          type="text"
                          placeholder="Ex: Mon Entreprise SARL"
                          value={companyData.name}
                          onChange={(e) => updateField("name", e.target.value)}
                          className="h-12 text-lg"
                        />
                      </div>
                    )}

                    {currentStepData.fields.includes("address") && (
                      <div className="space-y-2">
                        <Label
                          htmlFor="address"
                          className="text-sm font-medium text-slate-700"
                        >
                          Adresse
                        </Label>
                        <Input
                          id="address"
                          type="text"
                          placeholder="Ex: 123 Rue de la Paix, 75001 Paris"
                          value={companyData.address}
                          onChange={(e) =>
                            updateField("address", e.target.value)
                          }
                          className="h-12 text-lg"
                        />
                      </div>
                    )}

                    {currentStepData.fields.includes("phone") && (
                      <div className="space-y-2">
                        <Label
                          htmlFor="phone"
                          className="text-sm font-medium text-slate-700"
                        >
                          Téléphone
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="Ex: +33 1 23 45 67 89"
                          value={companyData.phone}
                          onChange={(e) => updateField("phone", e.target.value)}
                          className="h-12 text-lg"
                        />
                      </div>
                    )}

                    {currentStepData.fields.includes("contactEmail") && (
                      <div className="space-y-2">
                        <Label
                          htmlFor="contactEmail"
                          className="text-sm font-medium text-slate-700"
                        >
                          Email de contact
                        </Label>
                        <Input
                          id="contactEmail"
                          type="email"
                          placeholder="Ex: contact@monentreprise.com"
                          value={companyData.contactEmail}
                          onChange={(e) =>
                            updateField("contactEmail", e.target.value)
                          }
                          className="h-12 text-lg"
                        />
                      </div>
                    )}

                    {currentStepData.fields.includes("industry") && (
                      <div className="space-y-2">
                        <Label
                          htmlFor="industry"
                          className="text-sm font-medium text-slate-700"
                        >
                          Secteur d'activité
                        </Label>
                        <select
                          id="industry"
                          value={companyData.industry}
                          onChange={(e) =>
                            updateField("industry", e.target.value)
                          }
                          className="w-full h-12 px-3 py-2 border border-slate-300 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Sélectionnez un secteur</option>
                          {industries.map((industry) => (
                            <option key={industry} value={industry}>
                              {industry}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {currentStepData.fields.includes("employeeCount") && (
                      <div className="space-y-2">
                        <Label
                          htmlFor="employeeCount"
                          className="text-sm font-medium text-slate-700"
                        >
                          Nombre d'employés
                        </Label>
                        <Input
                          id="employeeCount"
                          type="number"
                          placeholder="Ex: 25"
                          value={companyData.employeeCount}
                          onChange={(e) =>
                            updateField("employeeCount", e.target.value)
                          }
                          className="h-12 text-lg"
                        />
                      </div>
                    )}
                  </div>

                  {/* Boutons de navigation modernes */}
                  <motion.div
                    className="flex items-center justify-between pt-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        variant="outline"
                        onClick={prevStep}
                        disabled={isFirstStep}
                        className="flex items-center gap-3 px-6 py-3 border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 rounded-xl"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        Précédent
                      </Button>
                    </motion.div>

                    {/* Indicateur de progression central */}
                    <motion.div
                      className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      <div className="flex gap-1">
                        {steps.map((_, index) => (
                          <motion.div
                            key={index}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${
                              index <= currentStep
                                ? "bg-blue-500"
                                : "bg-slate-300"
                            }`}
                            animate={
                              index === currentStep
                                ? { scale: [1, 1.2, 1] }
                                : {}
                            }
                            transition={{ duration: 0.5, repeat: Infinity }}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-medium text-slate-600 ml-2">
                        {Math.round(((currentStep + 1) / steps.length) * 100)}%
                      </span>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        onClick={nextStep}
                        disabled={!isStepValid() || isLoading}
                        className="flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-700 text-white shadow-xl hover:shadow-2xl transition-all duration-200 rounded-xl group disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Création...
                          </>
                        ) : isLastStep ? (
                          <>
                            Créer l'organisation
                            <CheckCircle className="h-4 w-4 group-hover:scale-110 transition-transform" />
                          </>
                        ) : (
                          <>
                            Suivant
                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </Button>
                    </motion.div>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
