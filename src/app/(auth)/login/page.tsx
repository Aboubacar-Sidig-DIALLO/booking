"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
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
  Eye,
  EyeOff,
  Calendar,
  Building2,
  Users,
  Clock,
  CheckCircle,
  ArrowRight,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/home";
  const errorParam = searchParams.get("error");

  // Charger les données sauvegardées au montage du composant
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    const savedPassword = localStorage.getItem("rememberedPassword");
    const savedRememberMe = localStorage.getItem("rememberMe") === "true";

    if (savedRememberMe && savedEmail) {
      setEmail(savedEmail);
      if (savedPassword) {
        setPassword(savedPassword);
      }
      setRememberMe(savedRememberMe);
    }
  }, []);

  // Afficher un message d'erreur si une page n'existe pas
  const pageNotFoundError = errorParam === "page_not_found";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Vérifier le statut du compte avant la connexion
      const statusCheck = await fetch("/api/auth/check-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (statusCheck.ok) {
        const statusData = await statusCheck.json();
        if (statusData.status && statusData.status !== "active") {
          let errorMessage =
            "Votre compte est inactif. Veuillez contacter un administrateur.";

          // Message personnalisé selon le statut
          if (statusData.status === "pending") {
            errorMessage =
              "Votre compte est en attente d'activation. Veuillez contacter votre administrateur pour activer votre compte.";
          } else if (statusData.status === "inactive") {
            errorMessage =
              "Votre compte est inactif. Veuillez contacter votre administrateur pour réactiver votre compte.";
          } else if (statusData.status === "suspended") {
            errorMessage =
              "Votre compte a été suspendu. Veuillez contacter votre administrateur pour plus d'informations.";
          }

          setError(errorMessage);
          toast.error(errorMessage);
          setIsLoading(false);
          return;
        }
      }

      const result = await signIn("credentials", {
        email,
        password,
        rememberMe: rememberMe.toString(),
        redirect: false,
      });

      if (result?.error) {
        setError("Email ou mot de passe incorrect");
        toast.error("Email ou mot de passe incorrect");
        return;
      }

      if (result?.ok) {
        // Gérer la sauvegarde des données de connexion
        if (rememberMe) {
          localStorage.setItem("rememberedEmail", email);
          localStorage.setItem("rememberedPassword", password);
          localStorage.setItem("rememberMe", "true");
        } else {
          // Supprimer les données sauvegardées si "Se souvenir de moi" est désactivé
          localStorage.removeItem("rememberedEmail");
          localStorage.removeItem("rememberedPassword");
          localStorage.removeItem("rememberMe");
        }

        // Vérifier si l'utilisateur doit changer son mot de passe
        const session = await getSession();
        if ((session?.user as any)?.mustChangePassword) {
          router.push("/change-password");
        } else {
          // Redirection basée sur le rôle de l'utilisateur
          const userRole = (session?.user as any)?.role;
          if (userRole === "ADMIN") {
            router.push("/admin");
          } else {
            // Rediriger vers la page demandée ou vers l'accueil par défaut
            router.push(callbackUrl);
          }
        }
      }
    } catch (error) {
      setError("Une erreur est survenue lors de la connexion");
      toast.error("Une erreur est survenue lors de la connexion");
    } finally {
      setIsLoading(false);
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
          {/* Section gauche - Branding et informations */}
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
                <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg">
                  <Calendar className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent drop-shadow-sm">
                  BookSpace
                </h1>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="space-y-4"
              >
                <h2 className="text-2xl lg:text-3xl font-semibold text-slate-800">
                  Bienvenue dans votre hub intelligent
                </h2>
                <p className="text-lg text-slate-600 max-w-lg mx-auto lg:mx-0">
                  Gérez vos réservations d'espaces avec simplicité et
                  efficacité. Une expérience moderne pour une productivité
                  optimale.
                </p>
              </motion.div>
            </div>

            {/* Fonctionnalités principales */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              <div className="flex items-center gap-3 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20 shadow-sm">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Building2 className="h-5 w-5 text-green-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-slate-800">
                    Gestion des salles
                  </h3>
                  <p className="text-sm text-slate-600">
                    Réservation intuitive
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20 shadow-sm">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-slate-800">
                    Collaboration
                  </h3>
                  <p className="text-sm text-slate-600">Travail d'équipe</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20 shadow-sm">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Clock className="h-5 w-5 text-purple-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-slate-800">Temps réel</h3>
                  <p className="text-sm text-slate-600">
                    Synchronisation instantanée
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20 shadow-sm">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-orange-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-slate-800">Fiabilité</h3>
                  <p className="text-sm text-slate-600">Système robuste</p>
                </div>
              </div>
            </motion.div>

            {/* Statistiques */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex flex-wrap gap-6 justify-center lg:justify-start"
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">500+</div>
                <div className="text-sm text-slate-600">
                  Utilisateurs actifs
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">50+</div>
                <div className="text-sm text-slate-600">Salles disponibles</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">1000+</div>
                <div className="text-sm text-slate-600">Réservations/mois</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Section droite - Formulaire de connexion */}
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
                  className="mx-auto p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl w-fit"
                >
                  <Sparkles className="h-8 w-8 text-white" />
                </motion.div>
                <CardTitle className="text-2xl font-bold text-slate-800">
                  Connexion
                </CardTitle>
                <CardDescription className="text-slate-600">
                  Accédez à votre espace de travail intelligent
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {pageNotFoundError && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        <div className="space-y-2">
                          <p className="font-semibold">Page non trouvée</p>
                          <p className="text-sm">
                            La page que vous cherchez n'existe pas.
                            Connectez-vous pour accéder à votre tableau de bord.
                          </p>
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}

                  {error && !pageNotFoundError && (
                    <Alert
                      variant="destructive"
                      className="border-2 border-red-300 bg-red-50"
                    >
                      <AlertCircle className="h-5 w-5 text-red-600" />
                      <AlertDescription className="text-sm font-medium text-red-900">
                        <p className="font-semibold mb-2">{error}</p>
                        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-red-200">
                          <Users className="h-4 w-4 text-red-600" />
                          <span className="text-xs text-red-700">
                            Besoin d'aide ? Contactez votre administrateur
                            système.
                          </span>
                        </div>
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
                        className="pl-10 h-12 rounded-xl border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.7 }}
                    className="space-y-2"
                  >
                    <label className="text-sm font-medium text-slate-700">
                      Mot de passe
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Votre mot de passe"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10 h-12 rounded-xl border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        required
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                        disabled={isLoading}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="flex items-center justify-between text-sm"
                  >
                    <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        disabled={isLoading}
                      />
                      Pré-remplir mes identifiants
                    </label>
                    <button
                      type="button"
                      onClick={() => router.push("/forgot-password")}
                      className="text-blue-600 hover:text-blue-700 font-medium transition-colors cursor-pointer"
                      disabled={isLoading}
                    >
                      Mot de passe oublié ?
                    </button>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.9 }}
                  >
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Connexion en cours...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          Se connecter
                          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      )}
                    </Button>
                  </motion.div>
                </form>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 1 }}
                  className="relative"
                >
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-slate-500">
                      Ou continuez avec
                    </span>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.1 }}
                  className="grid grid-cols-2 gap-3"
                >
                  <Button
                    variant="outline"
                    className="h-12 rounded-xl border-slate-200 hover:bg-slate-50 transition-all duration-200 cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      Google
                    </div>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-12 rounded-xl border-slate-200 hover:bg-slate-50 transition-all duration-200 cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                          fill="#00BCF2"
                          d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z"
                        />
                      </svg>
                      Microsoft
                    </div>
                  </Button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 1.2 }}
                  className="text-center text-sm text-slate-600"
                >
                  Première connexion ?{" "}
                  <a
                    href="/onboarding"
                    className="text-blue-600 font-medium hover:underline transition-colors cursor-pointer"
                  >
                    Créez votre organisation
                  </a>
                </motion.div>

                {/* Informations sur les mots de passe temporaires */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 1.3 }}
                  className="bg-blue-50 border border-blue-200 rounded-xl p-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Lock className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">
                      Mot de passe temporaire
                    </span>
                  </div>
                  <p className="text-xs text-blue-700">
                    Si vous venez de créer votre organisation, utilisez le mot
                    de passe temporaire qui vous a été envoyé par email. Vous
                    serez invité à le changer lors de votre première connexion.
                  </p>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
