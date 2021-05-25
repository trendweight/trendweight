import { LocalDate } from "@js-joda/core";
import { UseQueryOptions } from "react-query";
import { Profile, Settings, SourceData } from "~/lib/interfaces";
import { ApiError } from "./exceptions";
import { get } from "./fetch";

type Query<TData> = UseQueryOptions<TData, ApiError>;

export const profileQuery = (user?: string): Query<Profile> => ({
  queryKey: ["profile", user],
  queryFn: () => get(`/api/profile`),
  select: (data) => {
    if (data.goalStart && typeof data.goalStart === "string") {
      data.goalStart = LocalDate.parse(data.goalStart as string);
    }
    return data;
  },
});

export const sourceDataQuery = (user?: string): Query<SourceData[]> => ({
  queryKey: ["data", user],
  queryFn: () => get(`/api/data`),
  staleTime: 60000,
});

export const settingsQuery = (): Query<Settings> => ({
  queryKey: "settings",
  queryFn: () => get("/api/settings"),
});
