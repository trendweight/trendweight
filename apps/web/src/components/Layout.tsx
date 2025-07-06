import { Suspense, type ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Container } from "./Container";

interface LayoutProps {
  children: ReactNode;
}

function LoadingFallback() {
  return (
    <div className="flex justify-center items-center min-h-[400px]">
      <div className="text-gray-500">Loading...</div>
    </div>
  );
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Container as="main" className="flex-grow py-4 md:py-6">
        <Suspense fallback={<LoadingFallback />}>{children}</Suspense>
      </Container>
      <Footer />
    </div>
  );
}
