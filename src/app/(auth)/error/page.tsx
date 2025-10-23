"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case "Configuration":
        return "Il y a un problème avec la configuration du serveur.";
      case "AccessDenied":
        return "Accès refusé.";
      case "Verification":
        return "Le token a expiré ou a déjà été utilisé.";
      default:
        return "Une erreur d&apos;authentification s&apos;est produite.";
    }
  };

  return (
    <main className="min-h-dvh grid place-items-center p-6">
      <div className="w-full max-w-sm rounded-xl border bg-white/50 p-6 shadow-sm dark:bg-neutral-900/50">
        <h1 className="mb-2 text-xl font-semibold text-red-600">
          Erreur d'authentification
        </h1>
        <p className="mb-6 text-sm text-neutral-600 dark:text-neutral-300">
          {getErrorMessage(error)}
        </p>
        <a
          href="/login"
          className="w-full block text-center rounded-md bg-black px-3 py-2 text-white dark:bg-white dark:text-black hover:opacity-90 transition-opacity"
        >
          Retour à la connexion
        </a>
      </div>
    </main>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <AuthErrorContent />
    </Suspense>
  );
}
