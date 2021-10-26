import { Box, Flex, Heading, Stack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import Link from "~/components/shared/Link";
import LinkButton from "~/components/shared/LinkButton";
import { useAuth } from "~/lib/core/auth";
import { Page } from "~/lib/core/page";

const Register: Page = () => {
  const auth = useAuth();
  const router = useRouter();
  if (auth.isInitializing || auth.user) {
    if (auth.user) {
      router.push("/dashboard");
    }
    return null;
  } else {
    return (
      <Flex align="center" justify="center">
        <Stack
          direction="column"
          w="full"
          maxW="800px"
          spacing={5}
          my={{ base: 4, md: 12 }}
          py={{ md: 12 }}
          px={{ md: 6 }}
          bg={{ md: "gray.50" }}
          borderWidth={{ md: 1 }}
          borderColor={{ md: "gray.100" }}
          rounded={{ md: "lg" }}
          shadow={{ md: "md" }}
        >
          <Heading color="brand.600" pb={0}>
            Create an Account
          </Heading>
          <Box>
            Registration for the beta version of TrendWeight is not available yet. If you are interested in being an early tester, email me at{" "}
            <Link href="mailto:erv@ewal.net?subject=Beta Testing">erv@ewal.net</Link>.
          </Box>
          <Box>
            If you just are interested in knowing when the beta is ready for general use, your best bet is to follow TrendWeight on{" "}
            <Link href="https://twitter.com/trendweight">Twitter</Link>, <Link href="https://facebook.com/trendweight">Facebook</Link>, or subscribe to the{" "}
            <Link href="https://blog.trendweight.com">Blog</Link>.
          </Box>
          <Box>
            In the mean time, you're welcome to use the live version of TrendWeight at <Link href="https://trendweight.com">trendweight.com</Link>.
          </Box>
          <Box>
            <LinkButton href="/">Return to Homepage</LinkButton>
          </Box>
        </Stack>
      </Flex>
    );
  }
};

Register.title = "Sign Up";

export default Register;
