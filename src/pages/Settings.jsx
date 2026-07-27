import React, { useEffect, useState } from "react";
import { auth, SettingsAPI } from "@/api/base44Client";
import AppLayout from "@/components/AppLayout";
import { User, Lock, Bell, Eye, AlertTriangle, CheckCircle, Shield, Sun, Moon, Monitor } from "lucide-react";
import TrustBadge from "@/components/TrustBadge";
import { useTheme } from "@/lib/ThemeProvider";

function Section({ icon: Icon, title, children }) {
  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-border">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-primary/10">
          <Icon className="w-4 h-4 text-primary" />
        </div>
        <h2 className="font-bold text-foreground">{title}</h2>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function Toggle({ label, sub, value, onChange }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
      <div>
        <div className="font-medium text-foreground text-sm">{label}</div>
        {sub && <div className="text-muted text-xs mt-0.5">{sub}</div>}
      </div>
      <button onClick={() => onChange(!value)}
        className={`relative w-11 h-6 rounded-full transition-all duration-200 ${value ? "bg-primary" : "bg-card-hover"}`}>
        <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-200 ${value ? "left-5" : "left-0.5"}`} />
      </button>
    </div>
  );
}

const THEME_OPTIONS = [
  { key: "light", icon: Sun, label: "Light" },
  { key: "dark", icon: Moon, label: "Dark" },
  { key: "system", icon: Monitor, label: "System" },
];

function ThemeSection() {
  const { theme, setTheme } = useTheme();
  return (
    <Section icon={Monitor} title="Appearance">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-medium text-foreground text-sm">Theme</div>
          <div className="text-muted text-xs mt-0.5">Choose how TrustGuard looks on this device</div>
        </div>
        <div className="flex items-center gap-1 bg-background border border-border rounded-full p-1">
          {THEME_OPTIONS.map(({ key, icon: Icon, label }) => (
            <button key={key} onClick={() => setTheme(key)} aria-label={label}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                theme === key ? "bg-primary text-primary-foreground" : "text-muted hover:text-foreground"
              }`}>
              <Icon className="w-3.5 h-3.5" /> {label}
            </button>
          ))}
        </div>
      </div>
    </Section>
  );
}

