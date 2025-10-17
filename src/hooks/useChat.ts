"use client";

import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { api } from "@/lib/api";

export type ChatMessage = {
  id: string;
  bookingId: string;
  senderId: string;
  content: string;
  createdAt: string;
};

export function useChat(bookingId: string) {
  const socketRef = useRef<Socket | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // charger historique
    (async () => {
      try {
        const res = await api.get(`/chat/${bookingId}/messages`);
        setMessages(res.data);
      } catch {}
    })();
    const socket = io({ path: "/api/realtime/socket" });
    socketRef.current = socket;
    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));
    socket.emit("join", `booking:${bookingId}`);
    socket.on("chat.message", (m: ChatMessage) => {
      if (m.bookingId !== bookingId) return;
      setMessages((prev) => [...prev, m]);
    });
    return () => {
      socket.off("chat.message");
      socket.close();
    };
  }, [bookingId]);

  function send(content: string) {
    socketRef.current?.emit("chat.send", { bookingId, content });
  }

  return { messages, send, connected };
}
