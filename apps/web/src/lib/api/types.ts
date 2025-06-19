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