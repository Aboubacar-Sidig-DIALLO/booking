"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  Plus,
  Search,
  ArrowRight,
  Sparkles,
  Users,
  Calendar,
  Settings,
  Crown,
  Globe,
} from "lucide-react";
import Link from "next/link";

interface Tenant {
  id: string;
  name: string;
  slug: string;
  plan: string;
  userCount: number;
  roomCount: number;
  lastActivity: string;
}

export default function TenantSelectionPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTenant, setSelectedTenant] = useState<string | null>(null);

  // Données de démonstration - en production, cela viendrait de l'API
  const tenants: Tenant[] = [
    {
      id: "demo",
      name: "Organisation de Démonstration",
      slug: "demo",
      plan: "PROFESSIONAL",
      userCount: 12,
      roomCount: 8,
      lastActivity: "Il y a 2 heures",
    },
    {
      id: "test",
      name: "Test Corporation",
      slug: "test",
      plan: "STARTER",
      userCount: 5,
      roomCount: 3,
      lastActivity: "Il y a 1 jour",
    },
  ];

  const filteredTenants = tenants.filter(
    (tenant) =>
      tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case "STARTER":
        return "bg-gray-100 text-gray-700";
      case "PROFESSIONAL":
        return "bg-blue-100 text-blue-700";
      case "ENTERPRISE":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getPlanIcon = (plan: string) => {
    switch (plan) {
      case "STARTER":
        return Building2;
      case "PROFESSIONAL":
        return Crown;
      case "ENTERPRISE":
        return Crown;
      default:
        return Building2;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  Sélectionnez votre organisation
                </h1>
                <p className="text-slate-600">
                  Choisissez l'organisation à laquelle vous souhaitez accéder
                </p>
              </div>
            </div>
            <Link href="/onboarding">
              <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle organisation
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Barre de recherche */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Rechercher une organisation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12"
            />
          </div>
        </div>

        {/* Liste des organisations */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTenants.map((tenant, index) => {
            const PlanIcon = getPlanIcon(tenant.plan);
            const isSelected = selectedTenant === tenant.id;

            return (
              <motion.div
                key={tenant.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card
                  className={`cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? "ring-2 ring-blue-500 bg-blue-50"
                      : "hover:shadow-lg"
                  }`}
                  onClick={() => setSelectedTenant(tenant.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-100 rounded-lg">
                          <PlanIcon className="h-5 w-5 text-slate-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg font-semibold text-slate-900">
                            {tenant.name}
                          </CardTitle>
                          <CardDescription className="text-sm text-slate-600">
                            {tenant.slug}.localhost:3000
                          </CardDescription>
                        </div>
                      </div>
                      <Badge className={getPlanColor(tenant.plan)}>
                        {tenant.plan}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Statistiques */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Users className="h-4 w-4" />
                        <span>{tenant.userCount} utilisateurs</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Building2 className="h-4 w-4" />
                        <span>{tenant.roomCount} salles</span>
                      </div>
                    </div>

                    {/* Dernière activité */}
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Calendar className="h-3 w-3" />
                      <span>Dernière activité: {tenant.lastActivity}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Link
                        href={`/tenant/${tenant.slug}/home`}
                        className="flex-1"
                      >
                        <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
                          <ArrowRight className="h-4 w-4 mr-2" />
                          Accéder
                        </Button>
                      </Link>
                      <Link href={`/tenant/${tenant.slug}/admin/settings`}>
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Message si aucune organisation trouvée */}
        {filteredTenants.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="p-4 bg-slate-100 rounded-full w-fit mx-auto mb-4">
              <Building2 className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-600 mb-2">
              Aucune organisation trouvée
            </h3>
            <p className="text-slate-500 mb-6">
              {searchTerm
                ? "Aucune organisation ne correspond à votre recherche."
                : "Vous n'avez accès à aucune organisation pour le moment."}
            </p>
            <Link href="/onboarding">
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Créer une organisation
              </Button>
            </Link>
          </motion.div>
        )}

        {/* Informations supplémentaires */}
        <div className="mt-12">
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Globe className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">
                    Accès par sous-domaine
                  </h3>
                  <p className="text-sm text-slate-600 mb-3">
                    Vous pouvez également accéder directement à vos
                    organisations via leur sous-domaine :
                  </p>
                  <div className="space-y-1">
                    {tenants.map((tenant) => (
                      <div
                        key={tenant.id}
                        className="text-sm font-mono text-blue-600"
                      >
                        {tenant.slug}.localhost:3000
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
