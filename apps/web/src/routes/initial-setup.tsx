import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { Layout } from "../components/Layout";
import { BasicProfileSettings } from "../components/settings/BasicProfileSettings";
import { useUpdateProfile } from "../lib/api/mutations";
import { requireAuth } from "../lib/auth/authGuard";
import { pageTitle } from "../lib/utils/pageTitle";
import { getBrowserTimezone, shouldUseMetric, extractFirstName } from "../lib/utils/locale";
import { useAuth } from "../lib/auth/useAuth";
import type { SettingsData } from "../lib/core/interfaces";
import { queryOptions } from "../lib/api/queries";
import { queryClient } from "../lib/queryClient";

export const Route = createFileRoute("/initial-setup")({
  beforeLoad: requireAuth,
  loader: async () => {
    // Check if user already has a profile
    const profile = await queryClient.fetchQuery(queryOptions.profile);

    if (profile) {
      // User already has a profile, redirect to settings
      throw redirect({ to: "/settings", replace: true });
    }

    return null;
  },
  component: InitialSetupPage,
});

function InitialSetupPage() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const updateProfile = useUpdateProfile();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SettingsData>({
    defaultValues: {
      firstName: "",
      timezone: getBrowserTimezone(),
      useMetric: shouldUseMetric(),
    },
  });

  // Set default first name from auth user
  useEffect(() => {
    if (session?.user) {
      const metadata = session.user.user_metadata;
      if (metadata?.full_name) {
        setValue("firstName", extractFirstName(metadata.full_name));
      } else if (metadata?.name) {
        setValue("firstName", extractFirstName(metadata.name));
      }
    }
  }, [session, setValue]);

  const onSubmit = async (data: SettingsData) => {
    try {
      await updateProfile.mutateAsync(data);
      // Redirect to dashboard after successful profile creation
      navigate({ to: "/dashboard", replace: true });
    } catch (error) {
      console.error("Failed to create profile:", error);
    }
  };

  return (
    <>
      <title>{pageTitle("Initial Setup")}</title>
      <Layout>
        <div className="max-w-xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h1 className="text-2xl font-semibold">Welcome to TrendWeight!</h1>
              <p className="text-gray-600 mt-2">Let's set up your profile to get started.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6">
              <BasicProfileSettings register={register} errors={errors} control={control} />

              <div className="mt-6 flex items-center justify-between">
                <div>{updateProfile.isError && <p className="text-sm text-red-600">Failed to create profile. Please try again.</p>}</div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-6 py-2 rounded-md font-medium transition-colors ${
                    !isSubmitting ? "bg-brand-600 text-white hover:bg-brand-700" : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {isSubmitting ? "Creating Profile..." : "Continue"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Layout>
    </>
  );
}
