/** @type {import("@types/tailwindcss/tailwind-config").TailwindConfig } */
module.exports = {
  mode: "jit",
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
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        serif: ["Zilla Slab", "serif"],
      },
      colors: {
        brand: {
          50: "#ddebff",
          100: "#bed7f9",
          200: "#9bbef3",
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
