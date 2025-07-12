import type { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue, Control } from "react-hook-form";
import type { SettingsData } from "../../lib/core/interfaces";
import { BasicProfileSettings } from "./BasicProfileSettings";

interface ProfileSectionProps {
  register: UseFormRegister<SettingsData>;
  errors: FieldErrors<SettingsData>;
  watch: UseFormWatch<SettingsData>;
  setValue: UseFormSetValue<SettingsData>;
  control: Control<SettingsData>;
}

export function ProfileSection({ register, errors, control }: ProfileSectionProps) {
  return (
    <div className="p-6 border-b border-gray-200">
      <h2 className="text-xl font-semibold mb-4">Profile Settings</h2>
      <BasicProfileSettings register={register} errors={errors} control={control} />
    </div>
  );
}
