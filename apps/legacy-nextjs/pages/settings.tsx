import { useQuery } from "react-query";
import { settingsQuery } from "../lib/api/queries";
import { Page } from "../lib/core/page";
import Link from "../lib/shared/Link";

const Settings: Page = () => {
  const query = useQuery(settingsQuery());

  if (query.isLoading || query.isIdle) {
    return null;
  }

  if (query.isError) {
    return <div>Error: {JSON.stringify(query.error, undefined, 2)}</div>;
  }

  return (
    <>
      <div>
        <Link href="/link">Link an Account</Link>
      </div>
      <div>
        <code>
          <pre>{JSON.stringify(query.data, undefined, 2)}</pre>
        </code>
      </div>
    </>
  );
};

Settings.title = "Settings";
Settings.requireLogin = true;

export default Settings;
