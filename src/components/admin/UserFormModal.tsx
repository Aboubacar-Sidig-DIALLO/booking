"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Mail,
  Shield,
  Calendar,
  Phone,
  MapPin,
  Briefcase,
  Save,
  X,
} from "lucide-react";

const UserSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  email: z.string().email("Email invalide"),
  role: z.enum(["admin", "user", "manager"], {
    required_error: "Le rôle est requis",
  }),
  department: z.string().min(1, "Le département est requis"),
  phone: z.string().optional(),
  location: z.string().optional(),
  status: z.enum(["active", "inactive", "pending"]),
  notes: z.string().optional(),
});

type UserFormData = z.infer<typeof UserSchema>;

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UserFormData) => void;
  user?: {
    id: number;
    name: string;
    email: string;
    role: string;
    department: string;
    phone?: string;
    location?: string;
    status: string;
    notes?: string;
  } | null;
  isLoading?: boolean;
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

// Fonction pour convertir le rôle de l'API vers le format du formulaire
const convertRoleFromAPI = (role: string): "admin" | "user" | "manager" => {
  const roleUpper = role.toUpperCase();
  switch (roleUpper) {
    case "ADMIN":
      return "admin";
    case "MANAGER":
      return "manager";
    case "EMPLOYEE":
    case "VIEWER":
      return "user";
    default:
      return "user";
  }
};

const statusConfig = {
  active: {
    label: "Actif",
    color: "bg-green-100 text-green-800",
  },
  inactive: {
    label: "Inactif",
    color: "bg-gray-100 text-gray-800",
  },
  pending: {
    label: "En attente",
    color: "bg-yellow-100 text-yellow-800",
  },
};

