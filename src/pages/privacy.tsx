import { Box, Heading, Image, Link, Text } from "@chakra-ui/react";

const Privacy = () => {
  return (
    <Box maxW={900}>
      <Heading as="h2" size="lg" mt={4}>
        Privacy Policy
      </Heading>
      <Image src="/assets/privacy.svg" my={4} ml={4} float="right" height={{ base: 120, md: 200 }} />
      <Text as="p" mt={4} lineHeight="tall">
        Your privacy is important to us. It is TrendWeight's policy to respect your privacy regarding any information we
        may collect from you across our web app,{" "}
        <Link href="https://trendweight.io" isExternal>
          https://trendweight.io
        </Link>
        , and other sites we operate.
      </Text>
      <Text as="p" mt={4} lineHeight="tall">
        We only ask for personal information when we truly need it to provide a service to you. We collect it by fair
        and lawful means, with your knowledge and consent. We also let you know why we’re collecting it and how it will
        be used.
      </Text>
      <Text as="p" mt={4} lineHeight="tall">
        We only retain collected information for as long as necessary to provide you with your requested service. What
        data we store, we’ll protect within commercially acceptable means to prevent loss and theft, as well as
        unauthorized access, disclosure, copying, use or modification.
      </Text>
      <Text as="p" mt={4} lineHeight="tall">
        We don’t share any personally identifying information publicly or with third-parties, except when required to by
        law.
      </Text>
      <Text as="p" mt={4} lineHeight="tall">
        Our website may link to external sites that are not operated by us. Please be aware that we have no control over
        the content and practices of these sites, and cannot accept responsibility or liability for their respective
        privacy policies.
      </Text>
      <Text as="p" mt={4} lineHeight="tall">
        You are free to refuse our request for your personal information, with the understanding that we may be unable
        to provide you with some of your desired services. You may also delete your account at any time from the
        Settings page which will also delete your personal information.
      </Text>
      <Text as="p" mt={4} lineHeight="tall">
        Your continued use of our website will be regarded as acceptance of our practices around privacy and personal
        information. If you have any questions about how we handle user data and personal information, feel free to
        contact us.
      </Text>
      <Text as="p" mt={4} lineHeight="tall" fontStyle="italic">
        This policy is effective as of January 1, 2021.
      </Text>
    </Box>
  );
};

Privacy.title = "Privacy";

export default Privacy;
