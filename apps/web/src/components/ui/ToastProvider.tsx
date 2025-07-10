import * as React from "react";
import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from "./Toast";
import { ToastContext } from "../../lib/contexts/ToastContext";
import type { ToastProps, ToastState } from "../../lib/contexts/ToastContext";

export const ToastContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = React.useState<ToastState[]>([]);

  const showToast = React.useCallback((props: ToastProps) => {
    const id = Math.random().toString(36).substring(2, 9);
    const toast: ToastState = {
      ...props,
      id,
      open: true,
      duration: props.duration ?? 5000,
    };
    setToasts((prev) => [...prev, toast]);

    // Auto-dismiss
    setTimeout(() => {
      setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, open: false } : t)));
    }, toast.duration);
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, showToast }}>
      <ToastProvider>
        {children}
        <ToastViewport />
        {toasts.map((toast) => (
          <Toast key={toast.id} open={toast.open} variant={toast.variant}>
            {toast.title && <ToastTitle>{toast.title}</ToastTitle>}
            {toast.description && <ToastDescription>{toast.description}</ToastDescription>}
            <ToastClose />
          </Toast>
        ))}
      </ToastProvider>
    </ToastContext.Provider>
  );
};
