/**
 * Configuration centralisée des couleurs pour les actions rapides
 * Chaque action a sa propre palette de couleurs pour une expérience cohérente
 */

export type ThemeColorName = "blue" | "green" | "purple" | "pink";

export interface ThemeColorConfig {
  name: ThemeColorName;
  // Couleurs de fond (light) - classes Tailwind complètes
  bgFrom: string;
  bgTo: string;
  bgBorder: string;

  // Couleurs principales (dark) - classes Tailwind complètes
  primaryFrom: string;
  primaryTo: string;
  primaryFromHover: string;
  primaryToHover: string;

  // Couleurs pour les éléments UI
  iconBg: string;
  accent: string;
  text: string;
  textLight: string;

  // Gradient pour les headers - classes Tailwind complètes
  headerFrom: string;
  headerVia: string;
  headerTo: string;

  // Header background gradient - classe complète
  headerBg: string;

  // Hover states - classes complètes
  hoverBorder: string;
  hoverBg: string;

  // Focus ring - classe complète pour les inputs
  focusRing: string;

  // Hover gradients - classes complètes incluant hover:
  hoverGradientFrom: string;
  hoverGradientTo: string;
}

export const themeColors: Record<ThemeColorName, ThemeColorConfig> = {
  blue: {
    name: "blue",
    bgFrom: "from-blue-50",
    bgTo: "to-indigo-50",
    bgBorder: "border-blue-200",
    primaryFrom: "from-blue-500",
    primaryTo: "to-indigo-600",
    primaryFromHover: "from-blue-600",
    primaryToHover: "to-indigo-700",
    iconBg: "bg-gradient-to-br from-blue-500 to-indigo-600",
    accent: "blue-600",
    text: "text-blue-600",
    textLight: "text-blue-100",
    headerFrom: "from-blue-600",
    headerVia: "via-indigo-600",
    headerTo: "to-purple-600",
    headerBg: "bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600",
    hoverBorder: "hover:border-blue-400",
    hoverBg: "hover:bg-blue-50",
    focusRing: "focus:ring-blue-500",
    hoverGradientFrom: "hover:from-blue-600",
    hoverGradientTo: "hover:to-indigo-700",
  },
  green: {
    name: "green",
    bgFrom: "from-green-50",
    bgTo: "to-emerald-50",
    bgBorder: "border-green-200",
    primaryFrom: "from-green-500",
    primaryTo: "to-emerald-600",
    primaryFromHover: "from-green-600",
    primaryToHover: "to-emerald-700",
    iconBg: "bg-gradient-to-br from-green-500 to-emerald-600",
    accent: "green-600",
    text: "text-green-600",
    textLight: "text-green-100",
    headerFrom: "from-green-600",
    headerVia: "via-emerald-600",
    headerTo: "to-teal-600",
    headerBg: "bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600",
    hoverBorder: "hover:border-green-400",
    hoverBg: "hover:bg-green-50",
    focusRing: "focus:ring-green-500",
    hoverGradientFrom: "hover:from-green-600",
    hoverGradientTo: "hover:to-emerald-700",
  },
  purple: {
    name: "purple",
    bgFrom: "from-purple-50",
    bgTo: "to-violet-50",
    bgBorder: "border-purple-200",
    primaryFrom: "from-purple-500",
    primaryTo: "to-violet-600",
    primaryFromHover: "from-purple-600",
    primaryToHover: "to-violet-700",
    iconBg: "bg-gradient-to-br from-purple-500 to-violet-600",
    accent: "purple-600",
    text: "text-purple-600",
    textLight: "text-purple-100",
    headerFrom: "from-purple-600",
    headerVia: "via-violet-600",
    headerTo: "to-fuchsia-600",
    headerBg: "bg-gradient-to-br from-purple-600 via-violet-600 to-fuchsia-600",
    hoverBorder: "hover:border-purple-400",
    hoverBg: "hover:bg-purple-50",
    focusRing: "focus:ring-purple-500",
    hoverGradientFrom: "hover:from-purple-600",
    hoverGradientTo: "hover:to-violet-700",
  },
  pink: {
    name: "pink",
    bgFrom: "from-pink-50",
    bgTo: "to-rose-50",
    bgBorder: "border-pink-200",
    primaryFrom: "from-pink-500",
    primaryTo: "to-rose-600",
    primaryFromHover: "from-pink-600",
    primaryToHover: "to-rose-700",
    iconBg: "bg-gradient-to-br from-pink-500 to-rose-600",
    accent: "pink-600",
    text: "text-pink-600",
    textLight: "text-pink-100",
    headerFrom: "from-pink-600",
    headerVia: "via-rose-600",
    headerTo: "to-red-600",
    headerBg: "bg-gradient-to-br from-pink-600 via-rose-600 to-red-600",
    hoverBorder: "hover:border-pink-400",
    hoverBg: "hover:bg-pink-50",
    focusRing: "focus:ring-pink-500",
    hoverGradientFrom: "hover:from-pink-600",
    hoverGradientTo: "hover:to-rose-700",
  },
};

/**
 * Mappe les routes aux couleurs de thème
 */
export const routeThemeMap: Record<string, ThemeColorName> = {
  "/bookings/new": "blue",
  "/rooms": "green",
  "/my-bookings": "purple",
  "/favorites": "pink",
};

/**
 * Récupère la couleur de thème pour une route donnée
 */
export function getThemeColorForRoute(route: string): ThemeColorConfig {
  const themeName = routeThemeMap[route] || "blue";
  return themeColors[themeName];
}

/**
 * Récupère la couleur de thème par nom
 */
export function getThemeColor(
  name: ThemeColorName | string | null
): ThemeColorConfig {
  if (!name || !(name in themeColors)) {
    return themeColors.blue; // Par défaut
  }
  return themeColors[name as ThemeColorName];
}
