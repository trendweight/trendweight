import { Box, Stack } from "@chakra-ui/layout";
import React from "react";
import Logo from "~/components/shared/Logo";
import LayoutContainer from "../layout/LayoutContainer";

const Banner = () => {
  return (
    <Box bg="brand.500" color="white">
      <LayoutContainer px={4} py={14}>
        <Stack direction="column" spacing={1}>
          <Stack direction="row" alignItems="center">
            <Box fontFamily="Zilla Slab" pr={2} fontSize={{ base: "4xl", md: "6xl" }} fontWeight={700} lineHeight={1}>
              TrendWeight
            </Box>
            <Logo w={{ base: 77.13, md: 115.7 }} h={{ base: "32px", md: "48px" }} />
          </Stack>
          <Box fontSize="xl">
            Automated Weight Tracking<Box display={{ base: "none", md: "inline" }}>, Hacker's Diet Style</Box>
          </Box>
        </Stack>
      </LayoutContainer>
    </Box>
  );
};

export default Banner;
