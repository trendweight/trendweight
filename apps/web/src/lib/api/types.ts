import type { SettingsData } from "../core/interfaces";

// Response structure from the profile API endpoint
export interface ProfileResponse {
  user: SettingsData;
  timestamp: string;
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
    timestamp: number; // Unix timestamp
    weight: number;
    fatRatio?: number;
  }>;
}
