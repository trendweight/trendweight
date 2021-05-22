/* eslint-disable @next/next/missing-preload */
import BaseDocument, { Head, Html, Main, NextScript } from "next/document";

class Document extends BaseDocument {
  render() {
    return (
      <Html>
        <Head>
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:slnt,wght@-10..0,100..900&display=block"
            rel="stylesheet"
          />
          <link href="https://fonts.googleapis.com/css2?family=Zilla+Slab:wght@700&display=block" rel="stylesheet" />
          <script async defer data-domain="trendweight.io" src="https://plausible.io/js/plausible.js"></script>
          <script
            type="application/javascript"
            dangerouslySetInnerHTML={{
              __html: `if (/MSIE|Trident/.test(window.navigator.userAgent)) window.location.href = '/unsupported.html';`,
            }}
          ></script>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default Document;
