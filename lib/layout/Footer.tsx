import { Box, Flex, Stack } from "@chakra-ui/react";
import React from "react";
import { FaFacebook, FaGithub, FaRss, FaTwitter } from "react-icons/fa";
import Link from "../shared/Link";
import LayoutContainer from "./LayoutContainer";

const Footer = () => {
  return (
    <LayoutContainer as="footer" p={4}>
      <Flex direction={{ base: "column", md: "row" }} align="center" justifyContent="space-between" color="gray.300">
        <Box>
          &copy; 2012-{new Date().getFullYear()} Erv Walter{" "}
          {process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA && (
            <Link href="/build" variant="footer">{`(build ${process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA?.substring(0, 7)})`}</Link>
          )}
        </Box>
        <Stack direction="row" spacing={{ base: 2, md: 4 }}>
          <Stack direction="row" spacing={{ base: 2, md: 4 }} align="center">
            <Link href="https://twitter.com/trendweight" variant="footer">
              <FaTwitter />
            </Link>
            <Link href="https://facebook.com/trendweight" variant="footer">
              <FaFacebook />
            </Link>
            <Link href="https://github.com/trendweight" variant="footer">
              <FaGithub />
            </Link>
            <Link href="https://blog.trendweight.com" variant="footer">
              <FaRss />
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
