import { Link as ChakraLink, LinkProps } from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { FC } from "react";
import { useAuth } from "../../auth/auth";

export type NavLinkProps = LinkProps & { show?: boolean };

const NavLink: FC<NavLinkProps> = ({ href, show = true, ...rest }) => {
  const { pathname } = useRouter();
  const { isInitializing } = useAuth();
  const visibility = isInitializing ? "hidden" : "visible";

  if (!show) {
    return null;
  }

  const isActive = pathname === href;

  const chakraLink = (
    <ChakraLink
      visibility={visibility}
      display="flex"
      bg={{ base: isActive ? "brand.900" : "inherit", md: isActive ? "brand.400" : "inherit" }}
      py={2}
      px={3}
      rounded={{ base: 5, md: 0 }}
      color="white"
      transition="all 0.3s"
      fontWeight="normal"
      lineHeight="1.25rem"
      alignItems="center"
      aria-current={isActive ? "page" : undefined}
      _hover={{ color: "brand.800", bg: "white", textDecoration: "none" }}
      _activeLink={{
        bg: "blue.600",
        color: "white",
      }}
      variant="header"
      {...rest}
    />
  );

  if (href) {
    return (
      <NextLink href={href} passHref>
        {chakraLink}
      </NextLink>
    );
  } else {
    return chakraLink;
  }
};

export default NavLink;
