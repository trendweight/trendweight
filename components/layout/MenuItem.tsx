import { Link } from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { FC, PropsWithChildren } from "react";

interface MenuItemProps {
  href?: string;
  onClick?: () => void;
  show?: boolean;
}

const Item: FC<PropsWithChildren<MenuItemProps>> = ({ children, ...rest }) => {
  const { pathname } = useRouter();
  const { href, onClick } = rest;
  return (
    <Link
      as={href ? "a" : "div"}
      bg={{ base: "white", md: pathname === href ? "brand.400" : "inherit" }}
      color={{ base: pathname === href ? "brand.400" : "brand.900", md: "inherit" }}
      fontWeight={{ base: pathname === href ? "medium" : "inherit", md: "inherit" }}
      display="flex"
      alignItems="center"
      py={{ base: 2, md: 2 }}
      px={3}
      _hover={{ color: "brand.800", bg: "white", textDecoration: "none" }}
      _focus={{ boxShadow: "none", fontWeight: "medium" }}
      onClick={onClick}
      {...rest}
    >
      {children}
    </Link>
  );
};

const MenuItem: FC<PropsWithChildren<MenuItemProps>> = ({ href, show = true, ...rest }) => {
  if (!show) {
    return null;
  }
  if (href) {
    return (
      <NextLink href={href} passHref>
        <Item {...rest} />
      </NextLink>
    );
  } else {
    return <Item {...rest} />;
  }
};

export default MenuItem;
