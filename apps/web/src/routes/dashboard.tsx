import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { Layout } from "../components/Layout";
import Dashboard from "../components/dashboard/Dashboard";
import DashboardPlaceholder from "../components/dashboard/DashboardPlaceholder";
import { requireAuth } from "../lib/auth/authGuard";
import { pageTitle } from "../lib/utils/pageTitle";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: requireAuth,
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
