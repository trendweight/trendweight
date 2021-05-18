export default {
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
};
