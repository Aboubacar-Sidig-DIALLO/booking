"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Mail,
  Lock,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Shield,
  Key,
} from "lucide-react";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Fonction de validation d'email côté client
  const validateEmail = (email: string): string | null => {
    if (!email.trim()) {
      return "L'adresse email est requise";
    }

    if (email.length > 254) {
      return "L'adresse email est trop longue";
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return "Format d'email invalide - Utilisez un format valide (ex: nom@domaine.com)";
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Validation côté client avant l'envoi
    const emailValidationError = validateEmail(email);
    if (emailValidationError) {
      setError(emailValidationError);
      toast.error(emailValidationError);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSubmitted(true);
        toast.success(
          "Un email de réinitialisation a été envoyé à votre adresse !"
        );
      } else {
        // Gestion spécifique des erreurs
        if (response.status === 404 && data.code === "EMAIL_NOT_FOUND") {
          setError(
            "Cette adresse email n'est pas enregistrée dans notre système"
          );
          toast.error("Email non trouvé - Vérifiez votre adresse email");
        } else if (
          response.status === 400 &&
          data.code === "INVALID_EMAIL_FORMAT"
        ) {
          setError(data.error || "Format d'email invalide");
          toast.error(
            data.error || "Format d'email invalide - Vérifiez votre saisie"
          );
        } else {
          setError(data.error || "Une erreur technique est survenue");
          toast.error(data.error || "Erreur technique - Veuillez réessayer");
        }
      }
    } catch (error) {
      setError("Une erreur technique est survenue lors de l'envoi de l'email");
      toast.error(
        "Erreur technique - Veuillez réessayer dans quelques instants"
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-hidden">
        {/* Éléments décoratifs de fond */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-20 left-20 w-64 h-64 bg-green-200/20 rounded-full blur-3xl animate-float"></div>
            <div
              className="absolute top-40 right-32 w-48 h-48 bg-emerald-200/20 rounded-full blur-2xl animate-float"
              style={{ animationDelay: "2s" }}
            ></div>
            <div
              className="absolute bottom-20 left-1/3 w-56 h-56 bg-teal-200/20 rounded-full blur-3xl animate-float"
              style={{ animationDelay: "4s" }}
            ></div>
            <div
              className="absolute bottom-40 right-20 w-40 h-40 bg-green-200/20 rounded-full blur-2xl animate-float"
              style={{ animationDelay: "1s" }}
            ></div>
          </div>
        </div>

        <div className="relative min-h-screen flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md"
          >
            <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-2xl">
              <CardHeader className="text-center space-y-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="mx-auto p-4 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl w-fit"
                >
                  <CheckCircle className="h-12 w-12 text-white" />
                </motion.div>
                <div className="space-y-2">
                  <CardTitle className="text-2xl font-bold text-slate-800">
                    📧 Email envoyé avec succès !
                  </CardTitle>
                  <CardDescription className="text-slate-600">
                    Un email de réinitialisation a été envoyé à votre adresse
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="text-center space-y-4"
                >
                  <p className="text-slate-600">
                    Nous avons envoyé un lien de réinitialisation sécurisé à{" "}
                    <span className="font-semibold text-slate-800">
                      {email}
                    </span>
                    <br />
                    <span className="text-sm text-slate-500">
                      Le lien est valide pendant 1 heure
                    </span>
                  </p>

                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Mail className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-green-800">
                        Prochaines étapes
                      </span>
                    </div>
                    <ul className="text-sm text-green-700 space-y-1 text-left">
                      <li>
                        • Vérifiez votre boîte de réception (et les spams)
                      </li>
                      <li>• Cliquez sur le lien de réinitialisation</li>
                      <li>• Choisissez un nouveau mot de passe sécurisé</li>
                      <li>• Connectez-vous avec votre nouveau mot de passe</li>
                    </ul>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="space-y-3"
                >
                  <Button
                    onClick={() => router.push("/login")}
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                  >
                    Retour à la connexion
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => setIsSubmitted(false)}
                    className="w-full h-12 rounded-xl border-slate-200 hover:bg-slate-50 transition-all duration-200 cursor-pointer"
                  >
                    Envoyer un autre email
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

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
          {/* Section gauche - Informations */}
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
                  <Key className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent drop-shadow-sm">
                  Mot de passe oublié
                </h1>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="space-y-4"
              >
                <h2 className="text-2xl lg:text-3xl font-semibold text-slate-800">
                  Pas de panique !
                </h2>
                <p className="text-lg text-slate-600 max-w-lg mx-auto lg:mx-0">
                  Entrez votre adresse email et nous vous enverrons un lien pour
                  réinitialiser votre mot de passe en toute sécurité.
                </p>
              </motion.div>
            </div>

            {/* Étapes */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="space-y-4"
            >
              <h3 className="text-xl font-semibold text-slate-800">
                Comment ça marche ?
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20 shadow-sm">
                  <div className="p-2 bg-blue-100 rounded-lg mt-0.5">
                    <Mail className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-semibold text-slate-800 text-sm">
                      1. Entrez votre email
                    </h4>
                    <p className="text-xs text-slate-600">
                      L'adresse associée à votre compte
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20 shadow-sm">
                  <div className="p-2 bg-green-100 rounded-lg mt-0.5">
                    <Shield className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-semibold text-slate-800 text-sm">
                      2. Recevez le lien
                    </h4>
                    <p className="text-xs text-slate-600">
                      Email sécurisé avec lien de réinitialisation
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20 shadow-sm">
                  <div className="p-2 bg-purple-100 rounded-lg mt-0.5">
                    <Lock className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-semibold text-slate-800 text-sm">
                      3. Nouveau mot de passe
                    </h4>
                    <p className="text-xs text-slate-600">
                      Choisissez un mot de passe sécurisé
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Retour */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex items-center gap-2 text-slate-600"
            >
              <ArrowLeft className="h-4 w-4" />
              <button
                onClick={() => router.push("/login")}
                className="hover:text-slate-800 transition-colors cursor-pointer"
              >
                Retour à la connexion
              </button>
            </motion.div>
          </motion.div>

          {/* Section droite - Formulaire */}
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
                  <Key className="h-8 w-8 text-white" />
                </motion.div>
                <CardTitle className="text-2xl font-bold text-slate-800">
                  Réinitialisation
                </CardTitle>
                <CardDescription className="text-slate-600">
                  Entrez votre adresse email pour recevoir le lien
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        {error}
                        {error.includes("n'est pas enregistrée") && (
                          <div className="mt-3 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
                            <p className="font-medium text-red-800 mb-2">
                              💡 Que faire maintenant ?
                            </p>
                            <ul className="list-disc list-inside space-y-1 text-red-700">
                              <li>
                                Vérifiez l'orthographe de votre adresse email
                              </li>
                              <li>
                                Assurez-vous d'avoir créé un compte avec cette
                                adresse
                              </li>
                              <li>
                                Contactez votre administrateur si vous pensez
                                qu'il y a une erreur
                              </li>
                            </ul>
                          </div>
                        )}
                        {error.includes("Format d'email invalide") && (
                          <div className="mt-3 text-sm bg-orange-50 p-3 rounded-lg border border-orange-200">
                            <p className="font-medium text-orange-800 mb-2">
                              📝 Format d'email correct :
                            </p>
                            <ul className="list-disc list-inside space-y-1 text-orange-700">
                              <li>
                                Utilisez le format :{" "}
                                <code className="bg-orange-100 px-1 rounded">
                                  nom@domaine.com
                                </code>
                              </li>
                              <li>Vérifiez qu'il n'y a pas d'espaces</li>
                              <li>Assurez-vous que le domaine existe</li>
                              <li>
                                Exemples valides :{" "}
                                <code className="bg-orange-100 px-1 rounded">
                                  user@example.com
                                </code>
                              </li>
                            </ul>
                          </div>
                        )}
                      </AlertDescription>
                    </Alert>
                  )}

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="space-y-2"
                  >
                    <label className="text-sm font-medium text-slate-700">
                      Adresse email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        type="email"
                        placeholder="votre@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 h-12 rounded-xl border-slate-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.7 }}
                  >
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-12 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Envoi en cours...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          Envoyer le lien
                          <Mail className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      )}
                    </Button>
                  </motion.div>
                </form>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="text-center text-sm text-slate-600"
                >
                  Vous vous souvenez de votre mot de passe ?{" "}
                  <button
                    onClick={() => router.push("/login")}
                    className="text-orange-600 font-medium hover:underline transition-colors cursor-pointer"
                  >
                    Se connecter
                  </button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
