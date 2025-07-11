import ReactSelect, { type Props as ReactSelectProps, type GroupBase } from "react-select";

interface SelectProps<Option = unknown, IsMulti extends boolean = false, Group extends GroupBase<Option> = GroupBase<Option>>
  extends Omit<ReactSelectProps<Option, IsMulti, Group>, "classNamePrefix" | "className"> {
  error?: string;
}

export function Select<Option = unknown, IsMulti extends boolean = false, Group extends GroupBase<Option> = GroupBase<Option>>({
  error,
  ...props
}: SelectProps<Option, IsMulti, Group>) {
  return (
    <div>
      <ReactSelect
        {...props}
        classNamePrefix="select"
        className="react-select-container"
        classNames={{
          control: (state) => (state.isFocused ? "!border-brand-500 !ring-2 !ring-brand-500 !shadow-none" : "!border-gray-300 hover:!border-gray-400"),
          placeholder: () => "!text-gray-500",
          input: () => "!text-gray-900",
          singleValue: () => "!text-gray-900",
          menu: () => "!bg-white !border !border-gray-200 !shadow-lg !rounded-md",
          menuList: () => "!p-1",
          option: (state) => {
            if (state.isSelected) {
              return "!bg-brand-600 !text-white";
            }
            if (state.isFocused) {
              return "!bg-brand-50 !text-gray-900 !cursor-pointer";
            }
            return "!text-gray-900 !cursor-pointer hover:!bg-gray-50";
          },
          noOptionsMessage: () => "!text-gray-500 !py-2",
          loadingMessage: () => "!text-gray-500 !py-2",
          indicatorSeparator: () => "!bg-gray-300",
          dropdownIndicator: (state) => (state.isFocused ? "!text-gray-600" : "!text-gray-400"),
          clearIndicator: () => "!text-gray-400 hover:!text-gray-600",
        }}
        // Default props for consistency
        isClearable={false}
        isSearchable={false}
      />

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
