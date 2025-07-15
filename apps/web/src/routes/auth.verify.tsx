import { createFileRoute, useNavigate, Link, redirect } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Layout } from "../components/Layout";
import { useAuth } from "../lib/auth/useAuth";
import { supabase } from "../lib/supabase/client";
import { pageTitle } from "../lib/utils/pageTitle";
import { Heading } from "../components/ui/Heading";

export const Route = createFileRoute("/auth/verify")({
  // This runs BEFORE the component renders, outside of React's lifecycle
  loader: async ({ location }) => {
    // Check if already logged in
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session) {
      throw redirect({ to: "/dashboard" });
    }

    // Check if this is a Supabase magic link or OAuth callback
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get("token");
    const type = searchParams.get("type");
    const error = searchParams.get("error");
    const errorDescription = searchParams.get("error_description");

    // Handle OAuth errors
    if (error) {
      return { error: errorDescription || error, needsEmail: false };
    }

    // Magic link requires token and type=email
    if (token && type === "email") {
      return { error: null, needsEmail: false, token };
    }

    // Check if this looks like an OAuth callback (has hash or specific query params)
    const hasAuthParams = location.hash || searchParams.get("code") || searchParams.get("access_token");

    if (hasAuthParams) {
      // OAuth callbacks - Supabase handles them automatically
      return { error: null, needsEmail: false, isOAuth: true };
    }

    // Manual visit with no auth parameters - redirect to home
    throw redirect({ to: "/" });
  },
  component: VerifyEmailPage,
});

function VerifyEmailPage() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const routeData = Route.useLoaderData();
  const [isVerifying, setIsVerifying] = useState(true);
  const [error, setError] = useState("");

  const token = routeData.token;
  const isOAuth = routeData.isOAuth;

  useEffect(() => {
    // If already logged in, redirect
    if (isLoggedIn) {
      navigate({ to: "/dashboard" });
      return;
    }

    // Handle OAuth callback or magic link token
    if ((token || isOAuth) && isVerifying) {
      (async () => {
        try {
          // Supabase will handle the verification automatically when we call getSession
          // after the URL contains the proper parameters
          const { data, error } = await supabase.auth.getSession();

          if (error) {
            console.error("Error verifying token:", error);
            setError("Invalid or expired login link. Please try logging in again.");
            setIsVerifying(false);
            return;
          }

          if (data.session) {
            navigate({ to: "/dashboard" });
          } else {
            // Try to exchange the token manually
            const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(window.location.href);

            if (exchangeError) {
              console.error("Error exchanging code:", exchangeError);
              setError("Invalid or expired login link. Please try logging in again.");
            } else {
              navigate({ to: "/dashboard" });
            }
          }
        } catch (err) {
          console.error("Unexpected error:", err);
          setError("An unexpected error occurred. Please try logging in again.");
        } finally {
          setIsVerifying(false);
        }
      })();
    } else if (!token && !isOAuth) {
      setIsVerifying(false);
      setError(routeData.error || "Invalid login link");
    }
  }, [token, isOAuth, isLoggedIn, navigate, isVerifying, routeData.error]);

  return (
    <>
      <title>{pageTitle("Verify Email")}</title>
      <Layout>
        <div className="max-w-md mx-auto text-center">
          {isVerifying ? (
            <>
              <Heading level={1} display>
                Verifying...
              </Heading>
              <p className="text-gray-600">Please wait while we verify your login link.</p>
            </>
          ) : error ? (
            <>
              <Heading level={1} display>
                Verification Failed
              </Heading>
              <p className="text-red-600 mb-4">{error}</p>
              <Link to="/login" className="text-brand-600 hover:text-brand-700 underline">
                Return to login
              </Link>
            </>
          ) : (
            // This shouldn't happen, but just in case
            <>
              <Heading level={1} display>
                Processing...
              </Heading>
              <p className="text-gray-600">Please wait...</p>
            </>
          )}
        </div>
      </Layout>
    </>
  );
}
