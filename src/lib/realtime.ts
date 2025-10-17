"use client";

import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;
let eventSource: EventSource | null = null;

type Handler = (payload: any) => void;
const handlers = new Map<string, Set<Handler>>();

function emit(event: string, payload: any) {
  const set = handlers.get(event);
  if (!set) return;
  for (const fn of set) fn(payload);
}

export function on(event: string, fn: Handler) {
  if (!handlers.has(event)) handlers.set(event, new Set());
  handlers.get(event)!.add(fn);
  return () => off(event, fn);
}

export function off(event: string, fn: Handler) {
  handlers.get(event)?.delete(fn);
}

export function connectRealtime() {
  if (typeof window === "undefined") return;
  if (socket || eventSource) return;

  try {
    socket = io({ path: "/api/realtime/socket" });
    socket.onAny((event: string, payload: any) => emit(event, payload));
    socket.on("connect_error", () => {
      // fallback SSE si échec WS
      if (!eventSource) startSSE();
    });
  } catch {
    startSSE();
  }
}

function startSSE() {
  try {
    eventSource = new EventSource("/api/realtime/sse");

    eventSource.onmessage = (ev) => {
      try {
        const data = JSON.parse(ev.data);
        if (data?.event) emit(data.event, data.payload);
      } catch (error) {
        console.error("Erreur parsing SSE data:", error);
      }
    };

    eventSource.onerror = (error) => {
      console.log("SSE connection error, closing...");
      eventSource?.close();
      eventSource = null;
      // Tentative de reconnexion après 5 secondes
      setTimeout(() => {
        if (!socket && !eventSource) {
          startSSE();
        }
      }, 5000);
    };

    eventSource.onopen = () => {
      console.log("SSE connection opened");
    };
  } catch (error) {
    console.error("Erreur lors de la création de l'EventSource:", error);
  }
}

export function disconnectRealtime() {
  console.log("Disconnecting realtime...");

  if (socket) {
    socket.close();
    socket = null;
  }

  if (eventSource) {
    eventSource.close();
    eventSource = null;
  }
}

// Nettoyage automatique lors de la fermeture de la page
if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", disconnectRealtime);
  window.addEventListener("unload", disconnectRealtime);
}
