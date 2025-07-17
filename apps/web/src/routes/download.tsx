import { createFileRoute } from "@tanstack/react-router";
import { Suspense, useState } from "react";
import { Layout } from "../components/Layout";
import { requireAuth } from "../lib/auth/authGuard";
import { pageTitle } from "../lib/utils/pageTitle";
import { ensureProfile, ensureProviderLinks } from "../lib/loaders/utils";
import { useProviderLinks } from "../lib/api/queries";
import { Heading } from "../components/ui/Heading";
import { Button } from "../components/ui/Button";
import { ScaleReadingsTable } from "../components/download/ScaleReadingsTable";
import { ViewToggleButtons } from "../components/download/ViewToggleButtons";
import { SortToggle } from "../components/download/SortToggle";
import { useScaleReadingsData } from "../lib/download/useScaleReadingsData";
import { downloadScaleReadingsCSV } from "../lib/download/csvExport";
import { Pagination } from "../components/ui/Pagination";
import { HiDownload } from "react-icons/hi";
import type { ViewType } from "../components/download/types";

export const Route = createFileRoute("/download")({
  beforeLoad: requireAuth,
  loader: async () => {
    // Ensure user has profile and provider links
    await ensureProfile();
    await ensureProviderLinks();
    return null;
  },
  component: ScaleReadingsPage,
});

function ScaleReadingsPage() {
  return (
    <>
      <title>{pageTitle("Download Your Data")}</title>
      <Layout>
        <Suspense fallback={<div className="py-8 text-center">Loading scale readings...</div>}>
          <ScaleReadings />
        </Suspense>
      </Layout>
    </>
  );
}

function ScaleReadings() {
  const [viewType, setViewType] = useState<ViewType>("computed");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortNewestFirst, setSortNewestFirst] = useState(true);
  const itemsPerPage = 50;

  // Load data
  const { data: providerLinks } = useProviderLinks();
  const { readings, profile } = useScaleReadingsData(viewType, sortNewestFirst);

  const connectedProviders = providerLinks?.filter((link) => link.hasToken) || [];

  // Paginate data
  const totalPages = Math.ceil(readings.length / itemsPerPage);
  const paginatedData = readings.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Reset page when changing view
  const handleViewChange = (view: ViewType) => {
    setViewType(view);
    setCurrentPage(1);
  };

  const handleDownloadCSV = () => {
    downloadScaleReadingsCSV(readings, viewType, profile.useMetric);
  };

  if (connectedProviders.length === 0) {
    return (
      <>
        <Heading level={1}>Download Your Data</Heading>
        <p className="mt-4 text-gray-600">No providers connected. Please connect a scale provider from the settings page.</p>
      </>
    );
  }

  return (
    <>
      <Heading level={1}>Download Your Data</Heading>

      {/* View and Sort controls */}
      <div className="mt-6 mb-4 flex flex-col gap-2 sm:flex-row sm:items-center">
        <ViewToggleButtons viewType={viewType} onViewChange={handleViewChange} providerLinks={connectedProviders} />
        <div className="sm:ml-4">
          <SortToggle sortNewestFirst={sortNewestFirst} onSortChange={setSortNewestFirst} />
        </div>
      </div>

      {/* Download button */}
      <div className="mb-4">
        <Button onClick={handleDownloadCSV} variant="primary" size="sm" className="bg-brand-500 hover:bg-brand-800">
          <HiDownload className="mr-2 h-4 w-4" />
          Download as CSV
        </Button>
      </div>

      {/* Data table */}
      {readings.length === 0 ? (
        <p className="text-gray-600">No data available for the selected view.</p>
      ) : (
        <>
          {/* Top Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={readings.length}
            itemLabel="readings"
            className="mb-4"
          />

          <ScaleReadingsTable readings={paginatedData} viewType={viewType} useMetric={profile.useMetric} />

          {/* Bottom Pagination */}
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} className="mt-4" />
        </>
      )}
    </>
  );
}
