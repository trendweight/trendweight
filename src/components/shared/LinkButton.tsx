import { Button, ButtonProps } from "@chakra-ui/react";
import NextLink from "next/link";
import { FC } from "react";

export interface LinkButtonProps extends ButtonProps {
  href: string;
}

const LinkButton: FC<LinkButtonProps> = ({ href, ...rest }) => (
  <NextLink href={href} passHref>
    <Button as="a" {...rest} />
  </NextLink>
);

export default LinkButton;
