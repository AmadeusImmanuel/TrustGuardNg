import React, { useState } from "react";
import { Link } from "react-router-dom";
import { auth } from "@/api/base44Client";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await auth.forgotPassword(email);
      setSent(true);
    } catch (err) {
      setError(err.message || "Something went wrong");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#0D1F3C" }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-white">TrustGuard</h1>
          <p className="text-white/50 text-sm mt-2">Reset your password</p>
        </div>
        <div className="bg-white rounded-2xl p-8 shadow-xl">
          {sent ? (
            <div className="text-center py-4">
              <div className="text-4xl mb-4">📧</div>
              <h2 className="font-bold text-[#0D1F3C] mb-2">Check your email</h2>
              <p className="text-gray-500 text-sm">If that email exists, a reset link has been sent.</p>
              <Link to="/login" className="mt-6 block text-sm font-semibold" style={{ color: "#00A651" }}>Back to Login</Link>
            </div>
          ) : (
            <>
              {error && <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 text-red-600 text-sm">{error}</div>}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-500"
                    placeholder="you@email.com" />
                </div>
                <button type="submit" disabled={loading}
                  className="w-full py-3 rounded-full text-white font-bold text-sm disabled:opacity-60"
                  style={{ background: "#00A651" }}>
                  {loading ? "Sending..." : "Send Reset Link"}
                </button>
              </form>
              <div className="mt-4 text-center">
                <Link to="/login" className="text-sm text-gray-400 hover:text-gray-600">Back to Login</Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
