import React from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const fmt = (v) => "₦" + (v / 1000).toFixed(0) + "k";

export default function TradeVolumeChart({ trades }) {
  // Group by day (last 30 days)
  const days = {};
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toLocaleDateString("en-NG", { month: "short", day: "numeric" });
    days[key] = { date: key, volume: 0, count: 0 };
  }
  trades.forEach((t) => {
    const d = new Date(t.created_date);
    const key = d.toLocaleDateString("en-NG", { month: "short", day: "numeric" });
    if (days[key]) {
      days[key].volume += Number(t.amount) || 0;
      days[key].count += 1;
    }
  });
  const data = Object.values(days);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <h3 className="font-bold text-[#0D1F3C] mb-1">Trade Volume (30 days)</h3>
      <p className="text-gray-400 text-xs mb-4">Total escrow value per day</p>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="vol" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00A651" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#00A651" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#9ca3af" }} tickLine={false} interval={6} />
          <YAxis tickFormatter={fmt} tick={{ fontSize: 10, fill: "#9ca3af" }} tickLine={false} axisLine={false} />
          <Tooltip formatter={(v) => ["₦" + v.toLocaleString("en-NG"), "Volume"]} labelStyle={{ fontSize: 11 }} contentStyle={{ borderRadius: 10, border: "1px solid #f0f0f0" }} />
          <Area type="monotone" dataKey="volume" stroke="#00A651" strokeWidth={2} fill="url(#vol)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}