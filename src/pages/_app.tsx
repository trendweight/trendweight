import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import Head from "next/head";
import React, { FC, PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import PageWrapper from "~/components/layout/PageWrapper";
import "~/lib/core/fa";
import { Page } from "~/lib/core/page";
import theme from "~/lib/core/theme";
import { AuthProvider } from "~/lib/hooks/auth";

const queryClient = new QueryClient();

const NoShell: FC<PropsWithChildren<unknown>> = ({ children }) => {
  return <>{children}</>;
};

function App({ Component, pageProps }: AppProps) {
  const { title, bypassShell, requireLogin } = Component as Page;
  const Wrapper = bypassShell ? NoShell : PageWrapper;

  if (process.env.NODE_ENV === "development" && title === undefined) {
    throw new Error("'title' property is required on page component.");
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ChakraProvider theme={theme} resetCSS>
          <Head>
            <title>{title === "TrendWeight" ? title : `${title} - TrendWeight`}</title>
            <meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no" />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <Wrapper requireLogin={requireLogin}>
            <Component {...pageProps} />
          </Wrapper>
          <ReactQueryDevtools initialIsOpen={false} />
        </ChakraProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
