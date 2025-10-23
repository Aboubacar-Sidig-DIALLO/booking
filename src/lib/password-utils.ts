import bcrypt from "bcryptjs";
import crypto from "crypto";

/**
 * Génère un mot de passe aléatoire basé sur le slug et le nom de l'entreprise
 * @param companySlug - Le slug de l'entreprise
 * @param companyName - Le nom de l'entreprise
 * @returns Un mot de passe généré de manière déterministe mais sécurisé
 */
export function generateCompanyPassword(
  companySlug: string,
  companyName: string
): string {
  // Créer une base déterministe à partir du slug et du nom
  const base = `${companySlug}-${companyName}`.toLowerCase();

  // Utiliser crypto pour créer un hash déterministe
  const hash = crypto.createHash("sha256").update(base).digest("hex");

  // Prendre les premiers caractères du hash et les mélanger avec des caractères aléatoires
  const hashPart = hash.substring(0, 8);
  const randomPart = crypto.randomBytes(4).toString("hex");

  // Créer un mot de passe avec une combinaison de lettres, chiffres et caractères spéciaux
  const password = `${hashPart}${randomPart}`
    .split("")
    .map((char) => {
      // Ajouter de la variété en mélangeant les caractères
      if (Math.random() > 0.5) {
        return char.toUpperCase();
      }
      return char;
    })
    .join("");

  // Ajouter des caractères spéciaux pour respecter les critères de sécurité
  const specialChars = "!@#$%^&*";
  const specialChar =
    specialChars[Math.floor(Math.random() * specialChars.length)];

  return `${password}${specialChar}`;
}

/**
 * Hache un mot de passe avec bcrypt
 * @param password - Le mot de passe en clair
 * @returns Le mot de passe hashé
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

/**
 * Vérifie un mot de passe contre son hash
 * @param password - Le mot de passe en clair
 * @param hashedPassword - Le mot de passe hashé
 * @returns True si le mot de passe correspond
 */
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

/**
 * Génère un mot de passe temporaire pour les nouveaux utilisateurs
 * @param companySlug - Le slug de l'entreprise
 * @param companyName - Le nom de l'entreprise
 * @returns Un objet contenant le mot de passe en clair et son hash
 */
export async function generateTemporaryPassword(
  companySlug: string,
  companyName: string
): Promise<{
  plainPassword: string;
  hashedPassword: string;
}> {
  const plainPassword = generateCompanyPassword(companySlug, companyName);
  const hashedPassword = await hashPassword(plainPassword);

  return {
    plainPassword,
    hashedPassword,
  };
}
