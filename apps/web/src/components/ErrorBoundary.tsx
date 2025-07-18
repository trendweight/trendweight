import { Component } from "react";
import type { ReactNode } from "react";
import { Container } from "./Container";
import { pageTitle } from "../lib/utils/pageTitle";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: { componentStack: string }) {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <>
          <title>{pageTitle("Oops")}</title>
          <meta name="robots" content="noindex, nofollow" />

          <Container>
            <div className="flex min-h-[67vh] flex-col items-start justify-start md:items-center md:justify-center">
              <div className="flex flex-col items-start space-y-8 p-4 md:flex-row md:items-center">
                <div className="w-full max-w-[600px] border-none py-4 pr-0 md:border-r md:border-gray-300 md:pr-8">
                  <div className="text-brand-600 font-serif text-4xl leading-tight font-bold md:text-5xl">TrendWeight</div>
                  <div className="mt-4">
                    <b>Oops.</b> An error occurred in the application.
                  </div>
                  <div className="mt-4">
                    It was probably Internet gremlins messing with something. Yeah, probably gremlins. Definitely not a bug. Well, probably not a bug.
                  </div>
                  <div className="mt-4">
                    Just in case, it's been logged. Maybe wait a while. If it keeps happening, you can email me to let me know that the gremlins are being super
                    annoying.
                  </div>
                  <div className="mt-4">
                    <a href="/" className="bg-brand-600 hover:bg-brand-700 inline-block rounded px-4 py-2 text-white transition-colors">
                      Go to Homepage
                    </a>
                  </div>
                </div>
                <img src="/assets/error.svg" alt="error guy" className="h-auto w-full max-w-[250px] md:h-[250px] md:w-auto" />
              </div>
            </div>
          </Container>
        </>
      );
    }

    return this.props.children;
  }
}
