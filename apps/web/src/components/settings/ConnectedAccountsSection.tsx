import { ProviderList } from "../providers/ProviderList";
import { Heading } from "../ui/Heading";

export function ConnectedAccountsSection() {
  return (
    <div className="p-6">
      <Heading level={2}>Connected Accounts</Heading>
      <ProviderList variant="settings" showHeader={false} />
    </div>
  );
}
