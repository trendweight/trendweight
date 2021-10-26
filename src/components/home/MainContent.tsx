import { Grid } from "@chakra-ui/react";
import React from "react";
import LayoutContainer from "../layout/LayoutContainer";
import Blurb from "./Blurb";
import InfoButtons from "./InfoButtons";
import SampleChart from "./SampleChart";
import WorksWith from "./WorksWith";

export interface HomeWidgetProps {
  area: string;
}

const MainContent = () => {
  return (
    <LayoutContainer p={4} py={{ md: 6 }} flexGrow={1} flexShrink={1}>
      <Grid
        gridTemplateColumns={{ base: "1fr", md: "2fr 3fr" }}
        gridTemplateAreas={{
          base: ` "blurb" 
                  "buttons"
                  "chart"
                  "works"`,
          md: ` "blurb chart" 
                "buttons buttons"
                "works works"`,
        }}
        gap={{ base: 6, md: 10 }}
      >
        <InfoButtons area="buttons" />
        <Blurb area="blurb" />
        <SampleChart area="chart" />
        <WorksWith area="works" />
      </Grid>
    </LayoutContainer>
  );
};

export default MainContent;
