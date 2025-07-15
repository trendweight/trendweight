import { Container } from "./Container";
import { pageTitle } from "../lib/utils/pageTitle";

export function NotFound() {
  return (
    <>
      <title>{pageTitle("Error 404 (Not Found)")}</title>
      <meta name="robots" content="noindex, nofollow" />

      <Container>
        <div className="flex min-h-[67vh] flex-col items-start justify-start md:items-center md:justify-center">
          <div className="flex flex-col items-start space-y-8 p-4 md:flex-row md:items-center">
            <div className="w-full max-w-[600px] border-none py-4 pr-0 md:border-r md:border-gray-300 md:pr-8">
              <div className="text-brand-600 font-serif text-4xl leading-tight font-bold md:text-5xl">TrendWeight</div>
              <div className="mt-4">
                <b>404.</b> That's an error.
              </div>
              <div className="mt-4">The requested URL was not found on this site.</div>
              <div className="mt-4">
                Maybe the page was moved. Or maybe the link you clicked on is just wrong. Or maybe it was abducted? We'll probably never know.
              </div>
              <div className="mt-4">
                <a href="/" className="bg-brand-600 hover:bg-brand-700 inline-block rounded px-4 py-2 text-white transition-colors">
                  Go to Homepage
                </a>
              </div>
            </div>
            <img src="/assets/taken.svg" alt="alien abduction icon" className="h-auto w-full max-w-[200px] md:h-[150px] md:w-auto lg:h-[200px]" />
          </div>
        </div>
      </Container>
    </>
  );
}
