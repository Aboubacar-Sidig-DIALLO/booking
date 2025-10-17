import { NextRequest } from "next/server";
import { redis } from "@/lib/upstash";

export async function GET(req: NextRequest) {
  let heartbeatInterval: ReturnType<typeof setInterval> | null = null;
  let isClosed = false;

  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();

      const send = (event: string, payload: any) => {
        // Vérifier si le contrôleur est encore ouvert avant d'envoyer
        if (!isClosed && controller.desiredSize !== null) {
          try {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ event, payload })}\n\n`)
            );
          } catch (error) {
            console.error("Erreur lors de l'envoi SSE:", error);
            isClosed = true;
            // Fermer proprement si une erreur survient
            try {
              controller.close();
            } catch {}
          }
        }
      };

      // Heartbeat avec vérification de l'état
      heartbeatInterval = setInterval(() => {
        if (isClosed) {
          if (heartbeatInterval !== null) clearInterval(heartbeatInterval);
          return;
        }
        send("heartbeat", Date.now());
      }, 15000);

      // Fonction de nettoyage
      const cleanup = () => {
        isClosed = true;
        if (heartbeatInterval !== null) {
          clearInterval(heartbeatInterval);
          heartbeatInterval = null;
        }
        try {
          controller.close();
        } catch (error) {
          console.error("Erreur lors de la fermeture du contrôleur:", error);
        }
      };

      // Gérer la fermeture de la connexion
      const handleClose = () => {
        cleanup();
      };

      // Abandon côté serveur (AbortSignal)
      try {
        // @ts-ignore - request.signal existe côté Next
        const signal: AbortSignal | undefined = (req as any)?.signal;
        if (signal) {
          if (signal.aborted) cleanup();
          else signal.addEventListener("abort", cleanup, { once: true });
        }
      } catch {}

      // Retourner la fonction de nettoyage
      return cleanup;
    },

    cancel() {
      // Nettoyage quand le stream est annulé
      console.log("SSE stream cancelled");
      // Assurer l'arrêt du heartbeat et la fermeture
      if (heartbeatInterval !== null) {
        clearInterval(heartbeatInterval);
        heartbeatInterval = null;
      }
      isClosed = true;
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET",
      "Access-Control-Allow-Headers": "Cache-Control",
    },
  });
}
