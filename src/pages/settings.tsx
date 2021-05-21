import { useQuery } from "react-query";
import Link from "~/components/shared/Link";
import { settingsQuery } from "~/lib/api/queries";
import { Page } from "~/lib/core/page";
import { toJson } from "~/lib/core/utils";

const Settings: Page = () => {
  const query = useQuery(settingsQuery());

  if (query.isLoading || query.isIdle) {
    return null;
  }

  if (query.isError) {
    return <div>Error: {toJson(query.error)}</div>;
  }

  return (
    <>
      <div>
        <Link href="/link">Link an Account</Link>
      </div>
      <div>
        <code>
          <pre>{toJson(query.data)}</pre>
        </code>
      </div>
    </>
  );
};

Settings.title = "Settings";
Settings.requireLogin = true;

export default Settings;
