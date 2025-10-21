import { redirect } from "next/navigation";

interface TenantPageProps {
  params: {
    slug: string;
  };
}

export default function TenantPage({ params }: TenantPageProps) {
  // Rediriger vers la page home avec le slug en paramètre
  redirect(`/tenant/${params.slug}/home`);
}
