let jwt: string | null = null;

export const setJwt = (value: string | null) => {
  jwt = value;
};

const http = async <T>(path: string, config: RequestInit): Promise<T> => {
  const request = new Request(path, config);
  if (jwt) {
    request.headers.append("Authorization", `Bearer ${jwt}`);
  }
  const response = await fetch(request);
  if (!response.ok) {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
  // may error if there is no body, return empty array
  return response.json().catch(() => ({}));
};

export const get = async <T>(path: string, config?: RequestInit): Promise<T> => {
  const init = { method: "get", ...config };
  return await http<T>(path, init);
};

export const post = async <T, U>(path: string, body: T, config?: RequestInit): Promise<U> => {
  const init = { method: "post", body: JSON.stringify(body), ...config };
  return await http<U>(path, init);
};

export const put = async <T, U>(path: string, body: T, config?: RequestInit): Promise<U> => {
  const init = { method: "put", body: JSON.stringify(body), ...config };
  return await http<U>(path, init);
};
