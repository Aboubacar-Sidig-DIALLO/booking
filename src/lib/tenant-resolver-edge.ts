import { NextRequest } from "next/server";

// Version Edge Runtime compatible pour la résolution de tenant
export async function resolveTenantEdge(request: NextRequest): Promise<{
  tenantId: string | null;
  tenantSlug: string | null;
  tenantPlan: string | null;
  method: "subdomain" | "domain" | "path" | "header" | null;
}> {
  const hostname = request.headers.get("host") || "";
  const url = request.nextUrl;

  try {
    // 1. Résolution par sous-domaine : tenant1.votreapp.com
    const subdomain = extractSubdomain(hostname);
    if (subdomain && !isReservedSubdomain(subdomain)) {
      // Pour l'Edge Runtime, on utilise une logique simplifiée
      // Le tenant sera résolu côté serveur dans les API routes
      return {
        tenantId: subdomain === "demo" ? "demo" : null,
        tenantSlug: subdomain,
        tenantPlan: subdomain === "demo" ? "PROFESSIONAL" : "STARTER",
        method: "subdomain",
      };
    }

    // 2. Résolution par paramètre d'URL : /tenant/entreprise
    const pathSegments = url.pathname.split("/").filter(Boolean);
    if (pathSegments[0] === "tenant" && pathSegments[1]) {
      return {
        tenantId: pathSegments[1] === "demo" ? "demo" : null,
        tenantSlug: pathSegments[1],
        tenantPlan: pathSegments[1] === "demo" ? "PROFESSIONAL" : "STARTER",
        method: "path",
      };
    }

    // 3. Résolution par header personnalisé (pour les API)
    const tenantHeader = request.headers.get("x-tenant-id");
    if (tenantHeader) {
      return {
        tenantId: tenantHeader,
        tenantSlug: tenantHeader,
        tenantPlan: "STARTER",
        method: "header",
      };
    }

    return { tenantId: null, tenantSlug: null, tenantPlan: null, method: null };
  } catch (error) {
    console.error("Erreur lors de la résolution du tenant:", error);
    return { tenantId: null, tenantSlug: null, tenantPlan: null, method: null };
  }
}

function extractSubdomain(hostname: string): string | null {
  const parts = hostname.split(".");
  if (parts.length >= 3) {
    return parts[0];
  }
  return null;
}

function isReservedSubdomain(subdomain: string): boolean {
  const reserved = ["www", "app", "api", "admin", "staging", "dev", "test"];
  return reserved.includes(subdomain.toLowerCase());
}

// Cache simple pour les tenants (en mémoire, sera perdu au redémarrage)
const tenantCache = new Map<
  string,
  {
    id: string;
    slug: string;
    domain?: string;
    plan: string;
    settings?: any;
  }
>();

// Fonction pour mettre en cache un tenant
export function cacheTenant(
  slug: string,
  tenant: {
    id: string;
    slug: string;
    domain?: string;
    plan: string;
    settings?: any;
  }
) {
  tenantCache.set(slug, tenant);
}

// Fonction pour récupérer un tenant du cache
export function getCachedTenant(slug: string) {
  return tenantCache.get(slug);
}

// Fonction pour obtenir l'ID du tenant depuis le slug
export function getTenantIdFromSlug(slug: string): string | null {
  const cached = tenantCache.get(slug);
  if (cached) {
    return cached.id;
  }

  // Logique par défaut pour le développement
  if (slug === "demo") {
    return "demo";
  }

  return null;
}
