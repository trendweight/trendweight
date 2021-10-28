import { Flex } from "@chakra-ui/react";
import { FC, PropsWithChildren } from "react";
import Footer from "./Footer";
import Header from "./Header";
import LayoutContainer from "./LayoutContainer";

const Layout: FC<PropsWithChildren<{ flex?: boolean }>> = ({ children }) => {
  return (
    <Flex direction="column" minH="100vh">
      <Header />
      <LayoutContainer as="main" flexGrow={1} flexShrink={1} p={4} py={{ md: 6 }}>
        {children}
      </LayoutContainer>
      <Footer />
    </Flex>
  );
};

export default Layout;
