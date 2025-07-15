import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Layout } from "../../../components/Layout";
import { useEffect } from "react";
import { Heading } from "../../../components/ui/Heading";

export const Route = createFileRoute("/oauth/withings/callback")({
  component: WithingsCallbackPage,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      success: search.success ? String(search.success) : undefined,
      error: search.error ? String(search.error) : undefined,
    };
  },
});

function WithingsCallbackPage() {
  const navigate = useNavigate();
  const search = Route.useSearch() as { success?: string; error?: string };

  const isSuccess = search.success === "true";
  const errorMessage = search.error ? decodeURIComponent(search.error) : "Unknown error occurred";

  useEffect(() => {
    // Redirect to dashboard after 3 seconds on success
    if (isSuccess) {
      const timer = setTimeout(() => {
        navigate({ to: "/dashboard" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, navigate]);

  return (
    <Layout>
      <div className="max-w-md mx-auto mt-8">
        <div className={`bg-white shadow rounded-lg p-6 ${isSuccess ? "border-green-500" : "border-red-500"} border-2`}>
          <Heading level={1} className={isSuccess ? "text-green-600" : "text-red-600"}>
            {isSuccess ? "Success!" : "Error"}
          </Heading>

          {isSuccess ? (
            <>
              <p className="text-gray-700 mb-4">Your Withings account has been successfully linked.</p>
              <p className="text-sm text-gray-500">Redirecting to dashboard in 3 seconds...</p>
            </>
          ) : (
            <>
              <p className="text-gray-700 mb-4">Failed to link your Withings account.</p>
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
