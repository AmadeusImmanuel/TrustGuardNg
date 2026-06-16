import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

export default function DisputeRateChart({ trades, disputes }) {
  // Group by week (last 8 weeks)
  const weeks = {};
  for (let i = 7; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i * 7);
    const key = "W" + Math.ceil((d.getDate()) / 7) + " " + d.toLocaleDateString("en-NG", { month: "short" });
    weeks[key] = { week: key, trades: 0, disputes: 0 };
  }

  trades.forEach((t) => {
    const d = new Date(t.created_date);
    const key = "W" + Math.ceil((d.getDate()) / 7) + " " + d.toLocaleDateString("en-NG", { month: "short" });
    if (weeks[key]) weeks[key].trades += 1;
  });

  disputes.forEach((d) => {
    const dt = new Date(d.created_date);
    const key = "W" + Math.ceil((dt.getDate()) / 7) + " " + dt.toLocaleDateString("en-NG", { month: "short" });
    if (weeks[key]) weeks[key].disputes += 1;
  });

  const data = Object.values(weeks);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <h3 className="font-bold text-[#0D1F3C] mb-1">Disputes vs Trades (8 weeks)</h3>
      <p className="text-gray-400 text-xs mb-4">Weekly comparison of disputes raised</p>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} barSize={12}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis dataKey="week" tick={{ fontSize: 10, fill: "#9ca3af" }} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} tickLine={false} axisLine={false} />
          <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #f0f0f0" }} labelStyle={{ fontSize: 11 }} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Bar dataKey="trades" name="Trades" fill="#0D1F3C" radius={[4, 4, 0, 0]} />
          <Bar dataKey="disputes" name="Disputes" fill="#dc2626" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}