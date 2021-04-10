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
  const className = `bg-white ${pathname === href ? "md:bg-brand-400 text-brand-400 font-medium" : "md:bg-transparent text-brand-900 font-normal"} md:text-current md:font-normal flex items-center py-2 px-3 hover:text-brand-800 hover:bg-white hover:no-underline focus:shadow-none focus:font-medium`;

  if (!show) {
    return null;
  }

  if (href) {
    return (
      <NextLink href={href}>
        <a className={className}>{children}</a>
      </NextLink>
    );
  } else {
    return <div className={className} onClick={onClick}>{children}</div>;
  }
};

export default MenuItem;
