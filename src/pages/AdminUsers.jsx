import React, { useEffect, useState } from "react";
import { auth, User } from "@/api/base44Client";
import AppLayout from "@/components/AppLayout";
import { Search } from "lucide-react";
export default function AdminUsers() {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  useEffect(() => {
    (async () => {
      try {
        const u = await auth.me();
        setUser(u);
        const all = await User.list();
        setUsers(all);
      } catch (e) { console.error(e); }
      setLoading(false);
    })();
  }, []);
  const updateStatus = async (u, newStatus) => {
    await User.update(u.id, { status: newStatus });
    setUsers(users.map((x) => x.id === u.id ? { ...x, status: newStatus } : x));
  };
  const updateKyc = async (u, newKyc) => {
    await User.update(u.id, { kyc_status: newKyc });
    setUsers(users.map((x) => x.id === u.id ? { ...x, kyc_status: newKyc } : x));
  };
  const filtered = users.filter((u) => !search || u.email?.toLowerCase().includes(search.toLowerCase()) || u.full_name?.toLowerCase().includes(search.toLowerCase()));
  return (
    <AppLayout user={user}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-black text-[#0D1F3C] mb-6">Users</h1>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none" placeholder="Search users..." />
        </div>
        {loading ? (
          <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-gray-200 border-t-green-500 rounded-full animate-spin" /></div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-gray-100">{["Name", "Email", "Role", "Status", "KYC", "Actions"].map((h) => <th key={h} className="text-left px-4 py-3 text-xs font-bold text-gray-400 uppercase">{h}</th>)}</tr></thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-semibold text-[#0D1F3C]">{u.full_name || "—"}</td>
                    <td className="px-4 py-3 text-gray-500">{u.email}</td>
                    <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700">{u.role}</span></td>
                    <td className="px-4 py-3">
                      <select value={u.status || "active"} onChange={(e) => updateStatus(u, e.target.value)} className="px-2 py-1 rounded-lg border border-gray-200 text-xs focus:outline-none">
                        <option value="active">Active</option>
                        <option value="suspended">Suspended</option>
                        <option value="banned">Banned</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <select value={u.kyc_status || "none"} onChange={(e) => updateKyc(u, e.target.value)} className="px-2 py-1 rounded-lg border border-gray-200 text-xs focus:outline-none">
                        <option value="none">None</option>
                        <option value="pending">Pending</option>
                        <option value="verified">Verified</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400">{new Date(u.created_date).toLocaleDateString("en-NG")}</td>
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
