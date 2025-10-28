"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BookingFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  rooms: any[];
  isLoading?: boolean;
}

export function BookingFormModal({
  isOpen,
  onClose,
  onSubmit,
  rooms,
  isLoading = false,
}: BookingFormModalProps) {
  const [formData, setFormData] = useState({
    roomId: "",
    title: "",
    description: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    privacy: "ORG",
    participants: [] as string[],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const start = new Date(`${formData.startDate}T${formData.startTime}:00`);
    const end = new Date(`${formData.endDate}T${formData.endTime}:00`);

    if (start >= end) {
      alert("La date de fin doit être après la date de début");
      return;
    }

    onSubmit({
      roomId: formData.roomId,
      title: formData.title,
      description: formData.description || undefined,
      start: start.toISOString(),
      end: end.toISOString(),
      privacy: formData.privacy,
      participants: formData.participants,
    });

    // Reset form
    setFormData({
      roomId: "",
      title: "",
      description: "",
      startDate: "",
      startTime: "",
      endDate: "",
      endTime: "",
      privacy: "ORG",
      participants: [],
    });
  };

  const getMinDate = () => {
    return new Date().toISOString().split("T")[0];
  };

  const getMinTime = () => {
    if (formData.startDate === new Date().toISOString().split("T")[0]) {
      return new Date().toTimeString().slice(0, 5);
    }
    return "00:00";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl sm:text-2xl mb-2">
            <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <Plus className="h-5 w-5 text-white" />
            </div>
            Nouvelle réservation
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            Créez une nouvelle réservation de salle
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          {/* Salle */}
          <div className="space-y-2">
            <Label htmlFor="room" className="text-sm font-semibold">
              Salle *
            </Label>
            <Select
              value={formData.roomId}
              onValueChange={(value) =>
                setFormData({ ...formData, roomId: value })
              }
              required
            >
              <SelectTrigger className="h-10 sm:h-11">
                <SelectValue placeholder="Sélectionner une salle" />
              </SelectTrigger>
              <SelectContent>
                {rooms.map((room) => (
                  <SelectItem key={room.id} value={room.id}>
                    {room.name} ({room.capacity} places)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Titre */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-semibold">
              Titre *
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Ex: Réunion d'équipe"
              required
              className="h-10 sm:h-11"
            />
          </div>

          {/* Dates et heures */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Date de début */}
            <div className="space-y-2">
              <Label htmlFor="startDate" className="text-sm font-semibold">
                Date de début *
              </Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
                min={getMinDate()}
                required
                className="h-10 sm:h-11"
              />
            </div>

            {/* Heure de début */}
            <div className="space-y-2">
              <Label htmlFor="startTime" className="text-sm font-semibold">
                Heure de début *
              </Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) =>
                  setFormData({ ...formData, startTime: e.target.value })
                }
                min={
                  formData.startDate === new Date().toISOString().split("T")[0]
                    ? getMinTime()
                    : undefined
                }
                required
                className="h-10 sm:h-11"
              />
            </div>

            {/* Date de fin */}
            <div className="space-y-2">
              <Label htmlFor="endDate" className="text-sm font-semibold">
                Date de fin *
              </Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
                min={formData.startDate || getMinDate()}
                required
                className="h-10 sm:h-11"
              />
            </div>

            {/* Heure de fin */}
            <div className="space-y-2">
              <Label htmlFor="endTime" className="text-sm font-semibold">
                Heure de fin *
              </Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) =>
                  setFormData({ ...formData, endTime: e.target.value })
                }
                required
                className="h-10 sm:h-11"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-semibold">
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Ajouter une description..."
              rows={3}
              className="resize-none"
            />
          </div>

          {/* Confidentialité */}
          <div className="space-y-2">
            <Label htmlFor="privacy" className="text-sm font-semibold">
              Confidentialité *
            </Label>
            <Select
              value={formData.privacy}
              onValueChange={(value) =>
                setFormData({ ...formData, privacy: value })
              }
            >
              <SelectTrigger className="h-10 sm:h-11">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ORG">Organisation</SelectItem>
                <SelectItem value="PUBLIC">Publique</SelectItem>
                <SelectItem value="PRIVATE">Privée</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="cursor-pointer hover:cursor-pointer"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white cursor-pointer"
            >
              {isLoading ? "Création..." : "Créer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
