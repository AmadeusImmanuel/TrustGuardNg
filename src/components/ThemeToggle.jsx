import React from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "@/lib/ThemeProvider";

const OPTIONS = [
  { key: "light", icon: Sun, label: "Light" },
  { key: "dark", icon: Moon, label: "Dark" },
  { key: "system", icon: Monitor, label: "System" },
];

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-0.5 bg-card border border-border rounded-full p-0.5">
      {OPTIONS.map(({ key, icon: Icon, label }) => (
        <button
          key={key}
          onClick={() => setTheme(key)}
          aria-label={label}
          className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
            theme === key ? "text-white" : "text-muted hover:text-foreground"
          }`}
          style={theme === key ? { background: "linear-gradient(90deg, rgb(var(--primary)), rgb(var(--primary-hover)))" } : {}}
        >
          <Icon className="w-3.5 h-3.5" />
        </button>
      ))}
    </div>
  );
}
