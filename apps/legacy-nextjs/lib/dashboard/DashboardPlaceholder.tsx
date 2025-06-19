import { Box, Stack } from "@chakra-ui/react";
import React from "react";
import Loading from "../shared/Loading";
import PlaceholderGraph from "../shared/placeholder/PlaceholderGraph";
import PlaceholderGrid from "../shared/placeholder/PlaceholderGrid";
import PlaceholderParagraph from "../shared/placeholder/PlaceholderParagraph";

const DashboardPlaceholder = () => {
  return (
    <>
      <Stack direction="column" spacing={4}>
        <Stack direction="row">
          <Loading />
          <Box>Getting updated weight data...</Box>
        </Stack>
        <Stack direction="row" spacing={4}>
          <Box h={{ base: "240px", md: "280px", lg: "325px", xl: "420px" }} w={{ base: "full", md: "475px", lg: "650px", xl: "840px" }}>
            <PlaceholderGraph />
          </Box>
        </Stack>
        <Stack direction={{ base: "column-reverse", md: "row" }} spacing={{ base: 4, md: 12, lg: 20 }}>
          <Box w={{ base: "full", md: "280px" }}>
            <PlaceholderGrid columns={3} rows={14} active />
          </Box>
          <Box w={{ base: "full", md: "33%" }}>
            <PlaceholderParagraph rows={8} active />
          </Box>
        </Stack>
      </Stack>
    </>
  );
};

export default DashboardPlaceholder;
