import { Button } from "@chakra-ui/react";
import { useRouter } from "next/router";
import Layout from "~/components/layout/Layout";
import Page from "~/components/layout/Page";
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
        <Button onClick={(e) => auth.signinWithGithub()}>Sign In</Button>
      </Page>
    );
  }
};

export default Login;
