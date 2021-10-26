import { Box, Flex, Image, Stack } from "@chakra-ui/react";
import React from "react";
import LinkButton from "~/components/shared/LinkButton";
import { Page } from "~/lib/core/page";

const Oops: Page = () => {
  return (
    <Flex direction="column" minH="67vh" align={["flex-start", "center"]} justify={["flex-start", "center"]}>
      <Stack direction={{ base: "column", md: "row" }} alignItems={{ base: "initial", md: "center" }} p={4} spacing={8}>
        <Box pr={[0, 8]} py={4} borderRight={{ base: "none", md: "1px solid #e8e8e8" }} maxW={600} width="100%">
          <Box fontFamily="'Zilla Slab', serif" fontWeight="700" fontSize={["36px", "48px"]} pr={2} lineHeight={1.2} color="brand.500">
            TrendWeight
          </Box>
          <Box mt={4}>
            <b>Oops.</b> An error occurred in the application.
          </Box>
          <Box mt={4}>It was probably Internet gremlins messing with something. Yeah, probably gremlins. Definitely not a bug. Well, probably not a bug.</Box>
          <Box mt={4}>
            Just in case, it's been logged. Maybe wait a while. If it keeps happening, you can email me to let me know that the gremlins are being super
            annoying.
          </Box>
          <Box mt={4}>
            <LinkButton href="/">Go to Homepage</LinkButton>
          </Box>
        </Box>
        <Image
          src="/assets/error.svg"
          alt="error guy"
          height={{ base: "auto", md: "250px", lg: "250px" }}
          width={{ base: "100%", md: "auto" }}
          maxW={"250px"}
        />
      </Stack>
    </Flex>
  );
};

Oops.bypassShell = true;
Oops.title = "Oops";

export default Oops;
