/* eslint-disable @next/next/no-page-custom-font */
/* eslint-disable @next/next/google-font-display */

import BaseDocument, { Head, Html, Main, NextScript } from "next/document";

class Document extends BaseDocument {
  render() {
    return (
      <Html>
        <Head>
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:slnt,wght@-10..0,100..900&display=fallback"
            rel="stylesheet"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Zilla+Slab:wght@700&text=TrendWeight&display=block"
            rel="stylesheet"
          />
        </Head>
        <script
          dangerouslySetInnerHTML={{
            __html: `if (/MSIE|Trident/.test(window.navigator.userAgent)) window.location.href = '/unsupported.html';`,
          }}
        />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default Document;
