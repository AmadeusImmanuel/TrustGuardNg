const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
export const FILE_BASE_URL = BASE_URL.replace(/\/api\/?$/, "");

export const getToken   = ()  => localStorage.getItem("tg_token");
export const setToken   = (t) => localStorage.setItem("tg_token", t);
export const clearToken = ()  => localStorage.removeItem("tg_token");

export async function request(method, path, body) {
  const token = getToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  // Only treat 401 as "your session expired" when this request actually
  // carried a token — e.g. login/register legitimately return 401 for
  // wrong credentials on requests that never had a token to begin with,
  // and that should surface as a normal error message, not a silent
  // redirect that leaves callers reading .token off an undefined result.
  if (res.status === 401 && token) { clearToken(); window.location.href = "/login"; return; }
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
  register:       (email, password, full_name, phone, referred_by) => request("POST", "/auth/register", { email, password, full_name, phone, referred_by }).then((r) => { setToken(r.token); return r.user; }),
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

export const Reviews = {
  create: (data) => request("POST", "/reviews", data),
  forUser: (userId) => request("GET", `/reviews/user/${userId}`),
  forTrade: (tradeId) => request("GET", `/reviews/trade/${tradeId}`),
};

export const getProfile = (userId) => request("GET", `/profile/${userId}`);

export const Notifications = {
  list: () => request("GET", "/notifications"),
  unreadCount: () => request("GET", "/notifications/unread-count"),
  markRead: (id) => request("PUT", `/notifications/${id}/read`),
  markAllRead: () => request("PUT", "/notifications/mark-all-read"),
};

export const DisputeCenter = {
  getDetail: (id) => request("GET", `/disputes/${id}/detail`),
  addEvidence: (id, data) => request("POST", `/disputes/${id}/evidence`, data),
  addEvidenceFile: async (id, files, label) => {
    // Multipart upload — bypasses the JSON-only request() helper above.
    // Accepts either a single File or an array of Files.
    const fileArray = Array.isArray(files) ? files : [files];
    const token = getToken();
    const formData = new FormData();
    fileArray.forEach((f) => formData.append("files", f));
    formData.append("label", label || fileArray[0]?.name || "");
    const res = await fetch(`${BASE_URL}/disputes/${id}/evidence/upload`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
    if (res.status === 401) { clearToken(); window.location.href = "/login"; return; }
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Upload failed");
    return data;
  },
  updateAdminNotes: (id, data) => request("PUT", `/disputes/${id}/admin-notes`, data),
  appeal: (id, reason) => request("POST", `/disputes/${id}/appeal`, { reason }),
  sendAdminMessage: (id, message) => request("POST", `/disputes/${id}/message`, { message }),
};

export const WalletAPI = {
  withdraw: (amount, bank, account) => request("POST", "/wallet/withdraw", { amount, bank, account }),
};

export const AdminAPI = {
  auditLogs: () => request("GET", "/admin/audit-logs"),
  kycQueue: () => request("GET", "/admin/kyc-queue"),
  approveKyc: (userId) => request("PUT", `/admin/kyc/${userId}/approve`),
  rejectKyc: (userId, reason) => request("PUT", `/admin/kyc/${userId}/reject`, { reason }),
  systemHealth: () => request("GET", "/admin/system-health"),
  tickets: () => request("GET", "/support-tickets"),
  respondTicket: (id, response, status) => request("PUT", `/support-tickets/${id}/respond`, { response, status }),
};

export const SupportAPI = {
  create: (data) => request("POST", "/support-tickets", data),
  list: () => request("GET", "/support-tickets"),
};

export const FraudAPI = {
  fraudAlerts: () => request("GET", "/admin/fraud-alerts"),
  resolveAlert: (id) => request("PUT", `/admin/fraud-alerts/${id}/resolve`),
  blacklist: () => request("GET", "/admin/blacklist"),
  addBlacklist: (data) => request("POST", "/admin/blacklist", data),
  removeBlacklist: (id) => request("DELETE", `/admin/blacklist/${id}`),
  recalculateRisk: () => request("POST", "/admin/recalculate-risk"),
  userRisk: (id) => request("GET", `/users/${id}/risk-score`),
};

export const SettingsAPI = {
  getProfile: () => request("GET", "/settings/profile"),
  updateProfile: (data) => request("PUT", "/settings/profile", data),
  changePassword: (data) => request("PUT", "/settings/password", data),
  updateNotifications: (data) => request("PUT", "/settings/notifications", data),
  updatePrivacy: (data) => request("PUT", "/settings/privacy", data),
  deactivateAccount: (password) => request("DELETE", "/settings/account", { password }),
};

export const PaystackAPI = {
  initialize: (data) => request("POST", "/paystack/initialize", data),
  verify: (reference) => request("GET", `/paystack/verify/${reference}`),
};

export const tradeSellerActions = {
  accept: (tradeId) => request("POST", `/trades/${tradeId}/accept`),
  reject: (tradeId, message) => request("POST", `/trades/${tradeId}/reject`, { message }),
  requestModification: (tradeId, message) => request("POST", `/trades/${tradeId}/request-modification`, { message }),
  refund: (tradeId, reason) => request("POST", `/trades/${tradeId}/refund`, { reason }),
};

export const tradeBuyerActions = {
  cancel: (tradeId, reason) => request("POST", `/trades/${tradeId}/cancel`, { reason }),
};
