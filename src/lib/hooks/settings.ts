import { useQuery } from "react-query";
import { get } from "~/lib/api/fetch";
import { SettingsData } from "~/lib/core/interfaces";

const getSettings = async () => {
  return await get<SettingsData>("/api/settings");
};

export const useSettings = () => {
  return useQuery("get-settings", getSettings);
};
