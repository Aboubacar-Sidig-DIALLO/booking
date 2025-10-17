"use client";
type Props = { params: { id: string } };
import Chat from "@/components/chat/ChatBox";

export default function BookingDetailPage({ params }: Props) {
  return (
    <main className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Réservation #{params.id}</h1>
        <p className="text-neutral-600 dark:text-neutral-300">
          Détails & chat en temps réel
        </p>
      </div>
      <div>
        <Chat bookingId={params.id} />
      </div>
    </main>
  );
}
