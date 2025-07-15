import type { SettingsData } from "../core/interfaces";

// Response structure from the profile API endpoint
export interface ProfileResponse {
  user: SettingsData;
  timestamp: string;
  isMe?: boolean;
}

export interface Measurement {
  date: string;
  weight: number;
  trend?: number;
  change?: number;
}

export interface ChartData {
  measurements: Measurement[];
  startDate: string;
  endDate: string;
  currentWeight?: number;
  currentTrend?: number;
}

// Test endpoint data for authentication verification
export interface TestData {
  userId: string;
  email: string;
  claims: Record<string, string | number | boolean>;
}

// Source data from /api/data endpoint
export interface ApiSourceData {
  source: string; // "withings" or "fitbit"
  lastUpdate: string; // ISO timestamp
  measurements?: Array<{
    date: string; // "2024-01-15"
    time: string; // "06:30:00"
    weight: number;
    fatRatio?: number;
  }>;
}

// Provider link from /api/providers/links endpoint
export interface ProviderLink {
  provider: string;
  connectedAt: string;
  updateReason?: string;
  hasToken: boolean;
}

// Provider sync status
export interface ProviderSyncStatus {
  success: boolean;
  error?: "authfailed" | "networkerror" | "unknown";
  message?: string;
}

// Enhanced measurements response from /api/data endpoint
export interface MeasurementsResponse {
  data: ApiSourceData[];
  providerStatus: Record<string, ProviderSyncStatus>;
  isMe?: boolean;
}
