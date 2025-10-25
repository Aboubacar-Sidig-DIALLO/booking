"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ChangePasswordForm } from "@/components/auth/ChangePasswordForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Shield,
  AlertTriangle,
  Lock,
  Key,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

export default function ChangePasswordPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // En cours de chargement

    if (!session) {
      router.push("/login");
      return;
    }

    // Si l'utilisateur n'a pas besoin de changer son mot de passe, rediriger vers l'accueil
    if (!(session.user as any)?.mustChangePassword) {
      router.push("/home");
      return;
    }
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600 font-medium">Chargement...</p>
        </motion.div>
      </div>
    );
  }

  if (!session) {
    return null; // Redirection en cours
  }

  const handlePasswordChangeSuccess = () => {
    // Rediriger selon le rôle de l'utilisateur après le changement de mot de passe
    const userRole = (session.user as any)?.role;
    if (userRole === "ADMIN") {
      router.push("/admin");
    } else {
      router.push("/home");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-hidden">
      {/* Éléments décoratifs de fond */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-20 w-64 h-64 bg-blue-200/20 rounded-full blur-3xl animate-float"></div>
          <div
            className="absolute top-40 right-32 w-48 h-48 bg-indigo-200/20 rounded-full blur-2xl animate-float"
            style={{ animationDelay: "2s" }}
          ></div>
          <div
            className="absolute bottom-20 left-1/3 w-56 h-56 bg-purple-200/20 rounded-full blur-3xl animate-float"
            style={{ animationDelay: "4s" }}
          ></div>
          <div
            className="absolute bottom-40 right-20 w-40 h-40 bg-pink-200/20 rounded-full blur-2xl animate-float"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>
      </div>

      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Section gauche - Informations de sécurité */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8 text-center lg:text-left"
          >
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex items-center justify-center lg:justify-start gap-3"
              >
                <div className="p-3 bg-gradient-to-br from-orange-600 to-red-600 rounded-2xl shadow-lg">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent drop-shadow-sm">
                  Sécurité
                </h1>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="space-y-4"
              >
                <h2 className="text-2xl lg:text-3xl font-semibold text-slate-800">
                  Changez votre mot de passe temporaire
                </h2>
                <p className="text-lg text-slate-600 max-w-lg mx-auto lg:mx-0">
                  Pour votre sécurité, vous devez choisir un nouveau mot de
                  passe personnel avant d'accéder à votre espace de travail.
                </p>
              </motion.div>
            </div>

            {/* Alerte de sécurité */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Alert className="border-orange-200 bg-orange-50/80 backdrop-blur-sm">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-800">
                  <strong>Sécurité requise :</strong> Cette étape est
                  obligatoire pour protéger vos données.
                </AlertDescription>
              </Alert>
            </motion.div>

            {/* Raisons de sécurité */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="space-y-4"
            >
              <h3 className="text-xl font-semibold text-slate-800">
                Pourquoi changer votre mot de passe ?
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20 shadow-sm">
                  <div className="p-2 bg-blue-100 rounded-lg mt-0.5">
                    <Key className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-semibold text-slate-800 text-sm">
                      Mot de passe temporaire
                    </h4>
                    <p className="text-xs text-slate-600">
                      Généré automatiquement lors de la création
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20 shadow-sm">
                  <div className="p-2 bg-green-100 rounded-lg mt-0.5">
                    <Shield className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-semibold text-slate-800 text-sm">
                      Sécurité personnelle
                    </h4>
                    <p className="text-xs text-slate-600">
                      Choisissez un mot de passe que vous seul connaissez
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20 shadow-sm">
                  <div className="p-2 bg-purple-100 rounded-lg mt-0.5">
                    <Lock className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-semibold text-slate-800 text-sm">
                      Protection des données
                    </h4>
                    <p className="text-xs text-slate-600">
                      Étape obligatoire pour sécuriser votre compte
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Étapes suivantes */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200/50"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                </div>
                <h4 className="font-semibold text-blue-800">
                  Après le changement
                </h4>
              </div>
              <ul className="space-y-2 text-sm text-blue-700">
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-3 w-3" />
                  <span>Accès complet à votre espace de travail</span>
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-3 w-3" />
                  <span>Gestion de votre organisation</span>
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-3 w-3" />
                  <span>Création de réservations</span>
                </li>
              </ul>
            </motion.div>
          </motion.div>

          {/* Section droite - Formulaire de changement de mot de passe */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex justify-center lg:justify-end"
          >
            <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm border-white/20 shadow-2xl">
              <CardHeader className="text-center space-y-2">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="mx-auto p-3 bg-gradient-to-br from-orange-600 to-red-600 rounded-2xl w-fit"
                >
                  <Lock className="h-8 w-8 text-white" />
                </motion.div>
                <CardTitle className="text-2xl font-bold text-slate-800">
                  Nouveau mot de passe
                </CardTitle>
                <CardDescription className="text-slate-600">
                  Choisissez un mot de passe sécurisé pour votre compte
                </CardDescription>
              </CardHeader>

              <CardContent>
                <ChangePasswordForm
                  onSuccess={handlePasswordChangeSuccess}
                  userEmail={session.user?.email || ""}
                />
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
