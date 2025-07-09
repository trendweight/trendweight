import { useBlocker } from "@tanstack/react-router";

export function useNavigationGuard(isDirty: boolean, message = "You have unsaved changes. Are you sure you want to leave?") {
  useBlocker({
    shouldBlockFn: () => {
      if (!isDirty) return false;
      const shouldLeave = window.confirm(message);
      return !shouldLeave;
    },
  });
}
