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
      {isInvalid && (
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
      )}
    </div>
  );
});

export default Input;
