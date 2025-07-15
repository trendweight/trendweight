import { useSuspenseQuery, useSuspenseQueries } from "@tanstack/react-query";
import { apiRequest, ApiError } from "./client";
import type { ProfileResponse, ProviderLink, MeasurementsResponse } from "./types";
import type { ProfileData, SettingsData, SharingData } from "../core/interfaces";
import { getDemoData, getDemoProfile } from "../demo/demoData";

// Query key helpers
const createQueryKey = <T extends readonly unknown[]>(base: T, sharingCode?: string): T | readonly [...T, string] => {
  return sharingCode ? ([...base, sharingCode] as const) : base;
};

// Query keys
export const queryKeys = {
  profile: (sharingCode?: string) => createQueryKey(["profile"] as const, sharingCode),
  data: (sharingCode?: string) => createQueryKey(["data"] as const, sharingCode),
  providerLinks: (sharingCode?: string) => createQueryKey(["providerLinks"] as const, sharingCode),
  sharing: ["sharing"] as const,
};

// Query options for reuse
export const queryOptions = {
  profile: (sharingCode?: string) => ({
    queryKey: queryKeys.profile(sharingCode),
    queryFn: async () => {
      try {
        const endpoint = sharingCode ? `/profile/${sharingCode}` : "/profile";
        return await apiRequest<ProfileResponse>(endpoint);
      } catch (error) {
        if (error instanceof ApiError && error.status === 404) {
          // Return null for 404s (user exists but no profile yet)
          return null;
        }
        throw error;
      }
    },
  }),
  data: (sharingCode?: string) => ({
    queryKey: queryKeys.data(sharingCode),
    queryFn: () => apiRequest<MeasurementsResponse>(sharingCode ? `/data/${sharingCode}` : "/data"),
    staleTime: 60000, // 1 minute (matching legacy React Query config)
  }),
  providerLinks: (sharingCode?: string) => ({
    queryKey: queryKeys.providerLinks(sharingCode),
    queryFn: async () => {
      try {
        const endpoint = sharingCode ? `/providers/links/${sharingCode}` : "/providers/links";
        return await apiRequest<ProviderLink[]>(endpoint);
      } catch (error) {
        if (error instanceof ApiError && error.status === 404) {
          // Return empty array for 404s (no provider links yet)
          return [];
        }
        throw error;
      }
    },
  }),
  sharing: {
    queryKey: queryKeys.sharing,
    queryFn: () => apiRequest<SharingData>("/sharing"),
  },
};

// Profile query (with suspense) - returns just ProfileData for dashboard
export function useProfile() {
  return useSuspenseQuery({
    ...queryOptions.profile(),
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
        sharingEnabled: data.user.sharingEnabled,
      };
    },
  });
}

// Settings query - returns full SettingsData including email/uid
export function useSettings() {
  return useSuspenseQuery({
    ...queryOptions.profile(),
    select: (data: ProfileResponse | null): SettingsData | null => {
      if (!data) return null;
      return data.user;
    },
  });
}

// Combined profile and measurement data query with suspense (loads in parallel)
export function useDashboardQueries(sharingCode?: string) {
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
          isMe: false,
          timestamp: new Date().toISOString(),
        };
      },
    },
    data: {
      queryKey: ["demo-data"] as const,
      queryFn: async (): Promise<MeasurementsResponse> => ({
        ...getDemoData(),
        isMe: false,
      }),
    },
  };

  // Determine which query options to use
  const queryOptionsToUse = sharingCode === "demo" ? demoQueryOptions : { profile: queryOptions.profile(sharingCode), data: queryOptions.data(sharingCode) };

  // Always call the hook with consistent types
  const results = useSuspenseQueries({
    queries: [
      {
        ...queryOptionsToUse.profile,
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
      queryOptionsToUse.data,
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
    isMe: measurementsResponse.isMe ?? true,
  };
}

// Provider links query
export function useProviderLinks() {
  return useSuspenseQuery(queryOptions.providerLinks());
}

// Sharing settings query
export function useSharingSettings() {
  return useSuspenseQuery(queryOptions.sharing);
}
