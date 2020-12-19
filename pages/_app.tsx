import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import Head from "next/head";
import React from "react";
import { AuthProvider } from "~/lib/auth";
import "~/lib/fa.ts";
import theme from "~/lib/theme";

function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <ChakraProvider theme={theme} resetCSS>
        <Head>
          <title>TrendWeight</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Component {...pageProps} />
      </ChakraProvider>
    </AuthProvider>
  );
}

export default App;
