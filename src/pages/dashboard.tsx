import { Page } from "~/lib/core/page";
import { toJson } from "~/lib/core/utils";
import { useData } from "~/lib/queries/data";

const Dashboard: Page = () => {
  const { isLoading, data, isError, error } = useData();
  if (isLoading) {
    return null;
  }

  if (isError) {
    return (
      <div>
        <div>Error</div>
        {error && (
          <div>
            <code>
              <pre>
                Code: {error.code}
                <br />
                Message: {error.message}
                <br />
                Stack: {error.remoteStack}
              </pre>
            </code>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <div>
        <code>
          <pre>{toJson(data)}</pre>
        </code>
      </div>
    </>
  );
};

Dashboard.title = "Dashboard";
Dashboard.requireLogin = true;

export default Dashboard;
