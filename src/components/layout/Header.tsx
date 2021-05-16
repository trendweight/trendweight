import { Box, Flex, Stack } from "@chakra-ui/react";
import NextLink from "next/link";
import React from "react";
import Logo from "~/components/shared/Logo";
import LayoutContainer from "./LayoutContainer";
import Menu from "./Menu";

const Header = () => {
  return (
    <Box as="header" color="white" bg="brand.500">
      <LayoutContainer as="nav" display="flex" flexDir="row" alignItems="center" justifyContent="space-between" px={4}>
        <Flex direction="row" wrap="wrap" align="center" justify="space-between" w="full">
          <Stack direction="row" spacing={2} py={3}>
            <NextLink href="/">
              <a>
                <Box fontFamily="Zilla Slab" fontSize="2rem" fontWeight="bold" lineHeight={1.25}>
                  TrendWeight
                </Box>
              </a>
            </NextLink>
            <Logo height="32px" width="77.13px" />
          </Stack>
          <Menu />
        </Flex>
      </LayoutContainer>
    </Box>
  );
};

export default Header;
