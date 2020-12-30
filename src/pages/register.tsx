import { useRouter } from "next/router";
import Page from "~/components/layout/Page";
import { useAuth } from "~/lib/auth";

const Register = () => {
  const auth = useAuth();
  const router = useRouter();
  if (auth.isInitializing || auth.user) {
    if (auth.user) {
      router.push("/dashboard");
    }
    return <Page title="Register" />;
  } else {
    return <Page title="Register">Register Page</Page>;
  }
};

export default Register;
