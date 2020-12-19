import { Link as ChakraLink } from "@chakra-ui/react";
import NextLink, { LinkProps } from "next/link";
import { FC } from "react";

const RouteLink: FC<LinkProps> = ({ children, ...rest }) => {
  return (
    <NextLink passHref {...rest}>
      <ChakraLink>{children}</ChakraLink>
    </NextLink>
  );
};

export default RouteLink;
