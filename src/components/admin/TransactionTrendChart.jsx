import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

export default function TransactionTrendChart({ transactions }) {
  const days = {};
  const now = new Date();
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toLocaleDateString("en-NG", { month: "short", day: "numeric" });
    days[key] = { date: key, inflow: 0, payout: 0 };
  }

  transactions.forEach((t) => {
    const d = new Date(t.created_date);
    const key = d.toLocaleDateString("en-NG", { month: "short", day: "numeric" });
    if (!days[key]) return;
    if (t.type === "Escrow_Inflow") days[key].inflow += Number(t.amount) || 0;
    if (t.type === "Manual_Release" || t.type === "Auto_Release_Payout") days[key].payout += Number(t.amount) || 0;
  });

  const data = Object.values(days);
  const fmt = (v) => "₦" + (v / 1000).toFixed(0) + "k";

  return (
    <div className="rounded-2xl border p-6" style={{ background: "#111827", borderColor: "rgba(255,255,255,0.06)" }}>
      <h3 className="font-bold text-white mb-1">Transaction Trends (14 days)</h3>
      <p className="text-slate-500 text-xs mb-4">Inflows vs payouts daily</p>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#9ca3af" }} tickLine={false} interval={3} />
          <YAxis tickFormatter={fmt} tick={{ fontSize: 10, fill: "#9ca3af" }} tickLine={false} axisLine={false} />
          <Tooltip formatter={(v) => "₦" + v.toLocaleString("en-NG")} contentStyle={{ background: "#1A2235", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, fontSize: 12, color: "#fff" }} labelStyle={{ fontSize: 11 }} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Line type="monotone" dataKey="inflow" name="Inflow" stroke="#00A651" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="payout" name="Payout" stroke="#2563eb" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}