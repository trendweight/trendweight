import { redirect } from "@tanstack/react-router";
import { queryClient } from "../queryClient";
import { queryOptions } from "../api/queries";

/**
 * Ensures the user has a profile, redirecting to initial setup if not.
 * @throws Redirect to /initial-setup if no profile exists
 */
export async function ensureProfile(): Promise<void> {
  const profile = await queryClient.fetchQuery(queryOptions.profile);

  if (!profile) {
    throw redirect({ to: "/initial-setup", replace: true });
  }
}

/**
 * Ensures the user has connected provider links, redirecting to link page if not.
 * @throws Redirect to /link if no provider links exist
 */
export async function ensureProviderLinks(): Promise<void> {
  const providerLinks = await queryClient.fetchQuery(queryOptions.providerLinks);

  if (!providerLinks || providerLinks.length === 0) {
    throw redirect({ to: "/link", replace: true });
  }
}
