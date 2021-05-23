import { Box } from "@chakra-ui/layout";
import { Stack } from "@chakra-ui/react";
import { Spinner } from "@chakra-ui/spinner";
import React from "react";
import Placeholder from "rsuite/lib/Placeholder";

const DashboardPlaceholder = () => {
  const ParagraphPlaceholder = Placeholder.Paragraph;
  const GraphPlaceholder = Placeholder.Graph;
  const GridPlaceholder = Placeholder.Grid;
  return (
    <>
      <Stack direction="column" spacing={4}>
        <Stack direction="row">
          <Spinner color="gray.200" thickness="3px" />
          <Box>Getting updated weight data...</Box>
        </Stack>
        <Stack direction="row" spacing={4}>
          <Box h="240px" w="650px">
            <GraphPlaceholder />
          </Box>
        </Stack>
        <Stack direction="row" spacing={12}>
          <Box w="25%">
            <GridPlaceholder columns={3} rows={14} />
          </Box>
          <Box w="33%">
            <ParagraphPlaceholder rows={8} />
          </Box>
        </Stack>
      </Stack>
    </>
  );
};

export default DashboardPlaceholder;
