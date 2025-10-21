#!/usr/bin/env node

import { PrismaClient } from "@prisma/client";
import { cacheTenant } from "../src/lib/tenant-resolver-edge";

const prisma = new PrismaClient();

async function initializeTenantCache() {
  console.log("🔄 Initialisation du cache des tenants...");

  try {
    // Récupérer tous les tenants depuis la base de données
    const tenants = await prisma.organization.findMany({
      select: {
        id: true,
        slug: true,
        domain: true,
        plan: true,
        settings: true,
      },
    });

    // Mettre en cache chaque tenant
    tenants.forEach((tenant) => {
      cacheTenant(tenant.slug, {
        id: tenant.id,
        slug: tenant.slug,
        domain: tenant.domain || undefined,
        plan: tenant.plan,
        settings: tenant.settings,
      });
    });

    console.log(`✅ Cache initialisé avec ${tenants.length} tenants:`);
    tenants.forEach((tenant) => {
      console.log(`   - ${tenant.slug} (${tenant.plan})`);
    });
  } catch (error) {
    console.error("❌ Erreur lors de l'initialisation du cache:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter seulement si ce script est appelé directement
if (require.main === module) {
  initializeTenantCache();
}

export { initializeTenantCache };
