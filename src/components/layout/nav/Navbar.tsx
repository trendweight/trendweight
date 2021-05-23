import { Box, Button, Flex, Icon, Stack, useDisclosure } from "@chakra-ui/react";
import React, { isValidElement, ReactElement, useRef } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import MobileNav from "./MobileNav";

export const Navbar: React.FC = (props) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const mobileNav = useDisclosure();
  const children = React.Children.toArray(props.children).filter<ReactElement>(isValidElement);

  return (
    <Flex p={0} wrap="wrap" align="center" justifyContent="space-between" ref={wrapperRef}>
      <Stack direction="row" spacing={2} pl={4} py={3} flexGrow={1} align="center">
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

      <Button
        display={{ base: "flex", md: "none" }}
        size="sm"
        colorScheme="brand"
        color="white"
        aria-label="Open menu"
        fontSize="20px"
        onClick={mobileNav.onToggle}
        mr={4}
      >
        <Icon h={6} w={6} as={mobileNav.isOpen ? HiX : HiMenu}></Icon>
      </Button>
      <Box flexBasis="100%" h={0} />
      <MobileNav isOpen={mobileNav.isOpen} onClose={mobileNav.onClose} wrapperRef={wrapperRef}>
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
