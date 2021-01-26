import { Box, Code } from "@chakra-ui/react";
import RouteLink from "~/components/shared/RouteLink";
import { Page } from "~/lib/core/page";
import { toJson } from "~/lib/core/utils";
import { useSettings } from "~/lib/queries/settings";

const Settings: Page = () => {
  const { isLoading, data, isError, error } = useSettings();
  useSettings();
  if (isLoading) {
    return null;
  }

  if (isError) {
    return <Box>Error: {toJson(error)}</Box>;
  }

  return (
    <>
      <Box>
        <RouteLink href="/link">Link an Account</RouteLink>
      </Box>
      <Box>
        <Code>
          <pre>{toJson(data)}</pre>
        </Code>
      </Box>
    </>
  );
};

Settings.title = "Settings";
Settings.requireLogin = true;

export default Settings;
