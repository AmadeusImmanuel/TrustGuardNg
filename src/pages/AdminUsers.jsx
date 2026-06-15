import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import AppLayout from "@/components/AppLayout";
import { Search, ShieldCheck, ShieldAlert, UserX, UserCheck } from "lucide-react";

export default function AdminUsers() {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const u = await base44.auth.me();
      if (u?.role !== "admin") { window.location.href = "/dashboard"; return; }
      setUser(u);
      const all = await base44.entities.User.list("-created_date", 100);
      setUsers(all);
      setLoading(false);
    })();
  }, []);

  const toggleStatus = async (u) => {
    const newStatus = u.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    await base44.entities.User.update(u.id, { status: newStatus });
    setUsers((prev) => prev.map((x) => x.id === u.id ? { ...x, status: newStatus } : x));
  };

  const overrideKYC = async (u) => {
    const newKyc = u.kyc_status === "Verified" ? "Unverified" : "Verified";
    await base44.entities.User.update(u.id, { kyc_status: newKyc });
    setUsers((prev) => prev.map((x) => x.id === u.id ? { ...x, kyc_status: newKyc } : x));
  };

  const filtered = users.filter((u) =>
    !search ||
    u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const kycBadge = (s) => {
    const map = { Verified: "text-green-600 bg-green-50", Pending: "text-blue-600 bg-blue-50", Failed: "text-red-600 bg-red-50", Unverified: "text-gray-500 bg-gray-100" };
    return <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${map[s] || map.Unverified}`}>{s || "Unverified"}</span>;
  };

  return (
    <AppLayout user={user}>
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-8">
        <h1 className="text-2xl font-black text-[#0D1F3C] mb-6">Users</h1>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-500 bg-white" />
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-gray-200 border-t-green-500 rounded-full animate-spin" /></div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-4 py-3 text-gray-500 font-semibold text-xs">User</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-semibold text-xs">Role</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-semibold text-xs">KYC</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-semibold text-xs">Status</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-semibold text-xs">Wallet</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-semibold text-xs">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-[#0D1F3C]">{u.full_name}</div>
                      <div className="text-gray-400 text-xs">{u.email}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${u.role === "admin" ? "bg-[#0D1F3C] text-white" : "bg-gray-100 text-gray-600"}`}>
                        {u.role || "user"}
                      </span>
                    </td>
                    <td className="px-4 py-3">{kycBadge(u.kyc_status)}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${u.status === "SUSPENDED" ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}>
                        {u.status || "ACTIVE"}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-[#0D1F3C]">₦{(u.wallet_balance || 0).toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => toggleStatus(u)}
                          className={`p-1.5 rounded-lg border text-xs transition-all ${u.status === "SUSPENDED" ? "border-green-200 text-green-600 hover:bg-green-50" : "border-red-200 text-red-600 hover:bg-red-50"}`}
                          title={u.status === "SUSPENDED" ? "Activate" : "Suspend"}>
                          {u.status === "SUSPENDED" ? <UserCheck className="w-3.5 h-3.5" /> : <UserX className="w-3.5 h-3.5" />}
                        </button>
                        <button onClick={() => overrideKYC(u)}
                          className="p-1.5 rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-50 transition-all"
                          title="Toggle KYC">
                          {u.kyc_status === "Verified" ? <ShieldAlert className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppLayout>
  );
}