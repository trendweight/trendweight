import { jsx } from "react/jsx-runtime";
import jsesc from "jsesc";
function ScriptOnce({
  children,
  log
}) {
  if (typeof document !== "undefined") {
    return null;
  }
  return /* @__PURE__ */ jsx(
    "script",
    {
      className: "tsr-once",
      dangerouslySetInnerHTML: {
        __html: [
          children,
          (log ?? true) && process.env.NODE_ENV === "development" ? `console.info(\`Injected From Server:
${jsesc(children.toString(), { quotes: "backtick" })}\`)` : "",
          'if (typeof __TSR_SSR__ !== "undefined") __TSR_SSR__.cleanScripts()'
        ].filter(Boolean).join("\n")
      }
    }
  );
}
export {
  ScriptOnce
};
//# sourceMappingURL=ScriptOnce.js.map
