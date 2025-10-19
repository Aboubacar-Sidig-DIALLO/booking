"use client";

import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useDebounce } from "@/hooks/useDebounce";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { useState as useReactState } from "react";
import {
  Search,
  Users,
  UserPlus,
  X,
  RotateCcw,
  Crown,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

export type ParticipantRole = "host" | "required" | "optional";
export type Participant = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: ParticipantRole;
};

// Composant Tooltip moderne
const ModernTooltip = ({
  children,
  content,
  side = "top",
}: {
  children: React.ReactNode;
  content: string;
  side?: "top" | "bottom" | "left" | "right";
}) => {
  const [isVisible, setIsVisible] = useReactState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: side === "top" ? 10 : -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: side === "top" ? 10 : -10 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={`absolute z-50 px-3 py-2 text-xs font-medium text-white bg-slate-900 rounded-lg shadow-lg whitespace-nowrap ${
              side === "top"
                ? "bottom-full mb-2 left-1/2 transform -translate-x-1/2"
                : side === "bottom"
                  ? "top-full mt-2 left-1/2 transform -translate-x-1/2"
                  : side === "left"
                    ? "right-full mr-2 top-1/2 transform -translate-y-1/2"
                    : "left-full ml-2 top-1/2 transform -translate-y-1/2"
            }`}
          >
            {content}
            <div
              className={`absolute w-2 h-2 bg-slate-900 transform rotate-45 ${
                side === "top"
                  ? "top-full left-1/2 -translate-x-1/2 -translate-y-1/2"
                  : side === "bottom"
                    ? "bottom-full left-1/2 -translate-x-1/2 translate-y-1/2"
                    : side === "left"
                      ? "left-full top-1/2 -translate-y-1/2 -translate-x-1/2"
                      : "right-full top-1/2 -translate-y-1/2 translate-x-1/2"
              }`}
            ></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function ParticipantsPicker({
  value,
  onChange,
  maxParticipants,
}: {
  value: Participant[];
  onChange: (v: Participant[]) => void;
  maxParticipants?: number;
}) {
  const { data: session } = useSession();
  const [query, setQuery] = useState("");
  const q = useDebounce(query, 300);
  const [results, setResults] = useState<Participant[]>([]);
  const [showRemoveAlert, setShowRemoveAlert] = useState(false);
  const [userToRemove, setUserToRemove] = useState<Participant | null>(null);

  // Ajouter automatiquement l'utilisateur connecté au premier rendu
  useEffect(() => {
    // Vérifier si l'utilisateur est connecté et s'il n'y a pas encore de participants
    if (value.length === 0) {
      if (session?.user) {
        const currentUser: Participant = {
          id: session.user.id || "current-user",
          name:
            session.user.name ||
            session.user.email?.split("@")[0] ||
            "Utilisateur",
          email: session.user.email || "",
          role: "host",
        };
        onChange([currentUser]);
      } else {
        // Fallback: créer un utilisateur par défaut si pas de session
        const defaultUser: Participant = {
          id: "default-user",
          name: "Organisateur",
          email: "organisateur@example.com",
          role: "host",
        };
        onChange([defaultUser]);
      }
    }
  }, [session, value.length, onChange]);

  useEffect(() => {
    // Mock de recherche utilisateur
    const base = [
      { id: "u1", name: "Alice Martin", email: "alice@example.com" },
      { id: "u2", name: "Bob Dupont", email: "bob@example.com" },
      { id: "u3", name: "Chloé Bernard", email: "chloe@example.com" },
    ];
    const filtered = q
      ? base.filter((u) => u.name.toLowerCase().includes(q.toLowerCase()))
      : base;
    setResults(filtered.map((u) => ({ ...u, role: "required" as const })));
  }, [q]);

  const selectedIds = useMemo(() => new Set(value.map((p) => p.id)), [value]);
  const isQuotaReached = maxParticipants
    ? value.length >= maxParticipants
    : false;

  const isCurrentUser = (userId: string) => {
    return (
      session?.user?.id === userId ||
      (userId === "default-user" && !session?.user) ||
      (userId === "current-user" && session?.user)
    );
  };

  const add = (p: Participant) => {
    if (selectedIds.has(p.id) || isQuotaReached) return;
    onChange([...value, p]);
  };
  const remove = (id: string) => {
    const user = value.find((p) => p.id === id);
    const isCurrentUserFlag = isCurrentUser(id);

    if (isCurrentUserFlag && user) {
      setUserToRemove(user);
      setShowRemoveAlert(true);
    } else {
      onChange(value.filter((p) => p.id !== id));
    }
  };

  const confirmRemove = () => {
    if (userToRemove) {
      onChange(value.filter((p) => p.id !== userToRemove.id));
      setShowRemoveAlert(false);
      setUserToRemove(null);
    }
  };

  const cancelRemove = () => {
    setShowRemoveAlert(false);
    setUserToRemove(null);
  };
  const toggleRole = (id: string) =>
    onChange(
      value.map((p) =>
        p.id === id
          ? {
              ...p,
              role:
                p.role === "required"
                  ? "optional"
                  : p.role === "optional"
                    ? "host"
                    : "required",
            }
          : p
      )
    );

  const getRoleIcon = (role: ParticipantRole) => {
    switch (role) {
      case "host":
        return <Crown className="h-3 w-3 sm:h-4 sm:w-4" />;
      case "required":
        return <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />;
      case "optional":
        return <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4" />;
    }
  };

  const getRoleColor = (role: ParticipantRole) => {
    switch (role) {
      case "host":
        return "bg-gradient-to-r from-yellow-500 to-orange-500 text-white";
      case "required":
        return "bg-gradient-to-r from-red-500 to-pink-500 text-white";
      case "optional":
        return "bg-gradient-to-r from-green-500 to-emerald-500 text-white";
    }
  };

  const getRoleLabel = (role: ParticipantRole) => {
    switch (role) {
      case "host":
        return "Organisateur";
      case "required":
        return "Obligatoire";
      case "optional":
        return "Optionnel";
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Section de recherche */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
        </div>
        <Input
          placeholder="Rechercher des participants..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 h-10 sm:h-12 rounded-lg sm:rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
        />
      </div>

      {/* Participants sélectionnés */}
      {value.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3 sm:space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              <h3 className="text-sm sm:text-base font-semibold text-slate-700">
                Participants sélectionnés ({value.length})
              </h3>
            </div>

            {/* Indicateur de quota */}
            {maxParticipants && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <div
                    className={`w-2 h-2 rounded-full ${isQuotaReached ? "bg-green-500" : "bg-blue-500"}`}
                  ></div>
                  <span className="text-xs text-slate-500">
                    {value.length}/{maxParticipants}
                  </span>
                </div>
                {isQuotaReached && (
                  <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full">
                    <CheckCircle2 className="h-3 w-3" />
                    <span className="text-xs font-medium">Quota atteint</span>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <AnimatePresence>
              {value.map((p) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="group relative bg-white rounded-xl sm:rounded-2xl border border-slate-200 p-3 sm:p-4 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm sm:text-base font-medium text-slate-900 truncate">
                          {p.name}
                          {isCurrentUser(p.id) && (
                            <span className="ml-2 text-xs text-blue-600 font-medium">
                              (Vous)
                            </span>
                          )}
                        </h4>
                        <Badge
                          className={`${getRoleColor(p.role)} text-xs px-2 py-1 rounded-full flex items-center gap-1`}
                        >
                          {getRoleIcon(p.role)}
                          <span className="hidden sm:inline">
                            {getRoleLabel(p.role)}
                          </span>
                        </Badge>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-500 truncate">
                        {p.email}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 ml-2">
                      <ModernTooltip
                        content={
                          isCurrentUser(p.id)
                            ? "L'organisateur ne peut pas changer de rôle"
                            : "Changer le rôle"
                        }
                        side="top"
                      >
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => toggleRole(p.id)}
                          className={`h-6 w-6 sm:h-8 sm:w-8 p-0 ${
                            isCurrentUser(p.id)
                              ? "opacity-50 cursor-not-allowed"
                              : "hover:bg-blue-50 hover:text-blue-600"
                          }`}
                          aria-label="Changer rôle"
                          disabled={isCurrentUser(p.id)}
                        >
                          <RotateCcw className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                      </ModernTooltip>
                      <ModernTooltip
                        content={
                          isCurrentUser(p.id)
                            ? "⚠️ Supprimer l'organisateur (nécessite confirmation)"
                            : "Supprimer le participant"
                        }
                        side="top"
                      >
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => remove(p.id)}
                          className={`h-6 w-6 sm:h-8 sm:w-8 p-0 ${
                            isCurrentUser(p.id)
                              ? "hover:bg-amber-50 hover:text-amber-600 border border-amber-200"
                              : "hover:bg-red-50 hover:text-red-600"
                          }`}
                          aria-label={
                            isCurrentUser(p.id)
                              ? "Retirer (avec alerte)"
                              : "Retirer"
                          }
                        >
                          <X
                            className={`h-3 w-3 sm:h-4 sm:w-4 ${
                              isCurrentUser(p.id) ? "text-amber-600" : ""
                            }`}
                          />
                        </Button>
                      </ModernTooltip>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      )}

      {/* Résultats de recherche */}
      {results.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3 sm:space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserPlus className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
              <h3 className="text-sm sm:text-base font-semibold text-slate-700">
                Suggestions ({results.length})
              </h3>
            </div>

            {/* Message de quota atteint */}
            {isQuotaReached && (
              <div className="flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 rounded-full">
                <AlertCircle className="h-3 w-3" />
                <span className="text-xs font-medium">Quota atteint</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <AnimatePresence>
              {results.map((r) => (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="group relative bg-white rounded-xl sm:rounded-2xl border border-slate-200 p-3 sm:p-4 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm sm:text-base font-medium text-slate-900 truncate">
                        {r.name}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-500 truncate">
                        {r.email}
                      </p>
                    </div>

                    <Button
                      size="sm"
                      variant={selectedIds.has(r.id) ? "secondary" : "default"}
                      onClick={() => add(r)}
                      disabled={selectedIds.has(r.id) || isQuotaReached}
                      className={`h-8 sm:h-10 px-3 sm:px-4 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 ${
                        selectedIds.has(r.id)
                          ? "bg-green-100 text-green-700 border-green-200"
                          : isQuotaReached
                            ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                            : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-sm hover:shadow-md"
                      }`}
                    >
                      {selectedIds.has(r.id) ? (
                        <div className="flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span className="hidden sm:inline">Ajouté</span>
                        </div>
                      ) : isQuotaReached ? (
                        <div className="flex items-center gap-1">
                          <X className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span className="hidden sm:inline">
                            Quota atteint
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <UserPlus className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span>Ajouter</span>
                        </div>
                      )}
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      )}

      {/* État vide */}
      {!query && value.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8 sm:py-12"
        >
          <Users className="h-12 w-12 sm:h-16 sm:w-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-sm sm:text-base font-medium text-slate-500 mb-2">
            Aucun participant sélectionné
          </h3>
          <p className="text-xs sm:text-sm text-slate-400">
            Recherchez et ajoutez des participants à votre réservation
          </p>
        </motion.div>
      )}

      {/* Aucun résultat */}
      {query && results.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8 sm:py-12"
        >
          <Search className="h-12 w-12 sm:h-16 sm:w-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-sm sm:text-base font-medium text-slate-500 mb-2">
            Aucun résultat trouvé
          </h3>
          <p className="text-xs sm:text-sm text-slate-400">
            Essayez avec un autre nom ou email
          </p>
        </motion.div>
      )}

      {/* Alerte de suppression de l'utilisateur actif */}
      <AnimatePresence>
        {showRemoveAlert && userToRemove && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-red-200"
            >
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    Supprimer l&apos;organisateur ?
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-4">
                    Vous êtes sur le point de supprimer{" "}
                    <strong>{userToRemove.name}</strong> de la liste des
                    participants. En tant qu&apos;organisateur, vous ne recevrez
                    plus de notifications automatiques pour cette réservation.
                  </p>
                  <div className="flex items-center gap-3">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={cancelRemove}
                      className="text-slate-600 border-slate-300 hover:bg-slate-50"
                    >
                      Annuler
                    </Button>
                    <Button
                      size="sm"
                      onClick={confirmRemove}
                      className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white"
                    >
                      Supprimer quand même
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
