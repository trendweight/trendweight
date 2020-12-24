import { Button } from "@chakra-ui/react";
import Head from "next/head";
import { useRouter } from "next/router";
import Layout from "~/components/layout/Layout";
import { useAuth } from "~/lib/auth";

export default function Home() {
  const auth = useAuth();
  const router = useRouter();
  if (auth.isInitializing) {
    return <Layout />;
  }
  if (auth.user) {
    router.push("/dashboard");
    return <Layout />;
  } else {
    return (
      <Layout>
        <Head>
          <title>Sign In - TrendWeight</title>
        </Head>
        <Button onClick={(e) => auth.signinWithGithub()}>Sign In</Button>
      </Layout>
    );
  }
}
