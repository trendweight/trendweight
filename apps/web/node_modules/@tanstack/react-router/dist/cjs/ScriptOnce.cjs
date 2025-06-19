"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const jsxRuntime = require("react/jsx-runtime");
const jsesc = require("jsesc");
function ScriptOnce({
  children,
  log
}) {
  if (typeof document !== "undefined") {
    return null;
  }
  return /* @__PURE__ */ jsxRuntime.jsx(
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
exports.ScriptOnce = ScriptOnce;
//# sourceMappingURL=ScriptOnce.cjs.map
