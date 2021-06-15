import NProgress from "nprogress";
// import { useEffect, useState } from "react";

const delay = 250;
let count = 0;
let fetchingCount = 0;
let timer: number | undefined = undefined;
let configured = false;

const configure = () => {
  if (!configured) {
    // NProgress.configure({ parent: "#main" });
    configured = true;
  }
};

const triggerDelayedStart = () => {
  if (!timer) {
    timer = window.setTimeout(NProgress.start, delay);
  }
};

const triggerStop = () => {
  if (timer) {
    clearTimeout(timer);
    timer = undefined;
  }
  NProgress.done();
};

const setFetching = (active: number) => {
  fetchingCount = active;
  if (fetchingCount > 0) {
    triggerDelayedStart();
  } else if (fetchingCount + count === 0) {
    triggerStop();
  }
};

const start = () => {
  if (typeof window !== "undefined") {
    configure();
    count++;
    triggerDelayedStart();
  }
};

const done = () => {
  if (typeof window !== "undefined") {
    if (count > 0) count--;
    if (fetchingCount + count === 0) {
      triggerStop();
    }
  }
};

const progress = {
  start,
  done,
  setFetching,
};

export default progress;
