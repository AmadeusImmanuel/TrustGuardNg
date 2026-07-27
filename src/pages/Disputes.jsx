import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { auth, Dispute, DisputeCenter } from "@/api/base44Client";
import AppLayout from "@/components/AppLayout";
import { AlertTriangle, ChevronRight } from "lucide-react";

const statusStyles = {
  OPEN: { className: "bg-danger/10 text-danger", label: "Open" },
  UNDER_REVIEW: { className: "bg-warning/10 text-warning", label: "Under Review" },
  RESOLVED: { className: "bg-success/10 text-success", label: "Resolved" },
};

export default function Disputes() {
  const [user, setUser] = useState(null);
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const u = await auth.me();
        setUser(u);
        const d = await Dispute.list({ user_id: u.id });
        setDisputes(d);
      } catch (e) { console.error(e); }
      setLoading(false);
    })();
  }, []);

  return (
    <AppLayout user={user}>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-black text-foreground mb-6">My Disputes</h1>
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-border border-t-primary rounded-full animate-spin" />
          </div>
        ) : disputes.length === 0 ? (
          <div className="bg-card rounded-2xl border border-border py-20 text-center">
            <AlertTriangle className="w-12 h-12 text-disabled mx-auto mb-4" />
            <p className="text-text-secondary font-medium">No disputes raised</p>
            <p className="text-muted text-sm mt-1">Disputes are raised from within a trade.</p>
          </div>
        ) : (
          <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="divide-y divide-border">
              {disputes.map((d) => {
                const sc = statusStyles[d.status] || statusStyles.OPEN;
                return (
                  <Link
                    key={d.id}
                    to={"/disputes/" + d.id}
                    className="flex items-center gap-4 px-6 py-4 hover:bg-card-hover transition-colors"
                  >
                    <div className="w-10 h-10 rounded-xl bg-danger/10 flex items-center justify-center shrink-0">
                      <AlertTriangle className="w-5 h-5 text-danger" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-foreground text-sm truncate">{d.reason?.substring(0, 60) || "Dispute"}</div>
                      <div className="text-muted text-xs mt-0.5">{new Date(d.created_date).toLocaleDateString("en-NG")}</div>
                    </div>
                    <div className="shrink-0">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${sc.className}`}>{sc.label}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-disabled" />
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
