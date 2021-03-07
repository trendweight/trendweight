import { useRouter } from "next/router";
import { FC, PropsWithChildren } from "react";
import { useAuth } from "~/lib/core/auth";
import Layout from "./Layout";

const PageWrapper: FC<PropsWithChildren<{ requireLogin?: boolean }>> = ({ requireLogin, children }) => {
  const auth = useAuth();
  const router = useRouter();
  if (requireLogin && !auth.user) {
    if (!auth.isInitializing) {
      router.push("/login");
    }
    return null;
  }

  return <Layout>{children}</Layout>;
};

export default PageWrapper;
