import { Suspense } from "react";
import RoomTimelineClient from "./timeline-client";
import { Skeleton } from "@/components/common/Skeleton";

type Props = { params: { roomId: string } };

export default function RoomDetailPage({ params }: Props) {
  return (
    <main className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Salle #{params.roomId}</h1>
        <p className="text-neutral-600 dark:text-neutral-300">
          Disponibilités et réservations
        </p>
      </div>
      <Suspense fallback={<Skeleton className="h-40 w-full" />}>
        {/* composant client avec Query + motion */}
        <RoomTimelineClient roomId={params.roomId} />
      </Suspense>
    </main>
  );
}
