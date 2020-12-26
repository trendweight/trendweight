import { Box, Stack, useDisclosure } from "@chakra-ui/react";
import { useCallback } from "react";
import { useAuth } from "~/lib/auth";
import MenuItem from "./MenuItem";

const Menu = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const auth = useAuth();
  const handleSignOut = useCallback(() => {
    auth.signOut();
  }, [auth.signOut]);

  if (auth.isInitializing) {
    return null;
  }

  const isLoggedIn = !!auth?.user;

  return (
    <>
      <Box display={{ base: "block", md: "none" }} onClick={isOpen ? onClose : onOpen} pr={4}>
        <svg fill="white" width="1em" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <title>Menu</title>
          <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
        </svg>
      </Box>

      <Stack
        bg={{ base: "white", md: "inherit" }}
        direction={{ base: "column", md: "row" }}
        display={{ base: isOpen ? "block" : "none", md: "flex" }}
        alignSelf="stretch"
        alignItems="stretch"
        spacing={0}
        width={{ base: "100%", md: "auto" }}
        boxShadow={{ base: "0 4px 6px rgba(10,10,10,.1)", md: "none" }}
        py={{ base: 2, md: 0 }}
        onClick={isOpen ? onClose : undefined}
      >
        <MenuItem href="/">Home</MenuItem>
        <MenuItem href="/dashboard" show={isLoggedIn}>
          Dashboard
        </MenuItem>
        <MenuItem href="/settings" show={isLoggedIn}>
          Settings
        </MenuItem>
        <MenuItem href="/about">About</MenuItem>
        <MenuItem href="/register" show={!isLoggedIn}>
          Register
        </MenuItem>
        <MenuItem href="/login" show={!isLoggedIn}>
          Sign In
        </MenuItem>
        <MenuItem onClick={handleSignOut} show={isLoggedIn}>
          Sign Out
        </MenuItem>
      </Stack>
    </>
  );
};

export default Menu;
