import clsx from "clsx";
import NextLink from "next/link";
import { FC, ReactNode } from "react";

export interface LinkProps {
  href: string;
  children: ReactNode;
  btnColor?: "brand" | "green" | "gray" | "inverted-brand";
  variant?: "normal" | "muted" | "button";
  size?: "auto" | "lg" | "xl";
}

const Link: FC<LinkProps> = ({ href, children, variant = "normal", btnColor = "gray", size = "auto" }) => {
  let external = false;
  if (href.startsWith("https://") || (href.startsWith("http://") && !href.startsWith("https://trendweight"))) {
    external = true;
  }
  let variantClasses = "",
    colorClasses = "",
    sizeClasses = "";

  switch (variant) {
    case "button":
      variantClasses =
        "text-center border border-transparent focus:outline-none focus:ring-offset-2 focus:ring-2 focus:ring-offset-white flex-row justify-center";
      switch (size) {
        case "xl":
          sizeClasses =
            "md:min-w-[230px] lg:min-w-[320px] lg:px-4 py-2 lg:py-3 w-full text-xl md:w-auto md:text-xl lg:text-2xl inline-flex rounded-md";
          break;
        case "lg":
          sizeClasses = "px-6 py-3 text-lg md:text-xl inline-flex rounded-md";
          break;
        case "auto":
          sizeClasses = "px-4 py-2 rounded font-bold inline-flex";
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
        case "inverted-brand":
          colorClasses =
            "text-brand-700 bg-brand-50 font-bold hover:bg-brand-100 focus:ring-white focus:ring-offset-brand-700 ";
          break;
      }
      break;
    case "normal":
      variantClasses = "text-brand-600 hover:text-brand-700 no-underline hover:underline cursor-pointer font-medium";
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
