/* eslint-disable react/display-name */
import clsx from "clsx";
import React, { DetailedHTMLProps, InputHTMLAttributes } from "react";

interface InputProps extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  isInvalid?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Input = React.forwardRef<any, InputProps>((props, ref) => {
  const { isInvalid, className, ...rest } = props;
  return (
    <div className="relative mt-1">
      <input
        className={clsx(
          "placeholder-gray-400 block w-full border-gray-300 rounded-md shadow-sm",
          isInvalid
            ? "pr-10 border-red-600 focus:outline-none focus:ring-red-500 focus:border-red-600"
            : "focus:ring-brand-500 focus:border-brand-500",
          className
        )}
        ref={ref}
        {...rest}
      />
    </div>
  );
});

export default Input;
