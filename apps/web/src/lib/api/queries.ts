import { useQuery, useSuspenseQuery, useSuspenseQueries } from "@tanstack/react-query";
import { apiRequest } from "./client";
import type { SettingsResponse, ApiSourceData } from "./types";
import type { ProfileData } from "../core/interfaces";

// Query keys
export const queryKeys = {
  profile: ["profile"] as const,
  settings: ["settings"] as const,
  data: ["data"] as const,
};

// Query options for reuse
const queryOptions = {
  profile: {
    queryKey: queryKeys.profile,
    queryFn: () => apiRequest<ProfileData>("/profile"),
  },
  settings: {
    queryKey: queryKeys.settings,
    queryFn: () => apiRequest<SettingsResponse>("/settings"),
    select: (data: SettingsResponse) => data.user, // Extract the user settings from the nested response
  },
  data: {
    queryKey: queryKeys.data,
    queryFn: () => apiRequest<ApiSourceData[]>("/data"),
    staleTime: 60000, // 1 minute (matching legacy React Query config)
  },
};

// Profile query (with suspense)
export function useProfile() {
  return useSuspenseQuery(queryOptions.profile);
}

// Settings query
export function useSettings() {
  return useQuery(queryOptions.settings);
}

// Combined profile and measurement data query with suspense (loads in parallel)
export function useDashboardQueries() {
  const results = useSuspenseQueries({
    queries: [queryOptions.profile, queryOptions.data],
  });

  return {
    profile: results[0].data,
    measurementData: results[1].data,
  };
}
