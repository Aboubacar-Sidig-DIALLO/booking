"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";

export function PasswordChangeGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "loading") return; // En cours de chargement

    if (!session) return; // Pas connecté, laisser passer

    // Si l'utilisateur doit changer son mot de passe et n'est pas déjà sur la page de changement
    if (
      (session.user as any)?.mustChangePassword &&
      pathname !== "/change-password"
    ) {
      router.push("/change-password");
      return;
    }

    // Si l'utilisateur n'a pas besoin de changer son mot de passe mais est sur la page de changement
    if (
      !(session.user as any)?.mustChangePassword &&
      pathname === "/change-password"
    ) {
      router.push("/home");
      return;
    }
  }, [session, status, router, pathname]);

  // Si l'utilisateur doit changer son mot de passe et n'est pas sur la bonne page, ne pas afficher le contenu
  if (
    (session?.user as any)?.mustChangePassword &&
    pathname !== "/change-password"
  ) {
    return null;
  }

  return <>{children}</>;
}
