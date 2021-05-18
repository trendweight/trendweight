import { Box, Flex, Stack } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import Link from "../shared/Link";
import LayoutContainer from "./LayoutContainer";

const Footer = () => {
  return (
    <LayoutContainer as="footer" p={4}>
      <Flex direction={{ base: "column", md: "row" }} align="center" justifyContent="space-between" color="gray.300">
        <Box>&copy; 2012-{new Date().getFullYear()} Erv Walter</Box>
        <Stack direction="row" spacing={{ base: 2, md: 4 }}>
          <Stack direction="row" spacing={{ base: 2, md: 4 }}>
            <Link href="https://twitter.com/trendweight" variant="footer">
              <FontAwesomeIcon icon={["fab", "twitter"]} />
            </Link>
            <Link href="https://facebook.com/trendweight" variant="footer">
              <FontAwesomeIcon icon={["fab", "facebook"]} />
            </Link>
            <Link href="https://github.com/trendweight" variant="footer">
              <FontAwesomeIcon icon={["fab", "github"]} />
            </Link>
            <Link href="https://blog.trendweight.com" variant="footer">
              <FontAwesomeIcon icon="rss" />
            </Link>
          </Stack>
          <Link href="mailto:erv@ewal.net" variant="footer">
            Contact
          </Link>
          <Link href="/tipjar" variant="footer">
            Tip Jar
          </Link>
          <Link href="/privacy" variant="footer">
            Privacy
          </Link>
        </Stack>
      </Flex>
    </LayoutContainer>
  );
};

export default Footer;
