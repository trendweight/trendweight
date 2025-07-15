import type { ReactNode } from "react";
import { Heading } from "../ui/Heading";

interface SettingsLayoutProps {
  children: ReactNode;
}

export function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <Heading level={1} className="mb-8" display>
        Settings
      </Heading>
      {children}
    </div>
  );
}
