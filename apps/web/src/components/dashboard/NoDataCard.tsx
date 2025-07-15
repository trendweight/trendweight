import { HiOutlineClock } from "react-icons/hi";
import { useProviderLinks } from "../../lib/api/queries";
import { Heading } from "../ui/Heading";

export function NoDataCard() {
  const { data: providerLinks } = useProviderLinks();
  const connectedProviders = providerLinks?.filter((link) => link.hasToken) || [];

  const providerNames = connectedProviders.map((link) => (link.provider === "withings" ? "Withings" : "Fitbit")).join(" and ");

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg border border-gray-200 shadow-sm p-6">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <HiOutlineClock className="w-8 h-8" />
        </div>
        <div className="space-y-3">
          <Heading level={3}>Waiting for Data</Heading>
          <p>Your account is connected to {providerNames || "your provider"}, but there have been no weight measurements detected yet.</p>
          <p>Your charts and stats will appear here as soon as we detect at least one weight measurement.</p>
          <p className="italic">
            Note: TrendWeight looks for new measurements once every couple minutes, so if you go weigh yourself right now, it may be a few minutes before it
            shows up here.
          </p>
        </div>
      </div>
    </div>
  );
}
