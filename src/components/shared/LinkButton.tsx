import Link from "next/link";
import { FC } from "react";

export interface LinkButtonProps extends ButtonProps {
  href: string;
}

const LinkButton: FC<LinkButtonProps> = ({ href, ...rest }) => (
  <Link href={href} passHref>
    <Button as="a" {...rest} />
  </Link>
);

export default LinkButton;
