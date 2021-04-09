import clsx from "clsx";
import NextLink from "next/link";
import { FC, ReactNode } from "react";

export interface LinkProps {
  href: string;
  children: ReactNode;
  external?: boolean;
  btnColor?: "brand" | "green" | "gray";
  variant?: "normal" | "muted" | "button";
  size?: "auto" | "xl";
}

const Link: FC<LinkProps> = ({
  href,
  children,
  external = false,
  variant = "normal",
  btnColor = "gray",
  size = "auto",
}) => {
  let variantClasses = "",
    colorClasses = "",
    sizeClasses = "";

  switch (variant) {
    case "button":
      variantClasses =
        "text-center border border-transparent rounded focus:outline-none focus:ring-offset-2 focus:ring-2 flex-row justify-center";
      switch (size) {
        case "xl":
          sizeClasses = "min-w-[320px] px-8 py-2 w-full text-xl md:w-auto md:text-2xl inline-flex";
          break;
        case "auto":
          sizeClasses = "px-4 py-2 font-bold inline-flex";
          break;
      }
      switch (btnColor) {
        case "brand":
          colorClasses = "text-white bg-brand-600 hover:bg-brand-700 focus:ring-brand-500 shadow-sm ";
          break;
        case "green":
          colorClasses = "text-white bg-green-600 hover:bg-green-700 focus:ring-green-500 shadow-sm ";
          break;
        case "gray":
          colorClasses = "text-black bg-gray-200 hover:bg-gray-300 focus:ring-gray-500";
          break;
      }
      break;
    case "normal":
      variantClasses = "text-brand-500 hover:text-brand-700 no-underline hover:underline cursor-pointer";
      break;
    case "muted":
      variantClasses = "text-gray-300 hover:text-black no-underline hover:underline cursor-pointer";
      break;
  }

  if (external) {
    return (
      <a href={href} className={clsx(variantClasses, colorClasses, sizeClasses)} target="_blank" rel="noreferrer">
        {children}
      </a>
    );
  } else {
    return (
      <NextLink href={href}>
        <a className={clsx(variantClasses, colorClasses, sizeClasses)}>{children}</a>
      </NextLink>
    );
  }
};

export default Link;
