import { createFileRoute } from "@tanstack/react-router";
import { Container } from "../components/Container";
import { Layout } from "../components/Layout";
import { pageTitle } from "../lib/utils/pageTitle";
import { Heading } from "../components/ui/Heading";
import { Button } from "../components/ui/Button";
import { useState, useEffect } from "react";
import { FiCopy, FiCheck } from "react-icons/fi";
import ReactMarkdown from "react-markdown";

export const Route = createFileRoute("/build")({
  component: BuildDetails,
});

function BuildDetails() {
  const [copied, setCopied] = useState(false);
  const [changelog, setChangelog] = useState<string | null>(null);
  const [loadingChangelog, setLoadingChangelog] = useState(false);

  const environment = import.meta.env.MODE || "development";
  const buildTime = import.meta.env.VITE_BUILD_TIME || "Not available";
  const buildCommit = import.meta.env.VITE_BUILD_COMMIT || "Not available";
  const buildBranch = import.meta.env.VITE_BUILD_BRANCH || "Not available";
  const buildVersion = import.meta.env.VITE_BUILD_VERSION || "Not available";
  const buildRepo = import.meta.env.VITE_BUILD_REPO || "";

  const githubRepo = buildRepo ? `https://github.com/${buildRepo}` : null;
  const isTag = buildVersion.startsWith("v") || (!buildVersion.startsWith("build-") && buildVersion !== "Not available" && buildVersion !== "local");
  const commitUrl = githubRepo && buildCommit !== "Not available" ? `${githubRepo}/commit/${buildCommit}` : null;
  const versionUrl = githubRepo && buildVersion !== "Not available" && buildVersion !== "local" && isTag ? `${githubRepo}/releases/tag/${buildVersion}` : null;

  // Format build time to be more readable
  const formatBuildTime = (timestamp: string) => {
    if (timestamp === "Not available") return timestamp;
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      const localTime = date.toLocaleString();
      const utcTime = date.toUTCString();

      let ageText = "";
      if (diffDays === 0) {
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        if (diffHours === 0) {
          const diffMinutes = Math.floor(diffMs / (1000 * 60));
          ageText = `${diffMinutes} minute${diffMinutes !== 1 ? "s" : ""} ago`;
        } else {
          ageText = `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
        }
      } else if (diffDays === 1) {
        ageText = "1 day ago";
      } else {
        ageText = `${diffDays} days ago`;
      }

      return { localTime, utcTime, ageText };
    } catch {
      return timestamp;
    }
  };

  const buildTimeInfo = typeof formatBuildTime(buildTime) === "object" ? formatBuildTime(buildTime) : null;

  // Get browser and system info
  const getBrowserInfo = () => {
    const ua = navigator.userAgent;
    const browser = {
      name: "Unknown",
      version: "Unknown",
    };

    if (ua.includes("Chrome")) {
      browser.name = "Chrome";
      browser.version = ua.match(/Chrome\/(\d+)/)?.[1] || "Unknown";
    } else if (ua.includes("Firefox")) {
      browser.name = "Firefox";
      browser.version = ua.match(/Firefox\/(\d+)/)?.[1] || "Unknown";
    } else if (ua.includes("Safari") && !ua.includes("Chrome")) {
      browser.name = "Safari";
      browser.version = ua.match(/Version\/(\d+)/)?.[1] || "Unknown";
    } else if (ua.includes("Edge")) {
      browser.name = "Edge";
      browser.version = ua.match(/Edge\/(\d+)/)?.[1] || "Unknown";
    }

    return {
      browser: `${browser.name} ${browser.version}`,
      userAgent: ua,
      platform:
        (navigator as unknown as { platform?: string }).platform ||
        (navigator as unknown as { userAgentData?: { platform?: string } }).userAgentData?.platform ||
        "Unknown",
      language: navigator.language || "Unknown",
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      viewportSize: `${window.innerWidth}x${window.innerHeight}`,
      cookiesEnabled: navigator.cookieEnabled,
      localStorage: (() => {
        try {
          return !!window.localStorage;
        } catch {
          return false;
        }
      })(),
    };
  };

  const systemInfo = getBrowserInfo();

  // Create debug info for copying/emailing
  const getDebugInfo = () => {
    const info = [
      "=== TrendWeight Build Information ===",
      "",
      "Build Details:",
      `- Environment: ${environment}`,
      `- Version: ${buildVersion}`,
      `- Branch: ${buildBranch}`,
      `- Commit: ${buildCommit}`,
      `- Build Time: ${buildTime}`,
      buildTimeInfo && typeof buildTimeInfo === "object" ? `- Build Age: ${buildTimeInfo.ageText}` : "",
      "",
      "System Information:",
      `- Browser: ${systemInfo.browser}`,
      `- Platform: ${systemInfo.platform}`,
      `- Language: ${systemInfo.language}`,
      `- Screen Resolution: ${systemInfo.screenResolution}`,
      `- Viewport Size: ${systemInfo.viewportSize}`,
      `- Cookies Enabled: ${systemInfo.cookiesEnabled}`,
      `- Local Storage: ${systemInfo.localStorage}`,
      "",
      "User Agent:",
      systemInfo.userAgent,
      "",
      `Generated at: ${new Date().toISOString()}`,
    ]
      .filter(Boolean)
      .join("\n");

    return info;
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(getDebugInfo());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const getMailtoLink = () => {
    const subject = encodeURIComponent("TrendWeight Support Request");
    const body = encodeURIComponent("Please describe your issue here:\n\n\n\n" + "--- System Information (Please keep this) ---\n" + getDebugInfo());
    return `mailto:erv@ewal.net?subject=${subject}&body=${body}`;
  };

  // Fetch changelog for tagged releases
  useEffect(() => {
    if (isTag && buildVersion !== "Not available" && buildVersion !== "local" && githubRepo) {
      setLoadingChangelog(true);
      fetch(`https://api.github.com/repos/${buildRepo}/releases/tags/${buildVersion}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.body) {
            setChangelog(data.body);
          }
        })
        .catch((err) => console.error("Failed to fetch changelog:", err))
        .finally(() => setLoadingChangelog(false));
    }
  }, [buildVersion, buildRepo, githubRepo, isTag]);

  return (
    <>
      <title>{pageTitle("Build Information")}</title>

      <Layout>
        <Container>
          <div className="mx-auto max-w-4xl">
            <Heading level={1} className="mb-2" display>
              Build Information
            </Heading>

            <p className="mb-8 text-gray-600">
              This page contains technical information about the current build of TrendWeight. This information is useful when reporting issues or contacting
              support.
            </p>

            {/* Changelog */}
            {(changelog || loadingChangelog) && (
              <div className="mb-8 overflow-hidden rounded-lg border border-gray-200 bg-white">
                <div className="border-b border-gray-200 bg-gray-50 px-6 py-3">
                  <h2 className="font-semibold">Changelog for {buildVersion}</h2>
                </div>
                <div className="px-6 py-4">
                  {loadingChangelog ? (
                    <p className="text-gray-500">Loading changelog...</p>
                  ) : (
                    <div className="prose prose-sm prose-headings:mt-4 prose-headings:mb-2 prose-p:my-2 prose-ul:my-2 prose-li:my-0 max-w-none">
                      <ReactMarkdown>{changelog || ""}</ReactMarkdown>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="mb-4 flex justify-end gap-3">
              <Button onClick={copyToClipboard} variant="secondary" size="md" className="flex items-center gap-2">
                {copied ? (
                  <>
                    <FiCheck className="h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <FiCopy className="h-4 w-4" />
                    Copy Build Info
                  </>
                )}
              </Button>
              <a href={getMailtoLink()}>
                <Button variant="primary" size="md">
                  Email Support
                </Button>
              </a>
            </div>

            {/* Build Details */}
            <div className="mb-8 overflow-hidden rounded-lg border border-gray-200 bg-white">
              <div className="border-b border-gray-200 bg-gray-50 px-6 py-3">
                <h2 className="font-semibold">Build Details</h2>
              </div>
              <div className="divide-y divide-gray-200">
                <div className="flex justify-between px-6 py-4">
                  <span className="text-gray-600">Environment</span>
                  <span className="font-medium">
                    {environment === "production" ? (
                      <span className="text-green-600">Production</span>
                    ) : environment === "development" ? (
                      <span className="text-yellow-600">Development</span>
                    ) : (
                      <span className="text-blue-600">{environment}</span>
                    )}
                  </span>
                </div>

                <div className="px-6 py-4">
                  <div className="mb-1 flex justify-between">
                    <span className="text-gray-600">Build Time</span>
                    {buildTimeInfo && typeof buildTimeInfo === "object" ? (
                      <span className="text-right font-medium">
                        <div>{buildTimeInfo.ageText}</div>
                        <div className="text-sm text-gray-500">{buildTimeInfo.localTime}</div>
                      </span>
                    ) : (
                      <span className="font-medium">{buildTime}</span>
                    )}
                  </div>
                </div>

                <div className="flex justify-between px-6 py-4">
                  <span className="text-gray-600">Version</span>
                  <span className="font-medium">
                    {versionUrl ? (
                      <a href={versionUrl} target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:text-brand-700 underline">
                        {buildVersion}
                      </a>
                    ) : (
                      buildVersion
                    )}
                  </span>
                </div>

                <div className="flex justify-between px-6 py-4">
                  <span className="text-gray-600">Branch</span>
                  <span className="font-mono text-sm font-medium">{buildBranch}</span>
                </div>

                <div className="flex justify-between px-6 py-4">
                  <span className="text-gray-600">Commit</span>
                  <span className="font-mono text-sm font-medium">
                    {commitUrl ? (
                      <a href={commitUrl} target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:text-brand-700 underline">
                        {buildCommit.substring(0, 7)}
                      </a>
                    ) : (
                      buildCommit
                    )}
                  </span>
                </div>

                {buildRepo && githubRepo && (
                  <div className="flex justify-between px-6 py-4">
                    <span className="text-gray-600">Repository</span>
                    <span className="font-medium">
                      <a href={githubRepo} target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:text-brand-700 underline">
                        {buildRepo}
                      </a>
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Browser Information */}
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
              <div className="border-b border-gray-200 bg-gray-50 px-6 py-3">
                <h2 className="font-semibold">Browser Information</h2>
              </div>
              <div className="divide-y divide-gray-200">
                <div className="flex justify-between px-6 py-4">
                  <span className="text-gray-600">Browser</span>
                  <span className="font-medium">{systemInfo.browser}</span>
                </div>
                <div className="flex justify-between px-6 py-4">
                  <span className="text-gray-600">Platform</span>
                  <span className="font-medium">{systemInfo.platform}</span>
                </div>
                <div className="flex justify-between px-6 py-4">
                  <span className="text-gray-600">Screen Resolution</span>
                  <span className="font-medium">{systemInfo.screenResolution}</span>
                </div>
                <div className="flex justify-between px-6 py-4">
                  <span className="text-gray-600">Viewport Size</span>
                  <span className="font-medium">{systemInfo.viewportSize}</span>
                </div>
                <div className="px-6 py-4">
                  <div className="mb-1 text-gray-600">User Agent</div>
                  <div className="overflow-x-auto rounded bg-gray-50 p-2 font-mono text-xs">{systemInfo.userAgent}</div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Layout>
    </>
  );
}
