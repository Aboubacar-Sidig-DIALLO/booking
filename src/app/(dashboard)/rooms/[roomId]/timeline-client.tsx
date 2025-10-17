"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import AvailabilityTimeline, {
  BookingSegment,
} from "@/components/booking/AvailabilityTimeline";
import { motion } from "framer-motion";
import { useState } from "react";
import DateTimeRangePicker, {
  DateTimeRange,
} from "@/components/ui/datetime-range-picker";
import { useDebounce } from "@/hooks/useDebounce";

export default function RoomTimelineClient({ roomId }: { roomId: string }) {
  const [range, setRange] = useState<DateTimeRange>(() => ({
    from: new Date().toISOString().slice(0, 16),
    to: new Date(Date.now() + 6 * 60 * 60e3).toISOString().slice(0, 16),
  }));
  const debounced = useDebounce(range, 400);

  const { data } = useQuery({
    queryKey: ["room", roomId, "availability", debounced],
    queryFn: async (): Promise<BookingSegment[]> => {
      // Mock si l’API n’existe pas encore
      try {
        const res = await api.get(`/rooms/${roomId}/availability`, {
          params: {
            from: new Date(debounced.from).toISOString(),
            to: new Date(debounced.to).toISOString(),
          },
        });
        return res.data;
      } catch {
        const now = Date.now();
        return [
          {
            id: "1",
            start: now + 30 * 60e3,
            end: now + 90 * 60e3,
            status: "busy",
            title: "Réunion hebdo",
          },
          {
            id: "2",
            start: now + 3 * 60 * 60e3,
            end: now + 4 * 60 * 60e3,
            status: "pending",
            title: "Option client",
          },
        ];
      }
    },
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="space-y-4"
    >
      <DateTimeRangePicker value={range} onChange={setRange} />
      <AvailabilityTimeline
        bookings={data ?? []}
        date={new Date(debounced.from)}
        view="day"
        onSelectRange={(from, to) =>
          setRange({
            from: from.toISOString().slice(0, 16),
            to: to.toISOString().slice(0, 16),
          })
        }
      />
    </motion.div>
  );
}
