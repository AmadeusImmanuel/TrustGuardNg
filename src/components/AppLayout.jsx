import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import NotificationBell from "@/components/NotificationBell";
import {
  LayoutDashboard, ArrowLeftRight, AlertTriangle, Wallet, Shield,
  Menu, X, LogOut, Award, Settings, Search,
  Plus, ChevronRight
} from "lucide-react";

const NAV = [
  { label: "Dashboard",   icon: LayoutDashboard, to: "/dashboard"  },
  { label: "Trades",      icon: ArrowLeftRight,  to: "/trades"     },
  { label: "Disputes",    icon: AlertTriangle,   to: "/disputes"   },
  { label: "Wallet",      icon: Wallet,          to: "/wallet"     },
  { label: "Reputation",  icon: Award,           to: "/reputation" },
  { label: "Support",     icon: Settings,        to: "/support"    },
  { label: "Settings",    icon: Settings,        to: "/settings"   },
];

const ADMIN_NAV = [
  { label: "Dashboard",  to: "/admin"            },
  { label: "Users",      to: "/admin/users"      },
  { label: "All Trades", to: "/admin/trades"     },
  { label: "Disputes",   to: "/admin/disputes"   },
  { label: "Webhooks",   to: "/admin/webhooks"   },
  { label: "KYC Queue",  to: "/admin/kyc"        },
  { label: "Fraud",      to: "/admin/fraud"      },
  { label: "Support",    to: "/admin/support"    },
  { label: "Audit Logs", to: "/admin/audit-logs" },
  { label: "Settings",   to: "/admin/settings"   },
];

export default function AppLayout({ children, user }) {
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const isAdmin = user?.role === "admin";

  const isActive = (to) => location.pathname === to || location.pathname.startsWith(to + "/");

  return (
    <div className="min-h-screen flex bg-background text-foreground font-body">

      {/* Sidebar */}
      <AnimatePresence>
        <motion.aside
          initial={false}
          className={`fixed inset-y-0 left-0 z-40 flex flex-col w-60 border-r border-border bg-sidebar transition-transform duration-300
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
        >
          {/* Logo */}
          <div className="flex items-center gap-3 px-5 py-5 border-b border-border">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center shadow-glow bg-btn-gradient">
              <Shield className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <div className="font-black text-foreground text-sm leading-none">TrustGuard</div>
              <div className="text-xs mt-0.5 text-primary">Nigeria</div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="ml-auto lg:hidden text-muted hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Search */}
          <div className="px-3 py-3">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-card border border-border">
              <Search className="w-3.5 h-3.5 text-muted" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                className="flex-1 bg-transparent text-xs text-text-secondary placeholder-muted outline-none"
                placeholder="Search..." />
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 py-2 overflow-y-auto space-y-0.5">
            {NAV.map(({ label, icon: Icon, to }) => {
              const active = isActive(to);
              return (
                <Link key={to} to={to} onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all relative group
                    ${active ? "text-foreground bg-primary/10" : "text-muted hover:text-text-secondary hover:bg-card-hover"}`}>
                  {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full bg-primary" />}
                  <Icon className={`w-4 h-4 shrink-0 ${active ? "text-primary" : ""}`} />
                  {label}
                  {active && <ChevronRight className="w-3 h-3 ml-auto text-primary" />}
                </Link>
              );
            })}

            {isAdmin && (
              <>
                <div className="px-3 pt-5 pb-2 text-xs font-bold uppercase tracking-widest text-disabled">Admin</div>
                {ADMIN_NAV.map(({ label, to }) => {
                  const active = isActive(to);
                  return (
                    <Link key={to} to={to} onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all
                        ${active ? "text-primary bg-primary/10" : "text-disabled hover:text-muted hover:bg-card-hover"}`}>
                      {label}
                    </Link>
                  );
                })}
              </>
            )}
          </nav>

          {/* User profile */}
          <div className="p-3 border-t border-border">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-card">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center text-primary-foreground text-sm font-black shrink-0 bg-btn-gradient">
                {(user?.full_name || user?.email || "U")[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-foreground truncate">{user?.full_name || "User"}</div>
                <div className="text-xs truncate text-disabled">{user?.email}</div>
              </div>
              <a href={`/profile/${user?.id}`} className="text-slate-600 hover:text-green-400 transition-colors mr-1" title="My Profile"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 1 0-16 0"/></svg></a><button onClick={logout} className="text-slate-600 hover:text-red-400 transition-colors" title="Logout">
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </motion.aside>
      </AnimatePresence>

      {/* Overlay */}
      {sidebarOpen && <div className="fixed inset-0 z-30 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-60">
        {/* Topbar */}
        <header className="sticky top-0 z-20 flex items-center gap-3 px-4 lg:px-6 py-3 border-b border-border bg-navbar/80 backdrop-blur-md">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-muted hover:text-foreground">
            <Menu className="w-5 h-5" />
          </button>

          {/* Breadcrumb */}
          <div className="hidden lg:flex items-center gap-2 text-xs text-muted flex-1">
            <span>TrustGuard</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground capitalize">{location.pathname.split("/")[1] || "dashboard"}</span>
          </div>

          <div className="flex-1 lg:flex-none" />

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button onClick={() => navigate("/trades/new")}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold text-primary-foreground transition-all hover:opacity-90 bg-btn-gradient">
              <Plus className="w-3.5 h-3.5" /> New Trade
            </button>
            <NotificationBell />
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-primary-foreground text-xs font-black bg-btn-gradient">
              {(user?.full_name || user?.email || "U")[0].toUpperCase()}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto bg-background">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
