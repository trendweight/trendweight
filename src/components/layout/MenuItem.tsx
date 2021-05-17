import { Link as ChakraLink } from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React, { FC, PropsWithChildren } from "react";

interface MenuItemProps {
  href?: string;
  onClick?: () => void;
  show?: boolean;
}

const MenuItem: FC<PropsWithChildren<MenuItemProps>> = ({ href, onClick, show = true, children }) => {
  const { pathname } = useRouter();

  if (!show) {
    return null;
  }

  if (href) {
    return (
      <NextLink href={href} passHref>
        <ChakraLink
          bg={{ base: pathname === href ? "brand.900" : "inherit", md: pathname === href ? "brand.400" : "inherit" }}
          rounded={{ base: 5, md: 0 }}
          fontWeight={{ base: pathname === href ? "medium" : "inherit", md: "inherit" }}
          display="flex"
          alignItems="center"
          py={{ base: 2, md: 2 }}
          px={3}
          _hover={{ color: "brand.800", bg: "white", textDecoration: "none" }}
          onClick={onClick}
        >
          {children}
        </ChakraLink>
      </NextLink>
    );
  } else {
    return (
      <ChakraLink
        bg={{ base: "white", md: pathname === href ? "brand.400" : "inherit" }}
        color={{ base: pathname === href ? "brand.400" : "brand.900", md: "inherit" }}
        fontWeight={{ base: pathname === href ? "medium" : "inherit", md: "inherit" }}
        display="flex"
        alignItems="center"
        py={{ base: 2, md: 2 }}
        px={3}
        _hover={{ color: "brand.800", bg: "white", textDecoration: "none" }}
        onClick={onClick}
      >
        {children}
      </ChakraLink>
    );
  }
};

export default MenuItem;
