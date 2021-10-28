import { Flex } from "@chakra-ui/react";
import React from "react";
import Banner from "../modules/home/Banner";
import MainContent from "../modules/home/MainContent";
import Footer from "../modules/layout/Footer";
import { Page } from "../modules/shared/page";

const Home: Page = () => {
  return (
    <Flex direction="column" minH="100vh">
      <Banner />
      <MainContent />
      <Footer />
    </Flex>
  );
};

Home.bypassShell = true;
Home.title = "TrendWeight";

export default Home;
