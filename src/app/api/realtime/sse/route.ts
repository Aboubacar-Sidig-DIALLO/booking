import { NextRequest } from "next/server";
import { redis } from "@/lib/upstash";

export async function GET(_req: NextRequest) {
  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();
      let isClosed = false;

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
          }
        }
      };

      // Heartbeat avec vérification de l'état
      const heartbeatInterval = setInterval(() => {
        if (!isClosed) {
          send("heartbeat", Date.now());
        } else {
          clearInterval(heartbeatInterval);
        }
      }, 15000);

      // Fonction de nettoyage
      const cleanup = () => {
        isClosed = true;
        clearInterval(heartbeatInterval);
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

      // Écouter les événements de fermeture
      if (typeof window !== "undefined") {
        window.addEventListener("beforeunload", handleClose);
        window.addEventListener("unload", handleClose);
      }

      // Retourner la fonction de nettoyage
      return cleanup;
    },

    cancel() {
      // Nettoyage quand le stream est annulé
      console.log("SSE stream cancelled");
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
