import { ToggleButton } from "../ui/ToggleButton";
import { ToggleButtonGroup } from "../ui/ToggleButtonGroup";

interface SortToggleProps {
  sortNewestFirst: boolean;
  onSortChange: (newestFirst: boolean) => void;
}

export function SortToggle({ sortNewestFirst, onSortChange }: SortToggleProps) {
  return (
    <ToggleButtonGroup
      value={sortNewestFirst ? "newest" : "oldest"}
      onChange={(value) => onSortChange(value === "newest")}
      defaultValue="newest"
      aria-label="Sort Order"
    >
      <ToggleButton value="newest">Newest First</ToggleButton>
      <ToggleButton value="oldest">Oldest First</ToggleButton>
    </ToggleButtonGroup>
  );
}
