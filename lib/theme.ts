import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
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
  components: {
    Input: {
      variants: {
        outline: {
          field: {
            backgroundColor: "white",
          },
        },
        flushed: {
          field: {
            _invalid: {
              boxShadow: "none",
            },
          },
        },
      },
    },
    Button: {
      defaultProps: {
        colorScheme: "brand",
      },
    },
    Link: {
      baseStyle: {
        color: "brand.400",
        _hover: { color: "brand.800" },
      },
      variants: {
        footer: {
          color: "gray.300",
          _hover: { color: "gray.800" },
        },
      },
    },
  },
});

export default theme;
