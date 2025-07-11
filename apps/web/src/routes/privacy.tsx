import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "../components/Layout";
import { pageTitle } from "../lib/utils/pageTitle";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <>
      <title>{pageTitle("Privacy")}</title>
      <Layout>
        <div className="mt-4 max-w-4xl">
          <h1 className="text-4xl font-bold pb-4">Privacy Policy</h1>

          <div className="md:flex md:gap-6">
            <div className="flex-1">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                <h2 className="font-semibold text-lg mb-2">The Short Version</h2>
                <ul className="list-disc pl-5 space-y-1">
                  <li>We only collect what's needed: your email and weight data</li>
                  <li>Your data is encrypted and stored securely</li>
                  <li>We never sell your information to anyone</li>
                  <li>You can delete your account and all data anytime</li>
                </ul>
              </div>
            </div>

            <div className="md:w-48 mb-4 md:mb-0">
              <img src="/security.svg" className="w-full h-auto" alt="security matters" />
            </div>
          </div>

          <p>We know your privacy matters, so let's be clear about how we handle your data at TrendWeight.</p>

          <h2 className="text-2xl font-semibold mt-6 mb-3">What We Collect</h2>
          <p>TrendWeight only collects information that's needed to make the service work:</p>
          <ul className="mt-2 px-4 list-disc">
            <li>Your email address (for signing in)</li>
            <li>Weight measurements from your connected devices</li>
            <li>Body fat percentage (if your scale provides it)</li>
            <li>Timestamps for each measurement</li>
            <li>Your account preferences and settings</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-6 mb-3">How We Protect Your Data</h2>
          <p>Your data is protected with industry-standard security measures:</p>
          <ul className="mt-2 px-4 list-disc">
            <li>All connections use HTTPS encryption</li>
            <li>Passwords are never stored (we use secure email sign-in or social logins)</li>
            <li>Database access is restricted and monitored</li>
            <li>Regular security updates are applied to all systems</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-6 mb-3">Analytics</h2>
          <p>
            We use{" "}
            <a href="https://plausible.io/" className="text-brand-600 hover:text-brand-700 underline">
              Plausible
            </a>{" "}
            for privacy-friendly analytics. Plausible doesn't use cookies, doesn't track you across websites, and doesn't collect any personal information. It
            just helps us understand overall usage patterns. See their{" "}
            <a href="https://plausible.io/data-policy" className="text-brand-600 hover:text-brand-700 underline">
              privacy policy
            </a>
            .
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-3">Service Providers</h2>
          <p>These services help TrendWeight work. They only receive the minimum information needed:</p>
          <ul className="mt-2 px-4 list-disc">
            <li>
              <a href="https://www.cloudflare.com/" className="text-brand-600 hover:text-brand-700 underline">
                CloudFlare
              </a>
              {" - "}Delivers the website quickly and securely to your browser
            </li>
            <li>
              <a href="https://www.digitalocean.com/" className="text-brand-600 hover:text-brand-700 underline">
                Digital Ocean
              </a>
              {" - "}Hosts the servers that run our application
            </li>
            <li>
              <a href="https://supabase.com/" className="text-brand-600 hover:text-brand-700 underline">
                Supabase
              </a>
              {" - "}Handles sign-in (email/Google/Microsoft/Apple) and stores your data securely
            </li>
          </ul>

          <p className="mt-4 font-semibold">Connected Device Providers (if you use them):</p>
          <ul className="mt-2 px-4 list-disc">
            <li>
              <a href="https://withings.com/" className="text-brand-600 hover:text-brand-700 underline">
                Withings
              </a>
              {" - "}We retrieve your weight data when you connect your account
            </li>
            <li>
              <a href="https://www.fitbit.com/" className="text-brand-600 hover:text-brand-700 underline">
                Fitbit
              </a>
              {" - "}We retrieve your weight data when you connect your account
            </li>
          </ul>

          <h2 className="text-2xl font-semibold mt-6 mb-3">Your Rights</h2>
          <ul className="mt-2 px-4 list-disc">
            <li>You can download a copy of all your data from the Settings page</li>
            <li>You can delete your account anytime from the Settings page</li>
            <li>When you delete your account, your data is removed immediately from our systems</li>
            <li>We never sell or share your personal information with third parties</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-6 mb-3">Other Websites</h2>
          <p>
            TrendWeight includes links to other websites like Amazon, Withings, and Fitbit. When you visit those sites, their privacy policies apply, not ours.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-3">Changes to This Policy</h2>
          <p>We may update this policy from time to time. The most current version will always be on this page with the effective date at the bottom.</p>

          <h2 className="text-2xl font-semibold mt-6 mb-3">Contact</h2>
          <p>
            Questions about your privacy or this policy? Email{" "}
            <a href="mailto:erv@ewal.net" className="text-brand-600 hover:text-brand-700 underline">
              erv@ewal.net
            </a>
          </p>

          <p className="mt-6 text-sm text-gray-600">This policy is effective as of July 5, 2025.</p>
        </div>
      </Layout>
    </>
  );
}
