import React from "react";

const config = {
  Draft: { label: "Draft", className: "bg-card-hover text-muted" },
  Pending_Acceptance: { label: "Pending Acceptance", className: "bg-warning/10 text-warning" },
  Rejected: { label: "Rejected", className: "bg-danger/10 text-danger" },
  Awaiting_Payment: { label: "Awaiting Payment", className: "bg-warning/10 text-warning" },
  Funded: { label: "Funded", className: "bg-info/10 text-info" },
  Shipped: { label: "Shipped", className: "bg-info/10 text-info" },
  Confirmed: { label: "Confirmed", className: "bg-success/10 text-success" },
  Disputed: { label: "Disputed", className: "bg-danger/10 text-danger" },
  Resolved: { label: "Resolved", className: "bg-success/10 text-success" },
};

export default function StatusBadge({ status, className = "" }) {
  const c = config[status] || { label: status, className: "bg-card-hover text-muted" };
  return (
    <span
      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${c.className} ${className}`}
    >
      {c.label}
    </span>
  );
}
