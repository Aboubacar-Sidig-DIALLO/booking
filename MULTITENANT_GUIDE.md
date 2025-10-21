# 🏢 Architecture Multi-Tenant - Guide d'Utilisation

## 📋 Vue d'Ensemble

Cette application implémente une architecture multi-tenant complète permettant à plusieurs entreprises d'utiliser la même application de manière isolée et sécurisée.

## 🏗️ Architecture

### **Stratégie d'Isolation**

- **Base de données unique** avec colonne discriminante (`orgId`)
- **Isolation automatique** via middleware Prisma
- **Résolution de tenant** par sous-domaine, domaine personnalisé, ou paramètre d'URL

### **Composants Principaux**

1. **Middleware de Résolution** (`src/middleware.ts`)
2. **Contexte React** (`src/contexts/tenant-context.tsx`)
3. **Client Prisma Sécurisé** (`src/lib/prisma-tenant.ts`)
4. **Système de Features Flags** (`src/lib/feature-flags.ts`)
5. **Sécurité et Audit** (`src/lib/security-middleware.ts`, `src/lib/audit-logging.ts`)

## 🚀 Démarrage Rapide

### 1. Migration de la Base de Données

```bash
# Générer le client Prisma
npm run prisma:generate

# Appliquer les migrations
npm run prisma:migrate

# Initialiser les données par défaut
npx tsx scripts/migrate-multitenant.ts
```

### 2. Configuration des Variables d'Environnement

```env
# Base de données
DATABASE_URL="postgresql://..."

# URLs des tenants
NEXT_PUBLIC_APP_URL="https://votreapp.com"
NEXT_PUBLIC_TENANT_DOMAIN="votreapp.com"
```

### 3. Démarrage de l'Application

```bash
npm run dev
```

## 🌐 Résolution des Tenants

### **Méthodes de Résolution**

1. **Par Sous-domaine** : `tenant1.votreapp.com`
2. **Par Domaine Personnalisé** : `entreprise.com`
3. **Par Paramètre d'URL** : `/tenant/entreprise`
4. **Par Header** : `x-tenant-id` (pour les API)

### **Exemple d'Utilisation**

```typescript
// Dans un composant React
import { useTenant, useFeature } from '@/contexts/tenant-context';

function MyComponent() {
  const { tenant, isLoading } = useTenant();
  const hasAnalytics = useFeature('analytics');

  if (isLoading) return <div>Chargement...</div>;
  if (!tenant) return <div>Tenant non trouvé</div>;

  return (
    <div>
      <h1>Bienvenue chez {tenant.name}</h1>
      {hasAnalytics && <AnalyticsDashboard />}
    </div>
  );
}
```

## 🔒 Sécurité et Isolation

### **Isolation Automatique des Données**

```typescript
// Le client Prisma filtre automatiquement par tenant
const prisma = createSecurePrismaClient(request);

// Cette requête ne retourne que les réservations du tenant actuel
const bookings = await prisma.booking.findMany();
```

### **Vérification d'Accès**

```typescript
// Middleware avec vérification de fonctionnalité
export const GET = withFeatureCheck("analytics", async (req, { tenantId }) => {
  // Code de l'API
});

// Middleware avec vérification de rôle
export const POST = withAdminAccess(async (req, { tenantId, userId }) => {
  // Code de l'API
});
```

## 🎛️ Gestion des Fonctionnalités

### **Activation/Désactivation de Fonctionnalités**

```typescript
// Activer une fonctionnalité pour un tenant
await enableFeatureForTenant(tenantId, "analytics", {
  retentionDays: 90,
  exportEnabled: true,
});

// Vérifier l'accès à une fonctionnalité
const hasAccess = await checkFeatureAccess(tenantId, "analytics");
```

### **Composant FeatureGate**

```tsx
import { FeatureGate } from "@/components/feature-gate";

function AnalyticsPage() {
  return (
    <FeatureGate
      feature="analytics"
      showUpgrade={true}
      planRequired="PROFESSIONAL"
    >
      <AnalyticsDashboard />
    </FeatureGate>
  );
}
```

## 📊 Audit et Logging

### **Logging des Actions**

```typescript
// Logger une action utilisateur
await logTenantAction({
  tenantId,
  userId,
  action: "CREATE_BOOKING",
  entity: "booking",
  entityId: booking.id,
  metadata: { roomId: booking.roomId },
  ipAddress,
  userAgent,
});
```

### **Récupération des Logs**

```typescript
// Récupérer les logs d'audit
const logs = await getTenantAuditLogs(tenantId, {
  startDate: new Date("2024-01-01"),
  endDate: new Date("2024-12-31"),
  limit: 100,
});
```

## 🔧 Hooks React Sécurisés

