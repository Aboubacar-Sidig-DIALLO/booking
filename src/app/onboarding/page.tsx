"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Building2,
  Users,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Globe,
  Mail,
  Phone,
  Settings,
  CheckCircle2,
  Loader2,
  User,
  Clock,
} from "lucide-react";
import { toast } from "sonner";

// Composant pour afficher les messages d'erreur
const ErrorMessage = ({ message }: { message: string }) => (
  <p className="text-red-500 text-sm mt-1">{message}</p>
);

// Interface pour les erreurs de l'API
interface ApiError {
  error?: string;
  message?: string;
  details?: {
    suggestedSlug?: string;
  };
}

interface OnboardingData {
  // Informations de l'entreprise
  companyName: string;
  companySlug: string;
  companyDomain?: string;
  industry: string;
  companySize: string;

  // Informations de l'administrateur
  adminName: string;
  adminEmail: string;
  adminPhone?: string;

  // Configuration initiale
  timezone: string;
  language: string;
  currency: string;
}

const INDUSTRIES = [
  "Technologie",
  "Finance",
  "Santé",
  "Éducation",
  "Immobilier",
  "Consulting",
  "Manufacturing",
  "Retail",
  "Autre",
];

const COMPANY_SIZES = [
  "1-10 employés",
  "11-50 employés",
  "51-200 employés",
  "201-1000 employés",
  "1000+ employés",
];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [data, setData] = useState<OnboardingData>({
    companyName: "",
    companySlug: "",
    companyDomain: "",
    industry: "",
    companySize: "",
    adminName: "",
    adminEmail: "",
    adminPhone: "",
    timezone: "Europe/Paris",
    language: "fr",
    currency: "EUR",
  });

  const steps = [
    { id: 0, title: "Informations de l'entreprise", icon: Building2 },
    { id: 1, title: "Administrateur", icon: Users },
    { id: 2, title: "Configuration", icon: Settings },
    { id: 3, title: "Récapitulatif", icon: CheckCircle },
  ];

  const progress = ((currentStep + 1) / steps.length) * 100;

  const updateData = (field: keyof OnboardingData, value: any) => {
    setData((prev) => ({ ...prev, [field]: value }));
    // Effacer l'erreur de validation pour ce champ quand l'utilisateur tape
    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateCurrentStep = (): boolean => {
    const errors: Record<string, string> = {};

    switch (currentStep) {
      case 0: // Informations de l'entreprise
        if (!data.companyName.trim()) {
          errors.companyName = "Le nom de l'entreprise est obligatoire";
        }
        if (!data.companySlug.trim()) {
          errors.companySlug = "L'identifiant unique est obligatoire";
        }
        if (!data.industry) {
          errors.industry = "Le secteur d'activité est obligatoire";
        }
        if (!data.companySize) {
          errors.companySize = "La taille de l'entreprise est obligatoire";
        }
        break;

      case 1: // Administrateur
        if (!data.adminName.trim()) {
          errors.adminName = "Le nom complet est obligatoire";
        }
        if (!data.adminEmail.trim()) {
          errors.adminEmail = "L'email est obligatoire";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.adminEmail)) {
          errors.adminEmail = "Veuillez saisir un email valide";
        }
        break;

      case 2: // Configuration
        if (!data.timezone) {
          errors.timezone = "Le fuseau horaire est obligatoire";
        }
        if (!data.language) {
          errors.language = "La langue est obligatoire";
        }
        if (!data.currency) {
          errors.currency = "La devise est obligatoire";
        }
        break;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const checkSlugAvailability = async (slug: string) => {
    try {
      const response = await fetch(
        `/api/onboarding/check-slug?slug=${encodeURIComponent(slug)}`
      );

      if (!response.ok) {
        console.error(
          `Erreur ${response.status} lors de la vérification du slug`
        );
        return false;
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        console.error("Réponse non-JSON lors de la vérification du slug");
        return false;
      }

      const data = await response.json();
      return data.data.available;
    } catch (error) {
      console.error("Erreur lors de la vérification du slug:", error);
      return false;
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const isSlugAvailable = await checkSlugAvailability(data.companySlug);
      if (!isSlugAvailable) {
        toast.error(
          "Ce nom d'organisation est déjà utilisé. Veuillez en choisir un autre."
        );
        setIsLoading(false);
        return;
      }

      const response = await fetch("/api/onboarding/create-organization", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        let errorData: ApiError = {};
        try {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            errorData = await response.json();
          } else {
            const text = await response.text();
            throw new Error(
              `Erreur ${response.status}: ${text.substring(0, 100)}...`
            );
          }
        } catch (parseError) {
          console.error("Erreur lors du parsing de la réponse:", parseError);
          throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }

        if (response.status === 409) {
          if (errorData.error === "SLUG_ALREADY_EXISTS") {
            const suggestedSlug = errorData.details?.suggestedSlug;
            if (suggestedSlug) {
              toast.error(
                `Ce nom d'organisation est déjà utilisé. Suggestion: ${suggestedSlug}`
              );
            } else {
              toast.error(
                "Ce nom d'organisation est déjà utilisé. Veuillez en choisir un autre."
              );
            }
            return;
          } else if (errorData.error === "EMAIL_ALREADY_EXISTS") {
            toast.error(
              "Cet email est déjà utilisé. Veuillez utiliser un autre email."
            );
            return;
          } else if (errorData.error === "DOMAIN_ALREADY_EXISTS") {
            toast.error(
              "Ce domaine est déjà utilisé par une autre organisation."
            );
            return;
          }
        }

        throw new Error(
          errorData.message ||
            `Erreur ${response.status}: ${response.statusText}`
        );
      }

      const result = await response.json();

      toast.success("Organisation créée avec succès !");

      setTimeout(() => {
        window.location.href = `http://localhost:3000/tenant/${data.companySlug}/home`;
      }, 2000);
    } catch (error) {
      toast.error("Erreur lors de la création de l'organisation");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <div className="p-3 bg-blue-100 rounded-full w-fit mx-auto mb-4">
                <Building2 className="h-8 w-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Informations de votre entreprise
              </h2>
              <p className="text-slate-600 mb-3">
                Commençons par les détails de votre organisation
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full text-sm text-blue-700">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Gratuit pour commencer</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="companyName" className="text-sm font-medium">
                  Nom de l'entreprise *
                </Label>
                <Input
                  id="companyName"
                  placeholder="Ex: Acme Corporation"
                  value={data.companyName}
                  onChange={(e) => {
                    updateData("companyName", e.target.value);
                    if (!data.companySlug) {
                      updateData("companySlug", generateSlug(e.target.value));
                    }
                  }}
                  className={`h-12 ${validationErrors.companyName ? "border-red-500 focus:border-red-500" : ""}`}
                />
                {validationErrors.companyName && (
                  <ErrorMessage message={validationErrors.companyName} />
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="companySlug" className="text-sm font-medium">
                  Identifiant unique *
                </Label>
                <div className="relative">
                  <Input
                    id="companySlug"
                    placeholder="acme-corp"
                    value={data.companySlug}
                    onChange={(e) => updateData("companySlug", e.target.value)}
                    className={`h-12 pr-20 ${validationErrors.companySlug ? "border-red-500 focus:border-red-500" : ""}`}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">
                    .localhost:3000
                  </div>
                </div>
                {validationErrors.companySlug && (
                  <ErrorMessage message={validationErrors.companySlug} />
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="industry" className="text-sm font-medium">
                  Secteur d'activité *
                </Label>
                <Select
                  value={data.industry}
                  onValueChange={(value) => updateData("industry", value)}
                >
                  <SelectTrigger
                    className={`h-12 ${validationErrors.industry ? "border-red-500 focus:border-red-500" : ""}`}
                  >
                    <SelectValue placeholder="Sélectionnez votre secteur" />
                  </SelectTrigger>
                  <SelectContent>
                    {INDUSTRIES.map((industry) => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {validationErrors.industry && (
                  <ErrorMessage message={validationErrors.industry} />
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="companySize" className="text-sm font-medium">
                  Taille de l'entreprise *
                </Label>
                <Select
                  value={data.companySize}
                  onValueChange={(value) => updateData("companySize", value)}
                >
                  <SelectTrigger
                    className={`h-12 ${validationErrors.companySize ? "border-red-500 focus:border-red-500" : ""}`}
                  >
                    <SelectValue placeholder="Nombre d'employés" />
                  </SelectTrigger>
                  <SelectContent>
                    {COMPANY_SIZES.map((size) => (
                      <SelectItem key={size} value={size}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {validationErrors.companySize && (
                  <ErrorMessage message={validationErrors.companySize} />
                )}
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <div className="p-3 bg-green-100 rounded-full w-fit mx-auto mb-4">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Administrateur principal
              </h2>
              <p className="text-slate-600">
                Qui sera le responsable de cette organisation ?
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="adminName" className="text-sm font-medium">
                  Nom complet *
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="adminName"
                    placeholder="Jean Dupont"
                    value={data.adminName}
                    onChange={(e) => updateData("adminName", e.target.value)}
                    className={`h-12 pl-10 ${validationErrors.adminName ? "border-red-500 focus:border-red-500" : ""}`}
                  />
                </div>
                {validationErrors.adminName && (
                  <ErrorMessage message={validationErrors.adminName} />
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="adminEmail" className="text-sm font-medium">
                  Email *
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="adminEmail"
                    type="email"
                    placeholder="jean@acme.com"
                    value={data.adminEmail}
                    onChange={(e) => updateData("adminEmail", e.target.value)}
                    className={`h-12 pl-10 ${validationErrors.adminEmail ? "border-red-500 focus:border-red-500" : ""}`}
                  />
                </div>
                {validationErrors.adminEmail && (
                  <ErrorMessage message={validationErrors.adminEmail} />
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="adminPhone" className="text-sm font-medium">
                  Téléphone (optionnel)
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="adminPhone"
                    type="tel"
                    placeholder="+33 1 23 45 67 89"
                    value={data.adminPhone}
                    onChange={(e) => updateData("adminPhone", e.target.value)}
                    className="h-12 pl-10"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <div className="p-3 bg-orange-100 rounded-full w-fit mx-auto mb-4">
                <Settings className="h-8 w-8 text-orange-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Configuration initiale
              </h2>
              <p className="text-slate-600">
                Personnalisez les paramètres de votre organisation
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="timezone" className="text-sm font-medium">
                  Fuseau horaire *
                </Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Select
                    value={data.timezone}
                    onValueChange={(value) => updateData("timezone", value)}
                  >
                    <SelectTrigger
                      className={`h-12 pl-10 ${validationErrors.timezone ? "border-red-500 focus:border-red-500" : ""}`}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Europe/Paris">Europe/Paris</SelectItem>
                      <SelectItem value="Europe/London">
                        Europe/London
                      </SelectItem>
                      <SelectItem value="America/New_York">
                        America/New_York
                      </SelectItem>
                      <SelectItem value="America/Los_Angeles">
                        America/Los_Angeles
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {validationErrors.timezone && (
                  <ErrorMessage message={validationErrors.timezone} />
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="language" className="text-sm font-medium">
                  Langue *
                </Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Select
                    value={data.language}
                    onValueChange={(value) => updateData("language", value)}
                  >
                    <SelectTrigger
                      className={`h-12 pl-10 ${validationErrors.language ? "border-red-500 focus:border-red-500" : ""}`}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {validationErrors.language && (
                  <ErrorMessage message={validationErrors.language} />
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency" className="text-sm font-medium">
                  Devise *
                </Label>
                <Select
                  value={data.currency}
                  onValueChange={(value) => updateData("currency", value)}
                >
                  <SelectTrigger
                    className={`h-12 ${validationErrors.currency ? "border-red-500 focus:border-red-500" : ""}`}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="GBP">GBP (£)</SelectItem>
                    <SelectItem value="CAD">CAD (C$)</SelectItem>
                  </SelectContent>
                </Select>
                {validationErrors.currency && (
                  <ErrorMessage message={validationErrors.currency} />
                )}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <div className="p-3 bg-green-100 rounded-full w-fit mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Récapitulatif
              </h2>
              <p className="text-slate-600">
                Vérifiez les informations avant de créer votre organisation
              </p>
            </div>

            {/* Message de bienvenue gratuit */}
            <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Building2 className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">
                    Commencez gratuitement votre gestion de salles
                  </h3>
                  <p className="text-blue-700 mb-4">
                    Cette première utilisation est entièrement gratuite pour la
                    gestion de réservation de vos salles. Découvrez ReservApp
                    sans engagement et gérez vos espaces de travail en toute
                    simplicité.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 text-sm text-blue-700">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Réservation de salles en quelques clics</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-blue-700">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Interface moderne et intuitive</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-blue-700">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Notifications automatiques</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-blue-700">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Gestion complète de vos espaces</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Design ultra-moderne et compact */}
            <div className="space-y-3">
              {/* Carte Organisation - Design horizontal compact */}
              <div className="bg-gradient-to-r from-white to-slate-50 border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-lg transition-all duration-200">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-sm">
                    <Building2 className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 mb-3 text-sm">
                      Organisation
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div>
                        <span className="text-xs text-slate-500 font-medium">
                          Nom
                        </span>
                        <p className="text-slate-900 font-semibold text-sm">
                          {data.companyName}
                        </p>
                      </div>
                      <div>
                        <span className="text-xs text-slate-500 font-medium">
                          Identifiant
                        </span>
                        <p className="text-slate-900 font-semibold text-sm">
                          {data.companySlug}.localhost:3000
                        </p>
                      </div>
                      <div>
                        <span className="text-xs text-slate-500 font-medium">
                          Secteur
                        </span>
                        <p className="text-slate-900 font-semibold text-sm">
                          {data.industry}
                        </p>
                      </div>
                      <div>
                        <span className="text-xs text-slate-500 font-medium">
                          Taille
                        </span>
                        <p className="text-slate-900 font-semibold text-sm">
                          {data.companySize}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Carte Administrateur - Design horizontal compact */}
              <div className="bg-gradient-to-r from-white to-slate-50 border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-lg transition-all duration-200">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-sm">
                    <Users className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 mb-3 text-sm">
                      Administrateur
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <span className="text-xs text-slate-500 font-medium">
                          Nom
                        </span>
                        <p className="text-slate-900 font-semibold text-sm">
                          {data.adminName}
                        </p>
                      </div>
                      <div>
                        <span className="text-xs text-slate-500 font-medium">
                          Email
                        </span>
                        <p className="text-slate-900 font-semibold text-sm">
                          {data.adminEmail}
                        </p>
                      </div>
                      {data.adminPhone && (
                        <div>
                          <span className="text-xs text-slate-500 font-medium">
                            Téléphone
                          </span>
                          <p className="text-slate-900 font-semibold text-sm">
                            {data.adminPhone}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Carte Configuration - Design horizontal compact */}
              <div className="bg-gradient-to-r from-white to-slate-50 border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-lg transition-all duration-200">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-sm">
                    <Settings className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 mb-3 text-sm">
                      Configuration
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <span className="text-xs text-slate-500 font-medium">
                          Fuseau horaire
                        </span>
                        <p className="text-slate-900 font-semibold text-sm">
                          {data.timezone}
                        </p>
                      </div>
                      <div>
                        <span className="text-xs text-slate-500 font-medium">
                          Langue
                        </span>
                        <p className="text-slate-900 font-semibold text-sm">
                          {data.language === "fr"
                            ? "Français"
                            : data.language === "en"
                              ? "English"
                              : data.language === "es"
                                ? "Español"
                                : data.language === "de"
                                  ? "Deutsch"
                                  : data.language}
                        </p>
                      </div>
                      <div>
                        <span className="text-xs text-slate-500 font-medium">
                          Devise
                        </span>
                        <p className="text-slate-900 font-semibold text-sm">
                          {data.currency}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header moderne avec progression */}
      <div className="bg-gradient-to-r from-white via-slate-50 to-white backdrop-blur-md border-b border-slate-200/50 sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="p-3 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-2xl shadow-lg">
                  <Building2 className="h-7 w-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full border-2 border-white shadow-sm"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 mb-1">
                  ReservApp
                </h1>
                <p className="text-sm text-slate-600 font-medium">
                  Configuration de votre espace de gestion de salles
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-slate-800">
                  {steps[currentStep].title}
                </span>
              </div>
              <div className="text-xs text-slate-500 font-medium">
                Étape {currentStep + 1} sur {steps.length} •{" "}
                {Math.round(progress)}% terminé
              </div>
            </div>
          </div>

          {/* Barre de progression moderne */}
          <div className="relative">
            <div className="w-full bg-slate-200/60 rounded-full h-3 overflow-hidden">
              <motion.div
                className="bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 h-3 rounded-full shadow-sm"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
            <div className="flex justify-between mt-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index <= currentStep ? "bg-blue-500" : "bg-slate-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation des étapes moderne */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200/50 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;

              return (
                <motion.div
                  key={step.id}
                  className="flex items-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center gap-4">
                    <motion.div
                      className="relative"
                      whileHover={isCompleted ? { scale: 1.05 } : {}}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <motion.div
                        className={`
                        flex items-center justify-center w-12 h-12 rounded-2xl border-2 transition-all duration-300 shadow-lg
                        ${
                          isActive
                            ? "border-blue-500 bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-blue-200"
                            : isCompleted
                              ? "border-green-300 bg-gradient-to-br from-green-50 to-emerald-50 text-green-600 cursor-pointer hover:border-green-400 hover:bg-gradient-to-br hover:from-green-100 hover:to-emerald-100 hover:shadow-green-200"
                              : "border-slate-300 bg-gradient-to-br from-slate-50 to-slate-100 text-slate-400"
                        }
                      `}
                        onClick={
                          isCompleted ? () => setCurrentStep(index) : undefined
                        }
                        animate={
                          isActive
                            ? {
                                boxShadow: "0 0 0 4px rgba(59, 130, 246, 0.1)",
                                scale: 1.05,
                              }
                            : {}
                        }
                        transition={{ duration: 0.3 }}
                      >
                        <Icon className="h-6 w-6" />
                      </motion.div>
                      {isCompleted && (
                        <motion.div
                          className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg border-2 border-white"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 30,
                            delay: 0.2,
                          }}
                        >
                          <CheckCircle2 className="h-3 w-3 text-white" />
                        </motion.div>
                      )}
                    </motion.div>
                    <div className="hidden sm:block">
                      <div
                        className={`text-sm font-semibold transition-colors ${
                          isActive
                            ? "text-blue-600"
                            : isCompleted
                              ? "text-green-600"
                              : "text-slate-500"
                        }`}
                      >
                        {step.title}
                      </div>
                      <div
                        className={`text-xs transition-colors ${
                          isActive
                            ? "text-blue-500"
                            : isCompleted
                              ? "text-green-500"
                              : "text-slate-400"
                        }`}
                      >
                        {isCompleted
                          ? "Terminé"
                          : isActive
                            ? "En cours"
                            : "À venir"}
                      </div>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <motion.div
                      className="hidden sm:block w-12 h-1 bg-gradient-to-r from-slate-200 to-slate-300 mx-6 rounded-full"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: index * 0.1 + 0.2 }}
                    />
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Contenu principal moderne */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
                {/* Header de l'étape */}
                <motion.div
                  className="bg-gradient-to-r from-slate-50 to-blue-50 px-8 py-6 border-b border-slate-200/50"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="flex items-center gap-4">
                    <motion.div
                      className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg"
                      whileHover={{ scale: 1.05, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {React.createElement(steps[currentStep].icon, {
                        className: "h-6 w-6 text-white",
                      })}
                    </motion.div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">
                        {steps[currentStep].title}
                      </h2>
                      <p className="text-slate-600 mt-1">
                        {currentStep === 0 &&
                          "Configurez les informations de base de votre organisation"}
                        {currentStep === 1 &&
                          "Définissez les informations de l'administrateur principal"}
                        {currentStep === 2 &&
                          "Personnalisez les paramètres selon vos préférences"}
                        {currentStep === 3 &&
                          "Vérifiez et confirmez votre configuration"}
                      </p>
                    </div>
                  </div>
                </motion.div>

                <CardContent className="p-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    {renderStep()}
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation moderne */}
        <motion.div
          className="flex items-center justify-between mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
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
                    index <= currentStep ? "bg-blue-500" : "bg-slate-300"
                  }`}
                  animate={index === currentStep ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 0.5, repeat: Infinity }}
                />
              ))}
            </div>
            <span className="text-sm font-medium text-slate-600 ml-2">
              {Math.round(progress)}%
            </span>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            {currentStep < steps.length - 1 ? (
              <Button
                onClick={handleNext}
                className="flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-700 text-white shadow-xl hover:shadow-2xl transition-all duration-200 rounded-xl group"
              >
                Suivant
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 hover:from-green-700 hover:via-emerald-700 hover:to-green-800 text-white shadow-xl hover:shadow-2xl transition-all duration-200 rounded-xl group"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Création en cours...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 group-hover:scale-110 transition-transform" />
                    Créer l'organisation
                  </>
                )}
              </Button>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
