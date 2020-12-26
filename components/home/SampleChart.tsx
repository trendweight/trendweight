import { Box, Center, Image } from "@chakra-ui/react";
import React from "react";

const SampleChart = () => (
  <Center gridArea="chart" pb={8}>
    <Box position="relative">
      <Image
        src="/assets/chart.png"
        height={
          {
            base: "auto",
            md: 220,
            lg: 285,
            xl: 370,
          } as any
        }
        width={850}
        maxW="100%"
        fit="contain"
      />
      <Image
        src="/assets/withings-scale-white.png"
        height={{ base: 120, md: 180 } as any}
        width={{ base: 120, md: 180 } as any}
        maxW="25%"
        fit="contain"
        objectPosition="right bottom"
        position="absolute"
        left={5}
        bottom={"-10%"}
      />
    </Box>
  </Center>
);

export default SampleChart;
