import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const TONES = {
  primary: { icon: "text-primary", chip: "bg-primary/10" },
  info:    { icon: "text-info",    chip: "bg-info/10" },
  danger:  { icon: "text-danger",  chip: "bg-danger/10" },
  warning: { icon: "text-warning", chip: "bg-warning/10" },
  success: { icon: "text-success", chip: "bg-success/10" },
};

export default function QuickAction({ icon: Icon, title, description, tone = "primary", onClick }) {
  const t = TONES[tone] || TONES.primary;
  return (
    <motion.button
      whileHover={{ x: 2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="w-full flex items-center gap-3 p-4 rounded-xl border border-border bg-card-hover/40 text-left transition-all hover:border-primary/30 hover:bg-card-hover">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${t.chip}`}>
        <Icon className={`w-4 h-4 ${t.icon}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-foreground">{title}</div>
        {description && <div className="text-xs text-muted mt-0.5 truncate">{description}</div>}
      </div>
      <ArrowRight className="w-4 h-4 text-disabled shrink-0" />
    </motion.button>
  );
}
