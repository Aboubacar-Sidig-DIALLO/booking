# API & Intégration

## Environnement

- `DATABASE_URL` (Neon, sslmode=require)
- `NEXTAUTH_SECRET`
- `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` (SSE Pub/Sub)
- `REDIS_STANDARD_URL` (Socket.IO adapter multi-instance, optionnel)
- `EMAIL_SERVER`, `EMAIL_FROM` (Nodemailer, optionnel)

## Scripts

- `npm run dev` – serveur de dev
- `npm run prisma:generate` – client Prisma
- `npm run prisma:migrate` – migrations dev (Neon)
- `npm run test` – tests Vitest

## Endpoints principaux

- Rooms: `GET/POST /api/rooms`, `GET /api/rooms/[id]/availability`, `POST /api/rooms/[id]/images/sign`
- Bookings: `POST/GET /api/bookings`, `GET/PATCH/DELETE /api/bookings/[id]`, `GET /api/bookings/[id]/ics`, `POST /api/bookings/[id]/checkin`, `GET /api/bookings/conflicts`, `POST /api/bookings/recommend`
- Chat: `WS /api/realtime/socket` (rooms `booking:<id>`), `GET /api/chat/[bookingId]/messages`
- Realtime fallback: `GET /api/realtime/sse`
- Notifications: `GET /api/notifications`, `PATCH /api/notifications/[id]`, `POST /api/notifications`
- Reports: `GET /api/reports/usage`, `GET /api/reports/occupancy`, `GET /api/reports/top-features`, `GET /api/reports/export/pdf`
- Health: `GET /api/health`

## Realtime

- WS (Socket.IO):
  - `join` → `booking:<id>`
  - `chat.send` → persiste message + `chat.message` dans la room
- SSE (Upstash Redis):
  - canal `events` → `booking.created|updated|cancelled`, `checkin.updated`, `notification.created|read`, `chat.message` (payload concis)

## RBAC & Auth

- NextAuth JWT; session contient `user.id`, `user.role`, `user.orgId`.
- `assertCan(role, permission)` protège les mutations.
- Chat: lecture & envoi réservés aux participants.

## Tests (à venir)

- Zod schemas (unit)
- Bookings API (create/update/conflict)
- Chat (messages + WS emit)
- Notifications + SSE bridge
