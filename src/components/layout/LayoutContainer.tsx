import { Box, BoxProps, ChakraTheme, useTheme } from "@chakra-ui/react";
import { FC, PropsWithChildren } from "react";

const LayoutContainer: FC<PropsWithChildren<BoxProps>> = ({ children, ...rest }) => {
  const theme = useTheme() as ChakraTheme;

  return (
    <Box {...rest} w="full" mx="auto" maxW={{ ...theme.breakpoints, base: "unset", sm: "unset" }}>
      {children}
    </Box>
  );
};

export default LayoutContainer;
