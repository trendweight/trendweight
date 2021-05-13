import { useQuery } from "react-query";
import { get } from "~/lib/api/fetch";
import { ApiError } from "../api/exceptions";
import { SourceData } from "../data/interfaces";

const getSourceData = async (_user?: string) => {
  return await get<SourceData[]>(`/api/data`);
};

export const useSourceData = (user?: string) => {
  return useQuery<SourceData[], ApiError>(["data", user], () => getSourceData(user), {
    staleTime: 60000,
    retry: false,
  });
};
