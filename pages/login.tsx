import { Button, Code, Text } from "@chakra-ui/react";
import Head from "next/head";
import Layout from "~/components/layout/Layout";
import { useAuth } from "~/lib/auth";

export default function Home() {
  const auth = useAuth();
  return (
    <Layout>
      <Head>
        <title>Sign In - TrendWeight</title>
      </Head>
      <Text>
        Current user: <Code>{auth?.user ? auth.user.email : "None"}</Code>
      </Text>
      {auth.user ? (
        <Button onClick={(e) => auth.signOut()}>Sign Out</Button>
      ) : (
        <Button onClick={(e) => auth.signinWithGithub()}>Sign In</Button>
      )}
    </Layout>
  );
}
