import Head from "next/head";
import { useRouter } from "next/router";
import { FC, PropsWithChildren, ReactElement } from "react";
import { useAuth } from "~/lib/auth";
import Layout from "./Layout";

const AuthenticatedPage: FC<PropsWithChildren<{ title: string; flex?: boolean; placeholder?: ReactElement }>> = ({
  title,
  flex,
  placeholder,
  children,
}) => {
  const auth = useAuth();
  const router = useRouter();

  if (!auth.user) {
    if (!auth.isInitializing) {
      router.push("/login");
    }
    return (
      <Layout flex={flex}>
        <Head>
          <title>{title} - TrendWeight</title>
        </Head>
        {placeholder}
      </Layout>
    );
  }

  return (
    <Layout flex={flex}>
      <Head>
        <title>{title} - TrendWeight</title>
      </Head>
      {children}
    </Layout>
  );
};

export default AuthenticatedPage;
