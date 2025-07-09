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

export const Route = createFileRoute("/settings")({
  beforeLoad: requireAuth,
  component: SettingsPage,
});

function SettingsPage() {
  const { data: settingsData, isLoading, isError, error } = useSettings();
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

  // Warn user about unsaved changes when navigating away
  useNavigationGuard(isDirty);

  const onSubmit = async (data: SettingsData) => {
    try {
      await updateProfile.mutateAsync(data);
      reset(data); // Reset form state to mark as clean
    } catch (error) {
      console.error("Failed to update settings:", error);
    }
  };

  if (isLoading) {
    return (
      <>
        <title>{pageTitle("Settings")}</title>
        <Layout>
          <SettingsLayout>
            <div className="p-8 text-center">
              <p className="text-gray-500">Loading settings...</p>
            </div>
          </SettingsLayout>
        </Layout>
      </>
    );
  }

  if (isError) {
    return (
      <>
        <title>{pageTitle("Settings")}</title>
        <Layout>
          <SettingsLayout>
            <div className="p-8">
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded">
                <p className="font-medium">Error loading settings</p>
                <p className="text-sm mt-1">{error instanceof Error ? error.message : "Unknown error"}</p>
              </div>
            </div>
          </SettingsLayout>
        </Layout>
      </>
    );
  }

  return (
    <>
      <title>{pageTitle("Settings")}</title>
      <Layout>
        <SettingsLayout>
          {/* Settings Form Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
            <form onSubmit={handleSubmit(onSubmit)}>
              <ProfileSection register={register} errors={errors} watch={watch} setValue={setValue} control={control} />
              <GoalSection register={register} errors={errors} watch={watch} control={control} />
              <AdvancedSection register={register} errors={errors} watch={watch} setValue={setValue} control={control} />

              {/* Save button */}
              <div className="p-6 flex items-center justify-between">
                <div>
                  {isDirty && <p className="text-sm text-gray-600">You have unsaved changes</p>}
                  {updateProfile.isError && <p className="text-sm text-red-600">Failed to save settings. Please try again.</p>}
                  {updateProfile.isSuccess && !isDirty && <p className="text-sm text-green-600">Settings saved successfully!</p>}
                </div>
                <button
                  type="submit"
                  disabled={!isDirty || isSubmitting}
                  className={`px-6 py-2 rounded-md font-medium transition-colors ${
                    isDirty && !isSubmitting ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {isSubmitting ? "Saving..." : "Save Settings"}
                </button>
              </div>
            </form>
          </div>

          {/* Connected Accounts Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
            <ConnectedAccountsSection />
          </div>

          {/* Sharing Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
            <SharingSection watch={watch} />
          </div>

          {/* Danger Zone Card */}
          <div className="bg-white rounded-lg shadow-sm border-2 border-red-200">
            <DangerZoneSection />
          </div>
        </SettingsLayout>
      </Layout>
    </>
  );
}
