import { createFileRoute } from "@tanstack/react-router";
import Dashboard from "../components/dashboard/Dashboard";
import { Layout } from "../components/Layout";

export const Route = createFileRoute("/u/$sharingCode")({
  component: SharedDashboard,
});

function SharedDashboard() {
  const { sharingCode } = Route.useParams();
  return (
    <Layout>
      <Dashboard sharingCode={sharingCode} />
    </Layout>
  );
}
