import { Box, BoxProps, useTheme } from "@chakra-ui/react";
import React, { FC, PropsWithChildren } from "react";

export const ResponsiveContainer: FC<PropsWithChildren<BoxProps>> = ({
  children,
  ...props
}) => {
  const theme = useTheme();

  return (
    <Box
      {...props}
      mx="auto"
      w={["full", "full", ...theme.breakpoints.slice(2)]}
    >
      {children}
    </Box>
  );
};
