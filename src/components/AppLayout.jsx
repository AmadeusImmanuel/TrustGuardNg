import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { LayoutDashboard, ArrowLeftRight, AlertTriangle, Wallet, Shield, Menu, X, LogOut } from "lucide-react";
const NAV = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/dashboard" },
  { label: "Trades", icon: ArrowLeftRight, to: "/trades" },
  { label: "Disputes", icon: AlertTriangle, to: "/disputes" },
  { label: "Wallet", icon: Wallet, to: "/wallet" },
];
export default function AppLayout({ children, user }) {
  const { logout } = useAuth();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const isAdmin = user?.role === "admin";
  return (
    <div className="min-h-screen flex" style={{ background: "#f7f8fa" }}>
      {/* Sidebar */}
      <aside className={"fixed inset-y-0 left-0 z-40 w-64 flex flex-col transition-transform duration-200 lg:translate-x-0 " + (open ? "translate-x-0" : "-translate-x-full")} style={{ background: "#0D1F3C" }}>
        <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
          <Shield className="w-6 h-6" style={{ color: "#00A651" }} />
          <span className="text-white font-black text-lg">TrustGuard</span>
          <button onClick={() => setOpen(false)} className="ml-auto lg:hidden text-white/50"><X className="w-5 h-5" /></button>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map(({ label, icon: Icon, to }) => {
            const active = location.pathname === to || location.pathname.startsWith(to + "/");
            return (
              <Link key={to} to={to} onClick={() => setOpen(false)} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${active ? "text-white" : "text-white/50 hover:text-white hover:bg-white/5"}`} style={active ? { background: "#00A651" } : {}}>
                <Icon className="w-4 h-4" /> {label}
              </Link>
            );
          })}
          {isAdmin && (
            <>
              <div className="px-4 pt-4 pb-2 text-white/30 text-xs font-bold uppercase tracking-widest">Admin</div>
              {[{ label: "Dashboard", to: "/admin" }, { label: "Users", to: "/admin/users" }, { label: "All Trades", to: "/admin/trades" }, { label: "Disputes", to: "/admin/disputes" }, { label: "Webhooks", to: "/admin/webhooks" }, { label: "Settings", to: "/admin/settings" }].map(({ label, to }) => (
                <Link key={to} to={to} onClick={() => setOpen(false)} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${location.pathname === to ? "text-white bg-white/10" : "text-white/50 hover:text-white hover:bg-white/5"}`}>
                  {label}
                </Link>
              ))}
            </>
          )}
        </nav>
        <div className="px-3 py-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ background: "#00A651" }}>
              {user?.full_name?.[0] || user?.email?.[0] || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white text-sm font-semibold truncate">{user?.full_name || "User"}</div>
              <div className="text-white/40 text-xs truncate">{user?.email}</div>
            </div>
            <button onClick={logout} className="text-white/40 hover:text-white"><LogOut className="w-4 h-4" /></button>
          </div>
        </div>
      </aside>
      {/* Overlay */}
      {open && <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setOpen(false)} />}
      {/* Main */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <header className="sticky top-0 z-20 flex items-center gap-4 px-4 py-3 bg-white border-b border-gray-100 lg:hidden">
          <button onClick={() => setOpen(true)} className="text-gray-500"><Menu className="w-5 h-5" /></button>
          <span className="font-black text-[#0D1F3C]">TrustGuard</span>
        </header>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
