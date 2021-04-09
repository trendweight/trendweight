import BaseDocument, { Head, Html, Main, NextScript } from "next/document";

class Document extends BaseDocument {
  render() {
    return (
      <Html>
        <Head>
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link
            rel="preload"
            href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&family=Zilla+Slab:wght@700&display=block"
            as="style"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&family=Zilla+Slab:wght@700&display=block"
            rel="stylesheet"
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
