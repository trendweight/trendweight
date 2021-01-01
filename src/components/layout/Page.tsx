import { useRouter } from "next/router";
import { FC, PropsWithChildren } from "react";
import { useAuth } from "~/lib/hooks/auth";
import Layout from "./Layout";

const Page: FC<PropsWithChildren<{ requireLogin?: boolean }>> = ({ requireLogin, children }) => {
  const auth = useAuth();
  const router = useRouter();

  if (requireLogin && !auth.user) {
    if (!auth.isInitializing) {
      router.push("/login");
    }
    return <Layout />;
  }

  return <Layout>{children}</Layout>;
};

export default Page;
