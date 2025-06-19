import { Box, Flex, Heading, Stack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { useAuth } from "../lib/auth/auth";
import { Page } from "../lib/core/page";
import Link from "../lib/shared/Link";
import LinkButton from "../lib/shared/LinkButton";

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
            Registration for the beta version of TrendWeight is not available yet as the new site is not completely functional.
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
