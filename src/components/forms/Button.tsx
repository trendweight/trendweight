import clsx from "clsx";
import { FC, MouseEventHandler, PropsWithChildren } from "react";
import Spinner from "../shared/Spinner";

export interface ButtonProps {
  isLoading?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  type?: "button" | "submit" | "reset";
}

const Button: FC<PropsWithChildren<ButtonProps>> = ({ isLoading, onClick, type, children }) => {
  return (
    <button
      className={clsx(
        isLoading
          ? "bg-brand-200 cursor-not-allowed"
          : "bg-brand-600 hover:bg-brand-700 focus:ring-brand-500 focus:ring-offset-2 focus:ring-2",
        "relative inline-flex flex-row justify-center px-4 py-2 text-center text-white font-bold border border-transparent rounded focus:outline-none shadow-sm "
      )}
      onClick={onClick}
      type={type}
    >
      {isLoading && (
        <div className="absolute flex items-center">
          <Spinner />
        </div>
      )}
      {isLoading ? <span className="opacity-0">{children}</span> : children}
    </button>
  );
};

export default Button;
