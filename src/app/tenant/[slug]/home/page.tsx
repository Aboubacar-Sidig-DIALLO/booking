"use client";

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
import { Building2, Users, Calendar, Settings, ArrowRight } from "lucide-react";
import Link from "next/link";

interface TenantHomeProps {
  params: {
    slug: string;
  };
}

export default function TenantHome({ params }: TenantHomeProps) {
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

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-red-600 mb-2">
              Erreur de chargement
            </h3>
            <p className="text-red-500 mb-6">
              Impossible de charger les informations de l'organisation.
            </p>
            <Button onClick={() => window.location.reload()}>Réessayer</Button>
          </div>
        </div>
      </div>
    );
  }

  if (!tenant) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-slate-600 mb-2">
              Organisation non trouvée
            </h3>
            <p className="text-slate-500 mb-6">
              L'organisation "{params.slug}" n'existe pas.
            </p>
            <Link href="/auth/tenant-selection">
              <Button>
                <ArrowRight className="h-4 w-4 mr-2" />
                Sélectionner une organisation
              </Button>
            </Link>
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
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-2">
                Bienvenue dans {tenant.name}
              </h1>
              <p className="text-slate-600">
                Gérez vos réservations et votre organisation
              </p>
            </div>
            <Badge variant="outline" className="text-sm">
              {tenant.plan}
            </Badge>
          </div>
        </div>

        {/* Actions rapides */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-all duration-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                Réservations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 text-sm mb-4">
                Gérez vos réservations de salles
              </p>
              <Link href="/bookings">
                <Button className="w-full">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Voir les réservations
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-green-600" />
                Salles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 text-sm mb-4">
                Configurez vos salles de réunion
              </p>
              <Link href="/rooms">
                <Button className="w-full">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Gérer les salles
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-600" />
                Équipe
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 text-sm mb-4">
                Invitez et gérez votre équipe
              </p>
              <Link href="/admin/users">
                <Button className="w-full">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Gérer l'équipe
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-orange-600" />
                Paramètres
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 text-sm mb-4">
                Configurez votre organisation
              </p>
              <Link href="/admin/settings">
                <Button className="w-full">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Paramètres
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Informations de l'organisation */}
        <Card>
          <CardHeader>
            <CardTitle>Informations de l'organisation</CardTitle>
            <CardDescription>
              Détails de votre organisation et fonctionnalités activées
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-slate-900 mb-2">Détails</h4>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li>
                    <strong>Nom:</strong> {tenant.name}
                  </li>
                  <li>
                    <strong>Slug:</strong> {tenant.slug}
                  </li>
                  <li>
                    <strong>Plan:</strong> {tenant.plan}
                  </li>
                  {tenant.domain && (
                    <li>
                      <strong>Domaine:</strong> {tenant.domain}
                    </li>
                  )}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 mb-2">
                  Fonctionnalités
                </h4>
                <div className="space-y-1">
                  {tenant.features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-sm"
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${feature.isEnabled ? "bg-green-500" : "bg-gray-300"}`}
                      />
                      <span
                        className={
                          feature.isEnabled
                            ? "text-slate-900"
                            : "text-slate-500"
                        }
                      >
                        {feature.feature.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
