import { NextRequest } from "next/server";

const channels = new Map<string, Set<WebSocket>>();

export const GET = async (
  req: NextRequest,
  ctx: { params: Promise<{ bookingId: string }> }
) => {
  const { bookingId } = await ctx.params;
  // @ts-ignore - Next.js edge runtime WS upgrade
  const { socket, response } = Deno.upgradeWebSocket(req);
  const id = bookingId;
  socket.onopen = () => {
    if (!channels.has(id)) channels.set(id, new Set());
    channels.get(id)!.add(socket as any);
  };
  socket.onmessage = (ev: MessageEvent) => {
    const payload = String(ev.data || "");
    for (const client of channels.get(id) ?? []) {
      try {
        (client as any).send(payload);
      } catch {}
    }
  };
  socket.onclose = () => {
    channels.get(id)?.delete(socket as any);
  };
  return response;
};
