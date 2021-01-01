import { useQuery } from "react-query";
import { get } from "~/lib/fetch";

export interface WhoAmIResponse {
  uid: string;
  email: string;
}

const getWhoAmI = async () => {
  return await get<WhoAmIResponse>("/api/whoami");
};

export const useWhoAmI = () => {
  return useQuery("whoami", getWhoAmI);
};
