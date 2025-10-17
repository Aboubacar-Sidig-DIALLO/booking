# Réservation de salles – Monorepo Front/Back (Next.js)

## Lancer en local

1. `npm i`
2. Configurer `.env` (voir `.env.example` et `README_API.md`)
3. Prisma: `npm run prisma:generate` puis `npm run prisma:migrate`
4. `npm run dev`

## Environnement requis

- Voir `README_API.md` pour la liste complète.
- DB: Neon PostgreSQL (sslmode=require)
- Realtime: Upstash Redis (REST pour SSE) et optionnel Redis standard pour Socket.IO adapter

## PWA

- `next-pwa` actif en prod (désactivé en dev)
- `public/manifest.json` + icônes `public/icons/*`
- Offline lecture & file d’attente mutations: à compléter (Workbox)

## Qualité & Tests

- ESLint, Prettier, Husky (pre-commit)
- Vitest: `npm run test`
- E2E (Playwright): à ajouter

## Observabilité

- Santé: `GET /api/health`
- Logs: à intégrer avec Pino (JSON) et transport (optionnel)
- Metrics: endpoint Prometheus (optionnel)

## Documentation API

Voir `README_API.md` (endpoints, realtime, RBAC, scripts).
