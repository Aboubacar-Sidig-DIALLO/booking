"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// ============= TYPES =============
interface Stats {
  totalRooms: number;
  activeRooms: number;
  maintenanceRooms: number;
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  pendingUsers: number;
  activeBookings: number;
}

interface Room {
  id: string;
  name: string;
  capacity: number;
  status: string;
  location?: string;
  description?: string;
  equipment?: string[];
  features?: string[];
  isOccupied: boolean;
  isMaintenance: boolean;
  currentBooking?: any;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  department?: string;
  phone?: string;
  location?: string;
  notes?: string;
}

interface Equipment {
  id: string;
  name: string;
  description?: string | null;
  icon?: string | null;
  howToUse?: string | null;
  isActive: boolean;
  isEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ============= STATISTIQUES =============
export function useAdminStats() {
  return useQuery<Stats>({
    queryKey: ["admin", "stats"],
    queryFn: async () => {
      const response = await fetch("/api/admin/stats");
      if (!response.ok)
        throw new Error("Erreur lors du chargement des statistiques");
      return response.json();
    },
    staleTime: 30000, // Cache de 30 secondes
  });
}

// ============= SALLES =============
export function useAdminRooms() {
  return useQuery<Room[]>({
    queryKey: ["admin", "rooms"],
    queryFn: async () => {
      const response = await fetch("/api/admin/rooms/status");
      if (!response.ok) throw new Error("Erreur lors du chargement des salles");
      return response.json();
    },
    staleTime: 30000,
  });
}

// Mutation pour créer une salle
export function useCreateRoom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/admin/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          error.details || error.error || "Erreur lors de la création"
        );
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "rooms"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
      toast.success("Salle créée avec succès");
    },
    onError: (error: any) => {
      toast.error(error.message || "Erreur lors de la création");
    },
  });
}

// Mutation pour modifier une salle
export function useUpdateRoom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: any) => {
      const response = await fetch("/api/admin/rooms", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...data }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          error.details || error.error || "Erreur lors de la modification"
        );
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "rooms"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
      toast.success("Salle modifiée avec succès");
    },
    onError: (error: any) => {
      toast.error(error.message || "Erreur lors de la modification");
    },
  });
}

// Mutation pour supprimer une salle
export function useDeleteRoom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/rooms?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          error.details || error.error || "Erreur lors de la suppression"
        );
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "rooms"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
      toast.success("Salle supprimée avec succès");
    },
    onError: (error: any) => {
      toast.error(error.message || "Erreur lors de la suppression");
    },
  });
}

// ============= UTILISATEURS =============
export function useAdminUsers() {
  return useQuery<User[]>({
    queryKey: ["admin", "users"],
    queryFn: async () => {
      const response = await fetch("/api/admin/users");
      if (!response.ok)
        throw new Error("Erreur lors du chargement des utilisateurs");
      return response.json();
    },
    staleTime: 30000,
  });
}

// Mutation pour créer un utilisateur
export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erreur lors de la création");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
      toast.success("Utilisateur créé avec succès");
    },
    onError: (error: any) => {
      toast.error(error.message || "Erreur lors de la création");
    },
  });
}

// Mutation pour modifier un utilisateur
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: any) => {
      const response = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...data }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erreur lors de la modification");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
      toast.success("Utilisateur modifié avec succès");
    },
    onError: (error: any) => {
      toast.error(error.message || "Erreur lors de la modification");
    },
  });
}

// Mutation pour supprimer un utilisateur
export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/users?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erreur lors de la suppression");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
      toast.success("Utilisateur supprimé avec succès");
    },
    onError: (error: any) => {
      toast.error(error.message || "Erreur lors de la suppression");
    },
  });
}

// ============= ÉQUIPEMENTS =============
export function useAdminEquipment() {
  return useQuery<Equipment[]>({
    queryKey: ["admin", "equipment"],
    queryFn: async () => {
      const response = await fetch("/api/admin/equipment");
      if (!response.ok)
        throw new Error("Erreur lors du chargement des équipements");
      return response.json();
    },
    staleTime: 30000,
  });
}

// Mutation pour créer un équipement
export function useCreateEquipment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { name: string; description?: string }) => {
      const response = await fetch("/api/admin/equipment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erreur lors de la création");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "equipment"] });
      toast.success("Équipement créé avec succès");
    },
    onError: (error: any) => {
      toast.error(error.message || "Erreur lors de la création");
    },
  });
}

// Mutation pour modifier un équipement
export function useUpdateEquipment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: any) => {
      const response = await fetch("/api/admin/equipment", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...data }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erreur lors de la modification");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "equipment"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "rooms"] });
      toast.success("Équipement modifié avec succès");
    },
    onError: (error: any) => {
      toast.error(error.message || "Erreur lors de la modification");
    },
  });
}

