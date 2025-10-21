# Configuration pour le développement multi-tenant

## Domaines de développement

Pour tester le multi-tenancy en local, ajoutez ces entrées à votre fichier hosts :

```
127.0.0.1 demo.localhost
127.0.0.1 entreprise1.localhost
127.0.0.1 entreprise2.localhost
127.0.0.1 app.localhost
```

## URLs de test

- **Application principale** : http://localhost:3000
- **Tenant Demo** : http://demo.localhost:3000
- **Tenant Entreprise1** : http://entreprise1.localhost:3000
- **Tenant Entreprise2** : http://entreprise2.localhost:3000

## Comptes de test

### Tenant Demo

- **URL** : http://demo.localhost:3000
- **Email** : admin@demo.com
- **Plan** : PROFESSIONAL
- **Fonctionnalités** : Analytics, Réservations récurrentes, Multi-sites

### Création de nouveaux tenants

Vous pouvez créer de nouveaux tenants via l'API :

```bash
curl -X POST http://localhost:3000/api/tenant \
  -H "Content-Type: application/json" \
  -H "x-tenant-id: [admin-tenant-id]" \
  -d '{
    "name": "Nouvelle Entreprise",
    "slug": "nouvelle-entreprise",
    "domain": "nouvelle-entreprise.localhost",
    "plan": "STARTER"
  }'
```

## Variables d'environnement

```env
# Base de données
DATABASE_URL="postgresql://..."

# URLs de l'application
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_TENANT_DOMAIN="localhost"

# Pour la production
# NEXT_PUBLIC_APP_URL="https://votreapp.com"
# NEXT_PUBLIC_TENANT_DOMAIN="votreapp.com"
```

## Scripts utiles

```bash
# Générer le client Prisma
npm run prisma:generate

# Appliquer les migrations
npm run prisma:migrate

# Initialiser les données de démonstration
npx tsx scripts/migrate-multitenant.ts

# Nettoyer les logs d'audit
npx tsx scripts/cleanup-audit-logs.ts

# Démarrer l'application
npm run dev
```
