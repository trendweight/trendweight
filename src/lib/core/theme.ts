import { extendTheme } from "@chakra-ui/react";
import { createBreakpoints } from "@chakra-ui/theme-tools";

const breakpoints = createBreakpoints({
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
});

const theme = extendTheme({
  breakpoints,
  fonts: {
    body: "Inter, sans-serif",
    heading: "Inter, sans-serif",
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
  styles: {
    global: (_props) => ({
      html: {
        minWidth: "360px",
        scrollBehavior: "smooth",
        overflowY: "scroll",
        overflowX: "hidden",
      },
      "#__next": {
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        background: "white",
      },
    }),
  },
});

export default theme;
