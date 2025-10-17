"use client";

import { useEffect } from "react";
import { connectRealtime, on, off } from "@/lib/realtime";

type EventHandler = (payload: unknown) => void;

export type RealtimeEvents =
  | "booking.created"
  | "booking.updated"
  | "booking.cancelled"
  | "chat.message"
  | "checkin.updated";

export function useRealtime(
  handlers: Partial<Record<RealtimeEvents, EventHandler>>
) {
  useEffect(() => {
    connectRealtime();
    (Object.keys(handlers) as RealtimeEvents[]).forEach((event) => {
      const handler = handlers[event];
      if (handler) on(event, handler as any);
    });
    return () => {
      (Object.keys(handlers) as RealtimeEvents[]).forEach((event) => {
        const handler = handlers[event];
        if (handler) off(event, handler as any);
      });
    };
  }, [handlers]);
}
