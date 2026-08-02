import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, Notifications } from "@/api/base44Client";
import AppLayout from "@/components/AppLayout";
import { Bell, CheckCheck, CheckCircle, Info, AlertTriangle } from "lucide-react";

const TYPE_CONFIG = {
  success: { icon: CheckCircle, className: "text-success bg-success/10" },
  info:    { icon: Info,        className: "text-info bg-info/10" },
  warning: { icon: AlertTriangle, className: "text-warning bg-warning/10" },
  error:   { icon: AlertTriangle, className: "text-danger bg-danger/10" },
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
            <h1 className="text-2xl font-black text-foreground">Notifications</h1>
            {unreadCount > 0 && <p className="text-muted text-sm mt-1">{unreadCount} unread</p>}
          </div>
          {unreadCount > 0 && (
            <button onClick={markAllRead}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-border text-sm font-semibold text-text-secondary hover:bg-card-hover transition-all">
              <CheckCheck className="w-4 h-4" /> Mark all read
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-border border-t-primary rounded-full animate-spin" /></div>
        ) : notifications.length === 0 ? (
          <div className="bg-card rounded-2xl border border-border py-20 text-center">
            <Bell className="w-12 h-12 text-disabled mx-auto mb-4" />
            <p className="text-text-secondary font-medium">No notifications yet</p>
            <p className="text-muted text-sm mt-1">You'll be notified when trades are funded, shipped, or confirmed.</p>
          </div>
        ) : (
          <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
            {notifications.map((n) => {
              const config = TYPE_CONFIG[n.type] || TYPE_CONFIG.info;
              const Icon = config.icon;
              return (
                <div key={n.id}
                  className={`flex gap-4 px-6 py-4 border-b border-border hover:bg-card-hover transition-colors cursor-pointer ${!n.read ? "bg-info/5" : ""}`}
                  onClick={() => handleClick(n)}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${config.className}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <span className={`text-sm text-foreground ${!n.read ? "font-bold" : "font-semibold"}`}>{n.title}</span>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs text-muted">{timeAgo(n.created_date)}</span>
                        {!n.read && <div className="w-2 h-2 rounded-full bg-info" />}
                      </div>
                    </div>
                    <p className="text-sm text-text-secondary mt-1 leading-relaxed">{n.message}</p>
                    {n.link && <p className="text-xs mt-1 font-medium text-primary">Click to view →</p>}
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
