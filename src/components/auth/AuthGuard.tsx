"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // En cours de chargement

    if (!session) {
      // Rediriger vers la page de connexion avec l'URL actuelle comme callback
      router.push(`/login`);
      return;
    }
  }, [session, status, router]);

  // Afficher le fallback pendant le chargement ou si pas connecté
  if (status === "loading" || !session) {
    return (
      fallback || (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-slate-600 font-medium">
              {status === "loading"
                ? "Vérification de l'authentification..."
                : "Redirection vers la connexion..."}
            </p>
          </motion.div>
        </div>
      )
    );
  }

  return <>{children}</>;
}
