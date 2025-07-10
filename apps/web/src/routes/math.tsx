import { createFileRoute } from "@tanstack/react-router";
import "katex/dist/katex.min.css";
import { useEffect, useState } from "react";
import { HiArrowUp } from "react-icons/hi";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { Layout } from "../components/Layout";
import mathContent from "../content/math-of-trendweight.md?raw";
import { pageTitle } from "../lib/utils/pageTitle";

export const Route = createFileRoute("/math")({
  component: MathPage,
});

function MathPage() {
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Extract headings from markdown content for TOC
  const headings = mathContent
    .split("\n")
    .filter((line) => line.startsWith("##") && !line.startsWith("###"))
    .map((heading) => {
      const level = heading.match(/^#+/)?.[0].length || 2;
      const text = heading.replace(/^#+\s*/, "");
      const id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");
      return { level, text, id };
    });

  // Show/hide back to top button based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <title>{pageTitle("The Math Behind TrendWeight")}</title>
      <Layout>
        <div className="bg-white">
          <div>
            <div className="lg:grid lg:gap-8 lg:grid-cols-4">
              <div className="hidden lg:block">
                <div>
                  <h2 className="text-gray-900 text-xl font-bold pb-4">Table of Contents</h2>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    {headings.map((heading) => (
                      <li key={heading.id}>
                        <a href={`#${heading.id}`} className="text-gray-600 hover:text-brand-600 hover:underline transition-colors">
                          {heading.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                  {showBackToTop && (
                    <div className="fixed bottom-8">
                      <button
                        onClick={scrollToTop}
                        className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg shadow-lg hover:bg-brand-700 transition-colors"
                        aria-label="Back to top"
                      >
                        <HiArrowUp className="w-4 h-4" />
                        <span className="text-sm font-medium">Back to top</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-6 lg:mt-0 lg:col-span-3">
                <div className="prose prose-gray max-w-none prose-li:my-0.5 prose-h1:mb-4 prose-h2:mt-6 prose-h2:mb-3 prose-h3:mt-4 prose-h3:mb-2 prose-h4:mt-3 prose-h4:mb-2">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm, remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                    components={{
                      // Add IDs to headings for navigation
                      h2: ({ children, ...props }) => {
                        const text = children?.toString() || "";
                        const id = text
                          .toLowerCase()
                          .replace(/[^\w\s-]/g, "")
                          .replace(/\s+/g, "-");
                        return (
                          <h2 id={id} {...props}>
                            {children}
                          </h2>
                        );
                      },
                      // Only override what needs special handling
                      code: ({ children, className, ...props }) => {
                        const isInline = !className?.includes("language-");
                        return isInline ? (
                          <code className="px-1 py-0.5 bg-gray-100 text-gray-800 rounded text-sm" {...props}>
                            {children}
                          </code>
                        ) : (
                          <code {...props}>{children}</code>
                        );
                      },
                      pre: ({ children, ...props }) => (
                        <pre className="bg-gray-100 text-gray-800 rounded-lg overflow-x-auto" {...props}>
                          {children}
                        </pre>
                      ),
                    }}
                  >
                    {mathContent}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
