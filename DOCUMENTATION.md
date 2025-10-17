## Réservation de salles – Documentation d’implémentation (phase 1)

### Vue d’ensemble

Cette première passe met en place la stack Frontend Next.js (App Router, TypeScript strict), les providers globaux, la structure de dossiers, la PWA, ainsi que la configuration qualité (ESLint/Prettier/Husky). Des pages App Router “placeholder” sont créées pour les écrans clés.

### Stack installée

- Next.js 15 (App Router) + React 19 + TypeScript strict
- UI & UX: Tailwind CSS v4, Radix primitives, framer-motion, lucide-react, sonner (toasts)
- Data: TanStack Query 5, Axios
- Forms & validations: React Hook Form 7, Zod
- Auth client: next-auth (v4) (providers/UX prêts côté client)
- i18n: next-intl (locale par défaut: fr)
- Dates: date-fns
- Temps réel: socket.io-client (fallback SSE prévu)
- Graphiques: Recharts (pour Rapports)
- PWA: next-pwa + manifest
- Qualité: ESLint, Prettier, Husky (+ lint-staged)

### Scripts npm

- `npm run dev`: démarrer le serveur de dev (Turbopack)
- `npm run build`: build de production (Turbopack)
- `npm start`: démarrer en production
- `npm run lint`: exécuter ESLint
- `npm run prepare`: hook Husky (auto via npm)

### Providers globaux

Fichier: `src/app/providers.tsx`

- `SessionProvider` (next-auth) – prépare la gestion de session côté client
- `QueryClientProvider` (TanStack Query) – cache/fetching client
- `Toaster` (sonner) – notifications globales
  Injecté dans `src/app/layout.tsx` pour envelopper toute l’app.

### Fichiers et répertoires ajoutés/modifiés

Modifications

- `next.config.ts`: activation PWA (next-pwa), options d’images/expérimental
- `src/app/layout.tsx`: langue `fr`, branchement des providers globaux
- `src/app/page.tsx`: page d’accueil simplifiée FR
- `src/app/globals.css`: fonte par défaut sur variables Geist, thème light/dark
- `package.json`: dépendances, scripts lint/prepare, lint-staged
- `.husky/pre-commit`: hook pre-commit (format/lint)

Ajouts

- PWA: `public/manifest.json`
- Providers: `src/app/providers.tsx`
- Libs:
  - `src/lib/api.ts` (Axios préconfiguré `/api`)
  - `src/lib/zod.ts` (schéma `bookingSchema` de base)
  - `src/lib/utils.ts` (utilitaire `cn` clsx + tailwind-merge)
  - `src/lib/i18n.ts` (next-intl, locale fr)
  - `src/lib/auth-client.ts` (helpers next-auth côté client)
- i18n: `messages/fr.json` (exemples de clés UI)
- Hooks:
  - `src/hooks/useRealtime.ts` (socket.io-client; évènements WS définis)
  - `src/hooks/useQRScanner.ts` (squelette capture vidéo, prêt pour décodeur QR)
  - `src/hooks/useDebounce.ts`
- Routes App Router (placeholders):
  - `app/(auth)/login/page.tsx`
  - `app/(dashboard)/rooms/page.tsx`
  - `app/(dashboard)/rooms/[roomId]/page.tsx`
  - `app/(dashboard)/bookings/new/page.tsx`
  - `app/(dashboard)/bookings/[id]/page.tsx`
  - `app/(dashboard)/my-bookings/page.tsx`
  - `app/(dashboard)/favorites/page.tsx`
  - `app/(dashboard)/reports/page.tsx`
  - `app/(dashboard)/wallboard/page.tsx`
- Qualité: `.eslintrc.json`, `.prettierrc`

### Accessibilité (A11y)

- Base Tailwind + structures sémantiques. Les composants clés (Timeline, Wizard, Picker, GlobalSearch, Chat) seront implémentés avec rôles/labels ARIA (ex: `role="grid"` pour Timeline) lors des prochaines étapes.

### Internationalisation (next-intl)

