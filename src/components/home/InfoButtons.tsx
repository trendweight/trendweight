import { Stack } from "@chakra-ui/layout";
import React, { FC } from "react";
import { useAuth } from "~/lib/core/auth";
import { useStartHidden } from "~/lib/core/utils/hooks";
import { logCall } from "~/lib/core/utils/logging";
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
  const { isProbablyLoggedIn } = useAuth();
  const hideForSSR = useStartHidden();
  logCall("InfoButtons");

  return (
    <Stack gridArea={area} direction={{ base: "column", md: "row" }} spacing={4} align="center" width="full">
      <HomeLinkButton href="/about" colorScheme="green">
        Learn More
      </HomeLinkButton>
      {isProbablyLoggedIn ? (
        <HomeLinkButton href="/dashboard" colorScheme="brand" visibility={hideForSSR}>
          Go To Dashboard
        </HomeLinkButton>
      ) : (
        <>
          <HomeLinkButton href="/signup" colorScheme="brand" visibility={hideForSSR}>
            Create an Account
          </HomeLinkButton>
          <HomeLinkButton href="/login" colorScheme="brand" visibility={hideForSSR}>
            Log In
          </HomeLinkButton>
        </>
      )}
    </Stack>
  );
};

export default InfoButtons;
