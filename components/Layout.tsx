import { FC, ReactNode } from "react";
import { ResponsiveContainer } from "./ResponsiveContainer";

const Layout: FC<{ children: ReactNode }> = ({ children }) => {
  return <ResponsiveContainer px={6}>{children}</ResponsiveContainer>;
};

export default Layout;
