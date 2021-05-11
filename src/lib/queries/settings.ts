import { useQuery } from "react-query";
import { get } from "~/lib/api/fetch";
import { SettingsData } from "../settings";

const getSettings = async () => {
  return await get<SettingsData>("/api/settings");
};

export const useSettings = () => {
  return useQuery("settings", getSettings);
};