export function UserFormModal({
  isOpen,
  onClose,
  onSubmit,
  user,
  isLoading = false,
}: UserFormModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isEditing = !!user;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm<UserFormData>({
    resolver: zodResolver(UserSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      role: user?.role ? convertRoleFromAPI(user.role) : "user",
      department: user?.department || "",
      phone: user?.phone || "",
      location: user?.location || "",
      status: (user?.status as "active" | "inactive" | "pending") || "active",
      notes: user?.notes || "",
    },
  });

  // Mettre à jour le formulaire quand user change
  useEffect(() => {
    if (user) {
      reset({
        name: user.name || "",
        email: user.email || "",
        role: user.role ? convertRoleFromAPI(user.role) : "user",
        department: user.department || "",
        phone: user.phone || "",
        location: user.location || "",
        status: (user.status as "active" | "inactive" | "pending") || "active",
        notes: user.notes || "",
      });
    } else {
      reset({
        name: "",
        email: "",
        role: "user",
        department: "",
        phone: "",
        location: "",
        status: "active",
        notes: "",
      });
    }
  }, [user, reset]);

  const selectedRole = watch("role");
  const selectedStatus = watch("status");

  const handleFormSubmit = (data: UserFormData) => {
    onSubmit(data);
  };

  const RoleIcon =
    selectedRole && roleConfig[selectedRole]
      ? roleConfig[selectedRole].icon
      : User;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-start gap-4 mb-6 pb-6 border-b border-slate-200">
          <div className="flex-shrink-0">
            <div className="h-14 w-14 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg">
              <User className="h-7 w-7 text-white" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <DialogTitle className="text-xl font-bold text-slate-900 mb-1">
              {isEditing ? "Modifier l'utilisateur" : "Ajouter un utilisateur"}
            </DialogTitle>
            <DialogDescription className="text-sm text-slate-600">
              {isEditing
                ? "Modifiez les informations de l'utilisateur"
                : "Renseignez les informations du nouvel utilisateur"}
            </DialogDescription>
            {isEditing && user && (
              <div className="flex items-center gap-2 mt-2">
                <Badge className="bg-purple-100 text-purple-800 border-purple-300 text-xs">
                  {user.email}
                </Badge>
              </div>
            )}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            {/* Informations de base */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <User className="h-3.5 w-3.5 text-gray-600" />
                <h4 className="font-semibold text-sm text-gray-800">
                  Informations de base
                </h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-xs font-medium">
                    Nom complet *
                  </Label>
                  <Input
                    id="name"
                    {...register("name")}
                    placeholder="Jean Dupont"
                    className="h-9 w-full"
                  />
                  {errors.name && (
                    <p className="text-xs text-red-600">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs font-medium">
                    Email *
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      {...register("email")}
                      placeholder="jean.dupont@entreprise.com"
                      className="h-9 pl-9"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-red-600">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="phone" className="text-xs font-medium">
                    Téléphone
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                    <Input
                      id="phone"
                      {...register("phone")}
                      placeholder="+33 1 23 45 67 89"
                      className="h-9 pl-9"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="location" className="text-xs font-medium">
                    Localisation
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                    <Input
                      id="location"
                      {...register("location")}
                      placeholder="Paris, France"
                      className="h-9 pl-9"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Rôle et statut */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-3.5 w-3.5 text-gray-600" />
                <h4 className="font-semibold text-sm text-gray-800">
                  Rôle et statut
                </h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="role" className="text-xs font-medium">
                    Rôle *
                  </Label>
                  <Select
                    value={selectedRole}
                    onValueChange={(value) =>
                      setValue("role", value as "admin" | "user" | "manager")
                    }
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Sélectionner un rôle" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(roleConfig).map(([key, config]) => {
                        const Icon = config.icon;
                        return (
                          <SelectItem key={key} value={key}>
                            <div className="flex items-center gap-2">
                              <Icon className="h-3.5 w-3.5" />
                              <span className="text-sm">{config.label}</span>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  {errors.role && (
                    <p className="text-xs text-red-600">
                      {errors.role.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="status" className="text-xs font-medium">
                    Statut *
                  </Label>
                  <Select
                    value={selectedStatus}
                    onValueChange={(value) =>
                      setValue(
                        "status",
                        value as "active" | "inactive" | "pending"
                      )
                    }
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Sélectionner un statut" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(statusConfig).map(([key, config]) => (
                        <SelectItem key={key} value={key}>
                          <div className="flex items-center gap-2">
                            <Badge className={`text-xs ${config.color}`}>
                              {config.label}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.status && (
                    <p className="text-xs text-red-600">
                      {errors.status.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="department" className="text-xs font-medium">
                  Département *
                </Label>
                <div className="relative">
                  <Briefcase className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                  <Input
                    id="department"
                    {...register("department")}
                    placeholder="Ressources Humaines"
                    className="h-9 pl-9"
                  />
                </div>
                {errors.department && (
                  <p className="text-xs text-red-600">
                    {errors.department.message}
                  </p>
                )}
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-3.5 w-3.5 text-gray-600" />
                <h4 className="font-semibold text-sm text-gray-800">
                  Informations supplémentaires
                </h4>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="notes" className="text-xs font-medium">
                  Notes
                </Label>
                <Textarea
                  id="notes"
                  {...register("notes")}
                  placeholder="Informations complémentaires sur l'utilisateur..."
                  rows={2}
                  className="resize-none text-sm"
                />
              </div>
            </div>

            {/* Aperçu du rôle sélectionné */}
            {selectedRole && (
              <div className="p-3 bg-gray-50 rounded-lg border">
                <div className="flex items-center gap-2 mb-1.5">
                  <RoleIcon className="h-3.5 w-3.5 text-gray-600" />
                  <span className="text-xs font-medium text-gray-700">
                    Aperçu du rôle sélectionné
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    className={`text-xs ${roleConfig[selectedRole].color}`}
                  >
                    {roleConfig[selectedRole].label}
                  </Badge>
                  <span className="text-xs text-gray-600">
                    {selectedRole === "admin"
                      ? "Accès complet au système"
                      : selectedRole === "manager"
                        ? "Gestion des équipes et projets"
                        : "Accès utilisateur standard"}
                  </span>
                </div>
              </div>
            )}

            {/* Boutons d'action */}
            <div className="flex justify-end gap-2 pt-3 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="h-9 px-4"
              >
                <X className="h-3.5 w-3.5 mr-1.5" />
                <span className="text-sm">Annuler</span>
              </Button>
              <Button
                type="submit"
                disabled={!isValid || isLoading}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white h-9 px-4"
              >
                <Save className="h-3.5 w-3.5 mr-1.5" />
                <span className="text-sm">
                  {isLoading
                    ? "Enregistrement..."
                    : isEditing
                      ? "Modifier"
                      : "Créer"}
                </span>
              </Button>
            </div>
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
