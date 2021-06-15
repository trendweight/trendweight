import { Image } from "@chakra-ui/image";
import { Box, Heading, ListItem, Text, UnorderedList } from "@chakra-ui/layout";
import React from "react";
import Link from "~/components/shared/Link";
import { Page } from "~/lib/core/page";

const Privacy: Page = () => {
  return (
    <Box mt={4} maxW="4xl">
      <Heading>Our Privacy Policy</Heading>
      <Image src="/assets/security.svg" float="right" ml={4} my={4} h={{ base: 28, md: 48 }} alt="security matters" />
      <Text>
        Your privacy is important. It is TrendWeight's policy to respect your privacy regarding any information we may
        collect from you across our web app, <Link href="https://trendweight.io">https://trendweight.io</Link>, and
        other sites we operate.
      </Text>
      <Text mt={4}>
        We only ask for personal information when we truly need it to provide a service to you. We collect it by fair
        and lawful means, with your knowledge and consent. We also let you know why we’re collecting it and how it will
        be used.
      </Text>
      <Text mt={4}>
        We only retain collected information for as long as necessary to provide you with your requested service. What
        data we store, we’ll protect within commercially acceptable means to prevent loss and theft, as well as
        unauthorized access, disclosure, copying, use or modification.
      </Text>
      <Text mt={4}>
        We don’t share any personally identifying information publicly or with third-parties, except when required to by
        law.
      </Text>
      <Text mt={4}>
        We use <Link href="https://plausible.io/">Plausible</Link> for analytics to understand how many people visit the
        site and what kinds of devices they use. However, Plausible does not use cookies, does not track you, and does
        not collect any personally identifiable information. You can see their data privacy policy{" "}
        <Link href="https://plausible.io/data-policy">here</Link>.
      </Text>
      <Text mt={4}>
        We also use <Link href="https://vercel.com/docs/analytics">Vercel Analytics</Link> to monitor the performance of
        the app. Vercel also does not use cookies, does not track you, and does not collect any personally identifiable
        information. Their privacy policy is <Link href="https://vercel.com/legal/privacy-policy">here</Link>.
      </Text>
      <Text mt={4}>
        We use a number of service providers to make this site work. These service providers may receive some of your
        personal information as part of their normal operation. Below is a non-exhaustive list of the service providers
        we used and and the scope of the services they provide to us. Please see their respective privacy policies for
        details on how they protect any data they may receive about you.
      </Text>
      <UnorderedList mt={4} px={4}>
        <ListItem>
          <Link href="https://firebase.google.com/products/auth">Firebase Authentication</Link>. Authenticating accounts
          e.g. email and password.
        </ListItem>
        <ListItem>
          <Link href="https://firebase.google.com/products/firestore">Firebase Cloud Firestore</Link>. Cloud database
          for storing your settings and your synced weight data.
        </ListItem>
        <ListItem>
          <Link href="https://vercel.com/">Vercel</Link>. Website hosting, content distribution, and performance
          monitoring.
        </ListItem>
      </UnorderedList>
      <Text mt={4}>
        Our website may link to external sites that are not operated by us. Please be aware that we have no control over
        the content and practices of these sites, and cannot accept responsibility or liability for their respective
        privacy policies.
      </Text>
      <Text mt={4}>
        You are free to refuse our request for your personal information, with the understanding that we may be unable
        to provide you with some of your desired services. You may also delete your account at any time from the
        Settings page which will also delete your personal information.
      </Text>
      <Text mt={4}>
        Your continued use of our website will be regarded as acceptance of our practices around privacy and personal
        information. If you have any questions about how we handle user data and personal information, feel free to
        contact us.
      </Text>
      <Text mt={4}>This policy is effective as of April 11, 2021.</Text>
    </Box>
  );
};

Privacy.title = "Privacy";

export default Privacy;
