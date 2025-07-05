import type { FC, PropsWithChildren } from "react"
import { dashboardContext, type DashboardData } from "./dashboardContext"

export const DashboardProvider: FC<PropsWithChildren<{ data: DashboardData }>> = ({ data, children }) => (
  <dashboardContext.Provider value={data}>{children}</dashboardContext.Provider>
)