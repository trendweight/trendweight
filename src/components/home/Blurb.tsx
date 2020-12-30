import { Box, Center, Heading, Text } from "@chakra-ui/react";
import React from "react";

const Blurb = () => (
  <Center gridArea="blurb" pr={{ md: 6 }}>
    <Box>
      <Heading fontSize="1.6rem" pb={4}>
        Am I losing weight?
      </Heading>
      <Text pb={4}>TrendWeight can help answer that question by analyzing your day to day weight changes</Text>
      <Text pb={4}>
        <Text as="b">Step 1</Text>: Weigh yourself every day.
        <br />
        <Text as="b">Step 2</Text>: There is no Step 2!
      </Text>
      <Text pb={4}>
        <i>Losing weight is hard</i>. Don't beat yourself just because your weight is higher today than it was
        yesterday.
      </Text>
      <Text>
        Our weight fluxuates—it just does. That's completely normal. TrendWeight is a tool that helps you focus on your
        weight <i>trend</i> over time instead of day to day changes.
      </Text>
    </Box>
  </Center>
);

export default Blurb;
