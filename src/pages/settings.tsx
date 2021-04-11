import Link from "~/components/shared/Link";
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
    return <div>Error: {toJson(error)}</div>;
  }

  return (
    <>
      <div>
        <Link href="/link">Link an Account</Link>
      </div>
      <div>
        <code>
          <pre>{toJson(data)}</pre>
        </code>
      </div>
    </>
  );
};

Settings.title = "Settings";
Settings.requireLogin = true;

export default Settings;
