import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "../../lib/api/client";

interface ProviderLink {
  provider: string;
  connectedAt: string;
  updateReason?: string;
  hasToken: boolean;
}

export function ConnectedAccountsSection() {
  const queryClient = useQueryClient();

  const { data: providerLinks, isLoading } = useQuery({
    queryKey: ["providerLinks"],
    queryFn: () => apiRequest<ProviderLink[]>("/providers/links"),
  });

  const disconnectMutation = useMutation({
    mutationFn: (provider: string) => apiRequest(`/providers/${provider}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["providerLinks"] });
    },
  });

  const resyncMutation = useMutation({
    mutationFn: (provider: string) => apiRequest(`/providers/${provider}/resync`, { method: "POST" }),
  });

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
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Connected Accounts</h2>

      <div className="space-y-4">
        {providers.map((provider) => {
          const isConnected = connectedProviders.has(provider.id);
          const providerLink = providerLinks?.find((link) => link.provider === provider.id);

          return (
            <div key={provider.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
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

              <div className="flex items-center space-x-2">
                {isConnected ? (
                  <>
                    <button
                      type="button"
                      onClick={() => resyncMutation.mutate(provider.id)}
                      disabled={resyncMutation.isPending}
                      className="px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-700 disabled:text-gray-400"
                    >
                      {resyncMutation.isPending ? "Syncing..." : "Resync"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Are you sure you want to disconnect ${provider.name}? This will remove all weight data from this provider.`)) {
                          disconnectMutation.mutate(provider.id);
                        }
                      }}
                      disabled={disconnectMutation.isPending}
                      className="px-3 py-1 text-sm font-medium text-red-600 hover:text-red-700 disabled:text-gray-400"
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
  );
}
