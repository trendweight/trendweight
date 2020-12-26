import { Box, Flex, Image as ChakraImage, Stack, Text, useBreakpointValue } from "@chakra-ui/react";
import React from "react";
import ResponsiveContainer from "~/components/layout/ResponsiveContainer";
import Menu from "./Menu";

const Header = () => {
  const isNarrow = useBreakpointValue({ base: true, md: false });
  return (
    <Box as="header" bg="brand.500" color="white">
      <ResponsiveContainer
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        px={{ base: 0, md: 4 }}
        as="nav"
      >
        <Flex direction={"row"} align="center" justify="space-between" width="100%" wrap="wrap">
          <Stack direction="row" py={2} pl={{ base: 2, md: 0 }}>
            <Text fontFamily="'Zilla Slab', serif" fontWeight="700" fontSize="32px" lineHeight={1.2}>
              TrendWeight
            </Text>
            <ChakraImage src="/assets/logo-line.svg" alt="logo" height="32px" width="77.13px" />
          </Stack>
          <Menu />
        </Flex>
      </ResponsiveContainer>
    </Box>
  );
};

export default Header;
