const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export const getToken   = ()  => localStorage.getItem("tg_token");
export const setToken   = (t) => localStorage.setItem("tg_token", t);
export const clearToken = ()  => localStorage.removeItem("tg_token");

async function request(method, path, body) {
  const token = getToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  if (res.status === 401) { clearToken(); window.location.href = "/login"; return; }
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

function entity(path) {
  return {
    list:   (filters = {}) => { const qs = new URLSearchParams(filters).toString(); return request("GET", `${path}${qs ? "?" + qs : ""}`); },
    get:    (id)           => request("GET",    `${path}/${id}`),
    create: (data)         => request("POST",   path, data),
    update: (id, data)     => request("PUT",    `${path}/${id}`, data),
    delete: (id)           => request("DELETE", `${path}/${id}`),
  };
}

export const auth = {
  login:          (email, password)            => request("POST", "/auth/login",    { email, password }).then((r) => { setToken(r.token); return r.user; }),
  register:       (email, password, full_name) => request("POST", "/auth/register", { email, password, full_name }).then((r) => { setToken(r.token); return r.user; }),
  logout:         ()                           => { clearToken(); window.location.href = "/login"; },
  me:             ()                           => request("GET", "/auth/me"),
  forgotPassword: (email)                      => request("POST", "/auth/forgot-password", { email }),
  resetPassword:  (token, password)            => request("POST", "/auth/reset-password",  { token, password }),
};

export const User         = entity("/users");
export const Trade        = entity("/trades");
export const myTrades     = () => request("GET", "/my-trades");
export const Dispute      = entity("/disputes");
export const Transaction  = entity("/transactions");
export const Payout       = entity("/payouts");
export const WebhookEvent = entity("/webhook-events");

// ─── Trade lifecycle actions ─────────────────────────────────────────────────
export const tradeActions = {
  confirmPayment: (tradeId) => request("POST", `/trades/${tradeId}/confirm-payment`),
  releaseFunds:   (tradeId) => request("POST", `/trades/${tradeId}/release-funds`),
};

export const disputeActions = {
  resolve: (disputeId, ruling, resolution) => request("POST", `/disputes/${disputeId}/resolve`, { ruling, resolution }),
};

export const userLookup = {
  byEmail: (email) => request("GET", `/users/lookup/${encodeURIComponent(email)}`),
};

export const platformSettings = {
  getFeeRate: () => request("GET", "/settings/fee-rate"),
  setFeeRate: (rate) => request("PUT", "/settings/fee-rate", { fee_rate: rate }),
};
