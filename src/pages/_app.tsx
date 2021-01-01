import { ChakraProvider } from "@chakra-ui/react";
import { NextComponentType, NextPageContext } from "next";
import type { AppProps } from "next/app";
import Head from "next/head";
import React, { FC, PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import Page from "~/components/layout/Page";
import "~/lib/fa.ts";
import { AuthProvider } from "~/lib/hooks/auth";
import theme from "~/lib/theme";

const queryClient = new QueryClient();

interface AdditionalComponentProperties {
  title: string;
  bypassShell: boolean;
  requireLogin: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const NoShell: FC<PropsWithChildren<any>> = ({ children }) => {
  return <>{children}</>;
};

function App({ Component, pageProps }: AppProps) {
  const { title: pageTitle, bypassShell, requireLogin } = Component as NextComponentType<
    NextPageContext,
    unknown,
    unknown
  > &
    AdditionalComponentProperties;
  const PageWrapper = bypassShell ? NoShell : Page;
  if (process.env.NODE_ENV === "development" && pageTitle === undefined) {
    throw new Error("'title' property is required on page component.");
  }
  const title = pageTitle === "TrendWeight" ? pageTitle : `${pageTitle} - TrendWeight`;

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ChakraProvider theme={theme} resetCSS>
          <Head>
            <title>{title}</title>
            <meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no" />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <PageWrapper requireLogin={requireLogin}>
            <Component {...pageProps} />
          </PageWrapper>
          <ReactQueryDevtools initialIsOpen={false} />
        </ChakraProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
