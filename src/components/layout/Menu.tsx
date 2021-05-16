import { Box, Stack } from "@chakra-ui/react";
import React, { useCallback } from "react";
import { useAuth } from "~/lib/core/auth";
import { useDisclosure } from "~/lib/core/utils";
import MenuItem from "./MenuItem";

const Menu = () => {
  const { isOpen, toggle, close } = useDisclosure();
  const auth = useAuth();
  const handleSignOut = useCallback(() => {
    auth.signOut();
  }, [auth]);

  if (auth.isInitializing) {
    return null;
  }

  const isLoggedIn = !!auth?.user;

  return (
    <>
      <Box display={{ base: "block", md: "none" }} onClick={toggle}>
        {isOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            width="24px"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            width="24px"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </Box>
      <Stack
        direction={{ base: "column", md: "row" }}
        display={{ base: isOpen ? "block" : "none", md: "flex" }}
        alignSelf="stretch"
        alignItems="stretch"
        spacing={0}
        width={{ base: "100%", md: "auto" }}
        py={{ base: 2, md: 0 }}
        onClick={isOpen ? close : undefined}
      >
        <MenuItem href="/">Home</MenuItem>
        <MenuItem href="/dashboard" show={isLoggedIn}>
          Dashboard
        </MenuItem>
        <MenuItem href="/settings" show={isLoggedIn}>
          Settings
        </MenuItem>
        <MenuItem href="/about">Learn</MenuItem>
        <MenuItem href="/signup" show={!isLoggedIn}>
          Sign Up
        </MenuItem>
        <MenuItem href="/login" show={!isLoggedIn}>
          Log In
        </MenuItem>
        <MenuItem onClick={handleSignOut} show={isLoggedIn}>
          Log Out
        </MenuItem>
      </Stack>
    </>
  );
};

export default Menu;
