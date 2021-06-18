const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

module.exports = withBundleAnalyzer({
  webpack5: true,
  optimizeFonts: true,
  async rewrites() {
    return [
      {
        source: "/js/script.js",
        destination: "https://plausible.io/js/plausible.js",
      },
      {
        source: "/api/event",
        destination: "https://plausible.io/api/event",
      },
    ];
  },
});
