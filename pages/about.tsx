import { Text } from "@chakra-ui/react";
import Head from "next/head";
import Layout from "~/components/layout/Layout";

export default function About() {
  return (
    <Layout>
      <Head>
        <title>About - TrendWeight</title>
      </Head>
      <Text>About Page </Text>
    </Layout>
  );
}
