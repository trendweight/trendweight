import BaseDocument, { Head, Html, Main, NextScript } from "next/document";

class Document extends BaseDocument {
  render() {
    return (
      <Html>
        <Head>
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:slnt,wght@-10..0,100..900&display=swap"
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
          <style>
            {`
            .fonts-loading {
              font-family: Arial !important;
              letter-spacing: 0.40px;
              word-spacing: 0.2px;              
            }
            `}
          </style>
        </Head>
        <body className="fonts-loading">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default Document;
