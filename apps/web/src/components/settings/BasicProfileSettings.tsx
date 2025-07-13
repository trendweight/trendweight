import type { UseFormRegister, FieldErrors, Control } from "react-hook-form";
import { Controller } from "react-hook-form";
import type { SettingsData } from "../../lib/core/interfaces";
import { ToggleGroup } from "../ui/ToggleGroup";

interface BasicProfileSettingsProps {
  register: UseFormRegister<SettingsData>;
  errors: FieldErrors<SettingsData>;
  control: Control<SettingsData>;
}

/**
 * Basic profile settings component containing First Name, Time Zone, and Units.
 * Used in both the initial setup flow and the main settings page.
 */
export function BasicProfileSettings({ register, errors, control }: BasicProfileSettingsProps) {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
          First Name
        </label>
        <input
          id="firstName"
          type="text"
          {...register("firstName", { required: "First name is required" })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
        />
        {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>}
        <p className="mt-1 text-sm text-gray-500">Used for greetings on the dashboard.</p>
      </div>

      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Weight Units</label>
        <Controller
          name="useMetric"
          control={control}
          render={({ field }) => (
            <ToggleGroup
              options={[
                { value: "false", label: "lbs" },
                { value: "true", label: "kg" },
              ]}
              value={String(field.value ?? false)}
              onChange={(value) => field.onChange(value === "true")}
            />
          )}
        />
        <p className="mt-2 text-sm text-gray-500">Choose your preferred unit of measurement.</p>
      </div>
    </div>
  );
}
