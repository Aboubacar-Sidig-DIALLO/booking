"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface ProtectedPageProps {
  children: React.ReactNode;
  redirectTo?: string;
  fallback?: React.ReactNode;
}

export function ProtectedPage({
  children,
  redirectTo = "/login",
  fallback,
}: ProtectedPageProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // En cours de chargement

    if (!session) {
      // Rediriger vers la page de connexion avec l'URL actuelle comme callback
      const redirectUrl = redirectTo === "/login" ? `/login` : redirectTo;
      router.push(redirectUrl);
      return;
    }
  }, [session, status, router, redirectTo]);

  // Afficher le fallback pendant le chargement ou si pas connecté
  if (status === "loading" || !session) {
    return (
      fallback || (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-4"
          >
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
            <div className="space-y-2">
              <p className="text-slate-600 font-medium">
                {status === "loading"
                  ? "Vérification de l'authentification..."
                  : "Redirection..."}
              </p>
              <p className="text-sm text-slate-500">
                Veuillez patienter pendant que nous vérifions votre accès
              </p>
            </div>
          </motion.div>
        </div>
      )
    );
  }

  return <>{children}</>;
}