- Locale par défaut: `fr`. Les messages d’exemple sont dans `messages/fr.json`.
- `src/lib/i18n.ts` exposera la config serveur à brancher dans les segments App Router selon le pattern next-intl (ajout à venir lors de l’implémentation i18n complète multi-locales).

### PWA

- `next-pwa` activé (désactivé en dev), SW généré dans `public`.
- `public/manifest.json` avec icônes à fournir dans `public/icons/` (192/512px).
- Offline lecture et file d’attente de mutations seront ajoutées dans une passe dédiée (Workbox background sync, caches d’API et IndexedDB).

### Temps réel

- `src/hooks/useRealtime.ts` configure un client Socket.IO (`/api/realtime/socket`).
- Fallback SSE prévu via endpoint `/api/realtime/sse` (côté serveur à ajouter).
- Événements normalisés: `booking.created|updated|cancelled`, `chat.message`, `checkin.updated`.

### Qualité & Git Hooks

- ESLint + Prettier configurés.
- Husky initialisé, hook `pre-commit` exécute `lint-staged` (format) puis `npm run lint` en fallback.

### Arborescence cible (extrait)

```
app/
 ├─ (auth)/login/page.tsx
 ├─ (dashboard)/rooms/page.tsx
 ├─ (dashboard)/rooms/[roomId]/page.tsx
 ├─ (dashboard)/bookings/new/page.tsx
 ├─ (dashboard)/bookings/[id]/page.tsx
 ├─ (dashboard)/my-bookings/page.tsx
 ├─ (dashboard)/favorites/page.tsx
 ├─ (dashboard)/reports/page.tsx
 ├─ (dashboard)/wallboard/page.tsx
 ├─ layout.tsx
 ├─ providers.tsx
 └─ globals.css
components/
 ├─ ui/*
 ├─ rooms/*
 ├─ booking/*
 ├─ chat/*
 ├─ analytics/*
 ├─ widgets/*
 └─ common/*
hooks/
 ├─ useRealtime.ts
 ├─ useQRScanner.ts
 └─ useDebounce.ts
lib/
 ├─ api.ts
 ├─ zod.ts
 ├─ utils.ts
 ├─ i18n.ts
 └─ auth-client.ts
```

### Démarrage

1. Installer les dépendances: `npm i`
2. Lancer en dev: `npm run dev`
3. Ouvrir `http://localhost:3000`

### Contrats API consommés (à implémenter côté backend)

- GET `/api/rooms?capacity=&features=&siteId=&floor=&q=&from=&to=`
- GET `/api/rooms/:id`
- GET `/api/rooms/:id/availability?from=&to=`
- POST `/api/bookings`
- GET `/api/bookings/:id` ; PATCH `/api/bookings/:id` ; DELETE `/api/bookings/:id`
- GET `/api/bookings?mine=1`
- POST `/api/bookings/:id/checkin`
- GET `/api/bookings/:id/ics`
- GET `/api/features`
- GET `/api/sites`
- POST `/api/bookings/recommend`
- WS events: `booking.created|updated|cancelled`, `chat.message`, `checkin.updated`
- SSE fallback: `/api/realtime/sse`

### Prochaines étapes recommandées

1. Générer les composants UI Shadcn (Button, Input, Badge, Dialog, Tooltip, etc.) et le thème (clair/sombre).
2. Implémenter `AvailabilityTimeline` (a11y, drag-select, zoom, pilements, tooltips, skeletons) et ses tests (Vitest/RTL).
3. Construire `BookingWizard` (RHF + Zod, validations de créneau, participants/roles, confidentialité, récurrence RRULE, optimistic + confirmation WS).
4. GlobalSearch (Ctrl+K) + suggestions; FavoritesGrid; Wallboard auto-refresh.
5. NextAuth: config serveurs (providers, callbacks, rôles UI) + protections serveurs/clients.
6. PWA offline: caches de lecture (salles vues, mes bookings), file d’attente mutations + retry.
7. Tests E2E Playwright (scénario de bout en bout + rafraîchissement WS) et Lighthouse ≥ 90.
