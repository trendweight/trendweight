import { extendTheme } from "@chakra-ui/react";
import Button from "./components/button";
import Link from "./components/link";
import breakpoints from "./foundations/breakpoints";
import colors from "./foundations/colors";
import typography from "./foundations/typography";
import styles from "./styles";

const overrides = {
  breakpoints,
  ...typography,
  colors,
  styles,
  components: {
    Button,
    Link,
  },
};

export default extendTheme(overrides);
