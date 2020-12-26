import { Stack } from "@chakra-ui/react";
import React from "react";
import LinkButton, { LinkButtonProps } from "~/components/shared/LinkButton";
import { useAuth } from "~/lib/auth";

const InfoButtons = () => {
  const { isInitializing, user } = useAuth();

  const commonProps: Partial<LinkButtonProps> = {
    as: "a",
    fontSize: { base: 22, lg: 24 },
    fontWeight: "normal",
    width: { base: "100%", md: "35%" },
    p: { base: 6, md: 7 },
  };

  return (
    <Stack
      direction={{ base: "column", md: "row" }}
      spacing={4}
      align="center"
      width="100%"
      gridArea="buttons"
      visibility={isInitializing ? "hidden" : "visible"}
    >
      <LinkButton href="/about" colorScheme="green" {...commonProps}>
        Learn More
      </LinkButton>
      {!!user && (
        <LinkButton href="/dashboard" colorScheme="brand" {...commonProps}>
          Go To Dashboard
        </LinkButton>
      )}
      {!user && (
        <>
          <LinkButton href="/register" colorScheme="brand" {...commonProps}>
            Register
          </LinkButton>
          <LinkButton href="/login" colorScheme="brand" {...commonProps}>
            Sign In
          </LinkButton>
        </>
      )}
    </Stack>
  );
};

export default InfoButtons;
