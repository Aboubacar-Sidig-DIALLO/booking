# Fonctionnalité de Mot de Passe Temporaire

Cette fonctionnalité permet de générer automatiquement un mot de passe temporaire lors de la création d'une nouvelle entreprise, et force l'utilisateur à le changer lors de sa première connexion.

## Fonctionnalités Implémentées

### 1. Génération de Mot de Passe Automatique

- **Fichier**: `src/lib/password-utils.ts`
- **Fonction**: `generateTemporaryPassword()`
- Génère un mot de passe basé sur le slug et le nom de l'entreprise
- Utilise une combinaison déterministe et aléatoire pour la sécurité
- Inclut des caractères spéciaux pour respecter les critères de sécurité

### 2. Hachage Sécurisé des Mots de Passe

- **Bibliothèque**: `bcryptjs` avec 12 rounds de salt
- **Fonctions**: `hashPassword()` et `verifyPassword()`
- Stockage sécurisé des mots de passe dans la base de données

### 3. Modèle de Données Mis à Jour

- **Fichier**: `prisma/schema.prisma`
- **Nouveaux champs**:
  - `password`: Mot de passe hashé (optionnel)
  - `mustChangePassword`: Flag pour forcer le changement (défaut: false)
  - `passwordChangedAt`: Date du dernier changement de mot de passe

### 4. Système d'Authentification Amélioré

- **Fichier**: `src/lib/auth.ts`
- Support des mots de passe dans NextAuth
- Vérification des mots de passe lors de la connexion
- Transmission du flag `mustChangePassword` dans la session

### 5. Création d'Entreprise avec Mot de Passe Temporaire

- **Fichier**: `src/app/api/onboarding/create-organization/route.ts`
- Génération automatique du mot de passe temporaire
- Envoi par email avec instructions
- Flag `mustChangePassword` activé pour l'administrateur

### 6. Interface de Changement de Mot de Passe

- **Page dédiée**: `src/app/change-password/page.tsx`
- **Composant**: `src/components/auth/ChangePasswordForm.tsx`
- **API**: `src/app/api/user/change-password/route.ts`
- Validation en temps réel de la force du mot de passe
- Critères de sécurité visuels

### 7. Page de Connexion Mise à Jour

- **Fichier**: `src/app/auth/signin/page.tsx`
- Support des champs email et mot de passe
- Redirection automatique vers le changement de mot de passe si nécessaire

### 8. Email de Bienvenue Amélioré

- **Fichier**: `src/lib/email-service.ts`
- Inclusion du mot de passe temporaire
- Instructions claires pour la première connexion
- Design responsive et professionnel

## Workflow Complet

### 1. Création d'Entreprise

1. L'utilisateur remplit le formulaire d'onboarding
2. Un mot de passe temporaire est généré basé sur le slug et le nom de l'entreprise
3. Le mot de passe est hashé et stocké en base
4. L'utilisateur est créé avec `mustChangePassword: true`
5. Un email de bienvenue est envoyé avec le mot de passe temporaire

### 2. Première Connexion

1. L'utilisateur se connecte avec son email et le mot de passe temporaire
2. Le système vérifie le flag `mustChangePassword`
3. Redirection automatique vers `/change-password`
4. L'utilisateur doit choisir un nouveau mot de passe sécurisé
5. Le flag `mustChangePassword` est désactivé

### 3. Connexions Suivantes

1. L'utilisateur se connecte normalement
2. Redirection vers le dashboard si le mot de passe a été changé
3. Possibilité de changer le mot de passe depuis les paramètres

## Sécurité

### Critères de Mot de Passe

- Minimum 8 caractères
- Au moins une majuscule
- Au moins un chiffre
- Au moins un caractère spécial
- Indicateur visuel de force du mot de passe

### Protection

- Mots de passe hashés avec bcrypt (12 rounds)
- Validation côté client et serveur
- Protection contre les attaques par force brute
- Session sécurisée avec NextAuth

## Utilisation

### Pour les Développeurs

```typescript
import {
  generateTemporaryPassword,
  hashPassword,
  verifyPassword,
} from "@/lib/password-utils";

// Générer un mot de passe temporaire
const { plainPassword, hashedPassword } = await generateTemporaryPassword(
  "mon-entreprise",
  "Mon Entreprise"
);

// Hacher un mot de passe
const hashed = await hashPassword("monMotDePasse");

// Vérifier un mot de passe
const isValid = await verifyPassword("monMotDePasse", hashed);
```

### Pour les Utilisateurs

1. **Création**: Recevez votre mot de passe temporaire par email
2. **Première connexion**: Utilisez le mot de passe temporaire
3. **Changement obligatoire**: Choisissez un nouveau mot de passe sécurisé
4. **Paramètres**: Changez votre mot de passe depuis le dashboard

## Configuration

### Variables d'Environnement

```env
# Email (pour l'envoi des mots de passe temporaires)
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=votre_user
SMTP_PASS=votre_pass
EMAIL_FROM=noreply@votreapp.com
```

### Migration de Base de Données

```bash
npx prisma migrate dev --name add-password-fields
```

## Tests

Pour tester la fonctionnalité :

1. **Créer une entreprise** via `/onboarding`
2. **Vérifier l'email** avec le mot de passe temporaire
3. **Se connecter** avec les identifiants temporaires
4. **Changer le mot de passe** sur la page dédiée
5. **Se reconnecter** avec le nouveau mot de passe

## Maintenance

### Surveillance

- Logs des tentatives de connexion
- Monitoring des changements de mot de passe
- Alertes en cas d'échec d'authentification

### Mise à Jour

- Rotation périodique des mots de passe (optionnel)
- Mise à jour des critères de sécurité
- Amélioration de l'interface utilisateur
