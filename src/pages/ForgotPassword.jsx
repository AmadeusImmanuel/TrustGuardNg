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
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-foreground">TrustGuard</h1>
          <p className="text-muted text-sm mt-2">Reset your password</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-8 shadow-elevated">
          {sent ? (
            <div className="text-center py-4">
              <div className="text-4xl mb-4">📧</div>
              <h2 className="font-bold text-foreground mb-2">Check your email</h2>
              <p className="text-muted text-sm">If that email exists, a reset link has been sent.</p>
              <Link to="/login" className="mt-6 block text-sm font-semibold text-primary">Back to Login</Link>
            </div>
          ) : (
            <>
              {error && <div className="mb-4 px-4 py-3 rounded-xl bg-danger/10 text-danger text-sm">{error}</div>}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-text-secondary mb-1.5">Email Address</label>
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-primary"
                    placeholder="you@email.com" />
                </div>
                <button type="submit" disabled={loading}
                  className="w-full py-3 rounded-full text-primary-foreground font-bold text-sm disabled:opacity-60 bg-btn-gradient hover:opacity-90 transition-opacity">
                  {loading ? "Sending..." : "Send Reset Link"}
                </button>
              </form>
              <div className="mt-4 text-center">
                <Link to="/login" className="text-sm text-muted hover:text-foreground">Back to Login</Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
