import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import Link from "../shared/Link";

const Footer = () => {
  return (
    <footer className="container mx-auto px-4 py-4">
      <div className="flex flex-col items-center justify-between text-gray-300 md:flex-row">
        <p>&copy; 2012-{new Date().getFullYear()} Erv Walter</p>
        <div className="flex flex-row space-x-2 md:space-x-4">
          <div className="flex flex-row space-x-2 md:space-x-4">
            <Link href="https://twitter.com/trendweight" variant="muted">
              <FontAwesomeIcon icon={["fab", "twitter"]} />
            </Link>
            <Link href="https://facebook.com/trendweight" variant="muted">
              <FontAwesomeIcon icon={["fab", "facebook"]} />
            </Link>
            <Link href="https://github.com/trendweight" variant="muted">
              <FontAwesomeIcon icon={["fab", "github"]} />
            </Link>
            <Link href="https://blog.trendweight.com" variant="muted">
              <FontAwesomeIcon icon="rss" />
            </Link>
          </div>
          <Link href="mailto:erv@ewal.net" variant="muted">
            Contact
          </Link>
          <Link href="/donate" variant="muted">
            Donate
          </Link>
          <Link href="/privacy" variant="muted">
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
