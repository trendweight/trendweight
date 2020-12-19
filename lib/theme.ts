import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  styles: {
    global: (props) => ({
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
  fonts: {
    heading: `"Roboto", sans-serif`,
    body: `"Roboto", sans-serif`,
  },
  fontWeights: {
    normal: 400,
    medium: 500,
    bold: 700,
  },
});

export default theme;
