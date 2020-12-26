import { Box, Button, Center, FormControl, Heading, Input, Stack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import Layout from "~/components/layout/Layout";
import Page from "~/components/layout/Page";
import RouteLink from "~/components/shared/RouteLink";
import { useAuth } from "~/lib/auth";

const Login = () => {
  const auth = useAuth();
  const router = useRouter();
  if (auth.isInitializing || auth.user) {
    if (auth.user) {
      router.push("/dashboard");
    }
    return <Layout />;
  } else {
    return (
      <Page title="Sign In">
        <Center>
          <Stack
            borderColor={["inherit", "gray.100"]}
            bg={["inherit", "gray.50"]}
            borderWidth={[0, 1]}
            borderRadius={{ base: 0, md: 8 }}
            maxWidth="400px"
            px={[0, 8]}
            py={[0, 12]}
            my={[4, 12]}
            shadow={{ base: "none", md: "md" }}
            spacing={[6, 8]}
            w="100%"
          >
            <Heading size="md" color="brand.500">
              Sign In
            </Heading>
            <FormControl id="email">
              <Input type="email" variant="flushed" placeholder="Email Address" />
            </FormControl>
            <FormControl id="password">
              <Input type="password" variant="flushed" placeholder="Password" />
            </FormControl>
            <Stack direction="row" align="center">
              <Button>Sign In</Button>
              <Box>
                or <RouteLink href="/register">create an account</RouteLink>
              </Box>
            </Stack>
            <Box>
              <RouteLink href="">forgot your password?</RouteLink>
            </Box>
          </Stack>
        </Center>
      </Page>
    );
  }
};

export default Login;
