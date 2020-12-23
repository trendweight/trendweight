import { Box, Flex, Grid } from "@chakra-ui/react";
import React from "react";
import { Blurb } from "~/components/home/Blurb";
import { HomeChart } from "~/components/home/HomeChart";
import { HomeHeader } from "~/components/home/HomeHeader";
import { InfoButtons } from "~/components/home/InfoButtons";
import { WorksWith } from "~/components/home/WorksWith";
import Footer from "~/components/layout/Footer";
import { ResponsiveContainer } from "~/components/layout/ResponsiveContainer";

const Home = () => {
  return (
    <>
      <Flex direction="column" minH="100vh">
        <HomeHeader />
        <Box flexGrow={1} flexShrink={1} position="relative">
          <ResponsiveContainer px={{ base: 4, md: 4 }}>
            <Grid
              templateColumns="2fr 3fr"
              templateAreas={{
                base: '"blurb blurb" "buttons buttons" "chart chart" "works works" "evolution evolution"',
                md: '"blurb chart" "buttons buttons" "works works" "evolution evolution"',
              }}
              pt={6}
              rowGap={12}
            >
              <InfoButtons />
              <Blurb />
              <HomeChart />
              <WorksWith />
            </Grid>
          </ResponsiveContainer>
        </Box>
        <Footer />
      </Flex>
    </>
  );
};

export default Home;
