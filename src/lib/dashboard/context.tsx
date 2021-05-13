import { createContext, FC, PropsWithChildren, useContext } from "react";
import { Measurement } from "../data/interfaces";
import { Mode, TimeRange } from "./interfaces";

export interface DashboardData {
  measurements?: Measurement[];
  mode: Mode;
  timeRange: TimeRange;
  setMode: (mode: Mode) => void;
  setTimeRange: (timeRange: TimeRange) => void;
}

const dashboardContext = createContext<DashboardData | undefined>(undefined);

export const DashboardProvider: FC<PropsWithChildren<{ data: DashboardData }>> = ({ data, children }) => (
  <dashboardContext.Provider value={data}>{children}</dashboardContext.Provider>
);

export const useDashboardData = () => {
  const data = useContext(dashboardContext);
  if (!data) {
    throw new Error("Called useDashboardData() when the provider is not present.");
  }
  return data;
};
