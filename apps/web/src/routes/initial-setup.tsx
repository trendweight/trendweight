import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { Layout } from "../components/Layout";
import { BasicProfileSettings } from "../components/settings/BasicProfileSettings";
import { useUpdateProfile } from "../lib/api/mutations";
import { requireAuth } from "../lib/auth/authGuard";
import { pageTitle } from "../lib/utils/pageTitle";
import { shouldUseMetric, extractFirstName } from "../lib/utils/locale";
import { useAuth } from "../lib/auth/useAuth";
import type { SettingsData } from "../lib/core/interfaces";
import { queryOptions } from "../lib/api/queries";
import { queryClient } from "../lib/queryClient";
import { Heading } from "../components/ui/Heading";
import { Button } from "../components/ui/Button";

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
        <div className="mx-auto max-w-xl">
          <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 p-6">
              <Heading level={1}>Welcome to TrendWeight!</Heading>
              <p className="mt-2 text-gray-600">Let's set up your profile to get started.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6">
              <BasicProfileSettings register={register} errors={errors} control={control} />

              <div className="mt-6 flex items-center justify-between">
                <div>{updateProfile.isError && <p className="text-sm text-red-600">Failed to create profile. Please try again.</p>}</div>
                <Button type="submit" disabled={isSubmitting} variant="primary">
                  {isSubmitting ? "Creating Profile..." : "Continue"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </Layout>
    </>
  );
}
