import { Role } from "@prisma/client";

export type Permission =
  | "rooms:create"
  | "rooms:update"
  | "rooms:delete"
  | "bookings:create"
  | "bookings:update"
  | "bookings:delete"
  | "features:crud"
  | "sites:crud"
  | "users:manage";

const ROLE_PERMS: Record<Role, Set<Permission>> = {
  ADMIN: new Set([
    "rooms:create",
    "rooms:update",
    "rooms:delete",
    "features:crud",
    "sites:crud",
    "users:manage",
    "bookings:create",
    "bookings:update",
    "bookings:delete",
  ]),
  MANAGER: new Set([
    "rooms:create",
    "rooms:update",
    "features:crud",
    "sites:crud",
    "bookings:create",
    "bookings:update",
  ]),
  EMPLOYEE: new Set(["bookings:create", "bookings:update"]),
  VIEWER: new Set([]),
};

export function assertCan(role: Role, permission: Permission) {
  if (!ROLE_PERMS[role]?.has(permission)) {
    const err = new Error("Forbidden");
    // @ts-expect-error add status
    err.status = 403;
    throw err;
  }
}
