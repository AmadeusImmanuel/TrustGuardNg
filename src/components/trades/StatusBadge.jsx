import React from "react";

const config = {
  Draft: { label: "Draft", bg: "#f3f4f6", color: "#6b7280" },
  Awaiting_Payment: { label: "Awaiting Payment", bg: "#f3f4f6", color: "#6b7280" },
  Funded: { label: "Funded", bg: "#eff6ff", color: "#2563eb" },
  Shipped: { label: "Shipped", bg: "#fffbeb", color: "#d97706" },
  Confirmed: { label: "Confirmed", bg: "#f0fff4", color: "#16a34a" },
  Disputed: { label: "Disputed", bg: "#fef2f2", color: "#dc2626" },
  Resolved: { label: "Resolved", bg: "#f0fdfa", color: "#0d9488" },
};

export default function StatusBadge({ status, className = "" }) {
  const c = config[status] || { label: status, bg: "#f3f4f6", color: "#6b7280" };
  return (
    <span
      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${className}`}
      style={{ background: c.bg, color: c.color }}
    >
      {c.label}
    </span>
  );
}