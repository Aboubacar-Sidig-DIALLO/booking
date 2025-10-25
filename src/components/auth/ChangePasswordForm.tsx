"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Lock, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";

const ChangePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Le mot de passe actuel est requis"),
    newPassword: z
      .string()
      .min(8, "Le nouveau mot de passe doit contenir au moins 8 caractères")
      .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
      .regex(/[a-z]/, "Le mot de passe doit contenir au moins une minuscule")
      .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre")
      .regex(
        /[^A-Za-z0-9]/,
        "Le mot de passe doit contenir au moins un caractère spécial"
      ),
    confirmPassword: z
      .string()
      .min(1, "La confirmation du mot de passe est requise"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

type ChangePasswordForm = z.infer<typeof ChangePasswordSchema>;

interface ChangePasswordFormProps {
  onSuccess?: () => void;
  userEmail?: string; // Ajouter l'email de l'utilisateur
}

export function ChangePasswordForm({
  onSuccess,
  userEmail,
}: ChangePasswordFormProps) {
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPasteWarning, setShowPasteWarning] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<ChangePasswordForm>({
    resolver: zodResolver(ChangePasswordSchema),
  });

  const newPassword = watch("newPassword");
  const confirmPassword = watch("confirmPassword");

  // Fonction pour vérifier si tous les critères de sécurité sont respectés
  const isPasswordValid = (password: string) => {
    if (!password) return false;
    return (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /[0-9]/.test(password) &&
      /[^A-Za-z0-9]/.test(password)
    );
  };

  // Vérifier si le formulaire peut être soumis
  const canSubmit =
    newPassword &&
    confirmPassword &&
    isPasswordValid(newPassword) &&
    newPassword === confirmPassword;

  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, label: "", color: "" };

    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    const labels = ["Très faible", "Faible", "Moyen", "Fort", "Très fort"];
    const colors = [
      "bg-red-500",
      "bg-orange-500",
      "bg-yellow-500",
      "bg-blue-500",
      "bg-green-500",
    ];

    return {
      strength,
      label: labels[strength - 1] || "",
      color: colors[strength - 1] || "",
    };
  };

  const passwordStrength = getPasswordStrength(newPassword || "");

  const onSubmit = async (data: ChangePasswordForm) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/user/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        // Gérer les erreurs spécifiques du backend
        if (result.code === "SAME_PASSWORD") {
          throw new Error(
            "Le nouveau mot de passe doit être différent de l'ancien"
          );
        } else if (result.code === "INVALID_CURRENT_PASSWORD") {
          throw new Error("Le mot de passe actuel est incorrect");
        } else if (result.code === "VALIDATION_ERROR" && result.errors) {
          // Afficher la première erreur de validation
          const firstError = result.errors[0];
          throw new Error(firstError.message || "Erreur de validation");
        } else {
          throw new Error(
            result.message || "Erreur lors du changement de mot de passe"
          );
        }
      }

      toast.success("Mot de passe changé avec succès !");

      // Mettre à jour le localStorage si l'utilisateur a activé "Pré-remplir mes identifiants"
      const rememberedEmail = localStorage.getItem("rememberedEmail");
      const rememberMe = localStorage.getItem("rememberMe") === "true";

      if (rememberMe && userEmail && rememberedEmail === userEmail) {
        // Mettre à jour le mot de passe dans localStorage avec le nouveau mot de passe
        localStorage.setItem("rememberedPassword", data.newPassword);
        console.log("Mot de passe mis à jour dans localStorage");
      }

      reset();
      onSuccess?.();
    } catch (error: any) {
      setError(error.message);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handlePasteAttempt = (e: React.ClipboardEvent) => {
    e.preventDefault();
    setShowPasteWarning(true);

    // Masquer l'avertissement après 3 secondes
    setTimeout(() => {
      setShowPasteWarning(false);
    }, 3000);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
          <Lock className="h-6 w-6 text-blue-600" />
        </div>
        <CardTitle className="text-2xl">Changer le mot de passe</CardTitle>
        <CardDescription>
          Choisissez un mot de passe sécurisé pour protéger votre compte
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Mot de passe actuel */}
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Mot de passe actuel</Label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={showPasswords.current ? "text" : "password"}
                {...register("currentPassword")}
                className="pr-10"
                placeholder="Entrez votre mot de passe actuel"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => togglePasswordVisibility("current")}
              >
                {showPasswords.current ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {errors.currentPassword && (
              <p className="text-sm text-red-600">
                {errors.currentPassword.message}
              </p>
            )}
          </div>

          {/* Nouveau mot de passe */}
          <div className="space-y-2">
            <Label htmlFor="newPassword">Nouveau mot de passe</Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showPasswords.new ? "text" : "password"}
                {...register("newPassword")}
                className="pr-10"
                placeholder="Entrez votre nouveau mot de passe"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => togglePasswordVisibility("new")}
              >
                {showPasswords.new ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>

            {/* Indicateur de force du mot de passe */}
            {newPassword && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                      style={{
                        width: `${(passwordStrength.strength / 5) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm text-gray-600">
                    {passwordStrength.label}
                  </span>
                </div>
              </div>
            )}

            {errors.newPassword && (
              <p className="text-sm text-red-600">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          {/* Confirmation du mot de passe */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">
              Confirmer le nouveau mot de passe
              <span className="text-xs text-gray-500 ml-1">
                (saisie manuelle requise)
              </span>
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showPasswords.confirm ? "text" : "password"}
                {...register("confirmPassword")}
                className="pr-10"
                placeholder="Confirmez votre nouveau mot de passe"
                onPaste={handlePasteAttempt}
                // onCopy={(e) => e.preventDefault()}
                // onCut={(e) => e.preventDefault()}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => togglePasswordVisibility("confirm")}
              >
                {showPasswords.confirm ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-red-600">
                {errors.confirmPassword.message}
              </p>
            )}
            {showPasteWarning && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 animate-pulse">
                <div className="flex items-center space-x-2 text-orange-700">
                  <AlertCircle className="h-4 w-4 animate-bounce" />
                  <span className="text-sm font-medium">
                    ⚠️ Le copier-coller est désactivé pour vous assurer de bien
                    connaître votre mot de passe.
                  </span>
                </div>
              </div>
            )}
            {!showPasteWarning && (
              <p className="text-xs text-gray-500">
                💡 Le copier-coller est désactivé pour vous assurer de bien
                connaître votre mot de passe.
              </p>
            )}
          </div>

          {/* Critères de sécurité */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700">
              Critères de sécurité :
            </h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li
                className={`flex items-center space-x-2 ${
                  (newPassword?.length || 0) >= 8
                    ? "text-green-600"
                    : "text-red-500"
                }`}
              >
                <CheckCircle
                  className={`h-4 w-4 ${
                    (newPassword?.length || 0) >= 8
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                />
                <span>Au moins 8 caractères</span>
              </li>
              <li
                className={`flex items-center space-x-2 ${
                  /[A-Z]/.test(newPassword || "")
                    ? "text-green-600"
                    : "text-red-500"
                }`}
              >
                <CheckCircle
                  className={`h-4 w-4 ${
                    /[A-Z]/.test(newPassword || "")
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                />
                <span>Une majuscule</span>
              </li>
              <li
                className={`flex items-center space-x-2 ${
                  /[a-z]/.test(newPassword || "")
                    ? "text-green-600"
                    : "text-red-500"
                }`}
              >
                <CheckCircle
                  className={`h-4 w-4 ${
                    /[a-z]/.test(newPassword || "")
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                />
                <span>Une minuscule</span>
              </li>
              <li
                className={`flex items-center space-x-2 ${
                  /[0-9]/.test(newPassword || "")
                    ? "text-green-600"
                    : "text-red-500"
                }`}
              >
                <CheckCircle
                  className={`h-4 w-4 ${
                    /[0-9]/.test(newPassword || "")
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                />
                <span>Un chiffre</span>
              </li>
              <li
                className={`flex items-center space-x-2 ${
                  /[^A-Za-z0-9]/.test(newPassword || "")
                    ? "text-green-600"
                    : "text-red-500"
                }`}
              >
                <CheckCircle
                  className={`h-4 w-4 ${
                    /[^A-Za-z0-9]/.test(newPassword || "")
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                />
                <span>Un caractère spécial</span>
              </li>
            </ul>

            {/* Message de confirmation */}
            {newPassword && confirmPassword && (
              <div
                className={`text-sm font-medium ${
                  newPassword === confirmPassword
                    ? "text-green-600"
                    : "text-red-500"
                }`}
              >
                {newPassword === confirmPassword ? (
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4" />
                    <span>Les mots de passe correspondent</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4" />
                    <span>Les mots de passe ne correspondent pas</span>
                  </div>
                )}
              </div>
            )}

            {/* Message d'état global */}
            {newPassword && (
              <>
                {canSubmit ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center space-x-2 text-green-700">
                      <CheckCircle className="h-5 w-5" />
                      <span className="font-semibold">
                        Mot de passe valide - Prêt à être changé
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 animate-pulse">
                    <div className="flex items-center space-x-2 text-red-700">
                      <AlertCircle className="h-5 w-5 animate-bounce" />
                      <span className="font-semibold">
                        ⚠️ Critères de sécurité non respectés
                      </span>
                    </div>
                    <p className="text-sm text-red-600 mt-1">
                      Veuillez respecter tous les critères ci-dessus pour
                      pouvoir changer votre mot de passe.
                    </p>
                  </div>
                )}
              </>
            )}
          </div>

          <Button
            type="submit"
            className={`w-full ${
              !canSubmit && newPassword
                ? "bg-gray-400 text-gray-600 cursor-not-allowed opacity-60"
                : ""
            }`}
            disabled={isLoading || !canSubmit}
          >
            {isLoading ? "Changement en cours..." : "Changer le mot de passe"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
