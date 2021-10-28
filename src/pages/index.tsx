import { Flex } from "@chakra-ui/react";
import React from "react";
import { Page } from "../modules/core/page";
import Banner from "../modules/home/Banner";
import MainContent from "../modules/home/MainContent";
import Footer from "../modules/layout/Footer";

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
