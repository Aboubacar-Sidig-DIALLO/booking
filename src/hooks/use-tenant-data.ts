"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTenant } from "@/contexts/tenant-context";
import { Booking, Room, Site, User } from "@prisma/client";

// Hook pour récupérer les réservations du tenant
export function useTenantBookings(options?: {
  startDate?: Date;
  endDate?: Date;
  status?: string;
  roomId?: string;
}) {
  const { tenant } = useTenant();

  return useQuery({
    queryKey: ["bookings", tenant?.id, options],
    queryFn: async () => {
      if (!tenant) throw new Error("Tenant non trouvé");

      const params = new URLSearchParams();
      if (options?.startDate)
        params.append("startDate", options.startDate.toISOString());
      if (options?.endDate)
        params.append("endDate", options.endDate.toISOString());
      if (options?.status) params.append("status", options.status);
      if (options?.roomId) params.append("roomId", options.roomId);

      const response = await fetch(`/api/bookings?${params.toString()}`, {
        headers: {
          "x-tenant-id": tenant.id,
        },
      });

      if (!response.ok)
        throw new Error("Erreur lors de la récupération des réservations");
      return response.json() as Promise<Booking[]>;
    },
    enabled: !!tenant,
  });
}

// Hook pour récupérer les salles du tenant
export function useTenantRooms(siteId?: string) {
  const { tenant } = useTenant();

  return useQuery({
    queryKey: ["rooms", tenant?.id, siteId],
    queryFn: async () => {
      if (!tenant) throw new Error("Tenant non trouvé");

      const params = new URLSearchParams();
      if (siteId) params.append("siteId", siteId);

      const response = await fetch(`/api/rooms?${params.toString()}`, {
        headers: {
          "x-tenant-id": tenant.id,
        },
      });

      if (!response.ok)
        throw new Error("Erreur lors de la récupération des salles");
      return response.json() as Promise<Room[]>;
    },
    enabled: !!tenant,
  });
}

// Hook pour récupérer les sites du tenant
export function useTenantSites() {
  const { tenant } = useTenant();

  return useQuery({
    queryKey: ["sites", tenant?.id],
    queryFn: async () => {
      if (!tenant) throw new Error("Tenant non trouvé");

      const response = await fetch("/api/sites", {
        headers: {
          "x-tenant-id": tenant.id,
        },
      });

      if (!response.ok)
        throw new Error("Erreur lors de la récupération des sites");
      return response.json() as Promise<Site[]>;
    },
    enabled: !!tenant,
  });
}

// Hook pour récupérer les utilisateurs du tenant
export function useTenantUsers() {
  const { tenant } = useTenant();

  return useQuery({
    queryKey: ["users", tenant?.id],
    queryFn: async () => {
      if (!tenant) throw new Error("Tenant non trouvé");

      const response = await fetch("/api/users", {
        headers: {
          "x-tenant-id": tenant.id,
        },
      });

      if (!response.ok)
        throw new Error("Erreur lors de la récupération des utilisateurs");
      return response.json() as Promise<User[]>;
    },
    enabled: !!tenant,
  });
}

// Hook pour créer une réservation
export function useCreateBooking() {
  const { tenant } = useTenant();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookingData: {
      roomId: string;
      title: string;
      description?: string;
      start: Date;
      end: Date;
      participants?: string[];
    }) => {
      if (!tenant) throw new Error("Tenant non trouvé");

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-tenant-id": tenant.id,
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok)
        throw new Error("Erreur lors de la création de la réservation");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings", tenant?.id] });
    },
  });
}

// Hook pour mettre à jour une réservation
export function useUpdateBooking() {
  const { tenant } = useTenant();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...updateData
    }: { id: string } & Partial<Booking>) => {
      if (!tenant) throw new Error("Tenant non trouvé");

      const response = await fetch(`/api/bookings/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-tenant-id": tenant.id,
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok)
        throw new Error("Erreur lors de la mise à jour de la réservation");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings", tenant?.id] });
    },
  });
}

// Hook pour supprimer une réservation
export function useDeleteBooking() {
  const { tenant } = useTenant();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookingId: string) => {
      if (!tenant) throw new Error("Tenant non trouvé");

      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: "DELETE",
        headers: {
          "x-tenant-id": tenant.id,
        },
      });

      if (!response.ok)
        throw new Error("Erreur lors de la suppression de la réservation");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings", tenant?.id] });
    },
  });
}

// Hook pour créer une salle
export function useCreateRoom() {
  const { tenant } = useTenant();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (roomData: {
      siteId: string;
      name: string;
      capacity: number;
      location?: string;
      floor?: number;
      description?: string;
      features?: string[];
    }) => {
      if (!tenant) throw new Error("Tenant non trouvé");

      const response = await fetch("/api/rooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-tenant-id": tenant.id,
        },
        body: JSON.stringify(roomData),
      });

      if (!response.ok)
        throw new Error("Erreur lors de la création de la salle");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms", tenant?.id] });
    },
  });
}

// Hook pour créer un site
export function useCreateSite() {
  const { tenant } = useTenant();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (siteData: { name: string }) => {
      if (!tenant) throw new Error("Tenant non trouvé");

      const response = await fetch("/api/sites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-tenant-id": tenant.id,
        },
        body: JSON.stringify(siteData),
      });

      if (!response.ok) throw new Error("Erreur lors de la création du site");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sites", tenant?.id] });
    },
  });
}

// Hook pour récupérer les statistiques du tenant
export function useTenantStats() {
  const { tenant } = useTenant();

  return useQuery({
    queryKey: ["stats", tenant?.id],
    queryFn: async () => {
      if (!tenant) throw new Error("Tenant non trouvé");

      const response = await fetch("/api/reports/stats", {
        headers: {
          "x-tenant-id": tenant.id,
        },
      });

      if (!response.ok)
        throw new Error("Erreur lors de la récupération des statistiques");
      return response.json();
    },
    enabled: !!tenant,
  });
}

// Hook pour récupérer les notifications du tenant
export function useTenantNotifications() {
  const { tenant } = useTenant();

  return useQuery({
    queryKey: ["notifications", tenant?.id],
    queryFn: async () => {
      if (!tenant) throw new Error("Tenant non trouvé");

      const response = await fetch("/api/notifications", {
        headers: {
          "x-tenant-id": tenant.id,
        },
      });

      if (!response.ok)
        throw new Error("Erreur lors de la récupération des notifications");
      return response.json();
    },
    enabled: !!tenant,
    refetchInterval: 30000, // Rafraîchir toutes les 30 secondes
  });
}

// Hook pour marquer une notification comme lue
export function useMarkNotificationAsRead() {
  const { tenant } = useTenant();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      if (!tenant) throw new Error("Tenant non trouvé");

      const response = await fetch(
        `/api/notifications/${notificationId}/read`,
        {
          method: "PATCH",
          headers: {
            "x-tenant-id": tenant.id,
          },
        }
      );

      if (!response.ok)
        throw new Error("Erreur lors de la mise à jour de la notification");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notifications", tenant?.id],
      });
    },
  });
}
