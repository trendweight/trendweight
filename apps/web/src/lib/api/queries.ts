import { useQuery, useSuspenseQuery, type UseQueryOptions } from '@tanstack/react-query'
import { apiRequest } from './client'
import type { ProfileData, SettingsData, SettingsResponse, ChartData, TestData, SourceData } from './types'

// Query keys
export const queryKeys = {
  profile: ['profile'] as const,
  settings: ['settings'] as const,
  chart: (days: number) => ['chart', days] as const,
  test: ['test'] as const,
  data: ['data'] as const,
}

// Profile query (with suspense)
export function useProfile() {
  return useSuspenseQuery({
    queryKey: queryKeys.profile,
    queryFn: () => apiRequest<ProfileData>('/profile'),
  })
}

// Settings query
export function useSettings(
  options?: Omit<UseQueryOptions<SettingsResponse, Error, SettingsData, typeof queryKeys.settings>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: queryKeys.settings,
    queryFn: () => apiRequest<SettingsResponse>('/settings'),
    select: (data) => data.user, // Extract the user settings from the nested response
    ...options,
  })
}

// Chart data query
export function useChartData(days: number = 30) {
  return useQuery({
    queryKey: queryKeys.chart(days),
    queryFn: () => apiRequest<ChartData>(`/data/chart?days=${days}`),
  })
}

// Test endpoint query (for verifying authentication)
export function useTestData(
  options?: Omit<UseQueryOptions<TestData, Error, TestData, typeof queryKeys.test>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: queryKeys.test,
    queryFn: () => apiRequest<TestData>('/Test'),
    ...options,
  })
}

// Measurement data query (matches legacy behavior - refresh handled server-side)
export function useMeasurementData(
  options?: Omit<UseQueryOptions<SourceData[], Error, SourceData[], typeof queryKeys.data>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: queryKeys.data,
    queryFn: () => apiRequest<SourceData[]>('/data'),
    staleTime: 60000, // 1 minute (matching legacy React Query config)
    ...options,
  })
}