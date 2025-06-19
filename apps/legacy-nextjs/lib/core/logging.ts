export const log = (message?: unknown, ...optionalParams: unknown[]) => {
  if (process.env.NODE_ENV !== "production") {
    console.log(message, ...optionalParams);
  }
};

export const logCall = (methodName: string, ...optionalParams: unknown[]) => {
  log(`[${methodName}]`, ...optionalParams);
};

export const logRender = (componentName: string, ...optionalParams: unknown[]) => {
  log(`<${componentName}>`, ...optionalParams);
};
