import { Box, Flex, Heading } from "@chakra-ui/layout";
import React, { FC } from "react";
import { HomeWidgetProps } from "./MainContent";

const Blurb: FC<HomeWidgetProps> = ({ area }) => (
  <Flex gridArea={area} direction="column" alignItems="center" justifyContent="center" pr={{ md: 6 }}>
    <Box>
      <Heading fontSize="2xl">Am I losing weight?</Heading>
      <Box pb={4}>TrendWeight can help answer that question by analyzing your day to day weight changes</Box>
      <Box pb={4}>
        <b>Step 1</b>: Weigh yourself every day.
        <br />
        <b>Step 2</b>: There is no Step 2!
      </Box>
      <Box pb={4}>
        <i>Losing weight is hard</i>. Don't beat yourself just because your weight is higher today than it was
        yesterday.
      </Box>
      <Box>
        Our weight fluctuates—it just does. That's completely normal. TrendWeight is a tool that helps you focus on your
        weight <i>trend</i> over time instead of day to day changes.
      </Box>
    </Box>
  </Flex>
);

export default Blurb;
