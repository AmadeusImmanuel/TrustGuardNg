import React, { useEffect, useState, useRef } from "react";
import { Bell, CheckCheck, Info, CheckCircle, AlertTriangle, X } from "lucide-react";
import { Notifications } from "@/api/base44Client";
import { Link } from "react-router-dom";

const TYPE_CONFIG = {
  success: { icon: CheckCircle, className: "text-success bg-success/10" },
  info:    { icon: Info,         className: "text-info bg-info/10" },
  warning: { icon: AlertTriangle, className: "text-warning bg-warning/10" },
  error:   { icon: AlertTriangle, className: "text-danger bg-danger/10" },
};

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const fetchNotifications = async () => {
    try {
      const [notifs, count] = await Promise.all([
        Notifications.list(),
        Notifications.unreadCount(),
      ]);
      setNotifications(notifs);
      setUnread(count.count);
    } catch (e) {}
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleOpen = () => setOpen(!open);

  const markRead = async (id) => {
    await Notifications.markRead(id);
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    setUnread(Math.max(0, unread - 1));
  };

  const markAllRead = async () => {
    await Notifications.markAllRead();
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    setUnread(0);
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

  return (
    <div ref={ref} className="relative">
      <button onClick={handleOpen}
        className="relative w-9 h-9 rounded-xl flex items-center justify-center hover:bg-card-hover transition-colors">
        <Bell className="w-5 h-5 text-muted" />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-black bg-danger">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 w-80 bg-card rounded-2xl shadow-elevated border border-border overflow-hidden z-50">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <span className="font-bold text-foreground text-sm">Notifications</span>
            <div className="flex items-center gap-2">
              {unread > 0 && (
                <button onClick={markAllRead}
                  className="flex items-center gap-1 text-xs text-muted hover:text-foreground transition-colors">
                  <CheckCheck className="w-3 h-3" /> Mark all read
                </button>
              )}
              <button onClick={() => setOpen(false)} className="text-muted hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Notifications list */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="text-center py-10">
                <Bell className="w-8 h-8 text-disabled mx-auto mb-2" />
                <p className="text-muted text-sm">No notifications yet</p>
              </div>
            ) : (
              notifications.map((n) => {
                const config = TYPE_CONFIG[n.type] || TYPE_CONFIG.info;
                const Icon = config.icon;
                return (
                  <div key={n.id}
                    className={`flex gap-3 px-4 py-3 border-b border-border hover:bg-card-hover transition-colors cursor-pointer ${!n.read ? "bg-info/5" : ""}`}
                    onClick={async () => { if (!n.read) await markRead(n.id); if (n.link) { setOpen(false); window.location.href = n.link; } }}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${config.className}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <span className={`text-sm font-semibold text-foreground ${!n.read ? "font-bold" : ""}`}>{n.title}</span>
                        {!n.read && <div className="w-2 h-2 rounded-full shrink-0 mt-1.5 bg-info" />}
                      </div>
                      <p className="text-xs text-muted mt-0.5 leading-relaxed">{n.message}</p>
                      <span className="text-xs text-disabled mt-1 block">{timeAgo(n.created_date)}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-3 border-t border-border text-center">
              <Link to="/notifications" onClick={() => setOpen(false)}
                className="text-xs font-semibold text-primary hover:underline">
                View all notifications
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
