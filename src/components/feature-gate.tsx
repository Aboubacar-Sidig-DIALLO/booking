"use client";

import { ReactNode, useEffect, useState } from "react";
import { useFeature, useTenant } from "@/contexts/tenant-context";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Lock, Crown, Zap } from "lucide-react";

interface FeatureGateProps {
  feature: TenantFeature;
  children: ReactNode;
  fallback?: ReactNode;
  showUpgrade?: boolean;
  planRequired?: string;
}

export function FeatureGate({
  feature,
  children,
  fallback,
  showUpgrade = true,
  planRequired,
}: FeatureGateProps) {
  const { tenant, isLoading } = useTenant();
  const hasAccess = useFeature(feature);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      setIsChecking(false);
    }
  }, [isLoading]);

  if (isChecking) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!tenant) {
    return fallback || <TenantNotFoundFallback />;
  }

  if (!hasAccess) {
    if (fallback) {
      return <>{fallback}</>;
    }

    if (showUpgrade) {
      return <UpgradePrompt feature={feature} planRequired={planRequired} />;
    }

    return null;
  }

  return <>{children}</>;
}

function TenantNotFoundFallback() {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <Lock className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <CardTitle>Organisation non trouvée</CardTitle>
        <CardDescription>
          Impossible de trouver votre organisation. Veuillez vérifier l'URL ou
          contacter le support.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <Button
          variant="outline"
          onClick={() => (window.location.href = "/auth/tenant-selection")}
        >
          Sélectionner une organisation
        </Button>
      </CardContent>
    </Card>
  );
}

function UpgradePrompt({
  feature,
  planRequired,
}: {
  feature: TenantFeature;
  planRequired?: string;
}) {
  const { tenant } = useTenant();

  const featureNames: Record<TenantFeature, string> = {
    [TenantFeature.ANALYTICS]: "Analytics Avancés",
    [TenantFeature.RECURRING_BOOKINGS]: "Réservations Récurrentes",
    [TenantFeature.CUSTOM_BRANDING]: "Personnalisation de Marque",
    [TenantFeature.API_ACCESS]: "Accès API",
    [TenantFeature.ADVANCED_REPORTS]: "Rapports Avancés",
    [TenantFeature.MULTI_SITE]: "Multi-Sites",
    [TenantFeature.INTEGRATIONS]: "Intégrations",
    [TenantFeature.WHITE_LABEL]: "White Label",
  };

  const featureDescriptions: Record<TenantFeature, string> = {
    [TenantFeature.ANALYTICS]:
      "Obtenez des insights détaillés sur l'utilisation de vos espaces",
    [TenantFeature.RECURRING_BOOKINGS]:
      "Créez des réservations récurrentes automatiquement",
    [TenantFeature.CUSTOM_BRANDING]:
      "Personnalisez l'apparence avec votre marque",
    [TenantFeature.API_ACCESS]:
      "Intégrez avec vos systèmes existants via l'API",
    [TenantFeature.ADVANCED_REPORTS]:
      "Générez des rapports personnalisés et détaillés",
    [TenantFeature.MULTI_SITE]:
      "Gérez plusieurs sites depuis une seule interface",
    [TenantFeature.INTEGRATIONS]: "Connectez-vous à vos outils préférés",
    [TenantFeature.WHITE_LABEL]: "Solution complètement personnalisée",
  };

  const currentPlan = tenant?.plan || "STARTER";
  const requiredPlan = planRequired || "PROFESSIONAL";

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <Crown className="h-12 w-12 mx-auto text-yellow-500 mb-4" />
        <CardTitle className="text-xl">{featureNames[feature]}</CardTitle>
        <CardDescription>{featureDescriptions[feature]}</CardDescription>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Plan actuel :</strong> {currentPlan}
          </p>
          <p className="text-sm text-blue-800">
            <strong>Plan requis :</strong> {requiredPlan}
          </p>
        </div>

        <div className="space-y-2">
          <Button
            className="w-full"
            onClick={() => (window.location.href = "/pricing")}
          >
            <Zap className="h-4 w-4 mr-2" />
            Passer au plan {requiredPlan}
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => window.history.back()}
          >
            Retour
          </Button>
        </div>

        <p className="text-xs text-gray-500">
          Contactez le support pour des questions sur les fonctionnalités
        </p>
      </CardContent>
    </Card>
  );
}

// Composant pour afficher une liste de fonctionnalités disponibles
export function FeatureList({ features }: { features: TenantFeature[] }) {
  const { tenant } = useTenant();
  const hasAccess = useFeature;

  return (
    <div className="space-y-2">
      {features.map((feature) => {
        const hasFeatureAccess = hasAccess(feature);
        return (
          <div
            key={feature}
            className={`flex items-center justify-between p-3 rounded-lg border ${
              hasFeatureAccess
                ? "bg-green-50 border-green-200"
                : "bg-gray-50 border-gray-200"
            }`}
          >
            <div className="flex items-center space-x-3">
              <div
                className={`w-2 h-2 rounded-full ${
                  hasFeatureAccess ? "bg-green-500" : "bg-gray-400"
                }`}
              />
              <span
                className={`text-sm ${
                  hasFeatureAccess ? "text-green-800" : "text-gray-600"
                }`}
              >
                {feature}
              </span>
            </div>
            {hasFeatureAccess ? (
              <span className="text-xs text-green-600 font-medium">
                ✓ Inclus
              </span>
            ) : (
              <span className="text-xs text-gray-500">Non disponible</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

// Hook pour vérifier plusieurs fonctionnalités à la fois
export function useMultipleFeatures(
  features: TenantFeature[]
): Record<TenantFeature, boolean> {
  const { tenant } = useTenant();

  if (!tenant) {
    return features.reduce(
      (acc, feature) => ({ ...acc, [feature]: false }),
      {} as Record<TenantFeature, boolean>
    );
  }

  return features.reduce(
    (acc, feature) => {
      const hasAccess = tenant.features.some(
        (orgFeature) =>
          orgFeature.feature.name === feature && orgFeature.isEnabled
      );
      return { ...acc, [feature]: hasAccess };
    },
    {} as Record<TenantFeature, boolean>
  );
}
