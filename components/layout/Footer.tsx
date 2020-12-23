import { Box, Flex, HStack, Link, Text } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import RouteLink from "../shared/RouteLink";
import { ResponsiveContainer } from "./ResponsiveContainer";

const Footer = () => {
  return (
    <ResponsiveContainer py={2} px={4}>
      <Flex direction={{ base: "column", md: "row" }} color="gray.300" align="center" justify="space-between">
        <Text>&copy; 2012-{new Date().getFullYear()} Erv Walter</Text>
        <HStack spacing={{ base: 2, md: 4 }}>
          <Box>
            <Link href="https://twitter.com/trendweight" px={{ base: 1, md: 2 }}>
              <FontAwesomeIcon icon={["fab", "twitter"]} />
            </Link>
            <Link href="https://facebook.com/trendweight" px={{ base: 1, md: 2 }}>
              <FontAwesomeIcon icon={["fab", "facebook"]} />
            </Link>
            <Link href="https://blog.trendweight.com" px={{ base: 1, md: 2 }}>
              <FontAwesomeIcon icon="rss" />
            </Link>
          </Box>
          <Link href="mailto:erv@ewal.net">Contact</Link>
          <RouteLink href="/donate">Donate</RouteLink>
          <Link href="">Privacy</Link>
          <Link href="">Cookies</Link>
        </HStack>
      </Flex>
    </ResponsiveContainer>
  );
};

export default Footer;
