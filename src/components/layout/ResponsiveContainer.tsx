import React, { FC, PropsWithChildren } from "react";

const ResponsiveContainer: FC<PropsWithChildren<BoxProps>> = ({ children, ...props }) => {
  const theme = useTheme();
  return (
    <Box {...props} mx="auto" w={{ ...theme.breakpoints, base: "full", sm: "full" }}>
      {children}
    </Box>
  );
};

export default ResponsiveContainer;
