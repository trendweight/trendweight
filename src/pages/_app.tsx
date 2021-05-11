import "@js-joda/timezone";
import type { AppProps } from "next/app";
import Head from "next/head";
import { Router } from "next/router";
import React, { FC, PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import PageWrapper from "~/components/layout/PageWrapper";
import "~/components/shared/nprogress.css";
import { AuthProvider } from "~/lib/core/auth";
import "~/lib/core/fa";
import { Page } from "~/lib/core/page";
import progress from "~/lib/core/progress";
import "~/styles/globals.css";

const queryClient = new QueryClient();

const NoShell: FC<PropsWithChildren<unknown>> = ({ children }) => {
  return <>{children}</>;
};

Router.events.on("routeChangeStart", progress.start);
Router.events.on("routeChangeComplete", progress.done);
Router.events.on("routerChangeError", progress.done);

function App({ Component, pageProps }: AppProps) {
  const { title, bypassShell, requireLogin } = Component as Page;
  const Wrapper = bypassShell ? NoShell : PageWrapper;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isMarkdown = (Component as any).isMDXComponent;

  if (process.env.NODE_ENV === "development" && title === undefined && !isMarkdown) {
    throw new Error("'title' property is required on page component.");
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Head>
          {!isMarkdown && <title>{title === "TrendWeight" ? title : `${title} - TrendWeight`}</title>}
          <meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Wrapper requireLogin={requireLogin}>
          <Component {...pageProps} />
        </Wrapper>
        <ReactQueryDevtools initialIsOpen={false} />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
