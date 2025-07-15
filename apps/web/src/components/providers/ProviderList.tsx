import { useState } from "react";
import { HiCheckCircle } from "react-icons/hi";
import { useProviderLinks } from "../../lib/api/queries";
import { useDisconnectProvider, useResyncProvider } from "../../lib/api/mutations";
import { apiRequest } from "../../lib/api/client";
import { useToast } from "../../lib/hooks/useToast";
import { ConfirmDialog } from "../ui/ConfirmDialog";
import { Heading } from "../ui/Heading";

interface ProviderListProps {
  variant?: "link" | "settings"; // Different layouts for different pages
  showHeader?: boolean;
}

const providers = [
  {
    id: "withings",
    name: "Withings",
    displayName: "Withings Account",
    logo: "/assets/withings-app.png",
    linkUrl: "https://www.withings.com/us/en/scales",
    linkText: "Get a Withings scale",
    description:
      "Withings creates beautifully designed, easy-to-use smart scales that automatically sync your weight measurements to their Health Mate app. Track your weight, body composition, and long-term trends to achieve your health goals.",
    note: "TrendWeight will automatically import your daily weight measurements from Withings. You can also manually enter weights in the Health Mate app if you don't have a smart scale.",
  },
  {
    id: "fitbit",
    name: "Fitbit",
    displayName: "Fitbit Account",
    logo: "/assets/fitbit-app.png",
    linkUrl: "https://www.fitbit.com/global/us/products/scales",
    linkText: "Get a Fitbit Aria scale",
    description:
      "Fitbit's ecosystem helps you stay motivated and reach your goals with smart scales that measure weight and body fat percentage. Your stats sync automatically to the Fitbit app where you can see trends, log food, and track activity.",
    note: "TrendWeight will automatically import your daily weight measurements from Fitbit. You can also manually log weights in the Fitbit app or website if you don't have an Aria scale.",
  },
];

export function ProviderList({ variant = "link", showHeader = true }: ProviderListProps) {
  const { data: providerLinks } = useProviderLinks();
  const { showToast } = useToast();
  const [disconnectProvider, setDisconnectProvider] = useState<{ id: string; name: string } | null>(null);

  const disconnectMutation = useDisconnectProvider();
  const resyncMutation = useResyncProvider();

  const connectedProviders = new Set(providerLinks?.map((link) => link.provider) || []);

  const handleConnect = async (providerId: string) => {
    try {
      const endpoint = providerId === "fitbit" ? "/fitbit/link" : "/withings/link";
      const response = await apiRequest<{ url?: string; authorizationUrl?: string }>(endpoint);
      const redirectUrl = response.authorizationUrl || response.url;
      if (redirectUrl) {
        window.location.assign(redirectUrl);
      }
    } catch (error) {
      console.error(`Error getting ${providerId} authorization URL:`, error);
      showToast({
        title: "Connection Failed",
        description: `Failed to connect to ${providerId}. Please try again.`,
        variant: "error",
      });
    }
  };

  // Suspense handles loading state
  if (!providerLinks) {
    return <div className="text-gray-500">Loading providers...</div>;
  }

  const containerClasses = variant === "settings" ? "space-y-4" : "space-y-8 mb-8";

  return (
    <>
      {showHeader && variant === "link" && (
        <>
          <Heading level={1} display>
            Connect Your Scale
          </Heading>
          <p className="text-base sm:text-lg text-gray-600 mb-2">
            Connect your Withings or Fitbit account to automatically track your weight with TrendWeight. When you're ready, click one of the options below and
            authorize TrendWeight to access your weight data.
          </p>
          <p className="text-sm sm:text-base text-gray-600 mb-8">
            <span className="font-semibold">Don't have a smart scale?</span> No problem! You can manually enter your weight in either app and TrendWeight will
            still track your trends.
          </p>
        </>
      )}

      <div className={`@container ${containerClasses}`}>
        {providers.map((provider) => {
          const isConnected = connectedProviders.has(provider.id);
          const providerLink = providerLinks?.find((link) => link.provider === provider.id);

          if (variant === "settings") {
            // Compact layout for settings page
            return (
              <div
                key={provider.id}
                className="flex flex-col @sm:flex-row @sm:items-center @sm:justify-between p-4 border border-gray-200 rounded-lg space-y-3 @sm:space-y-0"
              >
                <div className="flex items-center space-x-3">
                  <img src={provider.logo} alt={provider.name} className="w-10 h-10" />
                  <div>
                    <Heading level={3} className="text-gray-900">
                      {provider.name}
                    </Heading>
                    <p className="text-sm text-gray-600">
                      {isConnected ? `Connected ${new Date(providerLink!.connectedAt).toLocaleDateString()}` : "Not connected"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 self-end @sm:self-auto">
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
                        className="px-4 py-2 text-sm font-medium text-white bg-brand-600 rounded-md hover:bg-brand-700 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
                      >
                        {resyncMutation.isPending ? "Syncing..." : "Resync"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setDisconnectProvider({ id: provider.id, name: provider.name })}
                        disabled={disconnectMutation.isPending}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-700 rounded-md hover:bg-red-800 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
                      >
                        {disconnectMutation.isPending ? "Disconnecting..." : "Disconnect"}
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleConnect(provider.id)}
                      className="px-4 py-2 text-sm font-medium text-white bg-brand-600 rounded-md hover:bg-brand-700 transition-colors"
                    >
                      Connect
                    </button>
                  )}
                </div>
              </div>
            );
          }

          // Full layout for link page
          return (
            <div key={provider.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4 @sm:p-6 relative">
              {isConnected && (
                <div className="absolute top-4 right-4">
                  <HiCheckCircle className="w-5 h-5 @sm:w-6 @sm:h-6 text-green-600" />
                </div>
              )}
              <Heading level={2}>{provider.displayName}</Heading>
              <div className="flex flex-col @md:flex-row gap-4 @md:gap-6">
                <div className="flex-shrink-0 self-center @md:self-start">
                  <img src={provider.logo} alt={`${provider.name} logo`} className="w-24 @sm:w-32 @md:w-48 h-auto" />
                </div>
                <div className="flex-1">
                  <p className="text-sm @sm:text-base text-gray-600 mb-3">{provider.description}</p>
                  <p className="text-sm @sm:text-base text-gray-600 mb-3">
                    <a href={provider.linkUrl} target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:text-brand-700 font-medium">
                      {provider.linkText}
                    </a>
                  </p>
                  <p className="text-xs @sm:text-sm text-gray-500 italic mb-4">{provider.note}</p>
                  {isConnected ? (
                    <div className="flex flex-col @sm:flex-row gap-2">
                      <button
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
                        className="px-4 @sm:px-6 py-2 rounded font-medium text-sm bg-brand-600 text-white hover:bg-brand-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                      >
                        {resyncMutation.isPending && resyncMutation.variables === provider.id ? "Syncing..." : "Resync Data"}
                      </button>
                      <button
                        onClick={() => setDisconnectProvider({ id: provider.id, name: provider.name })}
                        disabled={disconnectMutation.isPending}
                        className="px-4 @sm:px-6 py-2 rounded font-medium text-sm bg-red-700 text-white hover:bg-red-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                      >
                        {disconnectMutation.isPending && disconnectMutation.variables === provider.id ? "Disconnecting..." : "Disconnect"}
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleConnect(provider.id)}
                      className="px-4 @sm:px-6 py-2 rounded font-medium text-sm bg-green-600 text-white hover:bg-green-700 transition-colors"
                    >
                      Connect {provider.name} Account
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
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
