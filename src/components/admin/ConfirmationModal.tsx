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
        return <Trash2 className="h-5 w-5 sm:h-6 sm:w-6 text-red-500" />;
      case "edit":
        return <Edit className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500" />;
      case "create":
        return <Plus className="h-5 w-5 sm:h-6 sm:w-6 text-green-500" />;
      default:
        return (
          <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 text-orange-500" />
        );
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
          <DialogContent className="w-[95vw] sm:max-w-md max-h-[95vh] overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-center">
                <div
                  className={`mx-auto mb-4 sm:mb-6 flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-2xl shadow-lg ${
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
                  className={`text-xl sm:text-2xl font-bold mb-2 sm:mb-3 ${
                    type === "delete"
                      ? "text-red-900"
                      : type === "edit"
                        ? "text-blue-900"
                        : "text-green-900"
                  }`}
                >
                  {title}
                </DialogTitle>
                <DialogDescription className="text-xs sm:text-sm text-gray-600 mb-6 sm:mb-8 px-3 sm:px-4">
                  {description}
                </DialogDescription>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center mt-6 sm:mt-8 pb-2">
                <Button
                  variant="outline"
                  onClick={onClose}
                  disabled={isLoading}
                  className="px-6 sm:px-8 py-2 sm:py-2 min-w-full sm:min-w-[120px] text-sm sm:text-base cursor-pointer hover:cursor-pointer"
                >
                  Annuler
                </Button>
                <Button
                  onClick={onConfirm}
                  disabled={isLoading}
                  className={`px-6 sm:px-8 py-2 sm:py-2 min-w-full sm:min-w-[120px] text-sm sm:text-base cursor-pointer hover:cursor-pointer ${getButtonStyle()}`}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span className="text-xs sm:text-sm">En cours...</span>
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
