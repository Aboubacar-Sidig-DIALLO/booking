"use client";

import { useState } from "react";
import { useChat } from "@/hooks/useChat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ChatBox({ bookingId }: { bookingId: string }) {
  const { messages, send, connected } = useChat(bookingId);
  const [text, setText] = useState("");
  return (
    <div className="rounded-xl border p-4">
      <div className="mb-2 text-sm text-neutral-600 dark:text-neutral-300">
        Chat {connected ? "(connecté)" : "(hors ligne)"}
      </div>
      <div className="mb-3 max-h-64 overflow-auto space-y-2">
        {messages.map((m) => (
          <div key={m.id} className="text-sm">
            <span className="font-medium">{m.senderId}</span>: {m.content}
          </div>
        ))}
        {messages.length === 0 ? (
          <div className="text-sm text-neutral-500">Aucun message</div>
        ) : null}
      </div>
      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (!text.trim()) return;
          send(text.trim());
          setText("");
        }}
      >
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Écrire un message…"
        />
        <Button type="submit">Envoyer</Button>
      </form>
    </div>
  );
}
