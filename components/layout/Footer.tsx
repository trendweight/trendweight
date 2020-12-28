import { Box, Flex, HStack, Link, Text } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import RouteLink from "../shared/RouteLink";
import ResponsiveContainer from "./ResponsiveContainer";

const Footer = () => {
  return (
    <ResponsiveContainer as="footer" py={2} px={4}>
      <Flex direction={{ base: "column", md: "row" }} color="gray.300" align="center" justify="space-between">
        <Text>&copy; 2012-{new Date().getFullYear()} Erv Walter</Text>
        <HStack spacing={{ base: 2, md: 4 }}>
          <Box>
            <Link href="https://twitter.com/trendweight" px={{ base: 1, md: 2 }} isExternal variant="footer">
              <FontAwesomeIcon icon={["fab", "twitter"]} />
            </Link>
            <Link href="https://facebook.com/trendweight" px={{ base: 1, md: 2 }} isExternal variant="footer">
              <FontAwesomeIcon icon={["fab", "facebook"]} />
            </Link>
            <Link href="https://github.com/trendweight" px={{ base: 1, md: 2 }} isExternal variant="footer">
              <FontAwesomeIcon icon={["fab", "github"]} />
            </Link>
            <Link href="https://blog.trendweight.com" px={{ base: 1, md: 2 }} isExternal variant="footer">
              <FontAwesomeIcon icon="rss" />
            </Link>
          </Box>
          <Link href="mailto:erv@ewal.net" variant="footer">
            Contact
          </Link>
          <RouteLink href="/donate" variant="footer">
            Donate
          </RouteLink>
          <Link href="" isExternal variant="footer">
            Privacy
          </Link>
          <Link href="" isExternal variant="footer">
            Cookies
          </Link>
        </HStack>
      </Flex>
    </ResponsiveContainer>
  );
};

export default Footer;
