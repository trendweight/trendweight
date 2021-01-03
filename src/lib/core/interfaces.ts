import { ComponentType } from "react";

export interface SettingsData {
  uid: string;
  email: string;
}

export type Page<P = Record<string, never>> = ComponentType<P> & {
  title: string;
  requireLogin?: boolean;
  bypassShell?: boolean;
};
