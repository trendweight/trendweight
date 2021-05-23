const withLess = require("next-with-less");

module.exports = withLess({
  future: {
    webpack5: true,
  },
  optimizeFonts: true,
});
