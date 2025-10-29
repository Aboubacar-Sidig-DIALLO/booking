"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { EquipmentSkeleton } from "@/components/admin/EquipmentSkeleton";
import {
  useAdminEquipment,
  useCreateEquipment,
  useUpdateEquipment,
  useDeleteEquipment,
  useToggleEquipment,
  useToggleEquipmentOrg,
} from "@/hooks/use-admin-queries";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Plus,
  Edit,
  Trash2,
  Power,
  PowerOff,
  CheckCircle,
  XCircle,
  Search,
  Loader2,
  Package,
  Save,
  Info,
  Monitor,
  Tv,
  Mic,
  Video,
  Wifi,
  Phone,
  Settings,
  UserRound as UserIcon,
  Square as Whiteboard,
  Thermometer,
  Lightbulb,
  Table,
  Coffee,
  Users,
  Presentation,
  Laptop,
  Clock,
  Bell,
  Shield,
  Building2,
  Waves,
  Plug,
  Sofa,
} from "lucide-react";

interface Equipment {
  id: string;
  name: string;
  description?: string | null;
  icon?: string | null;
  howToUse?: string | null;
  isActive: boolean; // Statut global du feature
  isEnabled: boolean; // Statut pour cette organisation
  createdAt: Date;
  updatedAt: Date;
}

// Options d'icônes disponibles pour les salles de réunion
const iconOptions = [
  { name: "Monitor", icon: Monitor },
  { name: "Tv", icon: Tv },
  { name: "Presentation", icon: Presentation },
  { name: "Mic", icon: Mic },
  { name: "Video", icon: Video },
  { name: "Wifi", icon: Wifi },
  { name: "Whiteboard", icon: Whiteboard },
  { name: "Laptop", icon: Laptop },
  { name: "Phone", icon: Phone },
  { name: "Users", icon: Users },
  { name: "Sofa", icon: Sofa },
  { name: "Thermometer", icon: Thermometer },
  { name: "Lightbulb", icon: Lightbulb },
  { name: "Table", icon: Table },
  { name: "Coffee", icon: Coffee },
  { name: "Clock", icon: Clock },
  { name: "Bell", icon: Bell },
  { name: "Shield", icon: Shield },
  { name: "Building2", icon: Building2 },
  { name: "Waves", icon: Waves },
  { name: "Plug", icon: Plug },
  { name: "Settings", icon: Settings },
  { name: "User", icon: UserIcon },
];

// Fonction utilitaire pour obtenir le composant d'icône
const getIconComponent = (
  iconName: string | null | undefined,
  equipmentName?: string
) => {
  // Mapping spécial pour certains équipements basé sur le nom
  if (equipmentName) {
    const name = equipmentName.toLowerCase();
    if (
      name.includes("chaise") ||
      name.includes("siege") ||
      name.includes("fauteuil")
    ) {
      return Sofa;
    }
    if (
      name.includes("laptop") ||
      name.includes("ordinateur") ||
      name.includes("portable")
    ) {
      return Laptop;
    }
  }

  if (!iconName) return Settings;
  const iconOption = iconOptions.find((opt) => opt.name === iconName);
  return iconOption ? iconOption.icon : Settings;
};

