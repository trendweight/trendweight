import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Layout } from "../../../components/Layout";
import { useEffect } from "react";
import { Heading } from "../../../components/ui/Heading";
import { Button } from "../../../components/ui/Button";

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
      <div className="mx-auto mt-8 max-w-md">
        <div className={`rounded-lg bg-white p-6 shadow ${isSuccess ? "border-green-500" : "border-red-500"} border-2`}>
          <Heading level={1} className={isSuccess ? "text-green-600" : "text-red-600"}>
            {isSuccess ? "Success!" : "Error"}
          </Heading>

          {isSuccess ? (
            <>
              <p className="mb-4 text-gray-700">Your Withings account has been successfully linked.</p>
              <p className="text-sm text-gray-500">Redirecting to dashboard in 3 seconds...</p>
            </>
          ) : (
            <>
              <p className="mb-4 text-gray-700">Failed to link your Withings account.</p>
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
