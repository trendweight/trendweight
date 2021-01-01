import Head from "next/head";
import { FC, PropsWithChildren } from "react";
import Layout from "./Layout";

const Page: FC<PropsWithChildren<{ title: string; flex?: boolean }>> = ({ title, flex, children }) => {
  return (
    <Layout flex={flex}>
      <Head>
        <title>{title} - TrendWeight</title>
      </Head>
      {children}
    </Layout>
  );
};

export default Page;
