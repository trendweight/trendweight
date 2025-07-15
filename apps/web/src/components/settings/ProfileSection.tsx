import type { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue, Control } from "react-hook-form";
import type { SettingsData } from "../../lib/core/interfaces";
import { BasicProfileSettings } from "./BasicProfileSettings";
import { Heading } from "../ui/Heading";

interface ProfileSectionProps {
  register: UseFormRegister<SettingsData>;
  errors: FieldErrors<SettingsData>;
  watch: UseFormWatch<SettingsData>;
  setValue: UseFormSetValue<SettingsData>;
  control: Control<SettingsData>;
}

export function ProfileSection({ register, errors, control }: ProfileSectionProps) {
  return (
    <div className="border-b border-gray-200 p-6">
      <Heading level={2}>Profile Settings</Heading>
      <BasicProfileSettings register={register} errors={errors} control={control} />
    </div>
  );
}
