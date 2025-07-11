import { type ReactNode } from "react";

interface HeadingProps {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: ReactNode;
  className?: string;
  display?: boolean; // Use display font for h1
}

export function Heading({ level, children, className = "", display = false }: HeadingProps) {
  const baseStyles = {
    1: `text-2xl sm:text-3xl ${display ? "font-display" : ""} font-bold mb-4`,
    2: "text-xl sm:text-2xl font-semibold mb-4",
    3: "text-lg sm:text-xl font-semibold mb-3",
    4: "text-base sm:text-lg font-semibold mb-2",
    5: "text-sm sm:text-base font-semibold mb-2",
    6: "text-xs sm:text-sm font-semibold mb-2",
  };

  const Tag = `h${level}` as keyof React.JSX.IntrinsicElements;
  const combinedClassName = `${baseStyles[level]} ${className}`.trim();

  return <Tag className={combinedClassName}>{children}</Tag>;
}
