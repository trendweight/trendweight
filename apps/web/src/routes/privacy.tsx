import { createFileRoute } from '@tanstack/react-router'
import { Layout } from '../components/Layout'
import { pageTitle } from '../lib/utils/pageTitle'

export const Route = createFileRoute('/privacy')({
  component: PrivacyPage,
})

function PrivacyPage() {
  return (
    <>
      <title>{pageTitle('Privacy')}</title>
      <Layout>
        <div className="mt-4 max-w-4xl">
        <h1 className="text-4xl font-bold pb-4">Privacy Policy</h1>
        <img src="/security.svg" className="float-right ml-4 my-4 h-28 md:h-48" alt="security matters" />
        <p>
          Your privacy is important. It is TrendWeight's policy to respect your privacy regarding any information collected from you on this web app at{" "}
          <a href="https://trendweight.io" className="text-brand-600 hover:text-brand-700 underline">https://trendweight.io</a>.
        </p>
        <p className="mt-4">
          TrendWeight only collects information that's needed to make the service work for you - like your email address for sign-in and your weight measurements from
          your connected devices. Everything collected is transparent and necessary.
        </p>
        <p className="mt-4">
          Your data is stored securely and protected with reasonable safeguards. Your information is kept only as long as you have an active account.
        </p>
        <p className="mt-4">
          TrendWeight uses <a href="https://plausible.io/" className="text-brand-600 hover:text-brand-700 underline">Plausible</a> for analytics to understand how many people visit and what kinds of devices they
          use. Plausible does not use cookies, does not track you, and does not collect any personally identifiable information. You can see their data
          privacy policy <a href="https://plausible.io/data-policy" className="text-brand-600 hover:text-brand-700 underline">here</a>.
        </p>
        <p className="mt-4">
          This site uses several service providers to make TrendWeight work. These providers help deliver the service to you. Here's what each provider does and what
          information they may handle:
        </p>
        <ul className="mt-4 px-4 list-disc">
          <li>
            Hosting Provider (TBD). Hosts the website and serves it to your browser.
          </li>
          <li>
            <a href="https://supabase.com/auth" className="text-brand-600 hover:text-brand-700 underline">Supabase Auth</a>. Manages your account sign-in using email links or social logins
            (Google, Microsoft, Apple).
          </li>
          <li>
            <a href="https://supabase.com/database" className="text-brand-600 hover:text-brand-700 underline">Supabase Database</a>. Stores your account settings and weight measurements
            securely in the cloud.
          </li>
          <li>
            <a href="https://withings.com/" className="text-brand-600 hover:text-brand-700 underline">Withings</a>. If you connect your Withings account, TrendWeight retrieves your weight measurements
            on your behalf.
          </li>
          <li>
            <a href="https://www.fitbit.com/" className="text-brand-600 hover:text-brand-700 underline">Fitbit</a>. If you connect your Fitbit account, TrendWeight retrieves your weight measurements
            on your behalf.
          </li>
        </ul>
        <p className="mt-4">
          TrendWeight never sells your personal information and never shares it with anyone other than the service providers listed above (and only what's necessary 
          for them to provide their services).
        </p>
        <p className="mt-4">
          When you click links that take you to other websites, those sites have their own privacy policies that TrendWeight doesn't control.
        </p>
        <p className="mt-4">
          You can delete your account at any time from the Settings page, which will also delete all your data from the system.
        </p>
        <p className="mt-4">
          If you have any questions about your privacy or how TrendWeight handles your data, please contact us.
        </p>
        <p className="mt-4">This policy is effective as of July 5, 2025.</p>
      </div>
    </Layout>
    </>
  )
}