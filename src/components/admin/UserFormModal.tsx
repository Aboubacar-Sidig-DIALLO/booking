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
      <DialogContent className="w-[95vw] sm:max-w-2xl max-h-[95vh] overflow-y-auto p-3 sm:p-6">
        <div className="flex items-start gap-2 sm:gap-4 mb-3 sm:mb-6 pb-3 sm:pb-6 border-b border-slate-200">
          <div className="flex-shrink-0">
            <div className="h-10 w-10 sm:h-14 sm:w-14 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg">
              <User className="h-5 w-5 sm:h-7 sm:w-7 text-white" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <DialogTitle className="text-sm sm:text-xl font-bold text-slate-900 mb-0.5 sm:mb-1">
              {isEditing ? "Modifier l'utilisateur" : "Ajouter un utilisateur"}
            </DialogTitle>
            <DialogDescription className="text-[10px] sm:text-sm text-slate-600">
              {isEditing
                ? "Modifiez les informations de l'utilisateur"
                : "Renseignez les informations du nouvel utilisateur"}
            </DialogDescription>
            {isEditing && user && (
              <div className="flex items-center gap-1.5 sm:gap-2 mt-1.5 sm:mt-2">
                <Badge className="bg-purple-100 text-purple-800 border-purple-300 text-[9px] sm:text-xs px-1.5 py-0.5">
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
          <form
            onSubmit={handleSubmit(handleFormSubmit)}
            className="space-y-2 sm:space-y-4"
          >
            {/* Informations de base */}
            <div className="space-y-1.5 sm:space-y-3">
              <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
                <User className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-gray-600 flex-shrink-0" />
                <h4 className="font-semibold text-[10px] sm:text-sm text-gray-800">
                  Informations de base
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-3">
                <div className="space-y-1">
                  <Label
                    htmlFor="name"
                    className="text-[10px] sm:text-xs font-medium"
                  >
                    Nom complet *
                  </Label>
                  <Input
                    id="name"
                    {...register("name")}
                    placeholder="Jean Dupont"
                    className="h-8 sm:h-9 w-full text-xs sm:text-sm"
                  />
                  {errors.name && (
                    <p className="text-[9px] sm:text-xs text-red-600">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label
                    htmlFor="email"
                    className="text-[10px] sm:text-xs font-medium"
                  >
                    Email *
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-2 sm:left-2.5 top-1/2 transform -translate-y-1/2 h-2.5 w-2.5 sm:h-3.5 sm:w-3.5 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      {...register("email")}
                      placeholder="jean.dupont@entreprise.com"
                      className="h-8 sm:h-9 pl-7 sm:pl-9 text-xs sm:text-sm"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-[9px] sm:text-xs text-red-600">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-3">
                <div className="space-y-1">
                  <Label
                    htmlFor="phone"
                    className="text-[10px] sm:text-xs font-medium"
                  >
                    Téléphone
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-2 sm:left-2.5 top-1/2 transform -translate-y-1/2 h-2.5 w-2.5 sm:h-3.5 sm:w-3.5 text-gray-400" />
                    <Input
                      id="phone"
                      {...register("phone")}
                      placeholder="+33 1 23 45 67 89"
                      className="h-8 sm:h-9 pl-7 sm:pl-9 text-xs sm:text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label
                    htmlFor="location"
                    className="text-[10px] sm:text-xs font-medium"
                  >
                    Localisation
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-2 sm:left-2.5 top-1/2 transform -translate-y-1/2 h-2.5 w-2.5 sm:h-3.5 sm:w-3.5 text-gray-400" />
                    <Input
                      id="location"
                      {...register("location")}
                      placeholder="Paris, France"
                      className="h-8 sm:h-9 pl-7 sm:pl-9 text-xs sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Rôle et statut */}
            <div className="space-y-1.5 sm:space-y-3">
              <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
                <Shield className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-gray-600 flex-shrink-0" />
                <h4 className="font-semibold text-[10px] sm:text-sm text-gray-800">
                  Rôle et statut
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-3">
                <div className="space-y-1">
                  <Label
                    htmlFor="role"
                    className="text-[10px] sm:text-xs font-medium"
                  >
                    Rôle *
                  </Label>
                  <Select
                    value={selectedRole}
                    onValueChange={(value) =>
                      setValue("role", value as "admin" | "user" | "manager")
                    }
                  >
                    <SelectTrigger className="h-8 sm:h-9 text-xs sm:text-sm">
                      <SelectValue placeholder="Sélectionner un rôle" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(roleConfig).map(([key, config]) => {
                        const Icon = config.icon;
                        return (
                          <SelectItem key={key} value={key}>
                            <div className="flex items-center gap-1.5 sm:gap-2">
                              <Icon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                              <span className="text-xs sm:text-sm">
                                {config.label}
                              </span>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  {errors.role && (
                    <p className="text-[9px] sm:text-xs text-red-600">
                      {errors.role.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label
                    htmlFor="status"
                    className="text-[10px] sm:text-xs font-medium"
                  >
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
                    <SelectTrigger className="h-8 sm:h-9 text-xs sm:text-sm">
                      <SelectValue placeholder="Sélectionner un statut" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(statusConfig).map(([key, config]) => (
                        <SelectItem key={key} value={key}>
                          <div className="flex items-center gap-1.5 sm:gap-2">
                            <Badge
                              className={`text-[9px] sm:text-xs ${config.color}`}
                            >
                              {config.label}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.status && (
                    <p className="text-[9px] sm:text-xs text-red-600">
                      {errors.status.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <Label
                  htmlFor="department"
                  className="text-[10px] sm:text-xs font-medium"
                >
                  Département *
                </Label>
                <div className="relative">
                  <Briefcase className="absolute left-2 sm:left-2.5 top-1/2 transform -translate-y-1/2 h-2.5 w-2.5 sm:h-3.5 sm:w-3.5 text-gray-400" />
                  <Input
                    id="department"
                    {...register("department")}
                    placeholder="Ressources Humaines"
                    className="h-8 sm:h-9 pl-7 sm:pl-9 text-xs sm:text-sm"
                  />
                </div>
                {errors.department && (
                  <p className="text-[9px] sm:text-xs text-red-600">
                    {errors.department.message}
                  </p>
                )}
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-1.5 sm:space-y-3">
              <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
                <Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-gray-600 flex-shrink-0" />
                <h4 className="font-semibold text-[10px] sm:text-sm text-gray-800">
                  Informations supplémentaires
                </h4>
              </div>

              <div className="space-y-1">
                <Label
                  htmlFor="notes"
                  className="text-[10px] sm:text-xs font-medium"
                >
                  Notes
                </Label>
                <Textarea
                  id="notes"
                  {...register("notes")}
                  placeholder="Informations complémentaires sur l'utilisateur..."
                  rows={2}
                  className="resize-none text-xs sm:text-sm min-h-[60px]"
                />
              </div>
            </div>

            {/* Aperçu du rôle sélectionné */}
            {selectedRole && (
              <div className="p-2 sm:p-3 bg-gray-50 rounded-lg border">
                <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-1.5">
                  <RoleIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-gray-600 flex-shrink-0" />
                  <span className="text-[10px] sm:text-xs font-medium text-gray-700">
                    Aperçu du rôle sélectionné
                  </span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                  <Badge
                    className={`text-[9px] sm:text-xs ${roleConfig[selectedRole].color}`}
                  >
                    {roleConfig[selectedRole].label}
                  </Badge>
                  <span className="text-[9px] sm:text-xs text-gray-600">
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
            <div className="flex flex-col sm:flex-row gap-1.5 sm:gap-2 sm:justify-end pt-2 sm:pt-3 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="h-8 sm:h-9 px-3 sm:px-4 w-full sm:w-auto text-xs sm:text-sm"
              >
                <X className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1 sm:mr-1.5" />
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={!isValid || isLoading}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white h-8 sm:h-9 px-3 sm:px-4 w-full sm:w-auto text-xs sm:text-sm"
              >
                <Save className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1 sm:mr-1.5" />
                {isLoading
                  ? "Enregistrement..."
                  : isEditing
                    ? "Modifier"
                    : "Créer"}
              </Button>
            </div>
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
