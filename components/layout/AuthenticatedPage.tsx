import Head from "next/head";
import { useRouter } from "next/router";
import { FC, PropsWithChildren, ReactElement } from "react";
import { useAuth } from "~/lib/auth";
import Layout from "./Layout";

const AuthenticatedPage: FC<PropsWithChildren<{ title: string; placeholder?: ReactElement }>> = ({
  title,
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
      <Layout>
        <Head>
          <title>{title} - TrendWWeight</title>
        </Head>
        {placeholder}
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>{title} - TrendWWeight</title>
      </Head>
      {children}
    </Layout>
  );
};

export default AuthenticatedPage;
