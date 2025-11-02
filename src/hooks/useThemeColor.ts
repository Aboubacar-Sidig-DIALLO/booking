"use client";

import { useSearchParams, usePathname } from "next/navigation";
import { useMemo, useEffect } from "react";
import {
  ThemeColorConfig,
  getThemeColorForRoute,
  getThemeColor,
  ThemeColorName,
} from "@/lib/theme-colors";

const THEME_STORAGE_KEY = "bookspace_selected_theme";

/**
 * Définit le thème dans sessionStorage pour la navigation
 */
export function setThemeForNavigation(theme: ThemeColorName): void {
  if (typeof window !== "undefined") {
    sessionStorage.setItem(THEME_STORAGE_KEY, theme);
  }
}

/**
 * Récupère le thème depuis sessionStorage
 */
function getThemeFromStorage(): ThemeColorName | null {
  if (typeof window !== "undefined") {
    return sessionStorage.getItem(THEME_STORAGE_KEY) as ThemeColorName | null;
  }
  return null;
}

/**
 * Supprime le thème de sessionStorage après utilisation
 */
function clearThemeFromStorage(): void {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem(THEME_STORAGE_KEY);
  }
}

/**
 * Hook pour récupérer et utiliser la couleur de thème actuelle
 * Priorité: sessionStorage > query param > route actuelle
 */
export function useThemeColor(): ThemeColorConfig {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const theme = useMemo(() => {
    // Priorité 1: sessionStorage (thème défini depuis la page d'accueil)
    const storedTheme = getThemeFromStorage();
    if (storedTheme) {
      return getThemeColor(storedTheme);
    }

    // Priorité 2: Query param explicite (pour compatibilité)
    const themeParam = searchParams.get("theme");
    if (themeParam) {
      return getThemeColor(themeParam);
    }

    // Priorité 3: Route actuelle (déduction automatique)
    return getThemeColorForRoute(pathname);
  }, [searchParams, pathname]);

  // Nettoyer le thème de sessionStorage après le premier rendu
  useEffect(() => {
    const storedTheme = getThemeFromStorage();
    if (storedTheme) {
      // Nettoyer après utilisation pour ne pas affecter les navigations suivantes
      clearThemeFromStorage();
    }
  }, [pathname]);

  return theme;
}

/**
 * Hook pour obtenir juste le nom de la couleur de thème
 */
export function useThemeColorName(): ThemeColorName {
  const theme = useThemeColor();
  return theme.name;
}
