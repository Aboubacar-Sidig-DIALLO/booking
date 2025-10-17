import { NextRequest } from "next/server";
import { redis } from "@/lib/upstash";

export async function GET(_req: NextRequest) {
  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();
      const send = (event: string, payload: any) => {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ event, payload })}\n\n`)
        );
      };
      // heartbeat
      const iv = setInterval(() => send("heartbeat", Date.now()), 15000);
      return () => clearInterval(iv);
    },
  });
  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
