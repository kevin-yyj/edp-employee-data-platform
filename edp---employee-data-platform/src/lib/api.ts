export type ApiResponse<T> = {
  ok: boolean;
  data: T;
  error?: string;
};

function getAuthHeaders() {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("edp_access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
      ...(init?.headers || {}),
    },
  });

  const payload = (await res.json()) as ApiResponse<T>;
  if (!res.ok || !payload.ok) {
    throw new Error(payload.error || "Request failed");
  }
  return payload.data;
}

export const api = {
  get: <T>(url: string) => request<T>(url),
  post: <T>(url: string, body?: unknown) =>
    request<T>(url, { method: "POST", body: JSON.stringify(body || {}) }),
  patch: <T>(url: string, body?: unknown) =>
    request<T>(url, { method: "PATCH", body: JSON.stringify(body || {}) }),
};
