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
        <h1 className="text-4xl font-bold pb-4">Our Privacy Policy</h1>
        <img src="/security.svg" className="float-right ml-4 my-4 h-28 md:h-48" alt="security matters" />
        <p>
          Your privacy is important. It is TrendWeight's policy to respect your privacy regarding any information we may collect from you across our web app,{" "}
          <a href="https://trendweight.io" className="text-brand-600 hover:text-brand-700 underline">https://trendweight.io</a>, and other sites we operate.
        </p>
        <p className="mt-4">
          We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and
          consent. We also let you know why we're collecting it and how it will be used.
        </p>
        <p className="mt-4">
          We only retain collected information for as long as necessary to provide you with your requested service. What data we store, we'll protect within
          commercially acceptable means to prevent loss and theft, as well as unauthorized access, disclosure, copying, use or modification.
        </p>
        <p className="mt-4">We don't share any personally identifying information publicly or with third-parties, except when required to by law.</p>
        <p className="mt-4">
          We use <a href="https://plausible.io/" className="text-brand-600 hover:text-brand-700 underline">Plausible</a> for analytics to understand how many people visit the site and what kinds of devices they
          use. However, Plausible does not use cookies, does not track you, and does not collect any personally identifiable information. You can see their data
          privacy policy <a href="https://plausible.io/data-policy" className="text-brand-600 hover:text-brand-700 underline">here</a>.
        </p>
        <p className="mt-4">
          We also use <a href="https://vercel.com/docs/analytics" className="text-brand-600 hover:text-brand-700 underline">Vercel Analytics</a> to monitor the performance of the app. Vercel also does not use
          cookies, does not track you, and does not collect any personally identifiable information. Their privacy policy is{" "}
          <a href="https://vercel.com/legal/privacy-policy" className="text-brand-600 hover:text-brand-700 underline">here</a>.
        </p>
        <p className="mt-4">
          We use a number of service providers to make this site work. These service providers may receive some of your personal information as part of their
          normal operation. Below is a non-exhaustive list of the service providers we used and and the scope of the services they provide to us. Please see their
          respective privacy policies for details on how they protect any data they may receive about you.
        </p>
        <ul className="mt-4 px-4 list-disc">
          <li>
            <a href="https://supabase.com/auth" className="text-brand-600 hover:text-brand-700 underline">Supabase Auth</a>. Authenticating accounts e.g. email and password.
          </li>
          <li>
            <a href="https://supabase.com/database" className="text-brand-600 hover:text-brand-700 underline">Supabase Database</a>. Cloud database for storing your settings and your synced
            weight data.
          </li>
          <li>
            <a href="https://vercel.com/" className="text-brand-600 hover:text-brand-700 underline">Vercel</a>. Website hosting, content distribution, and performance monitoring.
          </li>
        </ul>
        <p className="mt-4">
          Our website may link to external sites that are not operated by us. Please be aware that we have no control over the content and practices of these
          sites, and cannot accept responsibility or liability for their respective privacy policies.
        </p>
        <p className="mt-4">
          You are free to refuse our request for your personal information, with the understanding that we may be unable to provide you with some of your desired
          services. You may also delete your account at any time from the Settings page which will also delete your personal information.
        </p>
        <p className="mt-4">
          Your continued use of our website will be regarded as acceptance of our practices around privacy and personal information. If you have any questions
          about how we handle user data and personal information, feel free to contact us.
        </p>
        <p className="mt-4">This policy is effective as of April 11, 2021.</p>
      </div>
    </Layout>
    </>
  )
}