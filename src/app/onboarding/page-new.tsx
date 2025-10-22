"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  Users,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Crown,
  Globe,
  Mail,
  Phone,
  Calendar,
  Settings,
  Zap,
  Star,
  CheckCircle2,
  Loader2,
  User,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";

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

  // Plan et fonctionnalités
  selectedPlan: string;
  selectedFeatures: string[];

  // Configuration initiale
  timezone: string;
  language: string;
  currency: string;
}

// Interface pour les erreurs de l'API
interface ApiError {
  error?: string;
  message?: string;
  details?: {
    suggestedSlug?: string;
  };
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

const PLANS = [
  {
    id: "STARTER",
    name: "Starter",
    price: "Gratuit",
    description: "Parfait pour les petites équipes",
    features: ["Jusqu'à 5 salles", "Réservations de base", "Support email"],
    icon: Building2,
    color: "gray",
    gradient: "from-gray-50 to-gray-100",
    borderColor: "border-gray-200",
    textColor: "text-gray-700",
    buttonColor: "bg-gray-600 hover:bg-gray-700",
    popular: false,
  },
  {
    id: "PROFESSIONAL",
    name: "Professional",
    price: "29€/mois",
    description: "Idéal pour les entreprises en croissance",
    features: [
      "Salles illimitées",
      "Analytics avancés",
      "Intégrations",
      "Support prioritaire",
    ],
    icon: Zap,
    color: "blue",
    gradient: "from-blue-50 to-indigo-100",
    borderColor: "border-blue-200",
    textColor: "text-blue-700",
    buttonColor:
      "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700",
    popular: true,
  },
  {
    id: "ENTERPRISE",
    name: "Enterprise",
    price: "99€/mois",
    description: "Solution complète pour les grandes organisations",
    features: [
      "Toutes les fonctionnalités",
      "SSO & Sécurité avancée",
      "API complète",
      "Support dédié 24/7",
    ],
    icon: Crown,
    color: "purple",
    gradient: "from-purple-50 to-violet-100",
    borderColor: "border-purple-200",
    textColor: "text-purple-700",
    buttonColor:
      "bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700",
    popular: false,
  },
];

const FEATURES = [
  {
    id: "analytics",
    name: "Analytics Avancés",
    description: "Tableaux de bord et rapports détaillés",
    icon: Calendar,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    id: "recurring_bookings",
    name: "Réservations Récurrentes",
    description: "Planification automatique des réunions",
    icon: Calendar,
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    id: "custom_branding",
    name: "Personnalisation",
    description: "Logo et couleurs de votre entreprise",
    icon: Sparkles,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    id: "api_access",
    name: "Accès API",
    description: "Intégration avec vos outils existants",
    icon: Settings,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
  {
    id: "advanced_reports",
    name: "Rapports Avancés",
    description: "Exports et analyses personnalisées",
    icon: Calendar,
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
  },
  {
    id: "multi_site",
    name: "Multi-Sites",
    description: "Gestion de plusieurs emplacements",
    icon: Building2,
    color: "text-teal-600",
    bgColor: "bg-teal-50",
  },
  {
    id: "integrations",
    name: "Intégrations",
    description: "Calendrier, Slack, Teams, etc.",
    icon: Zap,
    color: "text-pink-600",
    bgColor: "bg-pink-50",
  },
];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<OnboardingData>({
    companyName: "",
    companySlug: "",
    companyDomain: "",
    industry: "",
    companySize: "",
    adminName: "",
    adminEmail: "",
    adminPhone: "",
    selectedPlan: "PROFESSIONAL",
    selectedFeatures: [],
    timezone: "Europe/Paris",
    language: "fr",
    currency: "EUR",
  });

  const steps = [
    { id: 0, title: "Informations de l'entreprise", icon: Building2 },
    { id: 1, title: "Administrateur", icon: Users },
    { id: 2, title: "Plan & Fonctionnalités", icon: Crown },
    { id: 3, title: "Configuration", icon: Settings },
    { id: 4, title: "Récapitulatif", icon: CheckCircle },
  ];

  const progress = ((currentStep + 1) / steps.length) * 100;

  const updateData = (field: keyof OnboardingData, value: any) => {
    setData((prev) => ({ ...prev, [field]: value }));
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
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
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
        let errorData = {};
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
          if ((errorData as ApiError).error === "SLUG_ALREADY_EXISTS") {
            const suggestedSlug = (errorData as ApiError).details
              ?.suggestedSlug;
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
          } else if ((errorData as ApiError).error === "EMAIL_ALREADY_EXISTS") {
            toast.error(
              "Cet email est déjà utilisé. Veuillez utiliser un autre email."
            );
            return;
          } else if (
            (errorData as ApiError).error === "DOMAIN_ALREADY_EXISTS"
          ) {
            toast.error(
              "Ce domaine est déjà utilisé par une autre organisation."
            );
            return;
          }
        }

        throw new Error(
          (errorData as ApiError).message ||
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
              <p className="text-slate-600">
                Commençons par les détails de votre organisation
              </p>
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
                  className="h-12"
                />
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
                    className="h-12 pr-20"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">
                    .localhost:3000
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="industry" className="text-sm font-medium">
                  Secteur d'activité *
                </Label>
                <Select
                  value={data.industry}
                  onValueChange={(value) => updateData("industry", value)}
                >
                  <SelectTrigger className="h-12">
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="companySize" className="text-sm font-medium">
                  Taille de l'entreprise *
                </Label>
                <Select
                  value={data.companySize}
                  onValueChange={(value) => updateData("companySize", value)}
                >
                  <SelectTrigger className="h-12">
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
                    className="h-12 pl-10"
                  />
                </div>
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
                    className="h-12 pl-10"
                  />
                </div>
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
              <div className="p-3 bg-purple-100 rounded-full w-fit mx-auto mb-4">
                <Crown className="h-8 w-8 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Choisissez votre plan
              </h2>
              <p className="text-slate-600">
                Sélectionnez le plan qui correspond à vos besoins
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {PLANS.map((plan) => {
                const Icon = plan.icon;
                const isSelected = data.selectedPlan === plan.id;

                return (
                  <motion.div
                    key={plan.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card
                      className={`cursor-pointer transition-all duration-200 ${
                        isSelected
                          ? `ring-2 ring-blue-500 ${plan.gradient} ${plan.borderColor}`
                          : "hover:shadow-lg"
                      }`}
                      onClick={() => updateData("selectedPlan", plan.id)}
                    >
                      <CardHeader className="text-center pb-4">
                        {plan.popular && (
                          <Badge className="mb-2 bg-gradient-to-r from-blue-600 to-indigo-600">
                            <Star className="h-3 w-3 mr-1" />
                            Populaire
                          </Badge>
                        )}
                        <div
                          className={`p-3 ${plan.color} rounded-full w-fit mx-auto mb-3`}
                        >
                          <Icon className={`h-6 w-6 ${plan.color}`} />
                        </div>
                        <CardTitle className={plan.textColor}>
                          {plan.name}
                        </CardTitle>
                        <CardDescription className="text-lg font-semibold text-slate-900">
                          {plan.price}
                        </CardDescription>
                        <p className="text-sm text-slate-600">
                          {plan.description}
                        </p>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {plan.features.map((feature, index) => (
                            <li
                              key={index}
                              className="flex items-center gap-2 text-sm"
                            >
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                Fonctionnalités supplémentaires
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {FEATURES.map((feature) => {
                  const Icon = feature.icon;
                  const isSelected = data.selectedFeatures.includes(feature.id);

                  return (
                    <motion.div
                      key={feature.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card
                        className={`cursor-pointer transition-all duration-200 ${
                          isSelected
                            ? "ring-2 ring-blue-500 bg-blue-50"
                            : "hover:shadow-md"
                        }`}
                        onClick={() => {
                          const newFeatures = isSelected
                            ? data.selectedFeatures.filter(
                                (f) => f !== feature.id
                              )
                            : [...data.selectedFeatures, feature.id];
                          updateData("selectedFeatures", newFeatures);
                        }}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div
                              className={`p-2 ${feature.bgColor} rounded-lg`}
                            >
                              <Icon className={`h-5 w-5 ${feature.color}`} />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-slate-900 mb-1">
                                {feature.name}
                              </h4>
                              <p className="text-sm text-slate-600">
                                {feature.description}
                              </p>
                            </div>
                            <Checkbox
                              checked={isSelected}
                              onChange={() => {}}
                              className="mt-1"
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        );

      case 3:
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
                    <SelectTrigger className="h-12 pl-10">
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
                    <SelectTrigger className="h-12 pl-10">
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency" className="text-sm font-medium">
                  Devise *
                </Label>
                <Select
                  value={data.currency}
                  onValueChange={(value) => updateData("currency", value)}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="GBP">GBP (£)</SelectItem>
                    <SelectItem value="CAD">CAD (C$)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 4:
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-blue-600" />
                    Organisation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-slate-600">
                      Nom:
                    </span>
                    <p className="text-slate-900">{data.companyName}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-600">
                      Identifiant:
                    </span>
                    <p className="text-slate-900">
                      {data.companySlug}.localhost:3000
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-600">
                      Secteur:
                    </span>
                    <p className="text-slate-900">{data.industry}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-600">
                      Taille:
                    </span>
                    <p className="text-slate-900">{data.companySize}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-green-600" />
                    Administrateur
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-slate-600">
                      Nom:
                    </span>
                    <p className="text-slate-900">{data.adminName}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-600">
                      Email:
                    </span>
                    <p className="text-slate-900">{data.adminEmail}</p>
                  </div>
                  {data.adminPhone && (
                    <div>
                      <span className="text-sm font-medium text-slate-600">
                        Téléphone:
                      </span>
                      <p className="text-slate-900">{data.adminPhone}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Crown className="h-5 w-5 text-purple-600" />
                    Plan sélectionné
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Crown className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">
                        {PLANS.find((p) => p.id === data.selectedPlan)?.name}
                      </p>
                      <p className="text-sm text-slate-600">
                        {PLANS.find((p) => p.id === data.selectedPlan)?.price}
                      </p>
                    </div>
                  </div>
                  {data.selectedFeatures.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-slate-600 mb-2">
                        Fonctionnalités supplémentaires:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {data.selectedFeatures.map((featureId) => {
                          const feature = FEATURES.find(
                            (f) => f.id === featureId
                          );
                          return feature ? (
                            <Badge key={featureId} variant="secondary">
                              {feature.name}
                            </Badge>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-orange-600" />
                    Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-slate-600">
                      Fuseau horaire:
                    </span>
                    <p className="text-slate-900">{data.timezone}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-600">
                      Langue:
                    </span>
                    <p className="text-slate-900">
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
                    <span className="text-sm font-medium text-slate-600">
                      Devise:
                    </span>
                    <p className="text-slate-900">{data.currency}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header avec progression */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">
                  Configuration de votre organisation
                </h1>
                <p className="text-sm text-slate-600">
                  Étape {currentStep + 1} sur {steps.length}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-slate-700">
                {steps[currentStep].title}
              </div>
              <div className="text-xs text-slate-500">
                {Math.round(progress)}% terminé
              </div>
            </div>
          </div>

          {/* Barre de progression */}
          <div className="w-full bg-slate-200 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>

      {/* Navigation des étapes moderne */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-slate-200/50 shadow-sm">
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
                              ? "border-green-400 bg-gradient-to-br from-green-500 to-emerald-600 text-white cursor-pointer hover:border-green-500 hover:bg-gradient-to-br hover:from-green-600 hover:to-emerald-700 hover:shadow-green-200"
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
                        {isCompleted ? (
                          <CheckCircle2 className="h-6 w-6" />
                        ) : (
                          <Icon className="h-6 w-6" />
                        )}
                      </motion.div>
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

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Précédent
          </Button>

          <div className="flex items-center gap-2">
            {currentStep < steps.length - 1 ? (
              <Button
                onClick={handleNext}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Suivant
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Création en cours...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Créer l'organisation
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
