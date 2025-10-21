"use client";

import { TenantDashboard } from "@/components/tenant-dashboard";
import { useTenant } from "@/contexts/tenant-context";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  Settings,
  BarChart3,
  Zap,
  Shield,
  Crown,
  Globe,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export default function MultiTenantDemoPage() {
  const { tenant, isLoading, error } = useTenant();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="mb-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              🏢 Architecture Multi-Tenant
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Démonstration de l'architecture multi-tenant avec isolation
              complète des données
            </p>
          </div>

          {/* Informations de connexion */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Informations de Connexion
              </CardTitle>
              <CardDescription>
                URLs de test pour différents tenants
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">
                    Tenant Demo
                  </h3>
                  <p className="text-blue-700 text-sm mb-2">
                    Plan: PROFESSIONAL
                  </p>
                  <Link href="http://demo.localhost:3000" target="_blank">
                    <Button size="sm" className="w-full">
                      <Globe className="h-4 w-4 mr-2" />
                      demo.localhost:3000
                    </Button>
                  </Link>
                </div>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-2">
                    Tenant Entreprise1
                  </h3>
                  <p className="text-green-700 text-sm mb-2">Plan: STARTER</p>
                  <Link
                    href="http://entreprise1.localhost:3000"
                    target="_blank"
                  >
                    <Button size="sm" variant="outline" className="w-full">
                      <Globe className="h-4 w-4 mr-2" />
                      entreprise1.localhost:3000
                    </Button>
                  </Link>
                </div>
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <h3 className="font-semibold text-purple-800 mb-2">
                    Tenant Entreprise2
                  </h3>
                  <p className="text-purple-700 text-sm mb-2">
                    Plan: ENTERPRISE
                  </p>
                  <Link
                    href="http://entreprise2.localhost:3000"
                    target="_blank"
                  >
                    <Button size="sm" variant="outline" className="w-full">
                      <Globe className="h-4 w-4 mr-2" />
                      entreprise2.localhost:3000
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Dashboard du tenant actuel */}
        {tenant ? (
          <TenantDashboard />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="text-center">
                Aucun Tenant Détecté
              </CardTitle>
              <CardDescription className="text-center">
                Aucune organisation n'a été trouvée pour cette URL.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-slate-600">
                Pour tester le multi-tenancy, utilisez une des URLs ci-dessus ou
                créez un nouveau tenant.
              </p>
              <div className="flex justify-center gap-4">
                <Link href="/auth/tenant-selection">
                  <Button>
                    <Building2 className="h-4 w-4 mr-2" />
                    Sélectionner un Tenant
                  </Button>
                </Link>
                <Link href="/api/tenant">
                  <Button variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    Gérer les Tenants
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Fonctionnalités de l'architecture */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">
            Fonctionnalités de l'Architecture Multi-Tenant
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  Isolation des Données
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 text-sm">
                  Chaque tenant ne voit que ses propres données grâce à
                  l'isolation automatique au niveau de la base de données.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-blue-600" />
                  Features Flags
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 text-sm">
                  Activation/désactivation de fonctionnalités par tenant avec
                  configuration personnalisée.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-purple-600" />
                  Audit & Logging
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 text-sm">
                  Traçabilité complète des actions avec logs d'audit et
                  détection d'activités suspectes.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-orange-600" />
                  Résolution Multi-Domaine
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 text-sm">
                  Support des sous-domaines, domaines personnalisés et
                  paramètres d'URL pour la résolution de tenant.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-yellow-600" />
                  Plans & Tarification
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 text-sm">
                  Système de plans avec fonctionnalités différenciées selon le
                  niveau d'abonnement.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-gray-600" />
                  Configuration Flexible
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 text-sm">
                  Paramètres personnalisables par tenant pour l'adaptation aux
                  besoins spécifiques.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Instructions de test */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowRight className="h-5 w-5" />
              Comment Tester
            </CardTitle>
            <CardDescription>
              Étapes pour tester l'architecture multi-tenant
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-1">
                  1
                </Badge>
                <div>
                  <h4 className="font-semibold">
                    Configurer les domaines locaux
                  </h4>
                  <p className="text-sm text-slate-600">
                    Ajoutez les entrées suivantes à votre fichier hosts :
                  </p>
                  <code className="block mt-2 p-2 bg-gray-100 rounded text-xs">
                    127.0.0.1 demo.localhost
                    <br />
                    127.0.0.1 entreprise1.localhost
                    <br />
                    127.0.0.1 entreprise2.localhost
                  </code>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-1">
                  2
                </Badge>
                <div>
                  <h4 className="font-semibold">Tester différents tenants</h4>
                  <p className="text-sm text-slate-600">
                    Visitez les URLs ci-dessus pour voir l'isolation des données
                    en action.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-1">
                  3
                </Badge>
                <div>
                  <h4 className="font-semibold">
                    Vérifier les fonctionnalités
                  </h4>
                  <p className="text-sm text-slate-600">
                    Testez l'activation/désactivation des fonctionnalités selon
                    le plan du tenant.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
