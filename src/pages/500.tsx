import Link from "~/components/shared/Link";
import { Page } from "~/lib/core/page";

const Oops: Page = () => {
  return (
    <div className="min-h-[67vh] flex flex-col items-start justify-items-start md:items-center md:justify-center">
      <div className="flex flex-col items-start p-4 space-y-8 md:flex-row md:items-center md:space-x-8">
        <div className="pr-0 py-4 w-full max-w-xl border-none md:pr-8 md:border md:border-solid md:border-gray-50">
          <div className="text-brand-500 font-brand pr-2 text-3xl font-bold leading-5 md:text-5xl">TrendWeight</div>
          <div className="mt-4">
            <b>Oops.</b> An error occurred in the application.
          </div>
          <div className="mt-4">
            It was probably Internet gremlins messing with something. Yeah, probably gremlins. Definitely not a bug.
            Well, probably not a bug.
          </div>
          <div className="mt-4">
            Just in case, it's been logged. Maybe wait a while. If it keeps happening, you can email me to let me know
            that the gremlins are being super annoying.
          </div>
          <div className="mt-4">
            <Link href="/" variant="button" btnColor="brand">
              Go to Homepage
            </Link>
          </div>
        </div>
        <div className="max-w-[250px] md:h-[200px] md:h-[250px] w-full h-auto md:w-auto">
          <img src="/assets/error.svg" alt="error guy" />
        </div>
      </div>
    </div>
  );
};

Oops.bypassShell = true;
Oops.title = "Oops";

export default Oops;
