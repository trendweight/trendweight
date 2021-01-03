interface Options extends RequestInit {
  token?: string | null;
}

let defaultOptions: Options = {};

export const setDefaultFetchOptions = (options: Options, merge = false) => {
  if (merge) {
    defaultOptions = options;
  } else {
    defaultOptions = { ...defaultOptions, ...options };
  }
};

const http = async <T>(path: string, options: Options): Promise<T> => {
  const mergedOptions = { ...defaultOptions, ...options };
  const { token, ...init } = mergedOptions;
  const request = new Request(path, init);
  if (init.method !== "get") {
    request.headers.append("Content-Type", "application/json");
  }
  request.headers.append("Accept", "application/json");
  if (token) {
    request.headers.append("Authorization", `Bearer ${token}`);
  }
  const response = await fetch(request);
  if (!response.ok) {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
  // may error if there is no body, return empty array
  return response.json().catch(() => ({}));
};

export const get = async <T>(path: string, config?: Options): Promise<T> => {
  const init = { method: "get", ...config };
  return await http<T>(path, init);
};

export const post = async <T, U>(path: string, body: T, config?: Options): Promise<U> => {
  const init = { method: "post", body: JSON.stringify(body), ...config };
  return await http<U>(path, init);
};

export const put = async <T, U>(path: string, body: T, config?: Options): Promise<U> => {
  const init = { method: "put", body: JSON.stringify(body), ...config };
  return await http<U>(path, init);
};
