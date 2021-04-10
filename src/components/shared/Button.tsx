import { FC, MouseEventHandler, PropsWithChildren } from "react";
import Spinner from "./Spinner";

export interface ButtonProps {
  isLoading?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  type?: "button" | "submit" | "reset";
}

const Button: FC<PropsWithChildren<ButtonProps>> = ({ isLoading, onClick, type, children }) => {
  return (
    <button
      className="text-center border border-transparent focus:outline-none focus:ring-offset-2 focus:ring-2 flex-row justify-center px-4 py-2 rounded font-bold inline-flex text-white bg-brand-600 hover:bg-brand-700 focus:ring-brand-500 shadow-sm"
      onClick={onClick}
      type={type}
    >
      {isLoading ? <Spinner /> : children}
    </button>
  );
};

export default Button;
