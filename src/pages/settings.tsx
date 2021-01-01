import { Box, Code } from "@chakra-ui/react";
import { useWhoAmI } from "~/lib/hooks/whoami";
import { toJson } from "~/lib/utils";

const Settings = () => {
  const { isLoading, data, isError, error } = useWhoAmI();
  useWhoAmI();
  if (isLoading) {
    return null;
  }

  if (isError) {
    return <Box>Error: {toJson(error)}</Box>;
  }

  return (
    <Box>
      <Code>
        <pre>{toJson(data)}</pre>
      </Code>
    </Box>
  );
};

Settings.title = "Settings";
Settings.requireLogin = true;

export default Settings;
