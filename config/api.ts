export const apiConfig = {
  host: "http://localhost:8080",
};

export enum HttpMethod {
  GET = "GET",
  POST = "POST",
}

interface FetchOptions {
  params?: Record<string, string>;
  body?: Record<string, any>;
}

export async function fetchData(
  method: HttpMethod,
  path: string,
  options: FetchOptions = {}
): Promise<any> {
  const url = new URL(path, apiConfig.host);
  url.search = new URLSearchParams(options.params).toString();

  const response = await fetch(url.toString(), {
    method,
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "RTranslator Frontend",
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch data from ${path}`);
  }

  return response;
}

export const fetcher = ([method, path, options]: [
  method: HttpMethod,
  path: string,
  options?: FetchOptions
]) => fetchData(method, path, options).then((res) => res.json());
