export interface ProfileData {
  firstName: string
  timezone: string
  goalStart?: string
  goalWeight?: number
  plannedPoundsPerWeek?: number
  dayStartOffset?: number
  useMetric: boolean
  showCalories?: boolean
  sharingToken?: string
}

export interface SettingsData extends ProfileData {
  uid: string
  email: string
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