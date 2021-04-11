import { FC, ReactNode } from "react";

const ErrorMessage: FC<{ children: ReactNode }> = ({ children }) => {
  if (children) {
    return (
      <div className="mt-1 text-red-600" aria-live="polite">
        {children}
      </div>
    );
  } else {
    return null;
  }
};

export default ErrorMessage;
