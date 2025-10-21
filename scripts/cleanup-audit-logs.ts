#!/usr/bin/env node

import { PrismaClient } from "@prisma/client";
import { cleanupOldAuditLogs } from "../src/lib/audit-logging";

const prisma = new PrismaClient();

async function main() {
  console.log("🧹 Nettoyage des anciens logs d'audit...");

  try {
    const deletedCount = await cleanupOldAuditLogs(90); // Supprimer les logs de plus de 90 jours
    console.log(`✅ ${deletedCount} logs d'audit supprimés`);

    // Statistiques des logs restants
    const totalLogs = await prisma.auditLog.count();
    console.log(`📊 Total des logs d'audit restants: ${totalLogs}`);

    // Statistiques par tenant
    const logsByTenant = await prisma.auditLog.groupBy({
      by: ["orgId"],
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: "desc",
        },
      },
      take: 10,
    });

    console.log("\n📈 Top 10 des tenants par nombre de logs:");
    for (const tenant of logsByTenant) {
      const org = await prisma.organization.findUnique({
        where: { id: tenant.orgId },
        select: { name: true, slug: true },
      });
      console.log(
        `   ${org?.name || "Unknown"} (${org?.slug || tenant.orgId}): ${tenant._count.id} logs`
      );
    }
  } catch (error) {
    console.error("❌ Erreur lors du nettoyage:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
