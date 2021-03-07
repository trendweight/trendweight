import NProgress from "nprogress";
// import { useEffect, useState } from "react";

const delay = 250;
let count = 0;
let timer: number | undefined = undefined;
let configured = false;

const configure = () => {
  if (!configured) {
    // NProgress.configure({ parent: "#main" });
    configured = true;
  }
};

const start = () => {
  if (typeof window !== "undefined") {
    configure();
    count++;
    if (!timer) {
      timer = window.setTimeout(NProgress.start, delay);
    }
  }
};

const done = () => {
  if (typeof window !== "undefined") {
    if (count > 0) count--;
    if (count == 0) {
      if (timer) {
        clearTimeout(timer);
        timer = undefined;
      }
      NProgress.done();
    }
  }
};

export default {
  start,
  done,
};
