import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, Notifications } from "@/api/base44Client";
import AppLayout from "@/components/AppLayout";
import { Bell, CheckCheck, CheckCircle, Info, AlertTriangle } from "lucide-react";

const TYPE_CONFIG = {
  success: { icon: CheckCircle, color: "#00A651", bg: "#f0fff7" },
  info:    { icon: Info,        color: "#2563eb", bg: "#eff6ff" },
  warning: { icon: AlertTriangle, color: "#d97706", bg: "#fffbeb" },
  error:   { icon: AlertTriangle, color: "#dc2626", bg: "#fef2f2" },
};

export default function NotificationsPage() {
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const u = await auth.me();
        setUser(u);
        const notifs = await Notifications.list();
        setNotifications(notifs);
      } catch (e) { console.error(e); }
      setLoading(false);
    })();
  }, []);

  const handleClick = async (n) => {
    try {
      if (!n.read) {
        await Notifications.markRead(n.id);
        setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x));
      }
      if (n.link) {
        navigate(n.link);
      }
    } catch (e) { console.error(e); }
  };

  const markAllRead = async () => {
    await Notifications.markAllRead();
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const timeAgo = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AppLayout user={user}>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-black text-[#0D1F3C]">Notifications</h1>
            {unreadCount > 0 && <p className="text-gray-500 text-sm mt-1">{unreadCount} unread</p>}
          </div>
          {unreadCount > 0 && (
            <button onClick={markAllRead}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all">
              <CheckCheck className="w-4 h-4" /> Mark all read
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-gray-200 border-t-green-500 rounded-full animate-spin" /></div>
        ) : notifications.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 py-20 text-center">
            <Bell className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No notifications yet</p>
            <p className="text-gray-400 text-sm mt-1">You'll be notified when trades are funded, shipped, or confirmed.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {notifications.map((n) => {
              const config = TYPE_CONFIG[n.type] || TYPE_CONFIG.info;
              const Icon = config.icon;
              return (
                <div key={n.id}
                  className={`flex gap-4 px-6 py-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer ${!n.read ? "bg-blue-50/20" : ""}`}
                  onClick={() => handleClick(n)}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: config.bg }}>
                    <Icon className="w-5 h-5" style={{ color: config.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <span className={`text-sm text-[#0D1F3C] ${!n.read ? "font-bold" : "font-semibold"}`}>{n.title}</span>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs text-gray-400">{timeAgo(n.created_date)}</span>
                        {!n.read && <div className="w-2 h-2 rounded-full" style={{ background: "#2563eb" }} />}
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-1 leading-relaxed">{n.message}</p>
                    {n.link && <p className="text-xs mt-1 font-medium" style={{ color: "#00A651" }}>Click to view →</p>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
