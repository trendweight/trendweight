import type { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue, Control } from "react-hook-form";
import { Controller } from "react-hook-form";
import type { SettingsData } from "../../lib/core/interfaces";
import { Switch } from "../ui/Switch";
import { Select } from "../ui/Select";
import { Heading } from "../ui/Heading";

interface AdvancedSectionProps {
  register: UseFormRegister<SettingsData>;
  errors: FieldErrors<SettingsData>;
  watch: UseFormWatch<SettingsData>;
  setValue: UseFormSetValue<SettingsData>;
  control: Control<SettingsData>;
}

const dayStartOptions = Array.from({ length: 24 }, (_, i) => {
  const hour = i;
  const displayHour = hour === 0 ? "Midnight" : hour === 12 ? "Noon" : hour < 12 ? `${hour}:00 am` : `${hour - 12}:00 pm`;
  return { value: hour, label: displayHour };
});

export function AdvancedSection({ control }: AdvancedSectionProps) {
  return (
    <div className="p-6 border-b border-gray-200">
      <Heading level={2}>Advanced Settings</Heading>

      <div className="space-y-4">
        <div>
          <label htmlFor="dayStartOffset" className="block text-sm font-medium text-gray-700 mb-1">
            Day Start
          </label>
          <div className="w-full md:w-48">
            <Controller
              name="dayStartOffset"
              control={control}
              render={({ field }) => (
                <Select<{ value: number; label: string }>
                  value={dayStartOptions.find((opt) => opt.value === field.value)}
                  onChange={(option) => {
                    field.onChange(option?.value ?? 0);
                  }}
                  options={dayStartOptions}
                  placeholder="Select time..."
                />
              )}
            />
          </div>
          <div className="mt-2 text-sm text-gray-600 space-y-2">
            <p>
              TrendWeight uses the first weight reading of each day, and this setting determines the time of day that TrendWeight considers a new day to have
              started.
            </p>
            <p>
              For example, if you set this to 3am and then weigh yourself right before bed at 1am on a Wednesday night, TrendWeight will not count that weight
              reading for Thursday.
            </p>
            <p className="font-medium">If you're not sure what to do with this setting, just leave it set to Midnight.</p>
          </div>
        </div>

        <div className="mt-6">
          <Controller
            name="showCalories"
            control={control}
            render={({ field }) => (
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <Switch checked={field.value ?? false} onCheckedChange={field.onChange} />
                </div>
                <label htmlFor={field.name} className="cursor-pointer">
                  <div className="text-sm font-medium text-gray-700">Show calorie calculations</div>
                </label>
              </div>
            )}
          />
          <p className="mt-2 text-sm text-gray-600">Display estimated calorie surplus/deficit based on your weight changes.</p>
        </div>
      </div>
    </div>
  );
}
