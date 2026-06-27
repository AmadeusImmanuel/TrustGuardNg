import React from "react";
import { BarChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ComposedChart } from "recharts";

const fmtNaira = (v) => "₦" + (v / 1000).toFixed(0) + "k";

export default function DailyEscrowVolumeChart({ trades }) {
  // Build last 30 days
  const days = {};
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toLocaleDateString("en-NG", { month: "short", day: "numeric" });
    days[key] = { date: key, volume: 0, active: 0, completed: 0 };
  }

  trades.forEach((t) => {
    const d = new Date(t.created_date);
    const key = d.toLocaleDateString("en-NG", { month: "short", day: "numeric" });
    if (!days[key]) return;
    days[key].volume += Number(t.amount) || 0;
    if (["Draft", "Awaiting_Payment", "Funded", "Shipped", "Disputed"].includes(t.status)) {
      days[key].active += 1;
    }
    if (["Confirmed", "Resolved"].includes(t.status)) {
      days[key].completed += 1;
    }
  });

  const data = Object.values(days);

  const totalVolume = data.reduce((s, d) => s + d.volume, 0);
  const totalCompleted = data.reduce((s, d) => s + d.completed, 0);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-bold text-[#0D1F3C]">Daily Escrow Volume</h3>
        <div className="flex items-center gap-4 text-xs text-gray-400">
          <span>Total: <strong className="text-[#0D1F3C]">₦{totalVolume.toLocaleString("en-NG")}</strong></span>
          <span>Completed: <strong className="text-[#00A651]">{totalCompleted}</strong></span>
        </div>
      </div>
      <p className="text-gray-400 text-xs mb-4">Daily escrow value with active vs completed trade counts</p>
      <ResponsiveContainer width="100%" height={280}>
        <ComposedChart data={data}>
          <defs>
            <linearGradient id="escrowBar" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00A651" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#00A651" stopOpacity={0.2} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#9ca3af" }} tickLine={false} interval={6} />
          <YAxis yAxisId="left" tickFormatter={fmtNaira} tick={{ fontSize: 10, fill: "#9ca3af" }} tickLine={false} axisLine={false} />
          <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: "#9ca3af" }} tickLine={false} axisLine={false} allowDecimals={false} />
          <Tooltip
            formatter={(v, name) => {
              if (name === "volume") return ["₦" + Number(v).toLocaleString("en-NG"), "Escrow Volume"];
              return [v, name === "active" ? "Active Trades" : "Completed Trades"];
            }}
            contentStyle={{ borderRadius: 10, border: "1px solid #f0f0f0" }}
            labelStyle={{ fontSize: 11, fontWeight: 600 }}
          />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Bar yAxisId="left" dataKey="volume" name="volume" fill="url(#escrowBar)" radius={[4, 4, 0, 0]} barSize={16} />
          <Line yAxisId="right" type="monotone" dataKey="active" name="active" stroke="#2563eb" strokeWidth={2} dot={false} />
          <Line yAxisId="right" type="monotone" dataKey="completed" name="completed" stroke="#16a34a" strokeWidth={2} dot={false} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}