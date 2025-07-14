import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "../components/Layout";
import Dashboard from "../components/dashboard/Dashboard";
import { pageTitle } from "../lib/utils/pageTitle";

export const Route = createFileRoute("/demo")({
  component: DemoPage,
});

function DemoPage() {
  return (
    <>
      <title>{pageTitle("Demo Dashboard")}</title>
      <Layout>
        <Dashboard demoMode={true} />
      </Layout>
    </>
  );
}
