import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "./client";
import { queryKeys } from "./queries";
import type { ProfileResponse } from "./types";

interface UpdateProfileData {
  firstName?: string;
  timezone?: string;
  goalStart?: string;
  goalWeight?: number;
  plannedPoundsPerWeek?: number;
  dayStartOffset?: number;
  useMetric?: boolean;
  showCalories?: boolean;
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileData) =>
      apiRequest<ProfileResponse>("/profile", {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    onSuccess: (data) => {
      // Update the cache with the new data
      queryClient.setQueryData(queryKeys.profile, data);
      // Invalidate to ensure fresh data
      queryClient.invalidateQueries({ queryKey: queryKeys.profile });
    },
  });
}

export function useDisconnectProvider() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (provider: string) => apiRequest(`/providers/${provider}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.providerLinks });
    },
  });
}

export function useResyncProvider() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (provider: string) => apiRequest(`/providers/${provider}/resync`, { method: "POST" }),
    onSuccess: () => {
      // Invalidate data query to refresh measurements after resync
      queryClient.invalidateQueries({ queryKey: queryKeys.data });
    },
  });
}

export function useReconnectProvider() {
  return useMutation({
    mutationFn: async (provider: string) => {
      const endpoint = provider === "fitbit" ? "/fitbit/link" : "/withings/link";
      return apiRequest<{ url?: string; authorizationUrl?: string }>(endpoint);
    },
  });
}
