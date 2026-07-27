import React from "react";

const STATUS_MAP = {
  Pending_Acceptance: { label: "Pending Acceptance", color: "#F59E0B", bg: "rgba(245,158,11,0.1)" },
  Rejected:         { label: "Rejected",         color: "#EF4444", bg: "rgba(239,68,68,0.1)"  },
  Awaiting_Payment: { label: "Awaiting Payment", color: "#F59E0B", bg: "rgba(245,158,11,0.1)" },
  Funded:           { label: "Funded",           color: "#3B82F6", bg: "rgba(59,130,246,0.1)" },
  Shipped:          { label: "Shipped",          color: "#3B82F6", bg: "rgba(59,130,246,0.1)" },
  Confirmed:        { label: "Confirmed",        color: "#08B95F", bg: "rgba(8,185,95,0.1)" },
  Disputed:         { label: "Disputed",         color: "#EF4444", bg: "rgba(239,68,68,0.1)"  },
  Resolved:         { label: "Resolved",         color: "#08B95F", bg: "rgba(8,185,95,0.1)" },
  OPEN:             { label: "Open",             color: "#EF4444", bg: "rgba(239,68,68,0.1)"  },
  UNDER_REVIEW:     { label: "Under Review",     color: "#F59E0B", bg: "rgba(245,158,11,0.1)" },
  RESOLVED:         { label: "Resolved",         color: "#08B95F", bg: "rgba(8,185,95,0.1)" },
  active:           { label: "Active",           color: "#08B95F", bg: "rgba(8,185,95,0.1)" },
  suspended:        { label: "Suspended",        color: "#EF4444", bg: "rgba(239,68,68,0.1)"  },
};

export default function StatusBadge({ status, size = "sm" }) {
  const config = STATUS_MAP[status] || { label: status, color: "#94A3B8", bg: "rgba(148,163,184,0.1)" };
  return (
    <span className={`inline-flex items-center gap-1.5 font-semibold rounded-full ${size === "sm" ? "px-2.5 py-1 text-xs" : "px-3 py-1.5 text-sm"}`}
      style={{ background: config.bg, color: config.color }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: config.color }} />
      {config.label}
    </span>
  );
}
