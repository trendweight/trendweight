import Head from "next/head";
import { FC, PropsWithChildren } from "react";
import Layout from "./Layout";

const Page: FC<PropsWithChildren<{ title: string }>> = ({ title, children }) => {
  return (
    <Layout>
      <Head>
        <title>{title} - TrendWWeight</title>
      </Head>
      {children}
    </Layout>
  );
};

export default Page;
