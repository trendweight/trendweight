import { Box, Center, Image } from "@chakra-ui/react";
import React from "react";

const SampleChart = () => (
  <Center gridArea="chart">
    <Box position="relative">
      <Image
        src="/assets/chart-home.png"
        height={{
          base: "auto",
          xl: 400,
        }}
        width="auto"
      />
    </Box>
  </Center>
);

export default SampleChart;
