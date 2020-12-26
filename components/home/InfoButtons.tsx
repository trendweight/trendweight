import { Stack } from "@chakra-ui/react";
import React from "react";
import LinkButton from "~/components/shared/LinkButton";

const InfoButtons = () => {
  return (
    <Stack
      direction={{ base: "column", md: "row" }}
      spacing={4}
      align="center"
      // justify="center"
      width="100%"
      gridArea="buttons"
    >
      <LinkButton
        href="/about"
        colorScheme="green"
        fontSize={{ base: 22, lg: 24 }}
        fontWeight="normal"
        width={{ base: "100%", md: "33%" }}
        p={{ base: 6, md: 7 }}
      >
        Learn More
      </LinkButton>
      <LinkButton
        href="/dashboard"
        as="a"
        colorScheme="brand"
        fontSize={{ base: 22, lg: 24 }}
        fontWeight="normal"
        width={{ base: "100%", md: "33%" }}
        p={{ base: 6, md: 7 }}
      >
        Go To Dashboard
      </LinkButton>
    </Stack>
  );
};

export default InfoButtons;
