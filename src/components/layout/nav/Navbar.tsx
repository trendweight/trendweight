import { Box, Flex, IconButton, Stack, useDisclosure } from "@chakra-ui/react";
import { MenuIcon, XIcon } from "@heroicons/react/outline";
import React, { isValidElement, ReactElement } from "react";
import MobileNav from "./MobileNav";

export const Navbar: React.FC = (props) => {
  const mobileNav = useDisclosure();
  const children = React.Children.toArray(props.children).filter<ReactElement>(isValidElement);

  return (
    <Flex p={0} wrap="wrap" align="center" justifyContent="space-between">
      <Stack direction="row" spacing={2} pl={4} py={3} flexGrow={1}>
        {children.find((child) => child.type === Brand)?.props.children}
      </Stack>
      <Stack
        direction="row"
        spacing={0}
        display={{ base: "none", md: "flex" }}
        alignSelf="stretch"
        alignItems="stretch"
        justifyContent="center"
        pr={4}
      >
        {children.find((child) => child.type === Links)?.props.children}
      </Stack>

      <IconButton
        display={{ base: "flex", md: "none" }}
        size="sm"
        aria-label="Open menu"
        fontSize="20px"
        variant="ghost"
        onClick={mobileNav.onToggle}
        mr={4}
        icon={mobileNav.isOpen ? <XIcon /> : <MenuIcon />}
      />
      <Box flexBasis="100%" h={0} />
      <MobileNav isOpen={mobileNav.isOpen} onClose={mobileNav.onClose}>
        <Stack spacing={5}>
          <Stack>{children.find((child) => child.type === Links)?.props.children}</Stack>
        </Stack>
      </MobileNav>
    </Flex>
  );
};

const Brand: React.FC = () => null;
const Links: React.FC = () => null;

export default Object.assign(Navbar, { Brand, Links });
