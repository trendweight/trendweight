import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { clsx } from "clsx";
import { forwardRef } from "react";

export interface ToggleButtonProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export const ToggleButton = forwardRef<HTMLButtonElement, ToggleButtonProps>(({ value, children, className }, ref) => {
  return (
    <ToggleGroup.Item
      ref={ref}
      value={value}
      className={clsx(
        "border border-gray-300 bg-white px-2 py-1 text-sm font-normal text-gray-800",
        "data-[state=on]:bg-brand-500 data-[state=on]:border-brand-500 data-[state=on]:text-white",
        "md:hover:bg-gray-200 md:hover:text-gray-800",
        "md:data-[state=on]:hover:bg-brand-800 md:data-[state=on]:hover:text-white",
        "focus:outline-none",
        "transition-colors duration-150",
        "first:rounded-l-md last:rounded-r-md",
        "-ml-px first:ml-0",
        className,
      )}
    >
      {children}
    </ToggleGroup.Item>
  );
});

ToggleButton.displayName = "ToggleButton";
