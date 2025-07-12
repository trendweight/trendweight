import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "../components/Layout";
import { requireAuth } from "../lib/auth/authGuard";
import { useEffect } from "react";
import { pageTitle } from "../lib/utils/pageTitle";
import { useSearch } from "@tanstack/react-router";
import { ProviderList } from "../components/providers/ProviderList";
import { useToast } from "../lib/hooks/useToast";
import { ensureProfile } from "../lib/loaders/utils";

export const Route = createFileRoute("/link")({
  beforeLoad: requireAuth,
  loader: async () => {
    // Ensure user has completed initial setup
    await ensureProfile();
    return null;
  },
  component: LinkPage,
  validateSearch: (search: Record<string, unknown>): { provider?: string; success?: string; error?: string } => {
    return {
      provider: search.provider as string | undefined,
      success: search.success as string | undefined,
      error: search.error as string | undefined,
    };
  },
});

function LinkPage() {
  const search = useSearch({ from: "/link" });
  const providerParam = search.provider;
  const success = search.success;
  const error = search.error;
  const { showToast } = useToast();

  // Show success or error messages based on query params
  useEffect(() => {
    if (success && providerParam) {
      showToast({
        title: "Connection Successful",
        description: `Successfully connected ${providerParam === "fitbit" ? "Fitbit" : "Withings"} account!`,
        variant: "success",
      });
    } else if (error && providerParam) {
      showToast({
        title: "Connection Failed",
        description: `Failed to connect ${providerParam === "fitbit" ? "Fitbit" : "Withings"} account. Please try again.`,
        variant: "error",
      });
    }
  }, [success, error, providerParam, showToast]);

  return (
    <>
      <title>{pageTitle("Connect Your Scale")}</title>
      <Layout>
        <div>
          <ProviderList variant="link" showHeader={true} />
        </div>
      </Layout>
    </>
  );
}
