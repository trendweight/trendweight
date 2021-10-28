import { Flex } from "@chakra-ui/react";
import React from "react";
import { Page } from "../lib/core/page";
import Banner from "../lib/home/Banner";
import MainContent from "../lib/home/MainContent";
import Footer from "../lib/layout/Footer";

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
