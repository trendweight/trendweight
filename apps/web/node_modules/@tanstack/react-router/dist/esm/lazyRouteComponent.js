import { jsx } from "react/jsx-runtime";
import * as React from "react";
import { Outlet } from "./Match.js";
import { ClientOnly } from "./ClientOnly.js";
function isModuleNotFoundError(error) {
  if (typeof (error == null ? void 0 : error.message) !== "string") return false;
  return error.message.startsWith("Failed to fetch dynamically imported module") || error.message.startsWith("error loading dynamically imported module") || error.message.startsWith("Importing a module script failed");
}
function lazyRouteComponent(importer, exportName, ssr) {
  let loadPromise;
  let comp;
  let error;
  let reload;
  const load = () => {
    if (typeof document === "undefined" && (ssr == null ? void 0 : ssr()) === false) {
      comp = () => null;
      return Promise.resolve();
    }
    if (!loadPromise) {
      loadPromise = importer().then((res) => {
        loadPromise = void 0;
        comp = res[exportName ?? "default"];
      }).catch((err) => {
        error = err;
        if (isModuleNotFoundError(error)) {
          if (error instanceof Error && typeof window !== "undefined" && typeof sessionStorage !== "undefined") {
            const storageKey = `tanstack_router_reload:${error.message}`;
            if (!sessionStorage.getItem(storageKey)) {
              sessionStorage.setItem(storageKey, "1");
              reload = true;
            }
          }
        }
      });
    }
    return loadPromise;
  };
  const lazyComp = function Lazy(props) {
    if (reload) {
      window.location.reload();
      throw new Promise(() => {
      });
    }
    if (error) {
      throw error;
    }
    if (!comp) {
      throw load();
    }
    if ((ssr == null ? void 0 : ssr()) === false) {
      return /* @__PURE__ */ jsx(ClientOnly, { fallback: /* @__PURE__ */ jsx(Outlet, {}), children: React.createElement(comp, props) });
    }
    return React.createElement(comp, props);
  };
  lazyComp.preload = load;
  return lazyComp;
}
export {
  lazyRouteComponent
};
//# sourceMappingURL=lazyRouteComponent.js.map
