"use client";

import {
  QueryClient,
  QueryClientProvider,
  useQueryClient,
} from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { ReactNode, useState } from "react";
import { Toaster } from "sonner";
import dynamic from "next/dynamic";
import { useRealtime } from "@/hooks/useRealtime";
import { toast } from "sonner";
import { TenantProvider } from "@/contexts/tenant-context";

function RealtimeBridge() {
  const qc = useQueryClient();
  useRealtime({
    "booking.created": (p) => {
      toast.success("Réservation créée");
      qc.invalidateQueries();
    },
    "booking.updated": (p) => {
      toast("Réservation mise à jour");
      qc.invalidateQueries();
    },
    "booking.cancelled": (p) => {
      toast("Réservation annulée");
      qc.invalidateQueries();
    },
    "chat.message": () => {},
    "checkin.updated": () => {},
  });
  return null;
}

const GlobalSearchModal = dynamic(
  () => import("@/components/widgets/GlobalSearchModal"),
  { ssr: false }
);

type AppProvidersProps = {
  children: ReactNode;
};

export default function AppProviders({ children }: AppProvidersProps) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <SessionProvider
      baseUrl={process.env.NEXTAUTH_URL || "http://localhost:3000"}
      basePath="/api/auth"
    >
      <QueryClientProvider client={queryClient}>
        <TenantProvider>
          {children}
          <Toaster richColors position="top-right" />
          <GlobalSearchModal />
          <RealtimeBridge />
        </TenantProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}
