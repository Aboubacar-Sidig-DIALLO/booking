import { Suspense } from "react";
import RoomDetailClient from "./room-detail-client";
import { Skeleton } from "@/components/common/Skeleton";

type Props = { params: Promise<{ roomId: string }> };

export default async function RoomDetailPage({ params }: Props) {
  const { roomId } = await params;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50/50 to-slate-100/30">
      <Suspense
        fallback={
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-96 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
        }
      >
        <RoomDetailClient roomId={roomId} />
      </Suspense>
    </div>
  );
}
