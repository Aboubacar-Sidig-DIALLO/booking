"use client";

import {
  useTenant,
  useFeature,
  useTenantSettings,
} from "@/contexts/tenant-context";
import { FeatureGate } from "@/components/feature-gate";
import { TENANT_FEATURES } from "@/types/tenant";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Building2,
  Users,
  Settings,
  BarChart3,
  Zap,
  Shield,
  Crown,
  CheckCircle,
  XCircle,
} from "lucide-react";

export function TenantDashboard() {
  const { tenant, isLoading, error } = useTenant();
  const hasAnalytics = useFeature(TENANT_FEATURES.ANALYTICS);
  const hasAdvancedReports = useFeature(TENANT_FEATURES.ADVANCED_REPORTS);
  const hasCustomBranding = useFeature(TENANT_FEATURES.CUSTOM_BRANDING);
  const settings = useTenantSettings();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-red-600">Erreur</CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!tenant) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Aucun tenant trouvé</CardTitle>
          <CardDescription>
            Impossible de charger les informations de votre organisation.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case "STARTER":
        return "bg-gray-100 text-gray-800";
      case "PROFESSIONAL":
        return "bg-blue-100 text-blue-800";
      case "ENTERPRISE":
        return "bg-purple-100 text-purple-800";
      case "CUSTOM":
        return "bg-gold-100 text-gold-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPlanIcon = (plan: string) => {
    switch (plan) {
      case "STARTER":
        return <Building2 className="h-4 w-4" />;
      case "PROFESSIONAL":
        return <Users className="h-4 w-4" />;
      case "ENTERPRISE":
        return <Shield className="h-4 w-4" />;
      case "CUSTOM":
        return <Crown className="h-4 w-4" />;
      default:
        return <Building2 className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête du tenant */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-6 w-6 text-blue-600" />
                {tenant.name}
              </CardTitle>
              <CardDescription>
                Slug: {tenant.slug} • Domaine:{" "}
                {tenant.domain || "Non configuré"}
              </CardDescription>
            </div>
            <Badge
              className={`${getPlanColor(tenant.plan)} flex items-center gap-1`}
            >
              {getPlanIcon(tenant.plan)}
              {tenant.plan}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Fonctionnalités activées */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Fonctionnalités Activées
          </CardTitle>
          <CardDescription>
            Fonctionnalités disponibles pour votre organisation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {hasAnalytics ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-gray-400" />
                )}
                <span
                  className={hasAnalytics ? "text-green-800" : "text-gray-500"}
                >
                  Analytics Avancés
                </span>
              </div>
              <div className="flex items-center gap-2">
                {hasAdvancedReports ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-gray-400" />
                )}
                <span
                  className={
                    hasAdvancedReports ? "text-green-800" : "text-gray-500"
                  }
                >
                  Rapports Avancés
                </span>
              </div>
              <div className="flex items-center gap-2">
                {hasCustomBranding ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-gray-400" />
                )}
                <span
                  className={
                    hasCustomBranding ? "text-green-800" : "text-gray-500"
                  }
                >
                  Personnalisation de Marque
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-green-800">Réservations Récurrentes</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-green-800">Multi-Sites</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-green-800">Intégrations</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Démonstration des Feature Gates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Démonstration des Feature Gates
          </CardTitle>
          <CardDescription>
            Ces composants ne s'affichent que si la fonctionnalité est activée
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FeatureGate
            feature={TENANT_FEATURES.ANALYTICS}
            showUpgrade={true}
            planRequired="PROFESSIONAL"
          >
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="h-5 w-5 text-green-600" />
                <h3 className="font-semibold text-green-800">
                  Analytics Dashboard
                </h3>
              </div>
              <p className="text-green-700 text-sm">
                Cette section ne s'affiche que si la fonctionnalité Analytics
                est activée.
              </p>
            </div>
          </FeatureGate>

          <FeatureGate
            feature={TENANT_FEATURES.ADVANCED_REPORTS}
            showUpgrade={true}
            planRequired="ENTERPRISE"
          >
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-5 w-5 text-purple-600" />
                <h3 className="font-semibold text-purple-800">
                  Rapports Avancés
                </h3>
              </div>
              <p className="text-purple-700 text-sm">
                Cette section ne s'affiche que si la fonctionnalité Rapports
                Avancés est activée.
              </p>
            </div>
          </FeatureGate>
        </CardContent>
      </Card>

      {/* Paramètres du tenant */}
      {settings && Object.keys(settings).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Paramètres Personnalisés
            </CardTitle>
            <CardDescription>
              Configuration spécifique à votre organisation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-auto">
              {JSON.stringify(settings, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}

      {/* Actions d'administration */}
      <Card>
        <CardHeader>
          <CardTitle>Actions d'Administration</CardTitle>
          <CardDescription>
            Gérer les fonctionnalités et paramètres de votre organisation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button variant="outline" className="w-full justify-start">
            <Settings className="h-4 w-4 mr-2" />
            Gérer les Fonctionnalités
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <BarChart3 className="h-4 w-4 mr-2" />
            Voir les Logs d'Audit
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Crown className="h-4 w-4 mr-2" />
            Changer de Plan
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
