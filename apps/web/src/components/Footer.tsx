import { FaTwitter, FaFacebook, FaGithub, FaRss } from "react-icons/fa";
import { Link } from "@tanstack/react-router";
import { Container } from "./Container";

export function Footer() {
  const buildVersion = import.meta.env.VITE_BUILD_VERSION || "";
  const buildCommit = import.meta.env.VITE_BUILD_COMMIT || "";
  const buildRepo = import.meta.env.VITE_BUILD_REPO || "";

  const isTag = buildVersion.startsWith("v");
  const hasCommit = buildCommit && buildCommit !== "Not available";

  let versionDisplay = "dev";
  let versionUrl = "/build";

  if (isTag && buildRepo) {
    // Tagged release - show version and link to release
    versionDisplay = buildVersion;
    versionUrl = `https://github.com/${buildRepo}/releases/tag/${buildVersion}`;
  } else if (hasCommit) {
    // Show short SHA, link to /build
    versionDisplay = buildCommit.substring(0, 7);
  }
  // Otherwise falls back to 'dev' and /build

  return (
    <footer className="py-4">
      <Container>
        <div className="flex flex-col gap-4 text-gray-400 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2 text-sm">
            © 2012-{new Date().getFullYear()} Erv Walter<span>·</span>
            {versionUrl.startsWith("http") ? (
              <a href={versionUrl} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-gray-600 hover:underline">
                {versionDisplay}
              </a>
            ) : (
              <Link to={versionUrl} className="transition-colors hover:text-gray-600 hover:underline">
                {versionDisplay}
              </Link>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2 text-sm md:gap-4">
            <div className="flex items-center gap-2 md:gap-4">
              <a href="https://twitter.com/trendweight" className="transition-colors hover:text-gray-600">
                <FaTwitter />
              </a>
              <a href="https://facebook.com/trendweight" className="transition-colors hover:text-gray-600">
                <FaFacebook />
              </a>
              <a href="https://github.com/trendweight" className="transition-colors hover:text-gray-600">
                <FaGithub />
              </a>
              <a href="https://blog.trendweight.com" className="transition-colors hover:text-gray-600">
                <FaRss />
              </a>
            </div>
            <a href="mailto:erv@ewal.net" className="transition-colors hover:text-gray-600">
              Contact
            </a>
            <a href="/tipjar" className="transition-colors hover:text-gray-600">
              Tip Jar
            </a>
            <a href="/privacy" className="transition-colors hover:text-gray-600">
              Privacy
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
