import { ToggleButton } from "../ui/ToggleButton";
import { ToggleButtonGroup } from "../ui/ToggleButtonGroup";
import type { ViewType } from "./types";
import type { ProviderLink } from "../../lib/api/types";

interface ViewToggleButtonsProps {
  viewType: ViewType;
  onViewChange: (view: ViewType) => void;
  providerLinks: ProviderLink[];
}

export function ViewToggleButtons({ viewType, onViewChange, providerLinks }: ViewToggleButtonsProps) {
  const connectedProviders = providerLinks.filter((link) => link.hasToken);

  return (
    <ToggleButtonGroup value={viewType} onChange={onViewChange} defaultValue="computed" aria-label="View Type">
      <ToggleButton value="computed">Computed Values</ToggleButton>
      {connectedProviders.map((provider) => (
        <ToggleButton key={provider.provider} value={provider.provider}>
          {provider.provider.charAt(0).toUpperCase() + provider.provider.slice(1)} Data
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}
