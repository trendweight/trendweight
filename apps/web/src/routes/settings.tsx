import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { Layout } from "../components/Layout";
import { useSettings } from "../lib/api/queries";
import { useUpdateProfile } from "../lib/api/mutations";
import { requireAuth } from "../lib/auth/authGuard";
import { pageTitle } from "../lib/utils/pageTitle";
import { SettingsLayout } from "../components/settings/SettingsLayout";
import { ProfileSection } from "../components/settings/ProfileSection";
import { GoalSection } from "../components/settings/GoalSection";
import { AdvancedSection } from "../components/settings/AdvancedSection";
import { ConnectedAccountsSection } from "../components/settings/ConnectedAccountsSection";
import { SharingSection } from "../components/settings/SharingSection";
import { DangerZoneSection } from "../components/settings/DangerZoneSection";
import { useNavigationGuard } from "../lib/hooks/useNavigationGuard";
import type { SettingsData } from "../lib/core/interfaces";
import { ensureProfile } from "../lib/loaders/utils";

export const Route = createFileRoute("/settings")({
  beforeLoad: requireAuth,
  loader: async () => {
    // Ensure user has a profile
    await ensureProfile();
    return null;
  },
  component: SettingsPage,
});

function SettingsPage() {
  const { data: settingsData } = useSettings();
  const updateProfile = useUpdateProfile();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    control,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<SettingsData>();

  // Update form when settings data loads
  useEffect(() => {
    if (settingsData) {
      reset(settingsData);
    }
  }, [settingsData, reset]);

  // Watch for unit changes and convert values
  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (name === "useMetric" && type === "change") {
        const isMetric = value.useMetric;

        // Convert planned pounds per week when switching units
        const currentPlan = value.plannedPoundsPerWeek;
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
        const currentGoalWeight = value.goalWeight;
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
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, setValue]);

  // Warn user about unsaved changes when navigating away
  useNavigationGuard(isDirty);

  const onSubmit = async (data: SettingsData) => {
    try {
      // Transform empty strings to undefined for optional fields
      // and handle NaN for number fields
      const cleanedData = {
        ...data,
        goalStart: data.goalStart === "" ? undefined : data.goalStart,
        goalWeight: isNaN(data.goalWeight as number) ? undefined : data.goalWeight,
      };

      await updateProfile.mutateAsync(cleanedData);
      reset(cleanedData); // Reset form state to mark as clean
    } catch (error) {
      console.error("Failed to update settings:", error);
    }
  };

  return (
    <>
      <title>{pageTitle("Settings")}</title>
      <Layout>
        <SettingsLayout>
          {/* Settings Form Card */}
          <div className="mb-6 rounded-lg border border-gray-200 bg-white shadow-sm">
            <form onSubmit={handleSubmit(onSubmit)}>
              <ProfileSection register={register} errors={errors} watch={watch} setValue={setValue} control={control} />
              <GoalSection register={register} errors={errors} watch={watch} control={control} />
              <AdvancedSection register={register} errors={errors} watch={watch} setValue={setValue} control={control} />

              {/* Save button */}
              <div className="flex items-center justify-between p-6">
                <div>
                  {isDirty && <p className="text-sm text-gray-600">You have unsaved changes</p>}
                  {updateProfile.isError && <p className="text-sm text-red-600">Failed to save settings. Please try again.</p>}
                  {updateProfile.isSuccess && !isDirty && <p className="text-sm text-green-600">Settings saved successfully!</p>}
                </div>
                <button
                  type="submit"
                  disabled={!isDirty || isSubmitting}
                  className={`rounded-md px-6 py-2 font-medium transition-colors ${
                    isDirty && !isSubmitting ? "bg-brand-600 hover:bg-brand-700 text-white" : "cursor-not-allowed bg-gray-300 text-gray-500"
                  }`}
                >
                  {isSubmitting ? "Saving..." : "Save Settings"}
                </button>
              </div>
            </form>
          </div>

          {/* Connected Accounts Card */}
          <div className="mb-6 rounded-lg border border-gray-200 bg-white shadow-sm">
            <ConnectedAccountsSection />
          </div>

          {/* Sharing Card */}
          <div className="mb-6 rounded-lg border border-gray-200 bg-white shadow-sm">
            <SharingSection watch={watch} />
          </div>

          {/* Danger Zone Card */}
          <div className="rounded-lg border-2 border-red-200 bg-white shadow-sm">
            <DangerZoneSection />
          </div>
        </SettingsLayout>
      </Layout>
    </>
  );
}
