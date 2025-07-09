import type { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue, Control } from "react-hook-form";
import { Controller } from "react-hook-form";
import type { SettingsData } from "../../lib/core/interfaces";
import { ToggleGroup } from "../ui/ToggleGroup";
import { TimezoneSelect } from "../ui/TimezoneSelect";

interface ProfileSectionProps {
  register: UseFormRegister<SettingsData>;
  errors: FieldErrors<SettingsData>;
  watch: UseFormWatch<SettingsData>;
  setValue: UseFormSetValue<SettingsData>;
  control: Control<SettingsData>;
}

export function ProfileSection({ register, errors, watch, setValue, control }: ProfileSectionProps) {
  return (
    <div className="p-6 border-b border-gray-200">
      <h2 className="text-xl font-semibold mb-4">Profile Settings</h2>

      <div className="space-y-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
            First Name
          </label>
          <input
            id="firstName"
            type="text"
            {...register("firstName", { required: "First name is required" })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>}
        </div>

        <div>
          <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 mb-1">
            Time Zone
          </label>
          <TimezoneSelect control={control} error={errors.timezone?.message} />
        </div>

        <div>
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
                onChange={(value) => {
                  const isMetric = value === "true";
                  field.onChange(isMetric);

                  // Convert planned pounds per week when switching units
                  const currentPlan = watch("plannedPoundsPerWeek");
                  if (currentPlan && currentPlan !== 0) {
                    if (isMetric) {
                      // Converting from lbs to kg (roughly divide by 2)
                      setValue("plannedPoundsPerWeek", currentPlan / 2);
                    } else {
                      // Converting from kg to lbs (roughly multiply by 2)
                      setValue("plannedPoundsPerWeek", currentPlan * 2);
                    }
                  }

                  // Convert goal weight when switching units
                  const currentGoalWeight = watch("goalWeight");
                  if (currentGoalWeight && currentGoalWeight !== 0) {
                    if (isMetric) {
                      // Converting from lbs to kg (divide by 2.20462 and round)
                      const kgValue = Math.round(currentGoalWeight / 2.20462);
                      setValue("goalWeight", kgValue);
                    } else {
                      // Converting from kg to lbs (multiply by 2.20462 and round)
                      const lbsValue = Math.round(currentGoalWeight * 2.20462);
                      setValue("goalWeight", lbsValue);
                    }
                  }
                }}
              />
            )}
          />
        </div>
      </div>
    </div>
  );
}
