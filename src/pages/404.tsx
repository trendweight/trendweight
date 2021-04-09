import React from "react";
import Link from "~/components/shared/Link";
import { Page } from "~/lib/core/page";

const PageNotFound: Page = () => {
  return (
    <div className="min-h-[67vh] flex flex-col items-start justify-items-start md:items-center md:justify-center">
      <div className="flex flex-col items-start p-4 space-y-8 md:flex-row md:items-center md:space-x-8">
        <div className="pr-0 py-4 w-full max-w-xl border-none md:pr-8 md:border md:border-solid md:border-gray-50">
          <div className="pr-2 text-brand-500 font-serif text-3xl font-bold leading-5 md:text-5xl">TrendWeight</div>
          <div className="mt-4">
            <b>404.</b> That's an error.
          </div>
          <div className="mt-4">The requested URL was not found on this site.</div>
          <div className="mt-4">
            Maybe it got moved. Or maybe the link you clicked on is just wrong. Or maybe it was abducted? We'll probably
            never know.
          </div>
          <div className="mt-4">
            <Link href="/" variant="button" btnColor="brand">
              Go to Homepage
            </Link>
          </div>
        </div>
        <div className="max-w-[200px] md:h-[150px] lg:h-[200px] w-full h-auto md:w-auto">
          <img src="/assets/taken.svg" alt="alien abduction icon" />
        </div>
      </div>
    </div>
  );
};

PageNotFound.bypassShell = true;
PageNotFound.title = "Error 404 (Not Found)";

export default PageNotFound;