export default function Settings() {
  const [currentUser, setCurrentUser] = useState(null);
  const [profile, setProfile] = useState({ full_name: "", phone: "" });
  const [passwords, setPasswords] = useState({ current_password: "", new_password: "", confirm_password: "" });
  const [notifications, setNotifications] = useState({ notification_email: true, notification_sms: true, notification_inapp: true });
  const [privacy, setPrivacy] = useState({ profile_public: true, show_email: false });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState({});
  const [messages, setMessages] = useState({});
  const [showDeactivate, setShowDeactivate] = useState(false);
  const [deactivatePassword, setDeactivatePassword] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const u = await auth.me();
        setCurrentUser(u);
        const s = await SettingsAPI.getProfile();
        setProfile({ full_name: s.full_name || "", phone: s.phone || "" });
        setNotifications({
          notification_email: s.notification_email ?? true,
          notification_sms: s.notification_sms ?? true,
          notification_inapp: s.notification_inapp ?? true,
        });
        setPrivacy({
          profile_public: s.profile_public ?? true,
          show_email: s.show_email ?? false,
        });
      } catch (e) { console.error(e); }
      setLoading(false);
    })();
  }, []);

  const showMessage = (key, msg, isError = false) => {
    setMessages(m => ({ ...m, [key]: { text: msg, error: isError } }));
    setTimeout(() => setMessages(m => ({ ...m, [key]: null })), 3000);
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    setSaving(s => ({ ...s, profile: true }));
    try {
      await SettingsAPI.updateProfile(profile);
      showMessage("profile", "Profile updated successfully!");
    } catch (err) { showMessage("profile", err.message, true); }
    setSaving(s => ({ ...s, profile: false }));
  };

  const savePassword = async (e) => {
    e.preventDefault();
    if (passwords.new_password !== passwords.confirm_password) {
      return showMessage("password", "Passwords do not match", true);
    }
    setSaving(s => ({ ...s, password: true }));
    try {
      await SettingsAPI.changePassword({ current_password: passwords.current_password, new_password: passwords.new_password });
      setPasswords({ current_password: "", new_password: "", confirm_password: "" });
      showMessage("password", "Password changed successfully!");
    } catch (err) { showMessage("password", err.message, true); }
    setSaving(s => ({ ...s, password: false }));
  };

  const saveNotifications = async (newVal) => {
    const updated = { ...notifications, ...newVal };
    setNotifications(updated);
    try {
      await SettingsAPI.updateNotifications(updated);
      showMessage("notifications", "Notification preferences saved!");
    } catch (err) { showMessage("notifications", err.message, true); }
  };

  const savePrivacy = async (newVal) => {
    const updated = { ...privacy, ...newVal };
    setPrivacy(updated);
    try {
      await SettingsAPI.updatePrivacy(updated);
      showMessage("privacy", "Privacy settings saved!");
    } catch (err) { showMessage("privacy", err.message, true); }
  };

  const deactivate = async () => {
    try {
      await SettingsAPI.deactivateAccount(deactivatePassword);
      auth.logout();
    } catch (err) { showMessage("deactivate", err.message, true); }
  };

  const Message = ({ k }) => messages[k] ? (
    <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm mt-3 ${messages[k].error ? "bg-danger/10 text-danger" : "bg-success/10 text-success"}`}>
      {messages[k].error ? <AlertTriangle className="w-4 h-4 shrink-0" /> : <CheckCircle className="w-4 h-4 shrink-0" />}
      {messages[k].text}
    </div>
  ) : null;

  if (loading) return <AppLayout user={currentUser}><div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-border border-t-primary rounded-full animate-spin" /></div></AppLayout>;

  return (
    <AppLayout user={currentUser}>
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-black text-foreground mb-2">Account Settings</h1>
        <p className="text-muted text-sm mb-8">Manage your profile, security, and preferences.</p>

        <div className="space-y-6">
          {/* Account overview */}
          <div className="rounded-2xl p-6 text-primary-foreground relative overflow-hidden bg-brand-gradient">
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 blur-2xl bg-primary" />
            <div className="flex items-center gap-4 relative">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black bg-white/15">
                {(currentUser?.full_name || currentUser?.email || "?")[0].toUpperCase()}
              </div>
              <div>
                <div className="font-black text-xl">{currentUser?.full_name || "No name set"}</div>
                <div className="text-white/60 text-sm">{currentUser?.email}</div>
                <div className="mt-2">
                  <TrustBadge level={currentUser?.trust_level || "Bronze"} score={currentUser?.trust_score || 0} size="sm" showScore />
                </div>
              </div>
            </div>
          </div>

          {/* Appearance / Theme */}
          <ThemeSection />

          {/* Profile */}
          <Section icon={User} title="Profile Information">
            <form onSubmit={saveProfile} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-text-secondary mb-1.5">Full Name</label>
                <input value={profile.full_name} onChange={e => setProfile({ ...profile, full_name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-primary"
                  placeholder="Your full name" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-text-secondary mb-1.5">Phone Number</label>
                <input value={profile.phone} onChange={e => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-primary"
                  placeholder="08012345678" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-text-secondary mb-1.5">Email Address</label>
                <input value={currentUser?.email} disabled
                  className="w-full px-4 py-2.5 rounded-xl border border-border text-sm bg-card-hover text-disabled cursor-not-allowed" />
                <p className="text-xs text-muted mt-1">Email cannot be changed. Contact support if needed.</p>
              </div>
              <button type="submit" disabled={saving.profile}
                className="px-6 py-2.5 rounded-full text-primary-foreground font-semibold text-sm disabled:opacity-60 bg-primary hover:bg-primary-hover transition-colors">
                {saving.profile ? "Saving..." : "Save Profile"}
              </button>
              <Message k="profile" />
            </form>
          </Section>

          {/* Password */}
          <Section icon={Lock} title="Change Password">
            <form onSubmit={savePassword} className="space-y-4">
              {[
                { label: "Current Password", key: "current_password", placeholder: "Your current password" },
                { label: "New Password", key: "new_password", placeholder: "At least 6 characters" },
                { label: "Confirm New Password", key: "confirm_password", placeholder: "Repeat new password" },
              ].map(({ label, key, placeholder }) => (
                <div key={key}>
                  <label className="block text-sm font-semibold text-text-secondary mb-1.5">{label}</label>
                  <input type="password" value={passwords[key]} onChange={e => setPasswords({ ...passwords, [key]: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-primary"
                    placeholder={placeholder} />
                </div>
              ))}
              <button type="submit" disabled={saving.password}
                className="px-6 py-2.5 rounded-full text-primary-foreground font-semibold text-sm disabled:opacity-60 bg-primary hover:bg-primary-hover transition-colors">
                {saving.password ? "Changing..." : "Change Password"}
              </button>
              <Message k="password" />
            </form>
          </Section>

          {/* Notifications */}
          <Section icon={Bell} title="Notification Preferences">
            <Toggle label="Email Notifications" sub="Receive trade updates via email"
              value={notifications.notification_email}
              onChange={v => saveNotifications({ notification_email: v })} />
            <Toggle label="SMS Notifications" sub="Receive alerts via text message"
              value={notifications.notification_sms}
              onChange={v => saveNotifications({ notification_sms: v })} />
            <Toggle label="In-App Notifications" sub="Show notifications inside TrustGuard"
              value={notifications.notification_inapp}
              onChange={v => saveNotifications({ notification_inapp: v })} />
            <Message k="notifications" />
          </Section>

          {/* Privacy */}
          <Section icon={Eye} title="Privacy Settings">
            <Toggle label="Public Profile" sub="Allow other users to view your profile page"
              value={privacy.profile_public}
              onChange={v => savePrivacy({ profile_public: v })} />
            <Toggle label="Show Email on Profile" sub="Display your email address on your public profile"
              value={privacy.show_email}
              onChange={v => savePrivacy({ show_email: v })} />
            <Message k="privacy" />
          </Section>

          {/* KYC Status */}
          <Section icon={Shield} title="Identity Verification">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-foreground text-sm">KYC Status</div>
                <div className="text-muted text-xs mt-0.5">Required for withdrawals above ₦50,000</div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${
                currentUser?.kyc_status === "verified" ? "bg-success/10 text-success" :
                currentUser?.kyc_status === "pending" ? "bg-warning/10 text-warning" :
                "bg-card-hover text-muted"
              }`}>
                {currentUser?.kyc_status || "Not started"}
              </span>
            </div>
            {currentUser?.kyc_status !== "verified" && (
              <a href="/wallet" className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full text-primary-foreground text-xs font-semibold bg-primary hover:bg-primary-hover transition-colors">
                <Shield className="w-3 h-3" /> Complete KYC Verification
              </a>
            )}
          </Section>

          {/* Danger Zone */}
          <div className="bg-card rounded-2xl border border-danger/20 overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-danger/20">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-danger/10">
                <AlertTriangle className="w-4 h-4 text-danger" />
              </div>
              <h2 className="font-bold text-foreground">Danger Zone</h2>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-foreground text-sm">Deactivate Account</div>
                  <div className="text-muted text-xs mt-0.5">This will suspend your account. You can reactivate by contacting support.</div>
                </div>
                <button onClick={() => setShowDeactivate(true)}
                  className="px-4 py-2 rounded-full border border-danger/30 text-danger text-xs font-semibold hover:bg-danger/10 transition-all">
                  Deactivate
                </button>
              </div>
              <Message k="deactivate" />
            </div>
          </div>
        </div>
      </div>

      {/* Deactivate Modal */}
      {showDeactivate && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl p-6 w-full max-w-sm border border-border">
            <div className="text-center mb-4">
              <div className="w-12 h-12 rounded-full bg-danger/10 flex items-center justify-center mx-auto mb-3">
                <AlertTriangle className="w-6 h-6 text-danger" />
              </div>
              <h2 className="font-black text-foreground text-lg">Deactivate Account</h2>
              <p className="text-muted text-sm mt-1">Enter your password to confirm deactivation.</p>
            </div>
            <input type="password" value={deactivatePassword} onChange={e => setDeactivatePassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-danger mb-4"
              placeholder="Your password" />
            <div className="flex gap-3">
              <button onClick={() => setShowDeactivate(false)} className="flex-1 py-2.5 rounded-full border border-border text-sm font-semibold text-text-secondary">Cancel</button>
              <button onClick={deactivate} className="flex-1 py-2.5 rounded-full text-white text-sm font-semibold bg-danger hover:opacity-90 transition-opacity">
                Confirm Deactivate
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
