import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Layout } from "../components/Layout";
import { useAuth } from "../lib/auth/useAuth";
import { pageTitle } from "../lib/utils/pageTitle";
import { supabase } from "../lib/supabase/client";
import type { AppleIDAuthResponse } from "../types/apple";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const search = Route.useSearch() as { from?: string };
  const from = search.from;
  const { sendLoginEmail, signInWithGoogle, signInWithMicrosoft, signInWithApple } = useAuth();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    setError("");

    try {
      await sendLoginEmail(email);
      navigate({ to: "/check-email", search: { email } });
    } catch (err) {
      console.error("Error sending login email:", err);
      setError("Failed to send login email. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleSocialLogin = async (provider: "google" | "microsoft" | "apple") => {
    setError("");

    try {
      switch (provider) {
        case "google":
          await signInWithGoogle();
          break;
        case "microsoft":
          await signInWithMicrosoft();
          break;
        case "apple":
          await signInWithApple();
          break;
      }
      // After successful login, redirect to original destination or dashboard
      navigate({ to: from || "/dashboard" });
    } catch (err) {
      console.error(`Error signing in with ${provider}:`, err);
      setError(`Failed to sign in with ${provider}. Please try again.`);
    }
  };

  // Load Apple Sign In JS
  useEffect(() => {
    const appleServicesId = import.meta.env.VITE_APPLE_SERVICES_ID;
    if (!appleServicesId) {
      return;
    }

    // Check if script is already loaded
    const existingScript = document.querySelector('script[src*="appleid.auth.js"]');
    if (existingScript) {
      // If AppleID is already initialized, we're done
      if (window.AppleID) {
        return;
      }
    }

    const script = document.createElement('script');
    script.src = 'https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js';
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      // Initialize Apple ID auth after script loads
      if (window.AppleID) {
        window.AppleID.auth.init({
          clientId: appleServicesId,
          scope: 'name email',
          redirectURI: window.location.origin,
          usePopup: true,
        });
      }
    };
    
    document.head.appendChild(script);
  }, []);

  // Handle Apple Sign In events
  useEffect(() => {
    if (!import.meta.env.VITE_APPLE_SERVICES_ID) {
      return;
    }

    const handleSuccess = async (event: Event) => {
      const customEvent = event as CustomEvent<AppleIDAuthResponse>;
      try {
        setIsSubmitting(true);
        setError("");
        
        const { error } = await supabase.auth.signInWithIdToken({
          provider: 'apple',
          token: customEvent.detail.authorization.id_token,
        });
        
        if (error) throw error;
        
        navigate({ to: from || "/dashboard" });
      } catch (err) {
        console.error('Apple sign-in completion failed:', err);
        setError('Failed to complete Apple sign-in');
      } finally {
        setIsSubmitting(false);
      }
    };
    
    const handleFailure = (event: Event) => {
      const customEvent = event as CustomEvent<{ error: string }>;
      console.error('Apple sign-in failed:', customEvent.detail?.error);
      setError('Apple sign-in was cancelled or failed');
    };
    
    document.addEventListener('AppleIDSignInOnSuccess', handleSuccess as EventListener);
    document.addEventListener('AppleIDSignInOnFailure', handleFailure as EventListener);
    
    return () => {
      document.removeEventListener('AppleIDSignInOnSuccess', handleSuccess as EventListener);
      document.removeEventListener('AppleIDSignInOnFailure', handleFailure as EventListener);
    };
  }, [navigate, from]);

  return (
    <>
      <title>{pageTitle("Log In")}</title>
      <Layout>
        <div className="max-w-md mx-auto py-12">
          <h1 className="text-4xl font-bold text-center mb-4">Welcome</h1>
          <p className="text-center text-gray-600 mb-8">Log in to your account or create a new one</p>

          {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">{error}</div>}

          {/* Email login form */}
          <form onSubmit={handleEmailSubmit} className="mb-6">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent mb-4"
              placeholder="Email address"
              required
              disabled={isSubmitting}
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-brand-600 text-white py-3 px-6 rounded-md text-base font-medium hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Sending..." : "Continue"}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-gray-50 text-gray-700 uppercase font-medium">or</span>
            </div>
          </div>

          {/* Social login buttons */}
          <div className="space-y-3">
            <button
              onClick={() => handleSocialLogin("google")}
              className="w-full flex items-center justify-start gap-4 px-4 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              <img src="/google-logo-NePEveMl.svg" alt="Google" className="w-5 h-5" />
              <span className="flex-1 text-left text-base">Continue with Google</span>
            </button>

            <button
              onClick={() => handleSocialLogin("microsoft")}
              className="w-full flex items-center justify-start gap-4 px-4 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              <img src="/microsoft-logo-BUXxQnXH.svg" alt="Microsoft" className="w-5 h-5" />
              <span className="flex-1 text-left text-base">Continue with Microsoft Account</span>
            </button>

            <button
              onClick={() => handleSocialLogin("apple")}
              className="w-full flex items-center justify-start gap-4 px-4 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              <img src="/apple-logo-vertically-balanced-rwLdlt8P.svg" alt="Apple" className="w-5 h-5" />
              <span className="flex-1 text-left text-base">Continue with Apple</span>
            </button>
          </div>

          <p className="text-center text-sm text-gray-600 mt-8">
            By continuing, you agree to our{" "}
            <Link to="/privacy" className="text-brand-600 hover:text-brand-700 underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </Layout>
    </>
  );
}
