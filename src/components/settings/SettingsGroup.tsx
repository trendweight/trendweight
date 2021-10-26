import { Box, Heading, Stack } from "@chakra-ui/react";
import { FC } from "react";

const SettingsGroup: FC<{ title?: string }> = ({ title, children }) => {
  return (
    <Stack direction={{ base: "column", md: "row" }} spacing={6} py={4}>
      <Box minW="3xs">{title && <Heading flexShrink={0}>{title}</Heading>}</Box>
      {children}
    </Stack>
  );
};

export default SettingsGroup;
