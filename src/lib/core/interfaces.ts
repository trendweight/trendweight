import { ComponentType } from "react";

export type Page<P = Record<string, never>> = ComponentType<P> & {
  title: string;
  requireLogin?: boolean;
  bypassShell?: boolean;
};

export interface SettingsData {
  uid: string;
  email: string;
}

export interface OAuthState {
  uid: string;
  reason: string;
}
