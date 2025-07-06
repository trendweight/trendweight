import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { clsx } from "clsx";

export interface ToggleButtonGroupProps {
  value: string;
  onChange: (value: string) => void;
  defaultValue?: string;
  children: React.ReactNode;
  "aria-label": string;
  className?: string;
}

export const ToggleButtonGroup = ({ value, onChange, defaultValue, children, "aria-label": ariaLabel, className }: ToggleButtonGroupProps) => {
  return (
    <ToggleGroup.Root
      type="single"
      value={value}
      onValueChange={(newValue) => {
        if (newValue) onChange(newValue);
      }}
      defaultValue={defaultValue}
      aria-label={ariaLabel}
      className={clsx("inline-flex rounded-md", className)}
    >
      {children}
    </ToggleGroup.Root>
  );
};
