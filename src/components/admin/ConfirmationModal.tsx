"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { AlertTriangle, Trash2, Edit, Plus } from "lucide-react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  type: "delete" | "edit" | "create";
  isLoading?: boolean;
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  type,
  isLoading = false,
}: ConfirmationModalProps) {
  const getIcon = () => {
    switch (type) {
      case "delete":
        return <Trash2 className="h-6 w-6 text-red-500" />;
      case "edit":
        return <Edit className="h-6 w-6 text-blue-500" />;
      case "create":
        return <Plus className="h-6 w-6 text-green-500" />;
      default:
        return <AlertTriangle className="h-6 w-6 text-orange-500" />;
    }
  };

  const getButtonStyle = () => {
    switch (type) {
      case "delete":
        return "bg-red-500 hover:bg-red-600 text-white";
      case "edit":
        return "bg-blue-500 hover:bg-blue-600 text-white";
      case "create":
        return "bg-green-500 hover:bg-green-600 text-white";
      default:
        return "bg-gray-500 hover:bg-gray-600 text-white";
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="sm:max-w-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-center">
                <div
                  className={`mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg ${
                    type === "delete"
                      ? "bg-red-100"
                      : type === "edit"
                        ? "bg-blue-100"
                        : "bg-green-100"
                  }`}
                >
                  {getIcon()}
                </div>
                <DialogTitle
                  className={`text-2xl font-bold mb-3 ${
                    type === "delete"
                      ? "text-red-900"
                      : type === "edit"
                        ? "text-blue-900"
                        : "text-green-900"
                  }`}
                >
                  {title}
                </DialogTitle>
                <DialogDescription className="text-sm text-gray-600 mb-8 px-4">
                  {description}
                </DialogDescription>
              </div>

              <div className="flex gap-3 justify-center mt-8 pb-2">
                <Button
                  variant="outline"
                  onClick={onClose}
                  disabled={isLoading}
                  className="px-8 py-2 min-w-[120px] text-base cursor-pointer hover:cursor-pointer"
                >
                  Annuler
                </Button>
                <Button
                  onClick={onConfirm}
                  disabled={isLoading}
                  className={`px-8 py-2 min-w-[120px] text-base cursor-pointer hover:cursor-pointer ${getButtonStyle()}`}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>En cours...</span>
                    </div>
                  ) : (
                    "Confirmer"
                  )}
                </Button>
              </div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
