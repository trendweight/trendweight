import type { FC } from "react";
import { useReconnectProvider } from "../../lib/api/mutations";
import type { ProviderSyncStatus } from "../../lib/api/types";

interface ProviderSyncErrorProps {
  provider: string;
  status: ProviderSyncStatus;
}

const ProviderSyncError: FC<ProviderSyncErrorProps> = ({ provider, status }) => {
  const reconnectProvider = useReconnectProvider();

  // Skip if no error
  if (status.success || !status.error) {
    return null;
  }

  const providerDisplayName = provider === "fitbit" ? "Fitbit" : "Withings";

  const handleReconnect = async () => {
    try {
      const response = await reconnectProvider.mutateAsync(provider);

      // Redirect to the authorization URL
      const authUrl = response.url || response.authorizationUrl;
      if (authUrl) {
        window.location.assign(authUrl);
      }
    } catch (error) {
      console.error(`Error initiating ${provider} reconnection:`, error);
    }
  };

  // Determine the error message and button text based on error type
  let errorMessage: string;
  let buttonText = "Reconnect →";
  const isAuthError = status.error === "authfailed";

  switch (status.error) {
    case "authfailed":
      errorMessage = `${providerDisplayName} connection needs to be refreshed.`;
      break;
    case "networkerror":
      errorMessage = `Unable to connect to ${providerDisplayName}. Please wait a moment and try again. If this keeps happening, you can try reconnecting.`;
      buttonText = "Reconnect anyway →";
      break;
    default:
      errorMessage =
        status.message || `${providerDisplayName} sync failed. Please wait a moment and try again. If this keeps happening, you can try reconnecting.`;
      buttonText = "Reconnect anyway →";
  }

  return (
    <div className="mb-4 flex items-center justify-between rounded-lg bg-amber-50 border border-amber-200 p-4">
      <div className="flex items-center space-x-3">
        <span className="text-amber-600 text-xl" role="img" aria-label="Warning">
          ⚠️
        </span>
        <span className="text-amber-800 flex-1">{errorMessage}</span>
      </div>
      <button
        onClick={handleReconnect}
        disabled={reconnectProvider.isPending}
        className={`ml-4 whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors ${
          isAuthError ? "bg-amber-600 hover:bg-amber-700" : "bg-amber-500 hover:bg-amber-600"
        }`}
      >
        {reconnectProvider.isPending ? "Loading..." : buttonText}
      </button>
    </div>
  );
};

export default ProviderSyncError;
