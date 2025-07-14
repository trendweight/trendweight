import { useSuspenseQuery, useSuspenseQueries } from "@tanstack/react-query";
import { apiRequest, ApiError } from "./client";
import type { ProfileResponse, ProviderLink, MeasurementsResponse } from "./types";
import type { ProfileData, SettingsData } from "../core/interfaces";
import { getDemoData, getDemoProfile } from "../demo/demoData";

// Query keys
export const queryKeys = {
  profile: ["profile"] as const,
  data: ["data"] as const,
  providerLinks: ["providerLinks"] as const,
};

// Query options for reuse
export const queryOptions = {
  profile: {
    queryKey: queryKeys.profile,
    queryFn: async () => {
      try {
        return await apiRequest<ProfileResponse>("/profile");
      } catch (error) {
        if (error instanceof ApiError && error.status === 404) {
          // Return null for 404s (user exists but no profile yet)
          return null;
        }
        throw error;
      }
    },
  },
  data: {
    queryKey: queryKeys.data,
    queryFn: () => apiRequest<MeasurementsResponse>("/data"),
    staleTime: 60000, // 1 minute (matching legacy React Query config)
  },
  providerLinks: {
    queryKey: queryKeys.providerLinks,
    queryFn: async () => {
      try {
        return await apiRequest<ProviderLink[]>("/providers/links");
      } catch (error) {
        if (error instanceof ApiError && error.status === 404) {
          // Return empty array for 404s (no provider links yet)
          return [];
        }
        throw error;
      }
    },
  },
};

// Profile query (with suspense) - returns just ProfileData for dashboard
export function useProfile() {
  return useSuspenseQuery({
    ...queryOptions.profile,
    select: (data: ProfileResponse | null): ProfileData | null => {
      if (!data) return null;
      return {
        firstName: data.user.firstName,
        goalStart: data.user.goalStart,
        goalWeight: data.user.goalWeight,
        plannedPoundsPerWeek: data.user.plannedPoundsPerWeek,
        dayStartOffset: data.user.dayStartOffset,
        useMetric: data.user.useMetric,
        showCalories: data.user.showCalories,
        sharingToken: data.user.sharingToken,
      };
    },
  });
}

// Settings query - returns full SettingsData including email/uid
export function useSettings() {
  return useSuspenseQuery({
    ...queryOptions.profile,
    select: (data: ProfileResponse | null): SettingsData | null => {
      if (!data) return null;
      return data.user;
    },
  });
}

// Combined profile and measurement data query with suspense (loads in parallel)
export function useDashboardQueries(demoMode?: boolean) {
  // Create demo query options that match the expected types
  const demoQueryOptions = {
    profile: {
      queryKey: ["demo-profile"] as const,
      queryFn: async (): Promise<ProfileResponse> => {
        const demoProfile = getDemoProfile();
        return {
          user: {
            ...demoProfile,
            uid: "demo",
            email: "demo@example.com",
          },
          timestamp: new Date().toISOString(),
        };
      },
    },
    data: {
      queryKey: ["demo-data"] as const,
      queryFn: async (): Promise<MeasurementsResponse> => getDemoData(),
    },
  };

  // Always call the hook with consistent types
  const results = useSuspenseQueries({
    queries: [
      {
        ...(demoMode ? demoQueryOptions.profile : queryOptions.profile),
        select: (data: ProfileResponse | null): ProfileData | null => {
          if (!data) return null;
          return {
            firstName: data.user.firstName,
            goalStart: data.user.goalStart,
            goalWeight: data.user.goalWeight,
            plannedPoundsPerWeek: data.user.plannedPoundsPerWeek,
            dayStartOffset: data.user.dayStartOffset,
            useMetric: data.user.useMetric,
            showCalories: data.user.showCalories,
            sharingToken: data.user.sharingToken,
          };
        },
      },
      demoMode ? demoQueryOptions.data : queryOptions.data,
    ],
  });

  const profileResult = results[0];
  const dataResult = results[1];
  const measurementsResponse = dataResult.data;

  return {
    profile: profileResult.data,
    measurementData: measurementsResponse.data,
    providerStatus: measurementsResponse.providerStatus,
    profileError: profileResult.data === null ? new ApiError(404, "Profile not found") : null,
  };
}

// Provider links query
export function useProviderLinks() {
  return useSuspenseQuery(queryOptions.providerLinks);
}
