/** @type {import("@types/tailwindcss/tailwind-config").TailwindConfig } */
module.exports = {
  mode: process.env.__NEXT_PROCESSED_ENV || process.env.VERCEL ? "jit" : undefined, // this is a workaround to a bug in prettier-plugin-tailwind
  purge: ["./public/**/*.html", "./src/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      gridTemplateAreas: {
        "home-wide": ["blurb chart", "buttons buttons", "works works"],
        home: ["blurb", "buttons", "chart", "works"],
      },
      gridTemplateColumns: {
        home: "2fr 3fr",
        sidebar: "1fr auto",
      },
      fontFamily: {
        sans: ["Inter var", "sans-serif"],
        brand: ["Zilla Slab", "serif"],
      },
      colors: {
        brand: {
          50: "#f6f9fd",
          100: "#d5e5fb",
          200: "#d1e1fa",
          300: "#81a9e2",
          400: "#6592d0",
          500: "#507fc3",
          600: "#3468b1",
          700: "#315c98",
          800: "#31517f",
          900: "#2c466b",
        },
      },
      typography: {
        DEFAULT: {
          css: {
            a: {
              "text-decoration": "none",
              "font-weight": "bold",
            },
          },
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require("@savvywombat/tailwindcss-grid-areas"),
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
  ],
};
