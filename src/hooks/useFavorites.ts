"use client";

import { useState, useEffect, useCallback } from "react";

export function useFavorites() {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  // Charger les favoris depuis l'API au montage
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const res = await fetch("/api/favorites");
        if (res.ok) {
          const data = await res.json();
          const roomIds = data.roomIds || [];
          setFavorites(new Set(roomIds));
        } else if (res.status === 401) {
          // Utilisateur non connecté, pas de favoris
          setFavorites(new Set());
        } else {
          console.error("Error loading favorites:", res.statusText);
        }
      } catch (error) {
        console.error("Error loading favorites:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, []);

  // Vérifier si une salle est favorite
  const isFavorite = useCallback(
    (roomId: string | number) => {
      return favorites.has(String(roomId));
    },
    [favorites]
  );

  // Ajouter un favori
  const addFavorite = useCallback(async (roomId: string | number) => {
    const roomIdString = String(roomId);

    // Mise à jour optimiste
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      newFavorites.add(roomIdString);
      return newFavorites;
    });

    try {
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ roomId: roomIdString }),
      });

      if (!res.ok) {
        // Revenir en arrière en cas d'erreur
        setFavorites((prev) => {
          const newFavorites = new Set(prev);
          newFavorites.delete(roomIdString);
          return newFavorites;
        });

        if (res.status === 401) {
          console.error("User not authenticated");
        } else {
          const error = await res.json();
          console.error("Error adding favorite:", error);
        }
      }
    } catch (error) {
      // Revenir en arrière en cas d'erreur
      setFavorites((prev) => {
        const newFavorites = new Set(prev);
        newFavorites.delete(roomIdString);
        return newFavorites;
      });
      console.error("Error adding favorite:", error);
    }
  }, []);

  // Retirer un favori
  const removeFavorite = useCallback(async (roomId: string | number) => {
    const roomIdString = String(roomId);

    // Mise à jour optimiste
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      newFavorites.delete(roomIdString);
      return newFavorites;
    });

    try {
      const res = await fetch(`/api/favorites?roomId=${roomIdString}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        // Revenir en arrière en cas d'erreur
        setFavorites((prev) => {
          const newFavorites = new Set(prev);
          newFavorites.add(roomIdString);
          return newFavorites;
        });

        if (res.status === 401) {
          console.error("User not authenticated");
        } else {
          const error = await res.json();
          console.error("Error removing favorite:", error);
        }
      }
    } catch (error) {
      // Revenir en arrière en cas d'erreur
      setFavorites((prev) => {
        const newFavorites = new Set(prev);
        newFavorites.add(roomIdString);
        return newFavorites;
      });
      console.error("Error removing favorite:", error);
    }
  }, []);

  // Ajouter ou retirer un favori
  const toggleFavorite = useCallback(
    async (roomId: string | number) => {
      const roomIdString = String(roomId);

      if (favorites.has(roomIdString)) {
        await removeFavorite(roomId);
      } else {
        await addFavorite(roomId);
      }
    },
    [favorites, addFavorite, removeFavorite]
  );

  // Obtenir tous les favoris
  const getFavorites = useCallback(() => {
    return Array.from(favorites).map((id) => id);
  }, [favorites]);

  // Compter les favoris
  const favoritesCount = favorites.size;

  return {
    isFavorite,
    toggleFavorite,
    getFavorites,
    favoritesCount,
    loading,
  };
}
