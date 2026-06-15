import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Shield, LayoutDashboard, ArrowLeftRight, AlertTriangle,
  Wallet, Users, Settings, LogOut, Menu, X, ChevronRight, Bell
} from "lucide-react";
import { base44 } from "@/api/base44Client";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/trades", icon: ArrowLeftRight, label: "My Trades" },
  { to: "/disputes", icon: AlertTriangle, label: "Disputes" },
  { to: "/wallet", icon: Wallet, label: "Wallet" },
];

const adminItems = [
  { to: "/admin", icon: LayoutDashboard, label: "Admin Overview" },
  { to: "/admin/users", icon: Users, label: "Users" },
  { to: "/admin/trades", icon: ArrowLeftRight, label: "All Trades" },
  { to: "/admin/disputes", icon: AlertTriangle, label: "Disputes" },
  { to: "/admin/webhooks", icon: Settings, label: "Webhook Logs" },
];

export default function AppLayout({ user, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isAdmin = user?.role === "admin";
  const items = isAdmin ? [...navItems, ...adminItems] : navItems;

  const handleLogout = () => {
    base44.auth.logout("/");
  };

  return (
    <div className="min-h-screen flex bg-[#F5F7FA] font-body">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 min-h-screen" style={{ background: "#0D1F3C" }}>
        <div className="px-6 py-6 border-b border-white/10">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#00A651" }}>
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-white font-bold text-sm">TrustGuard</div>
              <div className="text-white/40 text-xs">Nigeria</div>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          {isAdmin && (
            <div className="px-3 mb-2">
              <span className="text-white/30 text-xs font-semibold uppercase tracking-widest">User</span>
            </div>
          )}
          {navItems.map(({ to, icon: Icon, label }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                location.pathname === to || location.pathname.startsWith(to + "/")
                  ? "text-white"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              }`}
              style={
                location.pathname === to || location.pathname.startsWith(to + "/")
                  ? { background: "#00A651" }
                  : {}
              }
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}

          {isAdmin && (
            <>
              <div className="px-3 mt-6 mb-2">
                <span className="text-white/30 text-xs font-semibold uppercase tracking-widest">Admin</span>
              </div>
              {adminItems.map(({ to, icon: Icon, label }) => (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    location.pathname === to
                      ? "text-white"
                      : "text-white/50 hover:text-white hover:bg-white/5"
                  }`}
                  style={location.pathname === to ? { background: "#00A651" } : {}}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              ))}
            </>
          )}
        </nav>

        <div className="px-3 py-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: "#00A651" }}>
              {user?.full_name?.charAt(0) || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white text-sm font-medium truncate">{user?.full_name || "User"}</div>
              <div className="text-white/40 text-xs truncate">{user?.email}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-white/50 hover:text-white hover:bg-white/5 text-sm transition-all"
          >
            <LogOut className="w-4 h-4" />
            Log Out
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 h-14 flex items-center justify-between px-4 text-white" style={{ background: "#0D1F3C" }}>
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "#00A651" }}>
            <Shield className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-sm">TrustGuard</span>
        </Link>
        <button onClick={() => setSidebarOpen(true)}>
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile drawer */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-64 min-h-screen flex flex-col" style={{ background: "#0D1F3C" }}>
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
              <span className="text-white font-bold">TrustGuard</span>
              <button onClick={() => setSidebarOpen(false)}>
                <X className="w-5 h-5 text-white/60" />
              </button>
            </div>
            <nav className="flex-1 px-3 py-4 space-y-1">
              {items.map(({ to, icon: Icon, label }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    location.pathname === to ? "text-white" : "text-white/50 hover:text-white hover:bg-white/5"
                  }`}
                  style={location.pathname === to ? { background: "#00A651" } : {}}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              ))}
            </nav>
            <div className="px-3 py-4 border-t border-white/10">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-white/50 hover:text-white text-sm"
              >
                <LogOut className="w-4 h-4" />
                Log Out
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Mobile bottom nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 px-2 py-2 flex items-center justify-around" style={{ background: "#0D1F3C" }}>
        {navItems.map(({ to, icon: Icon, label }) => (
          <Link
            key={to}
            to={to}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-all ${
              location.pathname === to ? "text-white" : "text-white/40"
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-xs">{label}</span>
          </Link>
        ))}
      </div>

      {/* Main Content */}
      <main className="flex-1 min-w-0 md:overflow-auto pt-14 md:pt-0 pb-20 md:pb-0">
        {children}
      </main>
    </div>
  );
}