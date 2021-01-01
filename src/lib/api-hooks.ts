import { useQuery } from "react-query";
import { get } from "~/lib/fetch";

export interface WhoAmIResult {
  uid: string;
  email: string;
}

const getWhoAmI = async () => {
  return await get<WhoAmIResult>("/api/whoami");
};

export const useWhoAmI = () => {
  return useQuery("whoami", getWhoAmI);
};
