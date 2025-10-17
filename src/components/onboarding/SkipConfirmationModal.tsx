"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X, SkipForward, ArrowRight } from "lucide-react";

interface SkipConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function SkipConfirmationModal({
  isOpen,
  onConfirm,
  onCancel,
}: SkipConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-60 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onCancel}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-center space-y-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: "spring", damping: 10 }}
              className="h-16 w-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto"
            >
              <SkipForward className="h-8 w-8 text-orange-600" />
            </motion.div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-900">
                Passer l'onboarding ?
              </h3>
              <p className="text-slate-600">
                Vous pouvez toujours découvrir les fonctionnalités de ReservApp
                en explorant l'application.
              </p>
            </div>

            <div className="flex items-center justify-center space-x-3 pt-4">
              <Button
                variant="outline"
                onClick={onCancel}
                className="border-slate-200 text-slate-700 hover:bg-slate-50"
              >
                Continuer l'onboarding
              </Button>
              <Button
                onClick={onConfirm}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6"
              >
                <SkipForward className="h-4 w-4 mr-2" />
                Passer
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
