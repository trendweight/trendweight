import { Stack } from "@chakra-ui/layout";
import React, { FC } from "react";
import { useAuth } from "~/lib/core/auth";
import LinkButton, { LinkButtonProps } from "../shared/LinkButton";
import { HomeWidgetProps } from "./MainContent";

const HomeLinkButton: FC<LinkButtonProps> = ({ ...props }) => (
  <LinkButton
    {...props}
    as="a"
    fontSize={{ base: 22, lg: 24 }}
    fontWeight="normal"
    width={{ base: "full", md: "320px" }}
    p={{ base: 6, md: 7 }}
  />
);

const InfoButtons: FC<HomeWidgetProps> = ({ area }) => {
  const { isInitializing, user } = useAuth();

  return (
    <Stack gridArea={area} direction={{ base: "column", md: "row" }} spacing={4} align="center" width="full">
      <HomeLinkButton href="/about" colorScheme="green">
        Learn More
      </HomeLinkButton>
      {!isInitializing && !user ? (
        <>
          <HomeLinkButton href="/signup" colorScheme="brand">
            Create an Account
          </HomeLinkButton>
          <HomeLinkButton href="/login" colorScheme="brand">
            Log In
          </HomeLinkButton>
        </>
      ) : (
        !isInitializing && (
          <HomeLinkButton href="/dashboard" colorScheme="brand">
            Go To Dashboard
          </HomeLinkButton>
        )
      )}
    </Stack>
  );
};

export default InfoButtons;
