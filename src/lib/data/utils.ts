import { Temporal } from "@js-joda/core";
import _ from "lodash";

const convertToString = (objValue: unknown, srcValue: unknown) => {
  if (srcValue instanceof Temporal) {
    return srcValue.toString();
  }
};

export const toPlainJS = (value: unknown) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const target: any = {};
  _.mergeWith(target, value, convertToString);
  return target;
};
