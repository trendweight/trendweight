export interface ProfileData {
  userId: string
  displayName: string
  timezone: string
  created: string
  modified: string
}

export interface SettingsData {
  userId: string
  goalWeightEnabled: boolean
  goalWeight?: number
  goalDate?: string
  unit: 'lbs' | 'kg' | 'stone'
  movingAverageSize: number
  allowDataSharing: boolean
  created: string
  modified: string
}

// Response structure from the settings API endpoint
export interface SettingsResponse {
  user: SettingsData
  timestamp: string
}

export interface Measurement {
  date: string
  weight: number
  trend?: number
  change?: number
}

export interface ChartData {
  measurements: Measurement[]
  startDate: string
  endDate: string
  currentWeight?: number
  currentTrend?: number
}

// Test endpoint data for authentication verification
export interface TestData {
  userId: string
  email: string
  claims: Record<string, string | number | boolean>
}

// Source data from /api/data endpoint
export interface SourceData {
  source: string  // "withings" or "fitbit"
  lastUpdate: string  // ISO timestamp
  measurements?: Array<{
    timestamp: number  // Unix timestamp
    weight: number
    fatRatio?: number
  }>
}