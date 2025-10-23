# Structure des Routes d'Authentification

## 🎯 Routes Disponibles

Toutes les pages d'authentification sont maintenant organisées dans le groupe `(auth)` :

### **Pages Principales**

- **`/signin`** - Page de connexion (remplace `/login` et `/auth/signin`)
- **`/change-password`** - Changement de mot de passe obligatoire
- **`/error`** - Page d'erreur d'authentification
- **`/tenant-selection`** - Sélection de tenant/organisation
- **`/onboarding`** - Création d'organisation

### **Redirections**

- **`/login`** → **`/signin`** (redirection automatique)

## 🔧 Configuration

### **NextAuth**

```typescript
// src/lib/auth.ts
pages: {
  signIn: "/signin",
  error: "/error",
}
```

### **Middleware**

```typescript
// src/middleware.ts
const publicRoutes = [
  "/signin",
  "/error",
  "/tenant-selection",
  "/onboarding",
  "/change-password",
  // ...
];
```

## 📁 Structure des Fichiers

```
src/app/
├── (auth)/
│   ├── layout.tsx              # Layout pour toutes les pages auth
│   ├── signin/page.tsx         # Connexion
│   ├── change-password/page.tsx # Changement de mot de passe
│   ├── error/page.tsx          # Erreurs d'auth
│   ├── tenant-selection/page.tsx
│   └── onboarding/page.tsx     # Création d'organisation
├── login/page.tsx              # Redirection vers /signin
└── (dashboard)/                # Pages protégées
```

## 🚀 Utilisation

### **Pour les Développeurs**

```typescript
// Redirection programmatique
import { useRouter } from "next/navigation";
const router = useRouter();
router.push("/signin");

// Liens dans les composants
<a href="/signin">Se connecter</a>
```

### **Pour les Utilisateurs**

- Accédez à `http://localhost:3000/signin` pour vous connecter
- Les anciens liens `/login` redirigent automatiquement
- Toutes les pages d'auth ont un layout cohérent

## ✅ Avantages

1. **URLs courtes** : `/signin` au lieu de `/auth/signin`
2. **Structure cohérente** : Tout dans `(auth)`
3. **Maintenabilité** : Layout partagé
4. **Compatibilité** : Redirections pour les anciens liens
5. **Performance** : Cache optimisé par Next.js
