import { Organization, PlanType } from "@prisma/client";

export interface Tenant extends Organization {
  features: OrganizationFeature[];
}

export interface OrganizationFeature {
  id: string;
  organizationId: string;
  featureId: string;
  isEnabled: boolean;
  settings?: any;
  createdAt: Date;
  updatedAt: Date;
  feature: {
    id: string;
    name: string;
    icon?: string;
    description?: string;
  };
}

export interface TenantContextType {
  tenant: Tenant | null;
  setTenant: (tenant: Tenant | null) => void;
  isLoading: boolean;
  error: string | null;
}

export interface TenantResolutionResult {
  tenant: Tenant | null;
  method: "subdomain" | "domain" | "path" | "header" | null;
}

export const TENANT_FEATURES = {
  ANALYTICS: "analytics",
  RECURRING_BOOKINGS: "recurring_bookings",
  CUSTOM_BRANDING: "custom_branding",
  API_ACCESS: "api_access",
  ADVANCED_REPORTS: "advanced_reports",
  MULTI_SITE: "multi_site",
  INTEGRATIONS: "integrations",
  WHITE_LABEL: "white_label",
} as const;

export type TenantFeature =
  (typeof TENANT_FEATURES)[keyof typeof TENANT_FEATURES];

export interface TenantSettings {
  branding?: {
    logo?: string;
    primaryColor?: string;
    secondaryColor?: string;
    companyName?: string;
  };
  notifications?: {
    emailEnabled: boolean;
    smsEnabled: boolean;
    pushEnabled: boolean;
  };
  limits?: {
    maxUsers?: number;
    maxRooms?: number;
    maxBookingsPerMonth?: number;
  };
  integrations?: {
    calendarSync?: boolean;
    slackIntegration?: boolean;
    webhookUrl?: string;
  };
}
