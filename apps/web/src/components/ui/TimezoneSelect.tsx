import { getTimeZones } from "@vvo/tzdb";
import { Controller, type Control } from "react-hook-form";
import type { SettingsData } from "../../lib/core/interfaces";
import { Select } from "./Select";

interface TimezoneSelectProps {
  control: Control<SettingsData>;
  error?: string;
}

// Type for timezone option
interface TimezoneOption {
  value: string;
  label: string;
  zone: ReturnType<typeof getTimeZones>[0];
}

// Get all timezones from tzdb and format for react-select
const allTimezones = getTimeZones({ includeUtc: true });
const timezoneOptions: TimezoneOption[] = allTimezones.map((zone) => ({
  value: zone.name,
  label: zone.currentTimeFormat,
  zone: zone, // Keep the full zone data for group lookup
}));

// Helper to find timezone option by value (checking both name and group)
function findTimezoneOption(value: string) {
  if (!value) return null;
  return timezoneOptions.find((option) => option.value === value || option.zone.group.includes(value)) || null;
}

export function TimezoneSelect({ control, error }: TimezoneSelectProps) {
  return (
    <Controller
      name="timezone"
      control={control}
      rules={{ required: "Time zone is required" }}
      render={({ field }) => {
        // Find the current timezone (handles aliases via group)
        const selectedOption = findTimezoneOption(field.value || "");

        return (
          <Select<TimezoneOption>
            value={selectedOption}
            onChange={(option) => {
              field.onChange(option?.value || "");
            }}
            options={timezoneOptions}
            placeholder="Select a timezone..."
            isSearchable={true}
            // Enable filtering by multiple fields
            filterOption={(option, inputValue) => {
              if (!inputValue) return true;
              const searchValue = inputValue.toLowerCase();
              const { zone } = option.data;

              // Search in multiple fields
              const searchableText = [zone.name, zone.alternativeName, ...(zone.mainCities || []), zone.abbreviation, zone.currentTimeFormat]
                .join(" ")
                .toLowerCase();

              return searchableText.includes(searchValue);
            }}
            error={error}
          />
        );
      }}
    />
  );
}
