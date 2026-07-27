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
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-foreground">TrustGuard</h1>
          <p className="text-muted text-sm mt-2">Set a new password</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-8 shadow-elevated">
          {error && <div className="mb-4 px-4 py-3 rounded-xl bg-danger/10 text-danger text-sm">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-text-secondary mb-1.5">New Password</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-primary"
                placeholder="••••••••" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-text-secondary mb-1.5">Confirm Password</label>
              <input type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-primary"
                placeholder="••••••••" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-full text-primary-foreground font-bold text-sm disabled:opacity-60 bg-btn-gradient hover:opacity-90 transition-opacity">
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
          <div className="mt-4 text-center"><Link to="/login" className="text-sm text-muted">Back to Login</Link></div>
        </div>
      </div>
    </div>
  );
}
