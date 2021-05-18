import { ChakraProvider } from "@chakra-ui/react";
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
import theme from "~/lib/theme";
import "~/styles/globals.css";

const queryClient = new QueryClient();

const NoShell: FC<PropsWithChildren<unknown>> = ({ children }) => {
  return <>{children}</>;
};

Router.events.on("routeChangeStart", progress.start);
Router.events.on("routeChangeComplete", progress.done);
Router.events.on("routerChangeError", progress.done);

// Router.events.on("routeChangeStart", () => {
//   /*
//    * This is needed for the focus to be moved back to the beginning of the page after
//    * client-side routing by next-router, we'll set it programmatically and remove on blur
//    * because we don't want to focus the body if the user clicks on some parts of the body
//    * that are actually not clickable.
//    *
//    * This is useful for click+tab interaction, where you click close to a link + tab in order
//    * to focus that link – a fast way for moving the focus exactly where you want it to be.
//    */
//   document.body.setAttribute("tabIndex", "-1");
// });

// if (typeof window !== "undefined") {
//   document.body.addEventListener("blur", () => {
//     // See the longer explanation above about why we remove this
//     document.body.removeAttribute("tabIndex");
//   });
// }

Router.events.on("routeChangeComplete", () => {
  document.body.setAttribute("tabIndex", "-1");
  document.body.focus();
  document.body.removeAttribute("tabIndex");
});

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
