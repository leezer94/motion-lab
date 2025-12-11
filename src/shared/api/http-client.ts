export type ApiErrorPayload = {
  message?: string;
  errorCode?: string | number;
  details?: unknown;
};

export class ApiError extends Error {
  status: number;
  payload?: ApiErrorPayload;

  constructor(status: number, payload?: ApiErrorPayload) {
    super(payload?.message ?? `Request failed with status ${status}`);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

export type ApiFetchRequest = Omit<RequestInit, "body" | "method" | "headers"> & {
  url: string;
  method?: RequestInit["method"];
  headers?: HeadersInit;
  body?: BodyInit | Record<string, unknown> | null;
  parseAs?: "json" | "text" | "blob" | "arrayBuffer";
};

function buildBody(body: ApiFetchRequest["body"]) {
  if (body === null || body === undefined) {
    return undefined;
  }

  if (body instanceof FormData || body instanceof URLSearchParams || body instanceof Blob) {
    return body;
  }

  if (typeof body === "string") {
    return body;
  }

  return JSON.stringify(body);
}

export async function apiFetch<TResponse>(request: ApiFetchRequest): Promise<TResponse> {
  const { url, method = "GET", headers, body, parseAs = "json", ...rest } = request;

  const normalizedHeaders = new Headers({
    Accept: "application/json",
    ...(headers ?? {}),
  });

  const nextInit: RequestInit = {
    method,
    headers: normalizedHeaders,
    ...rest,
  };

  const normalizedBody = buildBody(body);

  if (normalizedBody !== undefined && method.toUpperCase() !== "GET") {
    nextInit.body = normalizedBody;
    const hasExplicitContentType = normalizedHeaders.has("Content-Type");
    const shouldSkipContentType =
      normalizedBody instanceof FormData ||
      normalizedBody instanceof URLSearchParams ||
      normalizedBody instanceof Blob;

    if (!hasExplicitContentType && !shouldSkipContentType) {
      normalizedHeaders.set("Content-Type", "application/json");
    }
  }

  const response = await fetch(url, nextInit);

  if (!response.ok) {
    let payload: ApiErrorPayload | undefined;
    try {
      payload = (await response.json()) as ApiErrorPayload;
    } catch {
      payload = { message: response.statusText };
    }
    throw new ApiError(response.status, payload);
  }

  if (response.status === 204) {
    return undefined as TResponse;
  }

  switch (parseAs) {
    case "text":
      return (await response.text()) as TResponse;
    case "blob":
      return (await response.blob()) as TResponse;
    case "arrayBuffer":
      return (await response.arrayBuffer()) as TResponse;
    default:
      return (await response.json()) as TResponse;
  }
}
