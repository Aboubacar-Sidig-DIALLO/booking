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
        <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
          <User className="h-5 w-5 text-blue-600" />
          Détails de l'utilisateur
        </DialogTitle>
        <DialogDescription className="text-gray-600">
          Informations complètes de {user.name}
        </DialogDescription>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          {/* Header avec avatar et actions */}
          <div className="flex items-start justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <User className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{user.name}</h3>
                <p className="text-gray-600">{user.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className={roleInfo.color}>
                    <RoleIcon className="h-3 w-3 mr-1" />
                    {roleInfo.label}
                  </Badge>
                  <Badge className={statusInfo.color}>
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {statusInfo.label}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              {onEdit && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onEdit}
                  className="hover:bg-blue-50 hover:border-blue-300"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Modifier
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onDelete}
                  className="hover:bg-red-50 hover:border-red-300 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
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
                      {new Date(user.lastLogin).toLocaleDateString("fr-FR")}
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
                      {new Date(user.createdAt).toLocaleDateString("fr-FR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
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
