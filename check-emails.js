// Script pour vérifier les emails existants
const checkExistingEmails = async () => {
  console.log("🔍 Vérification des emails existants...\n");

  try {
    const { PrismaClient } = require("@prisma/client");
    const prisma = new PrismaClient();

    // Récupérer tous les utilisateurs avec leurs emails
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        org: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
    });

    console.log(`📊 Utilisateurs trouvés: ${users.length}\n`);

    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name || "Sans nom"}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Rôle: ${user.role}`);
      console.log(
        `   Organisation: ${user.org?.name || "N/A"} (${user.org?.slug || "N/A"})`
      );
      console.log("");
    });

    await prisma.$disconnect();
  } catch (error) {
    console.error("❌ Erreur lors de la vérification:", error);
  }
};

checkExistingEmails();
