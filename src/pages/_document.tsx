import BaseDocument, { Head, Html, Main, NextScript } from "next/document";

class Document extends BaseDocument {
  render() {
    return (
      <Html>
        <Head>
          <link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
          <link
            rel="preload"
            href="/fonts/zillaslab-bold-latin.woff2"
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
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
