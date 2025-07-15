import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Layout } from "../../../components/Layout";
import { useEffect } from "react";
import { Heading } from "../../../components/ui/Heading";
import { Button } from "../../../components/ui/Button";

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
      <div className="mx-auto mt-8 max-w-md">
        <div className={`rounded-lg bg-white p-6 shadow ${isSuccess ? "border-green-500" : "border-red-500"} border-2`}>
          <Heading level={1} className={isSuccess ? "text-green-600" : "text-red-600"}>
            {isSuccess ? "Success!" : "Error"}
          </Heading>

          {isSuccess ? (
            <>
              <p className="mb-4 text-gray-700">Your Fitbit account has been successfully linked.</p>
              <p className="text-sm text-gray-500">Redirecting to dashboard in 3 seconds...</p>
            </>
          ) : (
            <>
              <p className="mb-4 text-gray-700">Failed to link your Fitbit account.</p>
              <p className="mb-4 text-sm text-red-600">Error: {errorMessage}</p>
              <Button onClick={() => navigate({ to: "/link" })} variant="primary">
                Try Again
              </Button>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
