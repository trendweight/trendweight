import { useQuery } from "react-query";
import { get } from "~/lib/api/fetch";
import { ApiError } from "../api/exceptions";
import { SettingsData } from "../settings";

const getData = async () => {
  return await get<SettingsData>("/api/data");
};

export const useData = () => {
  return useQuery<SettingsData, ApiError>("data", getData, { staleTime: 60000, retry: false });
};
