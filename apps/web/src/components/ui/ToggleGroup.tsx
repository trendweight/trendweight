import * as RadioGroup from "@radix-ui/react-radio-group";
import { forwardRef } from "react";

interface ToggleOption {
  value: string;
  label: string;
}

interface ToggleGroupProps {
  options: ToggleOption[];
  value?: string;
  onChange?: (value: string) => void;
  name?: string;
}

export const ToggleGroup = forwardRef<HTMLDivElement, ToggleGroupProps>(({ options, value, onChange, name }, ref) => {
  return (
    <RadioGroup.Root ref={ref} className="inline-flex rounded-lg bg-gray-100 p-1" value={value} onValueChange={onChange} name={name}>
      {options.map((option) => (
        <RadioGroup.Item
          key={option.value}
          value={option.value}
          className="relative flex-1 px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-gray-100 rounded-md transition-all data-[state=checked]:bg-white data-[state=checked]:text-gray-900 data-[state=checked]:shadow-sm"
        >
          {option.label}
        </RadioGroup.Item>
      ))}
    </RadioGroup.Root>
  );
});

ToggleGroup.displayName = "ToggleGroup";
