import { Stack } from "@chakra-ui/react";
import React from "react";
import LinkButton, { LinkButtonProps } from "~/components/shared/LinkButton";
import { useAuth } from "~/lib/core/auth";

const InfoButtons = () => {
  const { isInitializing, user } = useAuth();

  const commonProps: Partial<LinkButtonProps> = {
    as: "a",
    fontSize: { base: 22, lg: 24 },
    fontWeight: "normal",
    width: { base: "100%", md: "320px" },
    p: { base: 6, md: 7 },
  };

  const getStartedUrl = isInitializing || !user ? "/register" : "/dashboard";

  return (
    <Stack direction={{ base: "column", md: "row" }} spacing={4} align="center" width="100%" gridArea="buttons">
      <LinkButton href="/about" colorScheme="green" {...commonProps}>
        Learn More
      </LinkButton>
      <LinkButton href={getStartedUrl} colorScheme="brand" {...commonProps}>
        Get Started
      </LinkButton>
    </Stack>
  );
};

export default InfoButtons;
