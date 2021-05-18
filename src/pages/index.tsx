import { Flex } from "@chakra-ui/layout";
import React from "react";
import Banner from "~/components/home/Banner";
import MainContent from "~/components/home/MainContent";
import Footer from "~/components/layout/Footer";
import { Page } from "~/lib/core/page";

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
