import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";

const TONES = {
  primary: { icon: "text-primary", chip: "bg-primary/10", glow: "bg-primary" },
  info:    { icon: "text-info",    chip: "bg-info/10",    glow: "bg-info" },
  danger:  { icon: "text-danger",  chip: "bg-danger/10",  glow: "bg-danger" },
  warning: { icon: "text-warning", chip: "bg-warning/10", glow: "bg-warning" },
  success: { icon: "text-success", chip: "bg-success/10", glow: "bg-success" },
};

export default function MetricCard({ icon: Icon, label, value, description, trend, trendValue, tone = "primary", delay = 0 }) {
  const isPositive = trend === "up";
  const t = TONES[tone] || TONES.primary;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -2 }}
      className="relative overflow-hidden rounded-2xl p-5 border border-border bg-card cursor-default hover:shadow-elevated transition-shadow">
      <div className={`absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 blur-2xl ${t.glow}`} />
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${t.chip}`}>
          <Icon className={`w-5 h-5 ${t.icon}`} />
        </div>
        {trendValue && (
          <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${isPositive ? "bg-success/10 text-success" : "bg-danger/10 text-danger"}`}>
            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {trendValue}
          </div>
        )}
      </div>
      <div className="text-3xl font-black text-foreground mb-1">{value}</div>
      <div className="text-sm font-semibold text-text-secondary mb-0.5">{label}</div>
      {description && <div className="text-xs text-muted">{description}</div>}
    </motion.div>
  );
}
