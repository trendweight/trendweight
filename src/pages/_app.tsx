import { ChakraProvider } from "@chakra-ui/react";
import "focus-visible/dist/focus-visible";
import FontFaceObserver from "fontfaceobserver";
import type { AppProps } from "next/app";
import Head from "next/head";
import { Router } from "next/router";
import React, { FC, PropsWithChildren, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import PageWrapper from "~/components/layout/PageWrapper";
import "~/components/shared/nprogress.css";
import "~/components/shared/placeholder/styles.scss";
import { AuthProvider } from "~/lib/core/auth";
import { Page } from "~/lib/core/page";
import progress from "~/lib/core/progress";
import theme from "~/lib/theme";

const queryClient = new QueryClient();

const NoShell: FC<PropsWithChildren<unknown>> = ({ children }) => {
  return <>{children}</>;
};

Router.events.on("routeChangeStart", progress.start);
Router.events.on("routeChangeComplete", progress.done);
Router.events.on("routerChangeError", progress.done);

Router.events.on("routeChangeComplete", () => {
  // reset focus on navigate
  document.body.setAttribute("tabIndex", "-1");
  document.body.focus();
  document.body.removeAttribute("tabIndex");
  window.scrollTo(0, 0);
});

function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    if (sessionStorage && sessionStorage.getItem("fontsLoaded")) {
      document.body.className = document.body.className.replace("fonts-loading", "");
      return;
    }
    const font = new FontFaceObserver("Inter");
    if (typeof window !== "undefined") {
      font.load().then(() => {
        document.body.className = document.body.className.replace("fonts-loading", "");
        if (sessionStorage) {
          sessionStorage.setItem("fontsLoaded", "true");
        }
      });
    }
  }, []);

  const { title, bypassShell, requireLogin } = Component as Page;
  const Wrapper = bypassShell ? NoShell : PageWrapper;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isMarkdown = (Component as any).isMDXComponent;

  if (process.env.NODE_ENV === "development" && title === undefined && !isMarkdown) {
    throw new Error("'title' property is required on page component.");
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
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
      </ChakraProvider>
    </QueryClientProvider>
  );
}

export default App;
