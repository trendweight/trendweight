import { Box } from "@chakra-ui/react";
import { useRouter } from "next/router";
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
    return <Box>Register Page</Box>;
  }
};

Register.title = "Register";

export default Register;
