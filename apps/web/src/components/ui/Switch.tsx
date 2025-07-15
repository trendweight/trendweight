import * as SwitchPrimitive from "@radix-ui/react-switch";
import { forwardRef } from "react";

interface SwitchProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  name?: string;
  disabled?: boolean;
}

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(({ checked, onCheckedChange, name, disabled }, ref) => {
  return (
    <SwitchPrimitive.Root
      ref={ref}
      checked={checked}
      onCheckedChange={onCheckedChange}
      name={name}
      disabled={disabled}
      className="focus-visible:ring-brand-500 data-[state=checked]:bg-brand-600 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=unchecked]:bg-gray-200"
    >
      <SwitchPrimitive.Thumb className="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0" />
    </SwitchPrimitive.Root>
  );
});

Switch.displayName = "Switch";
