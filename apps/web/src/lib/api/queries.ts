import { useQuery, useSuspenseQuery } from '@tanstack/react-query'
import { apiRequest } from './client'
import type { ProfileData, SettingsData, ChartData } from './types'

// Query keys
export const queryKeys = {
  profile: ['profile'] as const,
  settings: ['settings'] as const,
  chart: (days: number) => ['chart', days] as const,
}

// Profile query (with suspense)
export function useProfile() {
  return useSuspenseQuery({
    queryKey: queryKeys.profile,
    queryFn: () => apiRequest<ProfileData>('/profile'),
  })
}

// Settings query (with suspense)
export function useSettings() {
  return useSuspenseQuery({
    queryKey: queryKeys.settings,
    queryFn: () => apiRequest<SettingsData>('/settings'),
  })
}

// Chart data query
export function useChartData(days: number = 30) {
  return useQuery({
    queryKey: queryKeys.chart(days),
    queryFn: () => apiRequest<ChartData>(`/data/chart?days=${days}`),
  })
}