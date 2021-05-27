import equal from "fast-deep-equal";
import { UseQueryOptions } from "react-query";
import { Profile, Settings, SourceData } from "~/lib/interfaces";
import { ApiError } from "./exceptions";
import { get } from "./fetch";

type Query<TData> = UseQueryOptions<TData, ApiError>;

export const profileQuery = (user?: string): Query<Profile> => ({
  queryKey: ["profile", user],
  queryFn: () => get(`/api/profile`),
});

export const sourceDataQuery = (user?: string): Query<SourceData[]> => ({
  queryKey: ["data", user],
  queryFn: () => get(`/api/data`),
  staleTime: 60000,
  isDataEqual: (prev, cur) =>
    equal(
      prev?.map(({ lastUpdate: _, ...rest }) => ({ ...rest })),
      cur.map(({ lastUpdate: _, ...rest }) => ({ ...rest }))
    ),
});

export const settingsQuery = (): Query<Settings> => ({
  queryKey: "settings",
  queryFn: () => get("/api/settings"),
});
