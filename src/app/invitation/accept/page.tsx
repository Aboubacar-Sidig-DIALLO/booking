"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
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
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  AlertCircle,
  Users,
  Building2,
  Mail,
  Shield,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

interface InvitationData {
  id: string;
  email: string;
  name: string;
  role: string;
  message?: string;
  expiresAt: string;
  organization: {
    id: string;
    name: string;
    slug: string;
  };
  invitedBy: {
    name: string;
    email: string;
  };
}

export default function AcceptInvitationPage() {
  const [invitation, setInvitation] = useState<InvitationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAccepting, setIsAccepting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
    name: "",
  });

  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  useEffect(() => {
    if (token) {
      validateInvitation();
    } else {
      setError("Token d'invitation manquant");
      setIsLoading(false);
    }
  }, [token]);

  const validateInvitation = async () => {
    try {
      const response = await fetch(`/api/invitations/validate?token=${token}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error?.message || "Erreur lors de la validation de l'invitation"
        );
      }

      setInvitation(data.data.invitation);
      setFormData((prev) => ({ ...prev, name: data.data.invitation.name }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptInvitation = async () => {
    if (!invitation) return;

    // Validation côté client
    if (formData.password.length < 8) {
      toast.error("Le mot de passe doit contenir au moins 8 caractères");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }

    setIsAccepting(true);

    try {
      const response = await fetch("/api/invitations/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: token,
          password: formData.password,
          name: formData.name || invitation.name,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error?.message || "Erreur lors de l'acceptation de l'invitation"
        );
      }

      toast.success("Invitation acceptée avec succès !");

      // Rediriger vers le dashboard
      setTimeout(() => {
        window.location.href = data.data.dashboardUrl;
      }, 2000);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Erreur lors de l'acceptation"
      );
    } finally {
      setIsAccepting(false);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-red-100 text-red-800";
      case "MANAGER":
        return "bg-blue-100 text-blue-800";
      case "USER":
        return "bg-green-100 text-green-800";
      case "VIEWER":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "Administrateur";
      case "MANAGER":
        return "Gestionnaire";
      case "USER":
        return "Utilisateur";
      case "VIEWER":
        return "Observateur";
      default:
        return role;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Validation de l'invitation...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <CardTitle className="text-red-600">Invitation Invalide</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={() => router.push("/")} variant="outline">
              Retour à l'accueil
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!invitation) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">
        {/* En-tête */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Invitation à rejoindre {invitation.organization.name}
          </h1>
          <p className="text-gray-600">
            {invitation.invitedBy.name} vous invite à rejoindre son équipe
          </p>
        </motion.div>

        {/* Informations de l'invitation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Détails de l'invitation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{invitation.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Rôle</p>
                    <Badge className={getRoleColor(invitation.role)}>
                      {getRoleLabel(invitation.role)}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Shield className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Organisation</p>
                  <p className="font-medium">{invitation.organization.name}</p>
                </div>
              </div>

              {invitation.message && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Message de {invitation.invitedBy.name}:</strong>
                  </p>
                  <p className="text-blue-700 mt-1">{invitation.message}</p>
                </div>
              )}

              <div className="text-sm text-gray-500">
                <p>
                  Cette invitation expire le{" "}
                  {new Date(invitation.expiresAt).toLocaleDateString("fr-FR")}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Formulaire d'acceptation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Créer votre compte</CardTitle>
              <CardDescription>
                Complétez ces informations pour finaliser votre inscription
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nom complet</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Votre nom complet"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  placeholder="Minimum 8 caractères"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">
                  Confirmer le mot de passe
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      confirmPassword: e.target.value,
                    }))
                  }
                  placeholder="Répétez votre mot de passe"
                />
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">
                  🎯 Que pourrez-vous faire ?
                </h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Réserver des salles de réunion</li>
                  <li>• Gérer les participants aux réunions</li>
                  <li>• Consulter les rapports d'utilisation</li>
                  <li>• Configurer vos préférences</li>
                </ul>
              </div>

              <Button
                onClick={handleAcceptInvitation}
                disabled={
                  isAccepting || !formData.password || !formData.confirmPassword
                }
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                {isAccepting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Création du compte...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Accepter l'invitation
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Informations supplémentaires */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 text-center"
        >
          <p className="text-sm text-gray-500">
            En acceptant cette invitation, vous acceptez les{" "}
            <a href="/terms" className="text-blue-600 hover:underline">
              conditions d'utilisation
            </a>{" "}
            et la{" "}
            <a href="/privacy" className="text-blue-600 hover:underline">
              politique de confidentialité
            </a>
            .
          </p>
        </motion.div>
      </div>
    </div>
  );
}
