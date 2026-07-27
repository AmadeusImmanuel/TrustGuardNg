import React from "react";

const LEVELS = {
  Bronze:   { color: "#cd7f32", bg: "#fdf4ec", emoji: "🥉", min: 0,    max: 99  },
  Silver:   { color: "#9e9e9e", bg: "#f5f5f5", emoji: "🥈", min: 100,  max: 299 },
  Gold:     { color: "#ffc107", bg: "#fffde7", emoji: "🥇", min: 300,  max: 599 },
  Platinum: { color: "#78909c", bg: "#eceff1", emoji: "💎", min: 600,  max: 999 },
  Diamond:  { color: "#29b6f6", bg: "#e1f5fe", emoji: "👑", min: 1000, max: Infinity },
};

export default function TrustBadge({ level = "Bronze", score = 0, size = "md", showScore = true, showBar = false }) {
  const config = LEVELS[level] || LEVELS.Bronze;
  const levels = Object.keys(LEVELS);
  const currentIndex = levels.indexOf(level);
  const nextLevel = levels[currentIndex + 1];
  const nextConfig = nextLevel ? LEVELS[nextLevel] : null;
  const progress = nextConfig
    ? Math.min(100, ((score - config.min) / (nextConfig.min - config.min)) * 100)
    : 100;

  const sizes = {
    sm: { badge: "px-2 py-0.5 text-xs gap-1", emoji: "text-sm" },
    md: { badge: "px-3 py-1 text-sm gap-1.5", emoji: "text-base" },
    lg: { badge: "px-4 py-2 text-base gap-2", emoji: "text-xl" },
  };
  const sz = sizes[size] || sizes.md;

  return (
    <div className="inline-flex flex-col gap-2">
      <div className={`inline-flex items-center rounded-full font-bold ${sz.badge}`}
        style={{ background: config.bg, color: config.color, border: `1.5px solid ${config.color}40` }}>
        <span className={sz.emoji}>{config.emoji}</span>
        <span>{level}</span>
        {showScore && <span className="opacity-60 font-normal">· {score} pts</span>}
      </div>
      {showBar && (
        <div className="w-full">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>{score} pts</span>
            {nextLevel && <span>{nextConfig.min} pts for {nextLevel}</span>}
            {!nextLevel && <span>Max level reached!</span>}
          </div>
          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progress}%`, background: config.color }} />
          </div>
        </div>
      )}
    </div>
  );
}

export { LEVELS };
