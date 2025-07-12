import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { Layout } from "../components/Layout";
import Dashboard from "../components/dashboard/Dashboard";
import DashboardPlaceholder from "../components/dashboard/DashboardPlaceholder";
import { requireAuth } from "../lib/auth/authGuard";
import { pageTitle } from "../lib/utils/pageTitle";
import { ensureProfile, ensureProviderLinks } from "../lib/loaders/utils";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: requireAuth,
  loader: async () => {
    // Ensure user has profile and provider links
    await ensureProfile();
    await ensureProviderLinks();
    return null;
  },
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <>
      <title>{pageTitle("Dashboard")}</title>
      <Layout>
        <Suspense fallback={<DashboardPlaceholder />}>
          <Dashboard />
        </Suspense>
      </Layout>
    </>
  );
}
