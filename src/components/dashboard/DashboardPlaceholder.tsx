import { Box } from "@chakra-ui/layout";
import { Stack } from "@chakra-ui/react";
import { Spinner } from "@chakra-ui/spinner";
import React from "react";
import PlaceholderGraph from "../shared/placeholder/PlaceholderGraph";
import PlaceholderGrid from "../shared/placeholder/PlaceholderGrid";
import PlaceholderParagraph from "../shared/placeholder/PlaceholderParagraph";

const DashboardPlaceholder = () => {
  return (
    <>
      <Stack direction="column" spacing={4}>
        <Stack direction="row">
          <Spinner color="gray.200" thickness="3px" />
          <Box>Getting updated weight data...</Box>
        </Stack>
        <Stack direction="row" spacing={4}>
          <Box h="240px" w="650px">
            <PlaceholderGraph active />
          </Box>
        </Stack>
        <Stack direction="row" spacing={12}>
          <Box w="25%">
            <PlaceholderGrid columns={3} rows={14} active />
          </Box>
          <Box w="33%">
            <PlaceholderParagraph rows={8} active />
          </Box>
        </Stack>
      </Stack>
    </>
  );
};

export default DashboardPlaceholder;
