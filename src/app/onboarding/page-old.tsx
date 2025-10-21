"use client";
import { useState } from "react";
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
import { Progress } from "@/components/ui/progress";
import {
  Building2,
  Users,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Shield,
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

  const handleCompanyNameChange = (name: string) => {
    updateData("companyName", name);
    if (
      !data.companySlug ||
      data.companySlug === generateSlug(data.companyName)
    ) {
      updateData("companySlug", generateSlug(name));
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
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
        // En cas d'erreur, on considère le slug comme non disponible pour éviter les conflits
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
      // En cas d'erreur réseau ou autre, on considère le slug comme non disponible
      return false;
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Vérifier la disponibilité du slug avant la soumission
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
            // Si ce n'est pas du JSON, utiliser le texte de la réponse
            const text = await response.text();
            throw new Error(
              `Erreur ${response.status}: ${text.substring(0, 100)}...`
            );
          }
        } catch (parseError) {
          console.error("Erreur lors du parsing de la réponse:", parseError);
          throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }

        // Gestion spécifique des erreurs 409 (conflit)
        if (response.status === 409) {
          if (errorData.error === "SLUG_ALREADY_EXISTS") {
            const suggestedSlug = errorData.details?.suggestedSlug;
            if (suggestedSlug) {
              toast.error(
                `Ce nom d'organisation est déjà utilisé. Essayez: ${suggestedSlug}`
              );
              // Mettre à jour automatiquement le slug suggéré
              updateData("companySlug", suggestedSlug);
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

      // Rediriger vers le dashboard de l'organisation
      setTimeout(() => {
        // En développement, rediriger vers localhost avec le slug en paramètre
        window.location.href = `http://localhost:3000/tenant/${data.companySlug}/home`;
      }, 2000);
    } catch (error) {
      toast.error("Erreur lors de la création de l'organisation");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="companyName">Nom de l'entreprise *</Label>
                <Input
                  id="companyName"
                  value={data.companyName}
                  onChange={(e) => handleCompanyNameChange(e.target.value)}
                  placeholder="Ex: Acme Corporation"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companySlug">Identifiant unique *</Label>
                <Input
                  id="companySlug"
                  value={data.companySlug}
                  onChange={(e) => updateData("companySlug", e.target.value)}
                  placeholder="acme-corp"
                />
                <p className="text-xs text-gray-500">
                  URL: {data.companySlug}.localhost:3000
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyDomain">
                Domaine personnalisé (optionnel)
              </Label>
              <Input
                id="companyDomain"
                value={data.companyDomain}
                onChange={(e) => updateData("companyDomain", e.target.value)}
                placeholder="votre-entreprise.com"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="industry">Secteur d'activité</Label>
                <Select
                  value={data.industry}
                  onValueChange={(value) => updateData("industry", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un secteur" />
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
                <Label htmlFor="companySize">Taille de l'entreprise</Label>
                <Select
                  value={data.companySize}
                  onValueChange={(value) => updateData("companySize", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez la taille" />
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
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold">
                Administrateur Principal
              </h3>
              <p className="text-gray-600">
                Cette personne aura tous les droits d'administration
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="adminName">Nom complet *</Label>
                <Input
                  id="adminName"
                  value={data.adminName}
                  onChange={(e) => updateData("adminName", e.target.value)}
                  placeholder="Jean Dupont"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="adminEmail">Email professionnel *</Label>
                <Input
                  id="adminEmail"
                  type="email"
                  value={data.adminEmail}
                  onChange={(e) => updateData("adminEmail", e.target.value)}
                  placeholder="jean@acme-corp.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="adminPhone">Téléphone (optionnel)</Label>
              <Input
                id="adminPhone"
                value={data.adminPhone}
                onChange={(e) => updateData("adminPhone", e.target.value)}
                placeholder="+33 1 23 45 67 89"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-8">
            <div className="text-center mb-6">
              <Crown className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold">Choisissez votre Plan</h3>
              <p className="text-gray-600">
                Vous pourrez toujours changer de plan plus tard
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {PLANS.map((plan) => (
                <Card
                  key={plan.id}
                  className={`cursor-pointer transition-all ${
                    data.selectedPlan === plan.id
                      ? "ring-2 ring-blue-500 bg-blue-50"
                      : "hover:shadow-lg"
                  }`}
                  onClick={() => updateData("selectedPlan", plan.id)}
                >
                  <CardHeader className="text-center">
                    <plan.icon
                      className={`h-8 w-8 mx-auto mb-2 ${
                        plan.color === "blue"
                          ? "text-blue-600"
                          : plan.color === "purple"
                            ? "text-purple-600"
                            : "text-gray-600"
                      }`}
                    />
                    <CardTitle className="text-lg">{plan.name}</CardTitle>
                    <CardDescription className="text-2xl font-bold text-blue-600">
                      {plan.price}
                    </CardDescription>
                    <p className="text-sm text-gray-600">{plan.description}</p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Fonctionnalités Supplémentaires</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {FEATURES.map((feature) => (
                  <div key={feature.id} className="flex items-start space-x-3">
                    <Checkbox
                      id={feature.id}
                      checked={data.selectedFeatures.includes(feature.id)}
                      onCheckedChange={(checked: boolean) => {
                        if (checked) {
                          updateData("selectedFeatures", [
                            ...data.selectedFeatures,
                            feature.id,
                          ]);
                        } else {
                          updateData(
                            "selectedFeatures",
                            data.selectedFeatures.filter(
                              (f) => f !== feature.id
                            )
                          );
                        }
                      }}
                    />
                    <div className="space-y-1">
                      <Label htmlFor={feature.id} className="font-medium">
                        {feature.name}
                      </Label>
                      <p className="text-sm text-gray-600">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Shield className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold">Configuration Initiale</h3>
              <p className="text-gray-600">
                Paramètres de base pour votre organisation
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="timezone">Fuseau horaire</Label>
                <Select
                  value={data.timezone}
                  onValueChange={(value) => updateData("timezone", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Europe/Paris">Europe/Paris</SelectItem>
                    <SelectItem value="Europe/London">Europe/London</SelectItem>
                    <SelectItem value="America/New_York">
                      America/New_York
                    </SelectItem>
                    <SelectItem value="America/Los_Angeles">
                      America/Los_Angeles
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="language">Langue</Label>
                <Select
                  value={data.language}
                  onValueChange={(value) => updateData("language", value)}
                >
                  <SelectTrigger>
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
              <div className="space-y-2">
                <Label htmlFor="currency">Devise</Label>
                <Select
                  value={data.currency}
                  onValueChange={(value) => updateData("currency", value)}
                >
                  <SelectTrigger>
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
          <div className="space-y-6">
            <div className="text-center mb-8">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold">Récapitulatif</h3>
              <p className="text-gray-600">
                Vérifiez les informations avant de créer votre organisation
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Entreprise
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p>
                    <strong>Nom:</strong> {data.companyName}
                  </p>
                  <p>
                    <strong>URL:</strong> {data.companySlug}.localhost:3000
                  </p>
                  {data.companyDomain && (
                    <p>
                      <strong>Domaine:</strong> {data.companyDomain}
                    </p>
                  )}
                  <p>
                    <strong>Secteur:</strong> {data.industry}
                  </p>
                  <p>
                    <strong>Taille:</strong> {data.companySize}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Administrateur
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p>
                    <strong>Nom:</strong> {data.adminName}
                  </p>
                  <p>
                    <strong>Email:</strong> {data.adminEmail}
                  </p>
                  {data.adminPhone && (
                    <p>
                      <strong>Téléphone:</strong> {data.adminPhone}
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="h-5 w-5" />
                  Plan et Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{data.selectedPlan}</Badge>
                  <span className="text-sm text-gray-600">
                    {PLANS.find((p) => p.id === data.selectedPlan)?.price}
                  </span>
                </div>

                {data.selectedFeatures.length > 0 && (
                  <div>
                    <p className="font-medium mb-2">
                      Fonctionnalités sélectionnées:
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

                <div className="grid grid-cols-3 gap-4 text-sm">
                  <p>
                    <strong>Fuseau:</strong> {data.timezone}
                  </p>
                  <p>
                    <strong>Langue:</strong> {data.language}
                  </p>
                  <p>
                    <strong>Devise:</strong> {data.currency}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* En-tête */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Sparkles className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">
              Bienvenue sur BookingApp
            </h1>
            <p className="text-xl text-slate-600">
              Créez votre organisation en quelques minutes
            </p>
          </motion.div>

          {/* Indicateur de progression */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    index <= currentStep
                      ? "bg-blue-600 border-blue-600 text-white"
                      : "border-gray-300 text-gray-400"
                  }`}
                >
                  {index < currentStep ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <step.icon className="h-5 w-5" />
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-16 h-0.5 mx-2 ${
                      index < currentStep ? "bg-blue-600" : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="text-center">
            <h2 className="text-lg font-semibold text-slate-900">
              {steps[currentStep].title}
            </h2>
            <p className="text-gray-600">{steps[currentStep].description}</p>
          </div>
        </div>

        {/* Contenu principal */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="mb-8">
            <CardContent className="p-8">{renderStepContent()}</CardContent>
          </Card>
        </motion.div>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Précédent
          </Button>

          {currentStep === steps.length - 1 ? (
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  Création en cours...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Créer l'organisation
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={nextStep}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              Suivant
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
