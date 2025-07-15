import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Layout } from "../components/Layout";
import { supabase } from "../lib/supabase/client";
import { pageTitle } from "../lib/utils/pageTitle";
import { Heading } from "../components/ui/Heading";

export const Route = createFileRoute("/auth/apple/callback")({
  component: AppleCallbackPage,
});

function AppleCallbackPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the authorization response from URL
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const queryParams = new URLSearchParams(window.location.search);

        // Apple can send the response in either hash or query params
        const idToken = hashParams.get("id_token") || queryParams.get("id_token");
        const state = hashParams.get("state") || queryParams.get("state");
        const error = hashParams.get("error") || queryParams.get("error");

        if (error) {
          throw new Error(`Apple authentication failed: ${error}`);
        }

        if (!idToken) {
          throw new Error("No ID token received from Apple");
        }

        // Validate state for CSRF protection
        const savedState = sessionStorage.getItem("apple_auth_state");
        if (!savedState || savedState !== state) {
          throw new Error("Invalid state parameter - possible CSRF attack");
        }

        // Sign in with Supabase using the ID token
        const { error: signInError } = await supabase.auth.signInWithIdToken({
          provider: "apple",
          token: idToken,
        });

        if (signInError) {
          throw signInError;
        }

        // Get the redirect destination
        const redirectTo = sessionStorage.getItem("apple_auth_redirect") || "/dashboard";

        // Clean up session storage
        sessionStorage.removeItem("apple_auth_state");
        sessionStorage.removeItem("apple_auth_redirect");

        // Redirect to the intended destination
        navigate({ to: redirectTo });
      } catch (err) {
        console.error("Apple callback error:", err);
        setError(err instanceof Error ? err.message : "An unexpected error occurred");
        setIsProcessing(false);
      }
    };

    handleCallback();
  }, [navigate]);

  if (isProcessing) {
    return (
      <>
        <title>{pageTitle("Signing in...")}</title>
        <Layout>
          <div className="max-w-md mx-auto py-12 text-center">
            <Heading level={1}>Completing sign in...</Heading>
            <p className="text-gray-600">Please wait while we complete your sign in with Apple.</p>
          </div>
        </Layout>
      </>
    );
  }

  return (
    <>
      <title>{pageTitle("Sign In Error")}</title>
      <Layout>
        <div className="max-w-md mx-auto py-12">
          <Heading level={1} className="text-red-600">
            Sign In Failed
          </Heading>
          <p className="text-gray-700 mb-6">{error}</p>
          <a href="/login" className="inline-block bg-brand-600 text-white py-2 px-4 rounded hover:bg-brand-700 transition-colors">
            Back to Log In
          </a>
        </div>
      </Layout>
    </>
  );
}
