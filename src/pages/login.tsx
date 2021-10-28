import Login from "modules/auth/Login";
import { useRouter } from "next/router";
import React from "react";
import { useAuth } from "../modules/auth/auth";
import { Page } from "../modules/core/page";

const LoginPage: Page = () => {
  const auth = useAuth();
  const router = useRouter();

  if (auth.isInitializing || auth.user) {
    if (auth.user) {
      router.push("/dashboard");
    }
    return null;
  } else {
    return <Login />;
  }
};

LoginPage.title = "Log In";
LoginPage.requireLogin = false;

export default LoginPage;
