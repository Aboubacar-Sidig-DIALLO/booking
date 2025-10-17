"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useDebounce } from "@/hooks/useDebounce";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
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

export default function ParticipantsPicker({
  value,
  onChange,
}: {
  value: Participant[];
  onChange: (v: Participant[]) => void;
}) {
  const [query, setQuery] = useState("");
  const q = useDebounce(query, 300);
  const [results, setResults] = useState<Participant[]>([]);

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

  const add = (p: Participant) => {
    if (selectedIds.has(p.id)) return;
    onChange([...value, p]);
  };
  const remove = (id: string) => onChange(value.filter((p) => p.id !== id));
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
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
            <h3 className="text-sm sm:text-base font-semibold text-slate-700">
              Participants sélectionnés ({value.length})
            </h3>
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
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleRole(p.id)}
                        className="h-6 w-6 sm:h-8 sm:w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
                        aria-label="Changer rôle"
                      >
                        <RotateCcw className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => remove(p.id)}
                        className="h-6 w-6 sm:h-8 sm:w-8 p-0 hover:bg-red-50 hover:text-red-600"
                        aria-label="Retirer"
                      >
                        <X className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
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
          <div className="flex items-center gap-2">
            <UserPlus className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
            <h3 className="text-sm sm:text-base font-semibold text-slate-700">
              Suggestions ({results.length})
            </h3>
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
                      disabled={selectedIds.has(r.id)}
                      className={`h-8 sm:h-10 px-3 sm:px-4 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 ${
                        selectedIds.has(r.id)
                          ? "bg-green-100 text-green-700 border-green-200"
                          : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-sm hover:shadow-md"
                      }`}
                    >
                      {selectedIds.has(r.id) ? (
                        <div className="flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span className="hidden sm:inline">Ajouté</span>
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
    </div>
  );
}
