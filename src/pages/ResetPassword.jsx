import React, { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { auth } from "@/api/base44Client";
export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) return setError("Passwords do not match");
    setLoading(true); setError("");
    try {
      await auth.resetPassword(token, password);
      navigate("/login");
    } catch (err) { setError(err.message || "Reset failed"); }
    setLoading(false);
  };
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#0D1F3C" }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-white">TrustGuard</h1>
          <p className="text-white/50 text-sm mt-2">Set a new password</p>
        </div>
        <div className="bg-white rounded-2xl p-8 shadow-xl">
          {error && <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 text-red-600 text-sm">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">New Password</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-500" placeholder="••••••••" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm Password</label>
              <input type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-500" placeholder="••••••••" />
            </div>
            <button type="submit" disabled={loading} className="w-full py-3 rounded-full text-white font-bold text-sm disabled:opacity-60" style={{ background: "#00A651" }}>
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
          <div className="mt-4 text-center"><Link to="/login" className="text-sm text-gray-400">Back to Login</Link></div>
        </div>
      </div>
    </div>
  );
}