export function EquipmentManagement() {
  const { data: session } = useSession();
  const sessionUser = session?.user as any;
  const isROI = sessionUser?.role === "ROI";
  const isAdmin = sessionUser?.role === "ADMIN";
  const canManage = isROI || isAdmin;

  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(
    null
  );
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: "",
    howToUse: "",
  });
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");

  // TanStack Query hooks
  const { data: equipments = [], isLoading } = useAdminEquipment();
  const createEquipmentMutation = useCreateEquipment();
  const updateEquipmentMutation = useUpdateEquipment();
  const deleteEquipmentMutation = useDeleteEquipment();
  const toggleEquipmentMutation = useToggleEquipment();
  const toggleEquipmentOrgMutation = useToggleEquipmentOrg();

  // Ouvrir modal d'ajout
  const handleAdd = () => {
    setFormData({ name: "", description: "", icon: "", howToUse: "" });
    setShowAddModal(true);
  };

  // Ouvrir modal d'édition
  const handleEdit = (equipment: Equipment) => {
    setSelectedEquipment(equipment);
    setFormData({
      name: equipment.name,
      description: equipment.description || "",
      icon: equipment.icon || "",
      howToUse: equipment.howToUse || "",
    });
    setShowEditModal(true);
  };

  // Ouvrir dialogue de suppression
  const handleDeleteClick = (equipment: Equipment) => {
    setSelectedEquipment(equipment);
    setShowDeleteDialog(true);
  };

  const isSubmitting =
    createEquipmentMutation.isPending ||
    updateEquipmentMutation.isPending ||
    deleteEquipmentMutation.isPending;

  // Créer un équipement
  const handleCreate = async () => {
    try {
      await createEquipmentMutation.mutateAsync(formData);
      setShowAddModal(false);
    } catch (error) {
      // L'erreur est déjà gérée par la mutation
    }
  };

  // Mettre à jour un équipement
  const handleUpdate = async () => {
    if (!selectedEquipment) return;

    try {
      await updateEquipmentMutation.mutateAsync({
        id: selectedEquipment.id,
        ...formData,
      });
      setShowEditModal(false);
    } catch (error) {
      // L'erreur est déjà gérée par la mutation
    }
  };

  // Supprimer un équipement
  const handleDelete = async () => {
    if (!selectedEquipment) return;

    try {
      await deleteEquipmentMutation.mutateAsync(selectedEquipment.id);
      setShowDeleteDialog(false);
    } catch (error) {
      // L'erreur est déjà gérée par la mutation
    }
  };

  // Toggle actif/inactif pour l'organisation
  const handleToggleActive = async (equipment: Equipment) => {
    try {
      await toggleEquipmentOrgMutation.mutateAsync(equipment.id);
    } catch (error) {
      // L'erreur est déjà gérée par la mutation
    }
  };

  // Filtrer les équipements
  const filteredEquipments = equipments.filter((eq: any) => {
    const matchesSearch = eq.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter =
      filter === "all" ||
      (filter === "active" && eq.isEnabled) ||
      (filter === "inactive" && !eq.isEnabled);
    return matchesSearch && matchesFilter;
  });

  const activeCount = equipments.filter((e: any) => e.isEnabled).length;
  const inactiveCount = equipments.filter((e: any) => !e.isEnabled).length;

  return (
    <div className="space-y-6">
      {/* Layout avec stats sur le côté */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Stats sur le côté */}
        <div className="lg:col-span-3">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="sticky top-24 space-y-4">
              <Card className="border border-gray-200 bg-white shadow-md">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-lg">
                      <Package className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-sm font-semibold">
                        Filtres
                      </CardTitle>
                      <CardDescription className="text-xs mt-0.5">
                        Filtrer par statut
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2.5">
                  <div
                    onClick={() => setFilter("all")}
                    className={`rounded-lg p-3 cursor-pointer transition-all duration-200 ${
                      filter === "all"
                        ? "bg-gradient-to-r from-indigo-50 to-blue-50 border-2 border-indigo-300 shadow-sm"
                        : "bg-white border-2 border-gray-200 hover:bg-indigo-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className={`p-1.5 rounded-md ${
                            filter === "all" ? "bg-indigo-500" : "bg-gray-100"
                          }`}
                        >
                          <Package
                            className={`h-3.5 w-3.5 ${
                              filter === "all" ? "text-white" : "text-gray-600"
                            }`}
                          />
                        </div>
                        <span
                          className={`text-sm font-medium ${
                            filter === "all"
                              ? "text-indigo-900"
                              : "text-gray-700"
                          }`}
                        >
                          Total
                        </span>
                      </div>
                      <span
                        className={`text-xl font-bold ${
                          filter === "all" ? "text-indigo-900" : "text-gray-900"
                        }`}
                      >
                        {equipments.length}
                      </span>
                    </div>
                  </div>

                  <div
                    onClick={() => setFilter("active")}
                    className={`rounded-lg p-3 cursor-pointer transition-all duration-200 ${
                      filter === "active"
                        ? "bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 shadow-sm"
                        : "bg-white border-2 border-gray-200 hover:bg-green-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className={`p-1.5 rounded-md ${
                            filter === "active"
                              ? "bg-green-500"
                              : "bg-green-100"
                          }`}
                        >
                          <CheckCircle
                            className={`h-3.5 w-3.5 ${
                              filter === "active"
                                ? "text-white"
                                : "text-green-600"
                            }`}
                          />
                        </div>
                        <span
                          className={`text-sm font-medium ${
                            filter === "active"
                              ? "text-green-900"
                              : "text-green-700"
                          }`}
                        >
                          Actifs
                        </span>
                      </div>
                      <span
                        className={`text-xl font-bold ${
                          filter === "active"
                            ? "text-green-900"
                            : "text-green-700"
                        }`}
                      >
                        {activeCount}
                      </span>
                    </div>
                  </div>

                  <div
                    onClick={() => setFilter("inactive")}
                    className={`rounded-lg p-3 cursor-pointer transition-all duration-200 ${
                      filter === "inactive"
                        ? "bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-300 shadow-sm"
                        : "bg-white border-2 border-gray-200 hover:bg-red-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className={`p-1.5 rounded-md ${
                            filter === "inactive" ? "bg-red-500" : "bg-red-100"
                          }`}
                        >
                          <XCircle
                            className={`h-3.5 w-3.5 ${
                              filter === "inactive"
                                ? "text-white"
                                : "text-red-600"
                            }`}
                          />
                        </div>
                        <span
                          className={`text-sm font-medium ${
                            filter === "inactive"
                              ? "text-red-900"
                              : "text-red-700"
                          }`}
                        >
                          Inactifs
                        </span>
                      </div>
                      <span
                        className={`text-xl font-bold ${
                          filter === "inactive"
                            ? "text-red-900"
                            : "text-red-700"
                        }`}
                      >
                        {inactiveCount}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>

        {/* Liste des équipements au centre */}
        <div className="lg:col-span-9 space-y-6">
          {/* Header avec recherche */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                      <Package className="h-5 w-5 text-indigo-600 flex-shrink-0" />
                      <span className="truncate">Tous les équipements</span>
                    </CardTitle>
                    <CardDescription className="text-sm mt-1">
                      Gérez les équipements disponibles pour vos salles
                    </CardDescription>
                  </div>
                  {isROI && (
                    <Button
                      onClick={handleAdd}
                      className="bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 hover:cursor-pointer text-white w-full sm:w-auto text-sm px-6 h-10 cursor-pointer"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Rechercher un équipement..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-10"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Liste des équipements */}
          {isLoading ? (
            <EquipmentSkeleton />
          ) : filteredEquipments.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="p-4 bg-gray-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <Package className="h-10 w-10 text-gray-400" />
                </div>
                <p className="text-base font-semibold text-gray-900 mb-2">
                  Aucun équipement
                </p>
                <p className="text-sm text-gray-600">
                  {searchTerm || filter !== "all"
                    ? "Aucun équipement ne correspond à votre recherche"
                    : "Commencez par ajouter votre premier équipement"}
                </p>
                {!searchTerm && filter === "all" && (
                  <Button
                    onClick={handleAdd}
                    className="mt-6"
                    variant="outline"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter un équipement
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AnimatePresence>
                {filteredEquipments.map((equipment: any, index) => (
                  <motion.div
                    key={equipment.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.03, duration: 0.2 }}
                  >
                    <Card
                      className={`border-2 transition-all duration-300 ${
                        equipment.isEnabled
                          ? "border-green-200 hover:border-green-400 bg-white shadow-sm hover:shadow-xl"
                          : "border-red-200 bg-gray-50 opacity-70 grayscale hover:opacity-90 hover:grayscale-0 hover:border-red-400 hover:bg-gray-100 hover:shadow-md"
                      }`}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div
                              className={`p-2 rounded-xl ${
                                equipment.isEnabled
                                  ? "bg-blue-100"
                                  : "bg-gray-200"
                              }`}
                            >
                              {(() => {
                                const IconComponent = getIconComponent(
                                  equipment.icon,
                                  equipment.name
                                );
                                return (
                                  <IconComponent
                                    className={`h-6 w-6 ${
                                      equipment.isEnabled
                                        ? "text-blue-600"
                                        : "text-gray-400"
                                    }`}
                                  />
                                );
                              })()}
                            </div>
                            <h4
                              className={`font-semibold text-base flex items-center gap-2 ${
                                equipment.isEnabled
                                  ? "text-slate-900"
                                  : "text-gray-500"
                              }`}
                            >
                              {equipment.name}
                              {equipment.howToUse && (
                                <TooltipProvider>
                                  <Tooltip delayDuration={200}>
                                    <TooltipTrigger asChild>
                                      <button className="text-gray-400 hover:text-blue-600 transition-colors flex-shrink-0">
                                        <Info className="h-4 w-4" />
                                      </button>
                                    </TooltipTrigger>
                                    <TooltipContent
                                      side="top"
                                      className="max-w-xs bg-white border border-gray-200 shadow-lg p-3 rounded-lg"
                                    >
                                      <div className="flex items-start gap-2">
                                        <div className="p-1.5 bg-blue-100 rounded-md flex-shrink-0 mt-0.5">
                                          <Info className="h-3.5 w-3.5 text-blue-600" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <p className="font-semibold text-sm mb-1.5 text-gray-900">
                                            Comment utiliser
                                          </p>
                                          <p className="text-xs text-gray-600 leading-relaxed">
                                            {equipment.howToUse}
                                          </p>
                                        </div>
                                      </div>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              )}
                            </h4>
                          </div>
                          {canManage && (
                            <TooltipProvider>
                              <Tooltip delayDuration={200}>
                                <TooltipTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() =>
                                      handleToggleActive(equipment)
                                    }
                                    className={`h-8 w-8 p-0 transition-all hover:cursor-pointer ${
                                      equipment.isEnabled
                                        ? "hover:bg-orange-50 hover:text-orange-700"
                                        : "hover:bg-green-50 hover:text-green-700"
                                    }`}
                                  >
                                    {equipment.isEnabled ? (
                                      <PowerOff className="h-4 w-4" />
                                    ) : (
                                      <Power className="h-4 w-4" />
                                    )}
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  {equipment.isEnabled
                                    ? "Désactiver"
                                    : "Activer"}
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </div>

                        {equipment.description && (
                          <p
                            className={`text-xs mt-2 line-clamp-2 ${
                              equipment.isEnabled
                                ? "text-gray-600"
                                : "text-gray-400"
                            }`}
                          >
                            {equipment.description}
                          </p>
                        )}

                        {/* Actions pour ROI */}
                        {isROI && (
                          <div className="flex items-center justify-end gap-2 mt-3 pt-3 border-t border-gray-100">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEdit(equipment)}
                              className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-700 hover:cursor-pointer"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteClick(equipment)}
                              className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-700 hover:cursor-pointer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* Modal d'ajout */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="w-[95vw] sm:max-w-lg">
          <div className="flex items-center gap-3 mb-4 pb-4 border-b">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-lg">
              <Package className="h-5 w-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold">
                Nouvel équipement
              </DialogTitle>
              <DialogDescription className="text-xs text-gray-600 mt-0.5">
                Ajoutez un nouvel équipement disponible pour les salles
              </DialogDescription>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-sm font-medium mb-2 block">
                Nom de l'équipement *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Ex: Projecteur"
                className="h-10 text-sm"
              />
            </div>
            <div>
              <Label
                htmlFor="description"
                className="text-sm font-medium mb-2 block"
              >
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Description de l'équipement (optionnel)"
                rows={3}
                className="text-sm"
              />
            </div>

            <div>
              <Label className="text-sm font-medium mb-2 block">Icône</Label>
              <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 gap-1.5 p-2 border rounded-lg bg-gray-50 max-h-40 overflow-y-auto">
                {iconOptions.map((iconOption) => {
                  const IconComponent = iconOption.icon;
                  const isSelected = formData.icon === iconOption.name;
                  return (
                    <button
                      key={iconOption.name}
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, icon: iconOption.name })
                      }
                      className={`p-1.5 sm:p-2 rounded transition-all flex items-center justify-center ${
                        isSelected
                          ? "bg-blue-500 text-white shadow-md"
                          : "bg-white hover:bg-blue-50 hover:shadow-sm text-gray-600"
                      }`}
                    >
                      <IconComponent className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <Label
                htmlFor="howToUse"
                className="text-sm font-medium mb-2 block"
              >
                Comment utiliser
              </Label>
              <Textarea
                id="howToUse"
                value={formData.howToUse}
                onChange={(e) =>
                  setFormData({ ...formData, howToUse: e.target.value })
                }
                placeholder="Instructions d'utilisation de l'équipement (optionnel)"
                rows={3}
                className="text-sm"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6 pt-6 border-t">
            <Button
              variant="outline"
              onClick={() => setShowAddModal(false)}
              disabled={isSubmitting}
              className="flex-1 cursor-pointer hover:cursor-pointer"
            >
              Annuler
            </Button>
            <Button
              onClick={handleCreate}
              disabled={isSubmitting || !formData.name}
              className="flex-1 bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 hover:cursor-pointer cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Création...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Créer
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal d'édition */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="w-[95vw] sm:max-w-lg">
          <div className="flex items-center gap-3 mb-4 pb-4 border-b">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-lg">
              <Edit className="h-5 w-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold">
                Modifier l'équipement
              </DialogTitle>
              <DialogDescription className="text-xs text-gray-600 mt-0.5">
                Modifiez les informations de l'équipement
              </DialogDescription>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label
                htmlFor="edit-name"
                className="text-sm font-medium mb-2 block"
              >
                Nom de l'équipement *
              </Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Ex: Projecteur"
                className="h-10 text-sm"
              />
            </div>
            <div>
              <Label
                htmlFor="edit-description"
                className="text-sm font-medium mb-2 block"
              >
                Description
              </Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Description de l'équipement (optionnel)"
                rows={3}
                className="text-sm"
              />
            </div>

            <div>
              <Label className="text-sm font-medium mb-2 block">Icône</Label>
              <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 gap-1.5 p-2 border rounded-lg bg-gray-50 max-h-40 overflow-y-auto">
                {iconOptions.map((iconOption) => {
                  const IconComponent = iconOption.icon;
                  const isSelected = formData.icon === iconOption.name;
                  return (
                    <button
                      key={iconOption.name}
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, icon: iconOption.name })
                      }
                      className={`p-1.5 sm:p-2 rounded transition-all flex items-center justify-center ${
                        isSelected
                          ? "bg-blue-500 text-white shadow-md"
                          : "bg-white hover:bg-blue-50 hover:shadow-sm text-gray-600"
                      }`}
                    >
                      <IconComponent className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <Label
                htmlFor="edit-howToUse"
                className="text-sm font-medium mb-2 block"
              >
                Comment utiliser
              </Label>
              <Textarea
                id="edit-howToUse"
                value={formData.howToUse}
                onChange={(e) =>
                  setFormData({ ...formData, howToUse: e.target.value })
                }
                placeholder="Instructions d'utilisation de l'équipement (optionnel)"
                rows={3}
                className="text-sm"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6 pt-6 border-t">
            <Button
              variant="outline"
              onClick={() => setShowEditModal(false)}
              disabled={isSubmitting}
              className="flex-1 cursor-pointer hover:cursor-pointer"
            >
              Annuler
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={isSubmitting || !formData.name}
              className="flex-1 bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 hover:cursor-pointer cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Modification...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Modifier
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog de suppression */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="w-[95vw] sm:max-w-md">
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-xl">
                <Trash2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <AlertDialogTitle className="text-xl font-bold text-gray-900">
                  Supprimer l'équipement
                </AlertDialogTitle>
              </div>
            </div>
            <AlertDialogDescription className="text-sm text-gray-600 leading-relaxed">
              Êtes-vous sûr de vouloir supprimer l'équipement "
              <span className="font-semibold text-gray-900">
                {selectedEquipment?.name}
              </span>
              " ? Cette action est irréversible et ne pourra pas être annulée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isSubmitting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Suppression...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Supprimer
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
