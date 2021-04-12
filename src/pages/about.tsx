import Image from "next/image";
import React from "react";
import Link from "~/components/shared/Link";
import { useAuth } from "~/lib/core/auth";
import { Page } from "~/lib/core/page";

const About: Page = () => {
  const { isInitializing, user } = useAuth();

  const getStarted =
    isInitializing || !user
      ? { label: "Create an Account", href: "/register" }
      : { label: "Go to Dashboard", href: "/dashboard" };

  return (
    <div className="mt-4">
      <div className="hidden float-right pb-4 pl-4 bg-white md:block">
        <Link href="demo">
          <Image src="/assets/screenshot-large.png" height={357} width={375} layout="intrinsic" />
        </Link>
      </div>
      <div className="space-y-4">
        <h2 className="text-xl font-bold">What is TrendWeight, Exactly?</h2>
        <p>
          TrendWeight is a free weight tracking web app that filters out the noise and focuses on longer term trends in
          weight change.
        </p>
        <p>
          When you really want to track your weight loss, you probably know you should disregard day to day changes in
          weight and instead focus on the trend over time. There are multiple ways to do this, but TrendWeight uses the
          methodology described by John Walker in his online book, <i>The Hacker's Diet</i>.
        </p>
        <div className="inline-block pb-2 space-y-2 md:float-left md:pb-4 md:pr-8 md:pt-2">
          <div className="text-lg">
            <b>See it in action...</b>
          </div>
          <Link href="/demo" variant="button" size="lg" btnColor="green">
            View Demo
          </Link>
        </div>
        <p>
          The idea is pretty simple. You weigh yourself each day and TrendWeight will plot a exponentially weighted
          moving average for your weight alongside your daily scale weight. This gives you a better idea of your weight
          trend by masking most of the day to day noise that variances in water weight introduce.
        </p>
        <p>
          Your dashboard will also calculate some statistics that will help you understand how close you are to your
          weight goal and if you are hitting your weekly desired rate of weight change.
        </p>
        <p>
          Once you reach your goal, keep weighing yourself every day. TrendWeight will show a goal range that is a bit
          above and below your goal weight so that you can more easily see if your weight starts to creep up too high
          and you need to go back to the techniques that helped you lose weight in the first place.
        </p>
      </div>
      <div className="clear-both -mx-4 mt-6 bg-brand-50 sm:mx-0">
        <div className="px-6 py-8 md:px-12 md:py-10 lg:py-12">
          <h2 className="text-gray-900 text-xl font-extrabold tracking-tight sm:text-2xl">
            <span className="block text-brand-900">Ready to dive in?</span>
          </h2>
          <div className="flex mt-2">
            <div className="inline-flex rounded-md shadow">
              <Link href={getStarted.href} variant="button" btnColor="brand" size="lg">
                {getStarted.label}
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="clear-both mt-8">
        <div className="grid gap-8 grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
          <div className="flow-root mt-6 pb-8 px-6 bg-brand-50 rounded-lg">
            <div className="-mt-6">
              <div>
                <span className="inline-flex items-center justify-center p-3 text-white bg-brand-400 rounded-md shadow-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </span>
              </div>
              <h3 className="mt-6 text-gray-900 text-lg font-medium tracking-tight">Questions?</h3>
              <p className="mt-5 text-gray-500 text-base">
                Take a look at these <Link href="/faq">FAQs</Link> or email{" "}
                <Link href="mailto:erv@ewal.net">erv@ewal.net</Link>.
              </p>
            </div>
          </div>
          <div className="flow-root mt-6 pb-8 px-6 bg-brand-50 rounded-lg">
            <div className="-mt-6">
              <div>
                <span className="inline-flex items-center justify-center p-3 text-white bg-brand-400 rounded-md shadow-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </span>
              </div>
              <h3 className="mt-6 text-gray-900 text-lg font-medium tracking-tight">Get a Scale</h3>
              <p className="mt-5 text-gray-500 text-base">
                <ul className="list-inside list-disc">
                  <li>
                    <Link href="https://amzn.to/2Rh8yH1">Withings Scales</Link>
                  </li>
                  <li>
                    <Link href="https://amzn.to/3uEWUnS">Fitbit Scales</Link>
                  </li>
                </ul>
              </p>
            </div>
          </div>
          <div className="flow-root mt-6 pb-8 px-6 bg-brand-50 rounded-lg">
            <div className="-mt-6">
              <div>
                <span className="inline-flex items-center justify-center p-3 text-white bg-brand-400 rounded-md shadow-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 5c7.18 0 13 5.82 13 13M6 11a7 7 0 017 7m-6 0a1 1 0 11-2 0 1 1 0 012 0z"
                    />
                  </svg>
                </span>
              </div>
              <h3 className="mt-6 text-gray-900 text-lg font-medium tracking-tight">Stay Updated</h3>
              <p className="mt-5 text-gray-500 text-base">
                <ul className="list-inside list-disc">
                  <li>
                    <Link href="https://twitter.com/trendweight">Twitter</Link>
                  </li>
                  <li>
                    <Link href="https://github.com/trendweight/trendweight/releases">Release Notes</Link>
                  </li>
                  <li>
                    <Link href="https://blog.trendweight.com">Blog</Link>
                  </li>
                </ul>
              </p>
            </div>
          </div>
          <div className="flow-root mt-6 pb-8 px-6 bg-brand-50 rounded-lg">
            <div className="-mt-6">
              <div>
                <span className="inline-flex items-center justify-center p-3 text-white bg-brand-400 rounded-md shadow-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </span>
              </div>
              <h3 className="mt-6 text-gray-900 text-lg font-medium tracking-tight">Support TrendWeight</h3>
              <p className="mt-5 text-gray-500 text-base">
                TrendWeight is free, forever. But if you want info about how you can help fund it,{" "}
                <Link href="/donate">go here</Link>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

About.title = "About";

export default About;
