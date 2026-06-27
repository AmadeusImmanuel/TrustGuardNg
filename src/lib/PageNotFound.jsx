import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { auth } from "@/api/base44Client";
export default function PageNotFound() {
  const [user, setUser] = useState(null);
  useEffect(() => { auth.me().then(setUser).catch(() => {}); }, []);
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#0D1F3C" }}>
      <div className="text-center">
        <div className="text-8xl font-black text-white/10 mb-4">404</div>
        <h1 className="text-2xl font-black text-white mb-2">Page Not Found</h1>
        <p className="text-white/50 text-sm mb-8">The page you're looking for doesn't exist.</p>
        <Link to={user ? "/dashboard" : "/"} className="px-6 py-3 rounded-full text-white font-semibold text-sm" style={{ background: "#00A651" }}>
          Go Home
        </Link>
      </div>
    </div>
  );
}
