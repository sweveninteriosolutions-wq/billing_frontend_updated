const BASE_URL =
  import.meta.env.VITE_API_URL;

/* =========================
   TYPES
========================= */
export type AppError = {
  message: string;
  errorCode: string;
  details?: unknown;
};

/* =========================
   TOKEN STATE
========================= */
let accessToken: string | null = null;

let refreshInProgress = false;
let refreshQueue: (() => void)[] = [];

export const setAccessToken = (token: string | null) => {
  accessToken = token;
  if (token) {
    localStorage.setItem("access_token", token);
  } else {
    localStorage.removeItem("access_token");
  }
};

/* =========================
   LOGOUT HANDLER
========================= */
function logout() {
  accessToken = null;
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");

  window.location.href = "/";
}

/* =========================
   TOKEN HELPERS
========================= */
function isTokenExpired(token: string) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

/* =========================
   REFRESH TOKEN
========================= */
async function refreshAccessToken(): Promise<string> {
  const refreshToken = localStorage.getItem("refresh_token");
  if (!refreshToken) {
    logout();
    throw new Error("No refresh token");
  }

  const res = await fetch(`${BASE_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  if (!res.ok) {
    logout();
    throw new Error("Refresh failed");
  }

  const data = await res.json();

  setAccessToken(data.access_token);
  localStorage.setItem("refresh_token", data.refresh_token);

  return data.access_token;
}

/* =========================
   QUERY STRING
========================= */
function buildQueryString(params?: Record<string, any>) {
  if (!params) return "";

  const qs = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      qs.append(key, String(value));
    }
  });

  const query = qs.toString();
  return query ? `?${query}` : "";
}

/* =========================
   CORE REQUEST
========================= */
async function request<T>(
  path: string,
  options: RequestInit,
  retry = true
): Promise<T> {
  // 🔒 Prevent expired token usage
  if (accessToken && isTokenExpired(accessToken)) {
    try {
      accessToken = await handleRefreshQueue();
    } catch {
      logout();
    }
  }

  let res: Response;

  try {
    res = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(accessToken
          ? { Authorization: `Bearer ${accessToken}` }
          : {}),
        ...(options.headers || {}),
      },
    });
  } catch {
    throw {
      message: "Network error. Please try again.",
      errorCode: "NETWORK_ERROR",
    } satisfies AppError;
  }

  const json = await res.json().catch(() => null);

  // 🔁 AUTO REFRESH ON 401 (ONCE)
  if (res.status === 401 && retry) {
    try {
      accessToken = await handleRefreshQueue();
      return request<T>(path, options, false);
    } catch {
      logout();
    }
  }

  if (!res.ok) {
    throw {
      message: json?.message || "Request failed",
      errorCode: json?.error_code || "UNKNOWN_ERROR",
      details: json?.details,
    } satisfies AppError;
  }

  return json as T;
}

/* =========================
   REFRESH QUEUE (ANTI SPAM)
========================= */
async function handleRefreshQueue(): Promise<string> {
  if (refreshInProgress) {
    return new Promise((resolve) => {
      refreshQueue.push(() => resolve(accessToken!));
    });
  }

  refreshInProgress = true;

  try {
    const newToken = await refreshAccessToken();
    refreshQueue.forEach((cb) => cb());
    refreshQueue = [];
    return newToken;
  } finally {
    refreshInProgress = false;
  }
}

/* =========================
   API METHODS
========================= */
export const api = {
  get: <T>(path: string, params?: Record<string, any>) =>
    request<T>(`${path}${buildQueryString(params)}`, {
      method: "GET",
    }),

  post: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    }),

  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: "DELETE",
      body: body ? JSON.stringify(body) : undefined,
    }),
};
