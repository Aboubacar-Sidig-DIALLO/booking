import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { Tenant, TenantResolutionResult } from "@/types/tenant";

const prisma = new PrismaClient();

export async function resolveTenant(
  request: NextRequest
): Promise<TenantResolutionResult> {
  const hostname = request.headers.get("host") || "";
  const url = request.nextUrl;

  try {
    // 1. Résolution par sous-domaine : tenant1.votreapp.com
    const subdomain = extractSubdomain(hostname);
    if (subdomain && !isReservedSubdomain(subdomain)) {
      const tenant = await getTenantBySlug(subdomain);
      if (tenant) {
        return { tenant, method: "subdomain" };
      }
    }

    // 2. Résolution par domaine personnalisé : entreprise.com
    const tenant = await getTenantByDomain(hostname);
    if (tenant) {
      return { tenant, method: "domain" };
    }

    // 3. Résolution par paramètre d'URL : /tenant/entreprise
    const pathSegments = url.pathname.split("/").filter(Boolean);
    if (pathSegments[0] === "tenant" && pathSegments[1]) {
      const tenant = await getTenantBySlug(pathSegments[1]);
      if (tenant) {
        return { tenant, method: "path" };
      }
    }

    // 4. Résolution par header personnalisé (pour les API)
    const tenantHeader = request.headers.get("x-tenant-id");
    if (tenantHeader) {
      const tenant = await getTenantById(tenantHeader);
      if (tenant) {
        return { tenant, method: "header" };
      }
    }

    // 5. Résolution par défaut pour localhost (développement)
    if (hostname === "localhost:3000" || hostname === "127.0.0.1:3000") {
      const tenant = await getTenantByDomain("localhost");
      if (tenant) {
        return { tenant, method: "domain" };
      }
    }

    return { tenant: null, method: null };
  } catch (error) {
    console.error("Erreur lors de la résolution du tenant:", error);
    return { tenant: null, method: null };
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

async function getTenantBySlug(slug: string): Promise<Tenant | null> {
  try {
    const organization = await prisma.organization.findUnique({
      where: { slug },
      include: {
        features: {
          include: {
            feature: true,
          },
        },
      },
    });

    return organization as Tenant | null;
  } catch (error) {
    console.error(
      `Erreur lors de la récupération du tenant par slug ${slug}:`,
      error
    );
    return null;
  }
}

async function getTenantByDomain(domain: string): Promise<Tenant | null> {
  try {
    const organization = await prisma.organization.findUnique({
      where: { domain },
      include: {
        features: {
          include: {
            feature: true,
          },
        },
      },
    });

    return organization as Tenant | null;
  } catch (error) {
    console.error(
      `Erreur lors de la récupération du tenant par domaine ${domain}:`,
      error
    );
    return null;
  }
}

async function getTenantById(id: string): Promise<Tenant | null> {
  try {
    const organization = await prisma.organization.findUnique({
      where: { id },
      include: {
        features: {
          include: {
            feature: true,
          },
        },
      },
    });

    return organization as Tenant | null;
  } catch (error) {
    console.error(
      `Erreur lors de la récupération du tenant par ID ${id}:`,
      error
    );
    return null;
  }
}

export async function createTenant(data: {
  name: string;
  slug: string;
  domain?: string;
  plan?: "STARTER" | "PROFESSIONAL" | "ENTERPRISE" | "CUSTOM";
  settings?: any;
}): Promise<Tenant> {
  const organization = await prisma.organization.create({
    data: {
      name: data.name,
      slug: data.slug,
      domain: data.domain,
      plan: data.plan || "STARTER",
      settings: data.settings,
    },
    include: {
      features: {
        include: {
          feature: true,
        },
      },
    },
  });

  return organization as Tenant;
}

export async function updateTenantSettings(
  tenantId: string,
  settings: any
): Promise<Tenant> {
  const organization = await prisma.organization.update({
    where: { id: tenantId },
    data: { settings },
    include: {
      features: {
        include: {
          feature: true,
        },
      },
    },
  });

  return organization as Tenant;
}

export async function enableFeatureForTenant(
  tenantId: string,
  featureName: string,
  settings?: any
): Promise<void> {
  const feature = await prisma.feature.findUnique({
    where: { name: featureName },
  });

  if (!feature) {
    throw new Error(`Fonctionnalité ${featureName} introuvable`);
  }

  await prisma.organizationFeature.upsert({
    where: {
      organizationId_featureId: {
        organizationId: tenantId,
        featureId: feature.id,
      },
    },
    update: {
      isEnabled: true,
      settings,
    },
    create: {
      organizationId: tenantId,
      featureId: feature.id,
      isEnabled: true,
      settings,
    },
  });
}

export async function disableFeatureForTenant(
  tenantId: string,
  featureName: string
): Promise<void> {
  const feature = await prisma.feature.findUnique({
    where: { name: featureName },
  });

  if (!feature) {
    throw new Error(`Fonctionnalité ${featureName} introuvable`);
  }

  await prisma.organizationFeature.updateMany({
    where: {
      organizationId: tenantId,
      featureId: feature.id,
    },
    data: {
      isEnabled: false,
    },
  });
}
