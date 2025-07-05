import { createFileRoute, Link } from '@tanstack/react-router'
import { HiOutlineHeart, HiOutlineLightBulb, HiOutlineRss, HiOutlineShoppingCart } from 'react-icons/hi'
import { Layout } from '../components/Layout'
import { useAuth } from '../lib/auth/useAuth'
import { pageTitle } from '../lib/utils/pageTitle'

export const Route = createFileRoute('/about')({
  component: AboutPage,
})

function AboutPage() {
  const { isInitializing, user } = useAuth()
  const getStarted = isInitializing || !user ? { label: "Get Started", href: "/login" } : { label: "Go to Dashboard", href: "/dashboard" }

  return (
    <>
      <title>{pageTitle('About')}</title>
      <Layout>
        <div>
        <div className="hidden md:block float-right pb-4 pl-4 bg-white w-96">
          <Link to="/demo">
            <img
              src="/screenshot-large.png"
              alt="dashboard screenshot"
              className="w-full h-auto"
            />
          </Link>
        </div>
        <h1 className="text-4xl font-bold pb-4">What is TrendWeight, Exactly?</h1>
        <p className="pb-4">TrendWeight is a free weight tracking web app that filters out the noise and focuses on longer term trends in weight change.</p>
        <p className="pb-4">
          When you really want to track your weight loss, you probably know you should disregard day to day changes in weight and instead focus on the trend over
          time. There are multiple ways to do this, but TrendWeight uses the methodology described by John Walker in his online book, <i>The Hacker's Diet</i>.
        </p>
        <div className="inline-block pb-6 md:pb-4 pr-0 md:pr-8 pt-0 md:pt-2 float-none md:float-left">
          <div className="text-lg pb-2">
            <b>See it in action...</b>
          </div>
          <Link to="/demo" className="inline-block bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 transition-colors text-lg">
            View Demo
          </Link>
        </div>
        <p className="pb-4">
          The idea is pretty simple. You weigh yourself each day and TrendWeight will plot a exponentially weighted moving average for your weight alongside your
          daily scale weight. This gives you a better idea of your weight trend by masking most of the day to day noise that variances in water weight introduce.
        </p>
        <p className="pb-4">
          Your dashboard will also calculate some statistics that will help you understand how close you are to your weight goal and if you are hitting your
          weekly desired rate of weight change.
        </p>
        <p>
          Once you reach your goal, keep weighing yourself every day. TrendWeight will show a goal range that is a bit above and below your goal weight so that
          you can more easily see if your weight starts to creep up too high and you need to go back to the techniques that helped you lose weight in the first
          place.
        </p>
        <div className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-x-10 gap-y-4">
            <div className="bg-brand-50 border border-brand-100 mt-6 pb-8 px-6 rounded-lg flow-root">
              <div className="mt-[-24px]">
                <div>
                  <div className="inline-flex bg-brand-400 text-white items-center justify-center p-3 rounded-md shadow-lg">
                    <HiOutlineLightBulb className="h-6 w-6" />
                  </div>
                </div>
                <h3 className="mt-6 text-gray-900 text-lg font-medium tracking-tight pb-0">
                  Questions?
                </h3>
                <p className="mt-5 text-gray-500 text-base">
                  Take a look at these <Link to="/faq" className="text-brand-600 hover:text-brand-700 underline">FAQs</Link> or email <a href="mailto:erv@ewal.net" className="text-brand-600 hover:text-brand-700 underline">erv@ewal.net</a>.
                </p>
              </div>
            </div>
            <div className="bg-brand-50 border border-brand-100 mt-6 pb-8 px-6 rounded-lg flow-root">
              <div className="mt-[-24px]">
                <div>
                  <div className="inline-flex bg-brand-400 text-white items-center justify-center p-3 rounded-md shadow-lg">
                    <HiOutlineShoppingCart className="h-6 w-6" />
                  </div>
                </div>
                <h3 className="mt-6 text-gray-900 text-lg font-medium tracking-tight pb-0">
                  Get a Scale
                </h3>
                <ul className="pl-4 mt-5 text-gray-500 text-base list-disc">
                  <li>
                    <a href="https://amzn.to/2Rh8yH1" className="text-brand-600 hover:text-brand-700 underline">Withings Scales</a>
                  </li>
                  <li>
                    <a href="https://amzn.to/3uEWUnS" className="text-brand-600 hover:text-brand-700 underline">Fitbit Scales</a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="bg-brand-50 border border-brand-100 mt-6 pb-8 px-6 rounded-lg flow-root">
              <div className="mt-[-24px]">
                <div>
                  <div className="inline-flex bg-brand-400 text-white items-center justify-center p-3 rounded-md shadow-lg">
                    <HiOutlineRss className="h-6 w-6" />
                  </div>
                </div>
                <h3 className="mt-6 text-gray-900 text-lg font-medium tracking-tight pb-0">
                  Stay Updated
                </h3>
                <ul className="pl-4 mt-5 text-gray-500 text-base list-disc">
                  <li>
                    <a href="https://twitter.com/trendweight" className="text-brand-600 hover:text-brand-700 underline">Twitter</a>
                  </li>
                  <li>
                    <a href="https://github.com/trendweight/trendweight/releases" className="text-brand-600 hover:text-brand-700 underline">Release Notes</a>
                  </li>
                  <li>
                    <a href="https://blog.trendweight.com" className="text-brand-600 hover:text-brand-700 underline">Blog</a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="bg-brand-50 border border-brand-100 mt-6 pb-8 px-6 rounded-lg flow-root">
              <div className="mt-[-24px]">
                <div>
                  <div className="inline-flex bg-brand-400 text-white items-center justify-center p-3 rounded-md shadow-lg">
                    <HiOutlineHeart className="h-6 w-6" />
                  </div>
                </div>
                <h3 className="mt-6 text-gray-900 text-lg font-medium tracking-tight pb-0">
                  Support TrendWeight
                </h3>
                <p className="mt-5 text-gray-500 text-base">
                  TrendWeight is free, forever. But if you want info about how you can help fund it, <Link to="/tipjar" className="text-brand-600 hover:text-brand-700 underline">go here</Link>.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-brand-50 border border-brand-100 mt-10 rounded-lg">
          <div className="px-6 md:px-12 py-8 md:py-10 lg:py-12">
            <h2 className="text-brand-600 text-xl sm:text-2xl font-extrabold tracking-tight">
              Ready to check it out?
            </h2>
            <div className="flex mt-2">
              <Link to={getStarted.href} className="inline-block bg-brand-600 text-white px-6 py-3 rounded hover:bg-brand-700 transition-colors text-lg">
                {getStarted.label}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
    </>
  )
}