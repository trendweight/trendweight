import { useQuery, useSuspenseQuery, useSuspenseQueries } from "@tanstack/react-query";
import { apiRequest } from "./client";
import type { ProfileResponse, ApiSourceData } from "./types";
import type { ProfileData, SettingsData } from "../core/interfaces";

// Query keys
export const queryKeys = {
  profile: ["profile"] as const,
  data: ["data"] as const,
};

// Query options for reuse
const queryOptions = {
  profile: {
    queryKey: queryKeys.profile,
    queryFn: () => apiRequest<ProfileResponse>("/profile"),
  },
  data: {
    queryKey: queryKeys.data,
    queryFn: () => apiRequest<ApiSourceData[]>("/data"),
    staleTime: 60000, // 1 minute (matching legacy React Query config)
  },
};

// Profile query (with suspense) - returns just ProfileData for dashboard
export function useProfile() {
  return useSuspenseQuery({
    ...queryOptions.profile,
    select: (data: ProfileResponse): ProfileData => ({
      firstName: data.user.firstName,
      timezone: data.user.timezone,
      goalStart: data.user.goalStart,
      goalWeight: data.user.goalWeight,
      plannedPoundsPerWeek: data.user.plannedPoundsPerWeek,
      dayStartOffset: data.user.dayStartOffset,
      useMetric: data.user.useMetric,
      showCalories: data.user.showCalories,
      sharingToken: data.user.sharingToken,
    }),
  });
}

// Settings query - returns full SettingsData including email/uid
export function useSettings() {
  return useQuery({
    ...queryOptions.profile,
    select: (data: ProfileResponse): SettingsData => data.user,
  });
}

// Combined profile and measurement data query with suspense (loads in parallel)
export function useDashboardQueries() {
  const results = useSuspenseQueries({
    queries: [
      {
        ...queryOptions.profile,
        select: (data: ProfileResponse): ProfileData => ({
          firstName: data.user.firstName,
          timezone: data.user.timezone,
          goalStart: data.user.goalStart,
          goalWeight: data.user.goalWeight,
          plannedPoundsPerWeek: data.user.plannedPoundsPerWeek,
          dayStartOffset: data.user.dayStartOffset,
          useMetric: data.user.useMetric,
          showCalories: data.user.showCalories,
          sharingToken: data.user.sharingToken,
        }),
      },
      queryOptions.data,
    ],
  });

  return {
    profile: results[0].data,
    measurementData: results[1].data,
  };
}
