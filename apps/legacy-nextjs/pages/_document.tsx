/* eslint-disable @next/next/no-page-custom-font */
/* eslint-disable @next/next/google-font-display */

import BaseDocument, { Head, Html, Main, NextScript } from "next/document";

class Document extends BaseDocument {
  render() {
    return (
      <Html>
        <Head></Head>
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