// Mutation pour supprimer un équipement
export function useDeleteEquipment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/equipment?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erreur lors de la suppression");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "equipment"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "rooms"] });
      toast.success("Équipement supprimé avec succès");
    },
    onError: (error: any) => {
      toast.error(error.message || "Erreur lors de la suppression");
    },
  });
}

// Mutation pour activer/désactiver un équipement (global - ROI uniquement)
export function useToggleEquipment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/equipment/${id}/toggle`, {
        method: "PATCH",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erreur lors du changement de statut");
      }

      return response.json();
    },
    onSuccess: (data: Equipment) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "equipment"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "rooms"] });
      toast.success(
        `Équipement ${data.isActive ? "activé" : "désactivé"} avec succès`
      );
    },
    onError: (error: any) => {
      toast.error(error.message || "Erreur lors du changement de statut");
    },
  });
}

// Mutation pour activer/désactiver un équipement pour l'organisation
export function useToggleEquipmentOrg() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/equipment/${id}/toggle-org`, {
        method: "PATCH",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erreur lors du changement de statut");
      }

      const data = await response.json();
      return data;
    },
    onSuccess: () => {
      // Invalider les queries pour recharger les équipements et les salles
      queryClient.invalidateQueries({ queryKey: ["admin", "equipment"] });
      queryClient.invalidateQueries({
        queryKey: ["admin", "equipment", "active"],
      });
      queryClient.invalidateQueries({ queryKey: ["admin", "rooms"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Erreur lors du changement de statut");
    },
  });
}

// Mutation pour mettre une salle en maintenance
export function useMaintenanceRoom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/admin/rooms/maintenance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erreur lors de la mise en maintenance");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "rooms"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
      toast.success("Salle mise en maintenance");
    },
    onError: (error: any) => {
      toast.error(error.message || "Erreur lors de la mise en maintenance");
    },
  });
}

// Mutation pour annuler une maintenance
export function useCancelMaintenance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (roomId: string) => {
      const response = await fetch(
        `/api/admin/rooms/maintenance?roomId=${roomId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          error.error || "Erreur lors de l'annulation de la maintenance"
        );
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "rooms"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
      toast.success("Maintenance annulée");
    },
    onError: (error: any) => {
      toast.error(
        error.message || "Erreur lors de l'annulation de la maintenance"
      );
    },
  });
}

// ============= RÉSERVATIONS =============
interface Booking {
  id: string;
  roomId: string;
  title: string;
  description?: string;
  start: string;
  end: string;
  privacy: string;
  status: string;
  createdAt: string;
  room: {
    id: string;
    name: string;
    capacity: number;
    location?: string;
    floor?: number;
  };
  createdBy: {
    id: string;
    name: string;
    email: string;
  };
  participants: Array<{
    user: {
      id: string;
      name: string;
      email: string;
    };
    role: string;
  }>;
}

export function useAdminBookings(status?: string) {
  return useQuery<Booking[]>({
    queryKey: ["admin", "bookings", status],
    queryFn: async () => {
      const url = status
        ? `/api/admin/bookings?status=${status}`
        : "/api/admin/bookings";
      const response = await fetch(url);
      if (!response.ok)
        throw new Error("Erreur lors du chargement des réservations");
      return response.json();
    },
    staleTime: 30000,
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/admin/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          error.details || error.error || "Erreur lors de la création"
        );
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "bookings"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
      toast.success("Réservation créée avec succès");
    },
    onError: (error: any) => {
      toast.error(error.message || "Erreur lors de la création");
    },
  });
}

export function useCancelBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/bookings/${id}/cancel`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          error.details || error.error || "Erreur lors de l'annulation"
        );
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "bookings"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
      toast.success("Réservation annulée avec succès");
    },
    onError: (error: any) => {
      toast.error(error.message || "Erreur lors de l'annulation");
    },
  });
}

export function useBooking(id: string) {
  return useQuery<Booking>({
    queryKey: ["admin", "bookings", id],
    queryFn: async () => {
      const response = await fetch(`/api/admin/bookings/${id}`);
      if (!response.ok)
        throw new Error("Erreur lors du chargement de la réservation");
      return response.json();
    },
    enabled: !!id,
  });
}

export function useUpdateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: any) => {
      const response = await fetch(`/api/admin/bookings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          error.details || error.error || "Erreur lors de la modification"
        );
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "bookings"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
      toast.success("Réservation modifiée avec succès");
    },
    onError: (error: any) => {
      toast.error(error.message || "Erreur lors de la modification");
    },
  });
}
