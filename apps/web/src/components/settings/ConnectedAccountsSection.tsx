import { useState } from "react";
import { useProviderLinks } from "../../lib/api/queries";
import { useDisconnectProvider, useResyncProvider } from "../../lib/api/mutations";
import { useToast } from "../../lib/hooks/useToast";
import { ConfirmDialog } from "../ui/ConfirmDialog";

export function ConnectedAccountsSection() {
  const { data: providerLinks, isLoading } = useProviderLinks();
  const { showToast } = useToast();
  const [disconnectProvider, setDisconnectProvider] = useState<{ id: string; name: string } | null>(null);

  const disconnectMutation = useDisconnectProvider();
  const resyncMutation = useResyncProvider();

  const providers = [
    {
      id: "withings",
      name: "Withings",
      description: "Connect your Withings smart scale",
      icon: "⚖️", // In production, use actual icon
    },
    {
      id: "fitbit",
      name: "Fitbit",
      description: "Connect your Fitbit Aria scale",
      icon: "🏃", // In production, use actual icon
    },
  ];

  if (isLoading) {
    return (
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold mb-4">Connected Accounts</h2>
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  const connectedProviders = new Set(providerLinks?.map((link) => link.provider) || []);

  return (
    <>
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Connected Accounts</h2>

        <div className="space-y-4">
          {providers.map((provider) => {
            const isConnected = connectedProviders.has(provider.id);
            const providerLink = providerLinks?.find((link) => link.provider === provider.id);

            return (
              <div key={provider.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border border-gray-200 rounded-lg space-y-3 sm:space-y-0">
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">{provider.icon}</div>
                  <div>
                    <h3 className="font-medium text-gray-900">{provider.name}</h3>
                    <p className="text-sm text-gray-600">{provider.description}</p>
                    {isConnected && providerLink && (
                      <p className="text-xs text-gray-500 mt-1">Connected {new Date(providerLink.connectedAt).toLocaleDateString()}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2 self-end sm:self-auto">
                  {isConnected ? (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          resyncMutation.mutate(provider.id, {
                            onSuccess: () => {
                              showToast({
                                title: "Resync Complete",
                                description: `${provider.name} data has been resynced successfully.`,
                                variant: "success",
                              });
                            },
                            onError: () => {
                              showToast({
                                title: "Resync Failed",
                                description: `Failed to resync ${provider.name} data. Please try again.`,
                                variant: "error",
                              });
                            },
                          });
                        }}
                        disabled={resyncMutation.isPending}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
                      >
                        {resyncMutation.isPending ? "Syncing..." : "Resync"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setDisconnectProvider({ id: provider.id, name: provider.name })}
                        disabled={disconnectMutation.isPending}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
                      >
                        {disconnectMutation.isPending ? "Disconnecting..." : "Disconnect"}
                      </button>
                    </>
                  ) : (
                    <a href={`/link?provider=${provider.id}`} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                      Connect
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <ConfirmDialog
        open={!!disconnectProvider}
        onOpenChange={(open) => !open && setDisconnectProvider(null)}
        title={`Disconnect ${disconnectProvider?.name}?`}
        description={
          <div className="space-y-2">
            <p>Are you sure you want to disconnect {disconnectProvider?.name}?</p>
            <p>This will remove all weight data from this provider.</p>
          </div>
        }
        confirmText="Disconnect"
        destructive
        onConfirm={() => {
          if (disconnectProvider) {
            disconnectMutation.mutate(disconnectProvider.id, {
              onSuccess: () => {
                showToast({
                  title: "Disconnected",
                  description: `${disconnectProvider.name} has been disconnected successfully.`,
                  variant: "success",
                });
                setDisconnectProvider(null);
              },
              onError: () => {
                showToast({
                  title: "Disconnect Failed",
                  description: `Failed to disconnect ${disconnectProvider.name}. Please try again.`,
                  variant: "error",
                });
                setDisconnectProvider(null);
              },
            });
          }
        }}
      />
    </>
  );
}
