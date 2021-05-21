import { UseQueryOptions } from "react-query";
import { Profile, SourceData } from "../data/interfaces";
import { SettingsData } from "../settings";
import { ApiError } from "./exceptions";
import { get } from "./fetch";

type Query<TData> = UseQueryOptions<TData, ApiError>;

export const profileQuery = (user?: string): Query<Profile> => ({
  queryKey: ["profile", user],
  queryFn: () => get(`/api/profile/${user || "me"}`),
});

export const sourceDataQuery = (user?: string): Query<SourceData[]> => ({
  queryKey: ["data", user],
  queryFn: () => get(`/api/data`),
  staleTime: 60000,
});

export const settingsQuery = (): Query<SettingsData> => ({
  queryKey: "settings",
  queryFn: () => get("/api/settings"),
});
