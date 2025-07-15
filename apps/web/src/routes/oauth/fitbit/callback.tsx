import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Layout } from "../../../components/Layout";
import { useEffect } from "react";
import { Heading } from "../../../components/ui/Heading";

export const Route = createFileRoute("/oauth/fitbit/callback")({
  component: FitbitCallbackPage,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      code: search.code ? String(search.code) : undefined,
      state: search.state ? String(search.state) : undefined,
      success: search.success ? String(search.success) : undefined,
      error: search.error ? String(search.error) : undefined,
    };
  },
});

function FitbitCallbackPage() {
  const navigate = useNavigate();
  const search = Route.useSearch() as { code?: string; state?: string; success?: string; error?: string };

  const isSuccess = search.success === "true";
  const errorMessage = search.error ? decodeURIComponent(search.error) : "Unknown error occurred";

  useEffect(() => {
    // Handle initial OAuth callback from Fitbit
    if (search.code && search.state) {
      // Initial OAuth callback - redirect to backend
      window.location.href = `${import.meta.env.VITE_API_URL}/api/fitbit/callback?code=${search.code}&state=${search.state}`;
      return;
    }

    // Redirect to dashboard after 3 seconds on success
    if (isSuccess) {
      const timer = setTimeout(() => {
        navigate({ to: "/dashboard" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, search.code, search.state, navigate]);

  // Show loading state for initial OAuth redirect
  if (search.code && search.state) {
    return (
      <Layout>
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <Heading level={2} className="mb-2">
              Connecting to Fitbit...
            </Heading>
            <p className="text-gray-600">Please wait while we complete the authorization.</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Show success/error state
  return (
    <Layout>
      <div className="max-w-md mx-auto mt-8">
        <div className={`bg-white shadow rounded-lg p-6 ${isSuccess ? "border-green-500" : "border-red-500"} border-2`}>
          <Heading level={1} className={isSuccess ? "text-green-600" : "text-red-600"}>
            {isSuccess ? "Success!" : "Error"}
          </Heading>

          {isSuccess ? (
            <>
              <p className="text-gray-700 mb-4">Your Fitbit account has been successfully linked.</p>
              <p className="text-sm text-gray-500">Redirecting to dashboard in 3 seconds...</p>
            </>
          ) : (
            <>
              <p className="text-gray-700 mb-4">Failed to link your Fitbit account.</p>
              <p className="text-sm text-red-600 mb-4">Error: {errorMessage}</p>
              <button onClick={() => navigate({ to: "/link" })} className="bg-brand-600 text-white px-4 py-2 rounded hover:bg-brand-700">
                Try Again
              </button>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
