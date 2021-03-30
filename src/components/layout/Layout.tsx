import { FC, PropsWithChildren } from "react";
import Footer from "./Footer";
import Header from "./Header";
import ResponsiveContainer from "./ResponsiveContainer";

const Layout: FC<PropsWithChildren<{ flex?: boolean }>> = ({ children }) => (
  <Flex direction="column" minH="100vh">
    <Header />
    <ResponsiveContainer as="main" flexGrow={1} flexShrink={1} p={{ base: 4, md: 4 }}>
      {children}
    </ResponsiveContainer>
    <Footer />
  </Flex>
);

export default Layout;
