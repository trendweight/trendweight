import { createContext } from "react";

export interface ToastProps {
  title?: string;
  description?: string;
  variant?: "default" | "success" | "error";
  duration?: number;
}

export interface ToastState extends ToastProps {
  id: string;
  open: boolean;
}

export const ToastContext = createContext<{
  toasts: ToastState[];
  showToast: (props: ToastProps) => void;
}>({
  toasts: [],
  showToast: () => {},
});
