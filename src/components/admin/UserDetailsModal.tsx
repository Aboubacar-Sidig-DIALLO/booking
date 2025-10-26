"use client";

import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Shield,
  Calendar,
  Briefcase,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  X,
  Edit,
  Trash2,
} from "lucide-react";

interface UserDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
    department: string;
    phone?: string;
    location?: string;
    status: string;
    notes?: string;
    bookings: number;
    lastLogin: string;
    createdAt: string;
  } | null;
  onEdit?: () => void;
  onDelete?: () => void;
}

const roleConfig = {
  admin: {
    label: "Administrateur",
    color: "bg-red-100 text-red-800",
    icon: Shield,
  },
  user: {
    label: "Utilisateur",
    color: "bg-blue-100 text-blue-800",
    icon: User,
  },
  manager: {
    label: "Manager",
    color: "bg-purple-100 text-purple-800",
    icon: Briefcase,
  },
};

const statusConfig = {
  active: {
    label: "Actif",
    color: "bg-green-100 text-green-800",
    icon: CheckCircle,
  },
  inactive: {
    label: "Inactif",
    color: "bg-gray-100 text-gray-800",
    icon: XCircle,
  },
  pending: {
    label: "En attente",
    color: "bg-yellow-100 text-yellow-800",
    icon: AlertCircle,
  },
};

// Fonction pour formater les dates de manière sécurisée
const formatDate = (dateString?: string | null): string => {
  if (!dateString) return "Non disponible";

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Non disponible";
    return date.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (error) {
    return "Non disponible";
  }
};

// Fonction pour formater les dates courtes
const formatDateShort = (dateString?: string | null): string => {
  if (!dateString) return "Jamais";

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Jamais";
    return date.toLocaleDateString("fr-FR");
  } catch (error) {
    return "Jamais";
  }
};

export function UserDetailsModal({
  isOpen,
  onClose,
  user,
  onEdit,
  onDelete,
}: UserDetailsModalProps) {
  if (!user) {
    return null;
  }

  const roleInfo =
    roleConfig[user.role as keyof typeof roleConfig] || roleConfig.user;
  const statusInfo =
    statusConfig[user.status as keyof typeof statusConfig] ||
    statusConfig.active;
  const RoleIcon = roleInfo.icon;
  const StatusIcon = statusInfo.icon;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-200">
          <div className="flex-shrink-0">
            <div className="h-16 w-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center shadow-xl">
              <User className="h-8 w-8 text-white" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <DialogTitle className="text-2xl font-bold text-slate-900 mb-1">
              Détails de l'utilisateur
            </DialogTitle>
            <DialogDescription className="text-sm text-slate-600">
              Informations complètes de{" "}
              <span className="font-medium text-slate-700">{user.name}</span>
            </DialogDescription>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-5"
        >
          {/* Header avec avatar et actions */}
          <div className="flex items-start gap-6 p-5 bg-gradient-to-br from-purple-50 via-violet-50 to-blue-50 rounded-xl border-2 border-purple-100">
            <div className="flex items-center gap-5 flex-1 min-w-0">
              <div className="h-20 w-20 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center shadow-xl">
                <User className="h-10 w-10 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-2xl font-bold text-slate-900 truncate">
                  {user.name}
                </h3>
                <p className="text-slate-600 truncate mt-1">{user.email}</p>
                <div className="flex items-center gap-2 mt-3 flex-wrap">
                  <Badge className={`${roleInfo.color} border-2 shadow-sm`}>
                    <RoleIcon className="h-3.5 w-3.5 mr-1.5" />
                    {roleInfo.label}
                  </Badge>
                  <Badge className={`${statusInfo.color} border-2 shadow-sm`}>
                    <StatusIcon className="h-3.5 w-3.5 mr-1.5" />
                    {statusInfo.label}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              {onEdit && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onEdit}
                  className="hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all duration-200"
                >
                  <Edit className="h-4 w-4 mr-1.5" />
                  Modifier
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onDelete}
                  className="hover:bg-red-50 hover:border-red-300 hover:text-red-700 transition-all duration-200"
                >
                  <Trash2 className="h-4 w-4 mr-1.5" />
                  Supprimer
                </Button>
              )}
            </div>
          </div>

          {/* Métriques */}
          <div className="grid grid-cols-2 gap-3">
            <Card className="p-3">
              <CardContent className="p-0">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <Calendar className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-600">
                      Réservations
                    </p>
                    <p className="text-lg font-bold text-gray-900">
                      {user.bookings}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="p-3">
              <CardContent className="p-0">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Clock className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-600">
                      Dernière connexion
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      {formatDateShort(user.lastLogin)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Informations détaillées */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-800 flex items-center gap-2">
              <Shield className="h-4 w-4 text-gray-600" />
              Informations professionnelles
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Briefcase className="h-4 w-4 text-gray-600" />
                  <div>
                    <p className="text-xs font-medium text-gray-600">
                      Département
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      {user.department}
                    </p>
                  </div>
                </div>

                {user.phone && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Phone className="h-4 w-4 text-gray-600" />
                    <div>
                      <p className="text-xs font-medium text-gray-600">
                        Téléphone
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {user.phone}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                {user.location && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <MapPin className="h-4 w-4 text-gray-600" />
                    <div>
                      <p className="text-xs font-medium text-gray-600">
                        Localisation
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {user.location}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="h-4 w-4 text-gray-600" />
                  <div>
                    <p className="text-xs font-medium text-gray-600">
                      Membre depuis
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      {formatDate(user.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          {user.notes && (
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-600" />
                Notes
              </h4>
              <div className="p-3 bg-gray-50 rounded-lg border">
                <p className="text-sm text-gray-700">{user.notes}</p>
              </div>
            </div>
          )}

          {/* Bouton de fermeture */}
          <div className="flex justify-end pt-4 border-t">
            <Button variant="outline" onClick={onClose} className="px-6">
              <X className="h-4 w-4 mr-2" />
              Fermer
            </Button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
