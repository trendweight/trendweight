import { useQuery } from "react-query";
import { settingsQuery } from "../modules/api/queries";
import Link from "../modules/shared/components/Link";
import { Page } from "../modules/shared/page";

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
