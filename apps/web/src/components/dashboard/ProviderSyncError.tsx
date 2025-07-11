import type { FC } from "react";
import { useState } from "react";
import { apiRequest } from "../../lib/api/client";
import type { ProviderSyncStatus } from "../../lib/api/types";

interface ProviderSyncErrorProps {
  provider: string;
  status: ProviderSyncStatus;
}

const ProviderSyncError: FC<ProviderSyncErrorProps> = ({ provider, status }) => {
  const [isLoading, setIsLoading] = useState(false);

  // Skip if no error
  if (status.success || !status.error) {
    return null;
  }

  const providerDisplayName = provider === "fitbit" ? "Fitbit" : "Withings";

  const handleReconnect = async () => {
    setIsLoading(true);
    try {
      // Use the same endpoints as the link page
      const endpoint = provider === "fitbit" ? "/fitbit/link" : "/withings/link";
      const response = await apiRequest<{ url?: string; authorizationUrl?: string }>(endpoint);

      // Redirect to the authorization URL
      const authUrl = response.url || response.authorizationUrl;
      if (authUrl) {
        window.location.assign(authUrl);
      }
    } catch (error) {
      console.error(`Error initiating ${provider} reconnection:`, error);
      setIsLoading(false);
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
        disabled={isLoading}
        className={`ml-4 whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors ${
          isAuthError ? "bg-amber-600 hover:bg-amber-700" : "bg-amber-500 hover:bg-amber-600"
        }`}
      >
        {isLoading ? "Loading..." : buttonText}
      </button>
    </div>
  );
};

export default ProviderSyncError;
