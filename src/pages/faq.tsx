import React from "react";
import Link from "~/components/shared/Link";
import { Page } from "~/lib/core/page";

const FAQ: Page = () => {
  return (
    <div className="bg-white">
      <div className="md:px-0">
        <div className="lg:grid lg:gap-8 lg:grid-cols-4">
          <div>
            <h2 className="text-gray-200-900 text-2xl font-extrabold">Frequently asked questions</h2>
            <p className="text-md mt-4 text-gray-500">
              Can’t find the answer you’re looking for? Email me at <Link href="mailto:erv@ewal.net">erv@ewal.net</Link>
              .
            </p>
          </div>
          <div className="mt-6 lg:col-span-3 lg:mt-0">
            <dl className="space-y-6 md:space-y-8">
              <div>
                <dt className="text-gray-900 text-lg font-semibold leading-6">
                  Do I need to have a Withings or Fitbit scale to use this site? Can I manually enter my weight data
                  instead?
                </dt>
                <dd className="mt-2 text-gray-500 text-base space-y-4">
                  <p>
                    You do{" "}
                    <b>
                      <i>not</i>
                    </b>{" "}
                    need special scales. You{" "}
                    <i>
                      <b>do</b>
                    </i>{" "}
                    have to have either a Withings or Fitbit <i>account</i>. TrendWeight doesn't know or care if your
                    weight readings come from a connected scale or were entered manually in the Withings or Fitbit apps.
                    Any method is fine as long as the weight readings end up in your Withings or Fitbit account.
                  </p>
                  <p>
                    That said, I do recommend getting a smart scale. They are easy to setup and make it super easy to
                    record your weight everyday. You just step on the scale and your weight gets automatically uploaded.
                    If you don't have one and want to buy one, you can find them on Amazon:{" "}
                    <Link href="https://amzn.to/2Rh8yH1">Withings Scales</Link> or{" "}
                    <Link href="https://amzn.to/3uEWUnS">Fitbit Scales</Link>.
                  </p>
                  <p>
                    If you don't have a connected scale, just use either the{" "}
                    <Link href="https://www.withings.com/us/en/health-mate">Withings Health Mate</Link> app or the{" "}
                    <Link href="https://www.fitbit.com/sg/app">Fitbit App</Link> and enter your weight manually each
                    day.
                  </p>
                </dd>
              </div>
              <div>
                <dt className="text-gray-900 text-lg font-semibold leading-6">
                  Is there a mobile app for TrendWeight?
                </dt>
                <dd className="mt-2 text-gray-500 text-base space-y-4">
                  <p>
                    No. The TrendWeight website works great on mobile sizes, and there are no plans for a native mobile
                    app.
                  </p>
                </dd>
              </div>
              <div>
                <dt className="text-gray-900 text-lg font-semibold leading-6">
                  How do I change from Withings to Fitbit (or vice versa)?
                </dt>
                <dd className="mt-2 text-gray-500 text-base space-y-4">
                  <p>
                    If you have some data in one type of account and are going to start using the other type of account,
                    you can simply add a connection via the <Link href="/settings">settings page</Link> to your new
                    account. TrendWeight will keep all the existing weight data from your old account and combine it
                    with the data from the new one, giving you a unified view of your weight over time.
                  </p>
                </dd>
              </div>
              <div>
                <dt className="text-gray-900 text-lg font-semibold leading-6">
                  What happens when I weigh myself multiple times in a single day?
                </dt>
                <dd className="mt-2 text-gray-500 text-base space-y-4">
                  <p>
                    TrendWeight will only use one weigh-in per day—the first weigh-in of the day is used. To get the
                    most reliable weight readings day after day, professionals recommend you step on your scale first
                    thing in the morning after you wake up (and use the restroom). As such, TrendWeight uses only the
                    first reading of the day.
                  </p>
                  <p>
                    Feel free to weigh yourself as many times as you want in the day, as those subsequent readings won't
                    throw off TrendWeight even if you weigh yourself right after a large meal.
                  </p>
                  <p>
                    If your first weigh-in of the day is incorrect for some reason and you don't want TrendWeight to use
                    that data, you can log into the Fitbit or Withings apps and edit or delete that incorrect data
                    point. TrendWeight will see the corrected reading the next time it syncs your data.
                  </p>
                </dd>
              </div>
              <div>
                <dt className="text-gray-900 text-lg font-semibold leading-6">
                  Can I share my charts and stats with others?
                </dt>
                <dd className="mt-2 text-gray-500 text-base space-y-4">
                  <p>
                    Yep! Losing weight is hard, and sharing your progress with the people who support you can help
                    improve your odds of success. Each user gets a private URL that can be given to friends and family.
                    That URL will allow anyone to see your trend graphs and statistics (so only give it to people you
                    want to see your charts and stats).
                  </p>
                  <p>
                    Go to your <Link href="/settings">Settings</Link> page to find your private URL. You can also change
                    your private URL at any time in case you gave your URL to someone and later decide you don't want
                    them to see your stats anymore.
                  </p>
                </dd>
              </div>
              <div>
                <dt className="text-gray-900 text-lg font-semibold leading-6">What is the math behind TrendWeight?</dt>
                <dd className="mt-2 text-gray-500 text-base space-y-4">
                  <p>
                    The techniques used on TrendWeight come from John Walker's The Hacker's Diet. I found it to be an
                    interesting read (and it's free!). In particular, I recommend reading the "Signal and Noise" chapter
                    for a better understanding of the weight tracking methodology used on this site.
                  </p>
                  <p>
                    Additionally, there is a detailed walkthrough of the math of TrendWeight, specifically in this{" "}
                    <Link href="#">blog post</Link>.
                  </p>
                </dd>
              </div>
              <div>
                <dt className="text-gray-900 text-lg font-semibold leading-6">
                  Is there some way I can help support TrendWeight?
                </dt>
                <dd className="mt-2 text-gray-500 text-base space-y-4">
                  <p>
                    TrendWeight is an app that I created in my free time out of a passion for tech gadgets and software
                    development. And because I wanted this functionality for myself.
                  </p>
                  <p>
                    TrendWeight is free. It will always be free, but if you'd like to know how to help support
                    TrendWeight, you can read more <Link href="/donate">here</Link>.
                  </p>
                </dd>
              </div>
              <div>
                <dt className="text-gray-900 text-lg font-semibold leading-6">Is TrendWeight open source?</dt>
                <dd className="mt-2 text-gray-500 text-base space-y-4">
                  <p>
                    Yes. You can find the project on GitHub <Link href="https://github.com/trendweight">here</Link>.
                    However, it's essentially a one-man show (me), and I'm pretty protective of the project—probably too
                    overprotective. That said, if you have something you'd like to contribute, please reach out.
                  </p>
                </dd>
              </div>
              <div>
                <dt className="text-gray-900 text-lg font-semibold leading-6">
                  I still have a question or a suggestion for a new feature.
                </dt>
                <dd className="mt-2 text-gray-500 text-base space-y-4">
                  <p>
                    No problem. If you have a question you don't see answered here, feel free to email{" "}
                    <Link href="mailto:erv@ewal.net">erv@ewal.net</Link> and let me know. If you have a suggestion, you
                    can also email that to me, or you can post your idea{" "}
                    <Link href="https://github.com/trendweight/trendweight/issues">here</Link>.
                  </p>
                </dd>
              </div>
              {/* 
              <div>
                <dt className="text-gray-900 text-lg font-semibold leading-6">Question?</dt>
                <dd className="mt-2 text-gray-500 text-base space-y-4">
                  <p>Answer!</p>
                </dd>
              </div>
 */}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

FAQ.title = "FAQ";

export default FAQ;
