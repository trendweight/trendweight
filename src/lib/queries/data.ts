import { useQuery } from "react-query";
import { get } from "~/lib/api/fetch";
import { SettingsData } from "../settings";

const getData = async () => {
  return await get<SettingsData>("/api/data");
};

export const useData = () => {
  return useQuery("data", getData, { staleTime: 60000 });
};
