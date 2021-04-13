import { HeartIcon, LightBulbIcon, RssIcon, ShoppingCartIcon } from "@heroicons/react/outline";
import Image from "next/image";
import React from "react";
import Link from "~/components/shared/Link";
import { useAuth } from "~/lib/core/auth";
import { Page } from "~/lib/core/page";

const About: Page = () => {
  const { isInitializing, user } = useAuth();

  const getStarted =
    isInitializing || !user
      ? { label: "Create an Account", href: "/signup" }
      : { label: "Go to Dashboard", href: "/dashboard" };

  return (
    <div>
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
      <div className="clear-both mt-8">
        <div className="grid gap-8 grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
          <div className="flow-root mt-6 pb-8 px-6 bg-brand-50 border border-brand-100 rounded-lg">
            <div className="-mt-6">
              <div>
                <span className="inline-flex items-center justify-center p-3 text-white bg-brand-400 rounded-md shadow-lg">
                  <LightBulbIcon className="w-6 h-6" />
                </span>
              </div>
              <h3 className="mt-6 text-gray-900 text-lg font-medium tracking-tight">Questions?</h3>
              <p className="mt-5 text-gray-500 text-base">
                Take a look at these <Link href="/faq">FAQs</Link> or email{" "}
                <Link href="mailto:erv@ewal.net">erv@ewal.net</Link>.
              </p>
            </div>
          </div>
          <div className="flow-root mt-6 pb-8 px-6 bg-brand-50 border border-brand-100 rounded-lg">
            <div className="-mt-6">
              <div>
                <span className="inline-flex items-center justify-center p-3 text-white bg-brand-400 rounded-md shadow-lg">
                  <ShoppingCartIcon className="w-6 h-6" />
                </span>
              </div>
              <h3 className="mt-6 text-gray-900 text-lg font-medium tracking-tight">Get a Scale</h3>
              <p className="mt-5 text-gray-500 text-base">
                <ul className="pl-8 list-disc">
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
          <div className="flow-root mt-6 pb-8 px-6 bg-brand-50 border border-brand-100 rounded-lg">
            <div className="-mt-6">
              <div>
                <span className="inline-flex items-center justify-center p-3 text-white bg-brand-400 rounded-md shadow-lg">
                  <RssIcon className="w-6 h-6" />
                </span>
              </div>
              <h3 className="mt-6 text-gray-900 text-lg font-medium tracking-tight">Stay Updated</h3>
              <p className="mt-5 text-gray-500 text-base">
                <ul className="pl-8 list-disc">
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
          <div className="flow-root mt-6 pb-8 px-6 bg-brand-50 border border-brand-100 rounded-lg">
            <div className="-mt-6">
              <div>
                <span className="inline-flex items-center justify-center p-3 text-white bg-brand-400 rounded-md shadow-lg">
                  <HeartIcon className="w-6 h-6" />
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
      <div className="clear-both -mx-4 mt-6 bg-brand-50 border border-brand-100 rounded-lg sm:mx-0">
        <div className="px-6 py-8 md:px-12 md:py-10 lg:py-12">
          <h2 className="text-gray-900 text-xl font-extrabold tracking-tight sm:text-2xl">
            <span className="block text-brand-600">Ready to check it out?</span>
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
    </div>
  );
};

About.title = "About";

export default About;
