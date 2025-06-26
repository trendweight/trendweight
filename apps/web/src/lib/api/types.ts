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

// Withings test endpoint response
export interface WithingsTestResponse {
  measurements: Array<{
    date: string
    weight: number
    fatMass?: number
    fatFreeMass?: number
    fatRatio?: number
  }>
  pagination: {
    more: boolean
    offset: number
  }
  timezone: string
  tokenInfo: {
    userId: string
    expiresAt: string
    isRefreshed: boolean
  }
}