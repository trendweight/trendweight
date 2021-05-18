import { Box, GridItem, Heading, Text } from "@chakra-ui/layout";
import React, { FC, PropsWithChildren } from "react";
import Link from "~/components/shared/Link";
import { Page } from "~/lib/core/page";

const proseSpacing = { "> * + *": { my: 4 } };

const Question: FC<PropsWithChildren<{ title: string }>> = ({ title, children }) => (
  <Box>
    <Box as="dt" color="gray.900" fontSize="lg" fontWeight="semibold" lineHeight={6}>
      {title}
    </Box>
    <Box as="dd" mt={2} color="gray.600" fontSize="md" sx={proseSpacing}>
      {children}
    </Box>
  </Box>
);

const FAQ: Page = () => {
  return (
    <Box bg="white">
      <Box px={{ md: 0 }}>
        <Box display={{ lg: "grid" }} gridGap={{ lg: 8 }} gridTemplateColumns={{ lg: "repeat(4, 1fr)" }}>
          <Box>
            <Heading color="gray.900" fontSize="2xl" fontWeight="extrabold">
              Frequently asked questions
            </Heading>
            <Text fontSize="md" mt={4} color="gray.500">
              Can’t find the answer you’re looking for? Email me at <Link href="mailto:erv@ewal.net">erv@ewal.net</Link>
              .
            </Text>
          </Box>
          <GridItem mt={{ base: 6, lg: 0 }} colSpan={{ lg: 3 }}>
            <Box as="dl" sx={{ "> * + *": { my: 8 } }}>
              <Question
                title="Do I need to have a Withings or Fitbit scale to use this site? Can I manually enter my weight data
                  instead?"
              >
                <Text>
                  You do <i>not</i> need special scales. You <i>do</i> have to have either a Withings or Fitbit{" "}
                  <i>account</i>. TrendWeight doesn't know or care if your weight readings come from a connected scale
                  or were entered manually in the Withings or Fitbit apps. Any method is fine as long as the weight
                  readings end up in your Withings or Fitbit account.
                </Text>
                <Text>
                  That said, I do recommend getting a smart scale. They are easy to setup and make it super easy to
                  record your weight everyday. You just step on the scale and your weight gets automatically uploaded.
                  If you don't have one and want to buy one, you can find them on Amazon:{" "}
                  <Link href="https://amzn.to/2Rh8yH1">Withings Scales</Link> or{" "}
                  <Link href="https://amzn.to/3uEWUnS">Fitbit Scales</Link>. (p.s. I'm an Amazon affiliate and receive a
                  small payment if you buy a scale with one of the links on this page)
                </Text>
                <Text>
                  If you don't have a connected scale, just use either the{" "}
                  <Link href="https://www.withings.com/us/en/health-mate">Withings Health Mate</Link> app or the{" "}
                  <Link href="https://www.fitbit.com/sg/app">Fitbit App</Link> and enter your weight manually each day.
                </Text>
              </Question>
              <Question title="Is there a mobile app for TrendWeight?">
                <Text>
                  No. The TrendWeight website works great on mobile sizes, and there are no plans for a native mobile
                  app.
                </Text>
              </Question>
              <Question title="How do I change from Withings to Fitbit (or vice versa)?">
                <Text>
                  If you have some data in one type of account and are going to start using the other type of account,
                  you can simply add a connection via the <Link href="/settings">settings page</Link> to your new
                  account. TrendWeight will keep all the existing weight data from your old account and combine it with
                  the data from the new one, giving you a unified view of your weight over time.
                </Text>
              </Question>
              <Question title="What happens when I weigh myself multiple times in a single day?">
                <Text>
                  TrendWeight will only use one weigh-in per day—the first weigh-in of the day is used. To get the most
                  reliable weight readings day after day, professionals recommend you step on your scale first thing in
                  the morning after you wake up (and use the restroom). As such, TrendWeight uses only the first reading
                  of the day.
                </Text>
                <Text>
                  Feel free to weigh yourself as many times as you want in the day, as those subsequent readings won't
                  throw off TrendWeight even if you weigh yourself right after a large meal.
                </Text>
                <Text>
                  If your first weigh-in of the day is incorrect for some reason and you don't want TrendWeight to use
                  that data, you can log into the Fitbit or Withings apps and edit or delete that incorrect data point.
                  TrendWeight will see the corrected reading the next time it syncs your data.
                </Text>
              </Question>
              <Question title="Can I share my charts and stats with others?">
                <Text>
                  Yep! Losing weight is hard, and sharing your progress with the people who support you can help improve
                  your odds of success. Each user gets a private URL that can be given to friends and family. That URL
                  will allow anyone to see your trend graphs and statistics (so only give it to people you want to see
                  your charts and stats).
                </Text>
                <Text>
                  Go to your <Link href="/settings">Settings</Link> page to find your private URL. You can also change
                  your private URL at any time in case you gave your URL to someone and later decide you don't want them
                  to see your stats anymore.
                </Text>
              </Question>
              <Question title="What is the math behind TrendWeight?">
                <Text>
                  The techniques used on TrendWeight come from John Walker's The Hacker's Diet. I found it to be an
                  interesting read (and it's free!). In particular, I recommend reading the "Signal and Noise" chapter
                  for a better understanding of the weight tracking methodology used on this site.
                </Text>
                <Text>
                  Additionally, there is a detailed walkthrough of the math of TrendWeight, specifically in this{" "}
                  <Link href="#">blog post</Link>.
                </Text>
              </Question>
              <Question title="Is there some way I can help support TrendWeight?">
                <Text>
                  TrendWeight is an app that I created in my free time out of a passion for tech gadgets and software
                  development. And because I wanted this functionality for myself.
                </Text>
                <Text>
                  TrendWeight is free. It will always be free, but if you'd like to know how to help support
                  TrendWeight, you can read more <Link href="/tipjar">here</Link>.
                </Text>
              </Question>
              <Question title="Is TrendWeight open source?">
                <Text>
                  Yes. You can find the project on GitHub <Link href="https://github.com/trendweight">here</Link>.
                  However, it's essentially a one-man show (me), and I'm pretty protective of the project—probably too
                  overprotective. That said, if you have something you'd like to contribute, please reach out.
                </Text>
              </Question>
              <Question title="I still have a question or a suggestion for a new feature.">
                <Text>
                  No problem. If you have a question you don't see answered here, feel free to email{" "}
                  <Link href="mailto:erv@ewal.net">erv@ewal.net</Link> and let me know. If you have a suggestion, you
                  can also email that to me, or you can post your idea{" "}
                  <Link href="https://github.com/trendweight/trendweight/issues">here</Link>.
                </Text>
              </Question>
            </Box>
          </GridItem>
        </Box>
      </Box>
    </Box>
  );
};

FAQ.title = "FAQ";

export default FAQ;
