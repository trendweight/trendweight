import { Flex, Grid } from "@chakra-ui/react";
import React from "react";
import Banner from "~/components/home/Banner";
import Blurb from "~/components/home/Blurb";
import InfoButtons from "~/components/home/InfoButtons";
import SampleChart from "~/components/home/SampleChart";
import WorksWith from "~/components/home/WorksWith";
import Footer from "~/components/layout/Footer";
import ResponsiveContainer from "~/components/layout/ResponsiveContainer";

const Home = () => {
  return (
    <Flex direction="column" minH="100vh">
      <Banner />
      <ResponsiveContainer flexGrow={1} flexShrink={1} position="relative" p={{ base: 4, md: 4 }}>
        <Grid
          templateColumns="2fr 3fr"
          templateAreas={{
            base: '"blurb blurb" "buttons buttons" "chart chart" "works works" "evolution evolution"',
            md: '"blurb chart" "buttons buttons" "works works" "evolution evolution"',
          }}
          rowGap={{ base: 6, md: 10 }}
        >
          <InfoButtons />
          <Blurb />
          <SampleChart />
          <WorksWith />
        </Grid>
      </ResponsiveContainer>
      <Footer />
    </Flex>
  );
};

Home.bypassShell = true;

export default Home;
