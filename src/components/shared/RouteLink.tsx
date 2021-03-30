import NextLink, { LinkProps as NextLinkProps } from "next/link";
import { FC, PropsWithChildren } from "react";

export type RouteLinkProps = PropsWithChildren<NextLinkProps & Omit<ChakraLinkProps, "as">>;

const RouteLink: FC<RouteLinkProps> = ({ href, as, replace, scroll, shallow, prefetch, children, ...chakraProps }) => {
  return (
    <NextLink
      passHref={true}
      href={href}
      as={as}
      replace={replace}
      scroll={scroll}
      shallow={shallow}
      prefetch={prefetch}
    >
      <ChakraLink {...chakraProps}>{children}</ChakraLink>
    </NextLink>
  );
};

export default RouteLink;
