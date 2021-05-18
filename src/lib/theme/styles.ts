export default {
  global: () => ({
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
};
