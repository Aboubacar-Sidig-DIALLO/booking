"use client";

import { useState, useEffect } from "react";
import { Edit } from "lucide-react";
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
import { useBooking } from "@/hooks/use-admin-queries";

interface BookingEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  bookingId: string;
  rooms: any[];
  isLoading?: boolean;
}

export function BookingEditModal({
  isOpen,
  onClose,
  onSubmit,
  bookingId,
  rooms,
  isLoading = false,
}: BookingEditModalProps) {
  const { data: booking } = useBooking(bookingId);

  const [formData, setFormData] = useState({
    roomId: "",
    title: "",
    description: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
  });

  useEffect(() => {
    if (booking) {
      const startDate = new Date(booking.start);
      const endDate = new Date(booking.end);

      setFormData({
        roomId: booking.roomId,
        title: booking.title,
        description: booking.description || "",
        startDate: startDate.toISOString().split("T")[0],
        startTime: startDate.toTimeString().slice(0, 5),
        endDate: endDate.toISOString().split("T")[0],
        endTime: endDate.toTimeString().slice(0, 5),
      });
    }
  }, [booking]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const start = new Date(`${formData.startDate}T${formData.startTime}:00`);
    const end = new Date(`${formData.endDate}T${formData.endTime}:00`);

    if (start >= end) {
      alert("La date de fin doit être après la date de début");
      return;
    }

    onSubmit({
      roomId: formData.roomId !== booking?.roomId ? formData.roomId : undefined,
      title: formData.title !== booking?.title ? formData.title : undefined,
      description:
        formData.description !== booking?.description
          ? formData.description
          : undefined,
      start: start.toISOString(),
      end: end.toISOString(),
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl sm:text-2xl">
            <div className="h-10 w-10 bg-gradient-to-br from-orange-500 to-amber-600 rounded-lg flex items-center justify-center">
              <Edit className="h-5 w-5 text-white" />
            </div>
            Modifier la réservation
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base mt-2">
            Modifiez les informations de cette réservation
          </DialogDescription>
        </DialogHeader>

        {booking && (
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {/* Salle */}
            <div className="space-y-2">
              <Label htmlFor="room" className="text-sm font-semibold">
                Salle
              </Label>
              <Select
                value={formData.roomId}
                onValueChange={(value) =>
                  setFormData({ ...formData, roomId: value })
                }
              >
                <SelectTrigger className="h-10 sm:h-11">
                  <SelectValue />
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
                Titre
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Ex: Réunion d'équipe"
                className="h-10 sm:h-11"
              />
            </div>

            {/* Dates et heures */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Date de début */}
              <div className="space-y-2">
                <Label htmlFor="startDate" className="text-sm font-semibold">
                  Date de début
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                  className="h-10 sm:h-11"
                />
              </div>

              {/* Heure de début */}
              <div className="space-y-2">
                <Label htmlFor="startTime" className="text-sm font-semibold">
                  Heure de début
                </Label>
                <Input
                  id="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) =>
                    setFormData({ ...formData, startTime: e.target.value })
                  }
                  className="h-10 sm:h-11"
                />
              </div>

              {/* Date de fin */}
              <div className="space-y-2">
                <Label htmlFor="endDate" className="text-sm font-semibold">
                  Date de fin
                </Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                  className="h-10 sm:h-11"
                />
              </div>

              {/* Heure de fin */}
              <div className="space-y-2">
                <Label htmlFor="endTime" className="text-sm font-semibold">
                  Heure de fin
                </Label>
                <Input
                  id="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) =>
                    setFormData({ ...formData, endTime: e.target.value })
                  }
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

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
                className="cursor-pointer"
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white cursor-pointer"
              >
                {isLoading ? "Modification..." : "Enregistrer"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
