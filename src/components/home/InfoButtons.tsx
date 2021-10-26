import { Stack } from "@chakra-ui/react";
import React, { FC } from "react";
import { useAuth } from "~/lib/core/auth";
import LinkButton, { LinkButtonProps } from "../shared/LinkButton";
import { HomeWidgetProps } from "./MainContent";

const HomeLinkButton: FC<LinkButtonProps> = ({ ...props }) => (
  <LinkButton {...props} as="a" fontSize={{ base: 22, lg: 24 }} fontWeight="normal" width={{ base: "full", md: "320px" }} p={{ base: 6, md: 7 }} />
);

const InfoButtons: FC<HomeWidgetProps> = ({ area }) => {
  const { isInitializing, isLoggedIn } = useAuth();
  const visibility = isInitializing ? "hidden" : "visible";

  return (
    <Stack gridArea={area} direction={{ base: "column", md: "row" }} spacing={4} align="center" width="full">
      <HomeLinkButton href="/about" colorScheme="green" key="learn">
        Learn More
      </HomeLinkButton>
      {isLoggedIn ? (
        <HomeLinkButton href="/dashboard" colorScheme="brand" visibility={visibility} key="dashboard">
          Go To Dashboard
        </HomeLinkButton>
      ) : (
        <>
          <HomeLinkButton href="/signup" colorScheme="brand" visibility={visibility} key="create">
            Create an Account
          </HomeLinkButton>
          <HomeLinkButton href="/login" colorScheme="brand" visibility={visibility} key="login">
            Log In
          </HomeLinkButton>
        </>
      )}
    </Stack>
  );
};

export default InfoButtons;