### **Hooks de Données**

```typescript
import {
  useTenantBookings,
  useTenantRooms,
  useCreateBooking
} from '@/hooks/use-tenant-data';

function BookingsPage() {
  const { data: bookings, isLoading } = useTenantBookings({
    startDate: new Date(),
    status: 'CONFIRMED',
  });

  const createBooking = useCreateBooking();

  const handleCreate = async (data) => {
    await createBooking.mutateAsync(data);
  };

  return (
    <div>
      {isLoading ? 'Chargement...' : (
        <BookingList bookings={bookings} />
      )}
    </div>
  );
}
```

## 📈 Rapports et Analytics

### **Rapport d'Activité**

```typescript
// Générer un rapport d'activité
const report = await generateActivityReport(tenantId, startDate, endDate);

console.log(report);
// {
//   totalActions: 1250,
//   actionsByType: { 'CREATE_BOOKING': 500, 'UPDATE_BOOKING': 300 },
//   actionsByUser: { 'user1': 400, 'user2': 350 },
//   dailyActivity: [{ date: '2024-01-01', count: 50 }]
// }
```

### **Détection d'Activité Suspecte**

```typescript
// Détecter les activités suspectes
const suspicious = await detectSuspiciousActivity(tenantId);

if (suspicious.suspiciousLogins > 5) {
  // Alerter l'administrateur
}
```

## 🛠️ Scripts Utilitaires

### **Migration des Données**

```bash
# Initialiser les fonctionnalités par défaut
npx tsx scripts/migrate-multitenant.ts

# Nettoyer les anciens logs d'audit
npx tsx scripts/cleanup-audit-logs.ts
```

### **Gestion des Tenants**

```typescript
// Créer un nouveau tenant
const tenant = await createTenant({
  name: "Nouvelle Entreprise",
  slug: "nouvelle-entreprise",
  domain: "entreprise.com",
  plan: "PROFESSIONAL",
});

// Mettre à jour les paramètres
await updateTenantSettings(tenant.id, {
  branding: {
    primaryColor: "#ff0000",
    logo: "https://example.com/logo.png",
  },
});
```

## 🔍 Débogage et Monitoring

### **Logs de Débogage**

```typescript
// Activer les logs détaillés
process.env.DEBUG = "tenant:*";

// Vérifier la résolution de tenant
const { tenant, method } = await resolveTenant(request);
console.log(`Tenant résolu: ${tenant?.name} via ${method}`);
```

### **Monitoring des Performances**

```typescript
// Mesurer les performances des requêtes
const start = Date.now();
const bookings = await prisma.booking.findMany();
const duration = Date.now() - start;
console.log(`Requête exécutée en ${duration}ms`);
```

## 🚨 Bonnes Pratiques

### **Sécurité**

- ✅ Toujours utiliser les middlewares de sécurité
- ✅ Valider les données d'entrée avec Zod
- ✅ Logger toutes les actions sensibles
- ✅ Implémenter la limitation de taux

### **Performance**

- ✅ Utiliser les index sur `orgId`
- ✅ Implémenter la mise en cache par tenant
- ✅ Nettoyer régulièrement les anciens logs
- ✅ Optimiser les requêtes avec `select`

### **Maintenance**

- ✅ Tester l'isolation des données
- ✅ Surveiller les activités suspectes
- ✅ Sauvegarder régulièrement les données
- ✅ Documenter les changements de schéma

## 📚 API Reference

### **Endpoints Multi-Tenant**

- `GET /api/tenant/current` - Récupérer le tenant actuel
- `GET /api/tenant/features` - Lister les fonctionnalités
- `POST /api/tenant/features` - Activer/désactiver une fonctionnalité
- `GET /api/tenant/audit-logs` - Récupérer les logs d'audit
- `GET /api/tenant/activity-report` - Générer un rapport d'activité
- `GET /api/tenant/security-alerts` - Détecter les activités suspectes

### **Headers Requis**

- `x-tenant-id` - ID du tenant (ajouté automatiquement par le middleware)
- `x-user-id` - ID de l'utilisateur (pour les vérifications de rôle)

## 🆘 Support et Dépannage

### **Problèmes Courants**

1. **Tenant non trouvé**
   - Vérifier la configuration DNS
   - Vérifier les headers de la requête
   - Consulter les logs du middleware

2. **Accès refusé**
   - Vérifier les permissions utilisateur
   - Vérifier l'activation des fonctionnalités
   - Consulter les logs d'audit

3. **Données mélangées**
   - Vérifier l'isolation Prisma
   - Vérifier les filtres automatiques
   - Consulter les logs de sécurité

### **Contact Support**

Pour toute question ou problème, consultez les logs d'audit et contactez l'équipe de développement.
