import { type ButtonHTMLAttributes, forwardRef } from "react";
import { twMerge } from "tailwind-merge";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant = "primary", size = "md", ...props }, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-colors rounded-md disabled:opacity-50 disabled:pointer-events-none";

  const variantStyles = {
    primary: "bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800",
    secondary: "bg-white text-gray-900 border border-gray-300 hover:bg-gray-50 active:bg-gray-100",
    ghost: "text-gray-700 hover:bg-gray-100 active:bg-gray-200",
  };

  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return <button ref={ref} className={twMerge(baseStyles, variantStyles[variant], sizeStyles[size], className)} {...props} />;
});

Button.displayName = "Button";
