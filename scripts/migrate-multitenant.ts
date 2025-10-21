#!/usr/bin/env node

import { PrismaClient } from "@prisma/client";
import { seedDefaultFeatures } from "../src/lib/feature-flags";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Initialisation des fonctionnalités par défaut...");

  try {
    await seedDefaultFeatures();
    console.log("✅ Fonctionnalités par défaut créées avec succès");

    // Créer un tenant de démonstration
    const demoTenant = await prisma.organization.upsert({
      where: { slug: "demo" },
      update: {},
      create: {
        name: "Organisation de Démonstration",
        slug: "demo",
        domain: "demo.localhost",
        plan: "PROFESSIONAL",
        settings: {
          branding: {
            primaryColor: "#3b82f6",
            secondaryColor: "#1e40af",
            companyName: "Demo Corp",
          },
          notifications: {
            emailEnabled: true,
            smsEnabled: false,
            pushEnabled: true,
          },
        },
      },
    });

    console.log(`✅ Tenant de démonstration créé: ${demoTenant.slug}`);

    // Créer un utilisateur de démonstration
    const demoUser = await prisma.user.upsert({
      where: { email: "admin@demo.com" },
      update: {},
      create: {
        email: "admin@demo.com",
        name: "Administrateur Demo",
        role: "ADMIN",
        orgId: demoTenant.id,
      },
    });

    console.log(`✅ Utilisateur de démonstration créé: ${demoUser.email}`);

    // Créer un site de démonstration
    const demoSite =
      (await prisma.site.findFirst({
        where: {
          orgId: demoTenant.id,
          name: "Siège Social",
        },
      })) ||
      (await prisma.site.create({
        data: {
          name: "Siège Social",
          orgId: demoTenant.id,
        },
      }));

    console.log(`✅ Site de démonstration créé: ${demoSite.name}`);

    // Créer des salles de démonstration
    const rooms = [
      {
        name: "Salle de Réunion A",
        slug: "salle-reunion-a",
        capacity: 8,
        location: "Étage 1",
        floor: 1,
        description:
          "Salle de réunion équipée d'un écran et d'un tableau blanc",
      },
      {
        name: "Salle de Réunion B",
        slug: "salle-reunion-b",
        capacity: 12,
        location: "Étage 1",
        floor: 1,
        description: "Grande salle de réunion avec système de visioconférence",
      },
      {
        name: "Open Space",
        slug: "open-space",
        capacity: 20,
        location: "Étage 2",
        floor: 2,
        description: "Espace ouvert pour les événements et formations",
      },
    ];

    for (const roomData of rooms) {
      const existingRoom = await prisma.room.findFirst({
        where: {
          slug: roomData.slug,
          orgId: demoTenant.id,
        },
      });

      if (!existingRoom) {
        const room = await prisma.room.create({
          data: {
            ...roomData,
            orgId: demoTenant.id,
            siteId: demoSite.id,
          },
        });
        console.log(`✅ Salle créée: ${room.name}`);
      } else {
        console.log(`⚠️ Salle déjà existante: ${roomData.name}`);
      }
    }

    console.log("\n🎉 Migration terminée avec succès !");
    console.log("\n📋 Informations de connexion:");
    console.log(`   URL: http://demo.localhost:3000`);
    console.log(`   Email: admin@demo.com`);
    console.log(`   Tenant: ${demoTenant.slug}`);
  } catch (error) {
    console.error("❌ Erreur lors de la migration:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
