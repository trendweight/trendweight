import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "../components/Layout";
import { requireAuth } from "../lib/auth/authGuard";
import { apiRequest } from "../lib/api/client";
import { useState, useEffect } from "react";
import { pageTitle } from "../lib/utils/pageTitle";
import { useSearch } from "@tanstack/react-router";

export const Route = createFileRoute("/link")({
  beforeLoad: requireAuth,
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
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);
  const search = useSearch({ from: "/link" });
  const providerParam = search.provider;
  const success = search.success;
  const error = search.error;

  const handleLinkWithings = async () => {
    setIsLoading(true);
    setLoadingProvider("withings");
    try {
      const response = await apiRequest<{ authorizationUrl: string }>("/withings/link");
      window.location.assign(response.authorizationUrl);
    } catch (error) {
      console.error("Error getting Withings authorization URL:", error);
      setIsLoading(false);
      setLoadingProvider(null);
    }
  };

  const handleLinkFitbit = async () => {
    setIsLoading(true);
    setLoadingProvider("fitbit");
    try {
      const response = await apiRequest<{ url: string }>("/fitbit/link");
      window.location.assign(response.url);
    } catch (error) {
      console.error("Error getting Fitbit authorization URL:", error);
      setIsLoading(false);
      setLoadingProvider(null);
    }
  };

  // Show success or error messages based on query params
  useEffect(() => {
    if (success && providerParam) {
      // Could show a success toast here
      console.log(`Successfully linked ${providerParam}`);
    } else if (error && providerParam) {
      // Could show an error toast here
      console.error(`Failed to link ${providerParam}`);
    }
  }, [success, error, providerParam]);

  return (
    <>
      <title>{pageTitle("Link Accounts")}</title>
      <Layout>
        <div>
          <h1 className="text-4xl font-bold mb-4">Link Provider Account</h1>
          <p className="text-lg text-gray-600 mb-4">Connect your Withings or Fitbit account to start tracking your weight trends.</p>

          {success && providerParam && (
            <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded mb-4">
              Successfully connected {providerParam === "fitbit" ? "Fitbit" : "Withings"} account!
            </div>
          )}

          {error && providerParam && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded mb-4">
              Failed to connect {providerParam === "fitbit" ? "Fitbit" : "Withings"} account. Please try again.
            </div>
          )}

          <div className="bg-white shadow rounded-lg p-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <button
                onClick={handleLinkWithings}
                disabled={isLoading}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
              >
                <span className="text-xl">⚖️</span>
                <span>{loadingProvider === "withings" ? "Loading..." : "Link Withings Account"}</span>
              </button>

              <button
                onClick={handleLinkFitbit}
                disabled={isLoading}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
              >
                <span className="text-xl">🏃</span>
                <span>{loadingProvider === "fitbit" ? "Loading..." : "Link Fitbit Account"}</span>
              </button>
            </div>

            {providerParam && !success && !error && (
              <p className="text-sm text-gray-600 text-center mt-4">
                Click the {providerParam === "fitbit" ? "Fitbit" : "Withings"} button above to connect your account.
              </p>
            )}
          </div>
        </div>
      </Layout>
    </>
  );
}
