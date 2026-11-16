
"use client";

import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { useTheme } from "next-themes";
import {
  UserRound,
  Shield,
  Bell,
  Palette,
  LockKeyhole,
  Globe,
  Save,
  Camera,
  Eye,
  Monitor,
  Moon,
  Sun,
  Check,
  Settings as SettingsIcon,
  ChevronRight,
  Mail,
  X,
  Loader2,
  MonitorSmartphone,
  KeyRound,
  Copy,
  RefreshCw,
  ShieldCheck,
  Smartphone,
  LogOut
} from "lucide-react";
import Sidebar from "@/components/sidebar";
import Topbar from "@/components/topbar";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

type Profile = {
  name: string;
  username: string;
  email: string;
  university: string;
  course: string;
  year: string;
  bio: string;
  website: string;
  profileImage: string;
};

type SecuritySession = {
  sessionId: string;
  device: string;
  ipAddress: string;
  createdAt: string;
  lastActiveAt: string;
  current: boolean;
};

type SecurityStatus = {
  twoFactorEnabled: boolean;
  activeSessions: number;
  passwordChangedAt: string | null;
};

type Preferences = {
  emailNotifications: boolean;
  platformNotifications: boolean;
  eventUpdates: boolean;
  connectionRequests: boolean;
  startupUpdates: boolean;
  publicProfile: boolean;
  showUniversity: boolean;
  showEmail: boolean;
  language: string;
};

const defaultProfile: Profile = {
  name: "",
  username: "",
  email: "",
  university: "",
  course: "",
  year: "",
  bio: "",
  website: "",
  profileImage: ""
};

const defaultPreferences: Preferences = {
  emailNotifications: true,
  platformNotifications: true,
  eventUpdates: true,
  connectionRequests: true,
  startupUpdates: true,
  publicProfile: true,
  showUniversity: true,
  showEmail: false,
  language: "English"
};

const sections = [
  { id: "profile", label: "Profile", icon: UserRound },
  { id: "account", label: "Account", icon: Shield },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "privacy", label: "Privacy", icon: Eye },
  { id: "security", label: "Security", icon: LockKeyhole },
  { id: "preferences", label: "Preferences", icon: Globe }
];

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();

  const [activeSection, setActiveSection] = useState("profile");
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const [preferences, setPreferences] =
    useState<Preferences>(defaultPreferences);

  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [sessions, setSessions] = useState<SecuritySession[]>([]);
  const [securityStatus, setSecurityStatus] = useState<SecurityStatus | null>(null);
  const [securityLoading, setSecurityLoading] = useState(false);
  const [securityBusy, setSecurityBusy] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [revokeOtherSessions, setRevokeOtherSessions] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [twoFactorPassword, setTwoFactorPassword] = useState("");
  const [twoFactorSetup, setTwoFactorSetup] = useState<{
    qrCode: string;
    manualEntryKey: string;
  } | null>(null);
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);

  useEffect(() => {
    setMounted(true);

    const loadSettings = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/api/users/profile`, {
          method: "GET",
          credentials: "include"
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Unable to load settings.");
        }

        const user = data.user;

        setProfile({
          name: user.name || "",
          username: user.username || "",
          email: user.email || "",
          university: user.university || "",
          course: user.course || "",
          year: user.year || "",
          bio: user.bio || "",
          website: user.website || "",
          profileImage: user.profileImage || ""
        });

        setPreferences({
          ...defaultPreferences,
          ...(user.preferences || {})
        });
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to connect to the server."
        );
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const updateProfile = (key: keyof Profile, value: string) => {
    setProfile((previous) => ({
      ...previous,
      [key]: value
    }));
  };

  const updatePreference = (
    key: keyof Preferences,
    value: boolean | string
  ) => {
    setPreferences((previous) => ({
      ...previous,
      [key]: value
    }));
  };

  const saveProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setSaving(true);
      setMessage("");
      setError("");

      const response = await fetch(`${API_URL}/api/users/profile`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: profile.name,
          username: profile.username,
          university: profile.university,
          course: profile.course,
          year: profile.year,
          bio: profile.bio,
          website: profile.website
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Profile update failed.");
      }

      const user = data.user;

      setProfile((previous) => ({
        ...previous,
        name: user.name || "",
        username: user.username || "",
        university: user.university || "",
        course: user.course || "",
        year: user.year || "",
        bio: user.bio || "",
        website: user.website || ""
      }));

      setMessage("Profile updated successfully!");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to save your profile."
      );
    } finally {
      setSaving(false);
    }
  };

  const savePreferences = async () => {
    try {
      setSaving(true);
      setMessage("");
      setError("");

      const response = await fetch(`${API_URL}/api/users/profile`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          preferences
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to save preferences.");
      }

      setPreferences({
        ...defaultPreferences,
        ...(data.user.preferences || preferences)
      });

      setMessage("Your preferences have been saved successfully!");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to save preferences."
      );
    } finally {
      setSaving(false);
    }
  };

  const loadSecurityData = async () => {
    try {
      setSecurityLoading(true);
      const [sessionsResponse, statusResponse] = await Promise.all([
        fetch(`${API_URL}/api/auth/sessions`, { credentials: "include" }),
        fetch(`${API_URL}/api/auth/security-status`, { credentials: "include" })
      ]);
      const sessionsData = await sessionsResponse.json();
      const statusData = await statusResponse.json();

      if (!sessionsResponse.ok || !sessionsData.success) {
        throw new Error(sessionsData.message || "Unable to load sessions.");
      }
      if (!statusResponse.ok || !statusData.success) {
        throw new Error(statusData.message || "Unable to load security status.");
      }

      setSessions(sessionsData.sessions || []);
      setSecurityStatus(statusData.security);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load security data.");
    } finally {
      setSecurityLoading(false);
    }
  };

  const changePassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (newPassword.length < 12) {
      setError("Your new password must contain at least 12 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }

    try {
      setSecurityBusy(true);
      setError("");
      setMessage("");
      const response = await fetch(`${API_URL}/api/auth/change-password`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword, revokeOtherSessions })
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Password change failed.");
      }
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setRevokeOtherSessions(false);
      setMessage(data.message || "Password changed successfully.");
      await loadSecurityData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to change password.");
    } finally {
      setSecurityBusy(false);
    }
  };

  const revokeSession = async (sessionId: string, isCurrent: boolean) => {
    const confirmed = window.confirm(
      isCurrent
        ? "Revoke this session? You will be logged out of this device."
        : "Revoke this device session?"
    );
    if (!confirmed) return;

    try {
      setSecurityBusy(true);
      setError("");
      const response = await fetch(
        `${API_URL}/api/auth/sessions/${encodeURIComponent(sessionId)}`,
        { method: "DELETE", credentials: "include" }
      );
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to revoke session.");
      }
      if (isCurrent) {
        window.location.href = "/login";
        return;
      }
      setMessage(data.message || "Session revoked successfully.");
      await loadSecurityData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to revoke session.");
    } finally {
      setSecurityBusy(false);
    }
  };

  const logoutAllDevices = async () => {
    if (!window.confirm("This will log you out of every device, including this one. Continue?")) return;
    try {
      setSecurityBusy(true);
      setError("");
      const response = await fetch(`${API_URL}/api/auth/logout-all`, {
        method: "POST",
        credentials: "include"
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to log out all devices.");
      }
      window.location.href = "/login";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to log out all devices.");
      setSecurityBusy(false);
    }
  };

  const startTwoFactorSetup = async () => {
    try {
      setSecurityBusy(true);
      setError("");
      setMessage("");
      const response = await fetch(`${API_URL}/api/auth/2fa/setup`, {
        method: "POST",
        credentials: "include"
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to start two-factor setup.");
      }
      setTwoFactorSetup({ qrCode: data.qrCode, manualEntryKey: data.manualEntryKey });
      setMessage("Scan the QR code with your authenticator app.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to start 2FA setup.");
    } finally {
      setSecurityBusy(false);
    }
  };

  const verifyTwoFactorSetup = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setSecurityBusy(true);
      setError("");
      setMessage("");
      const response = await fetch(`${API_URL}/api/auth/2fa/verify-setup`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: twoFactorCode })
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Verification failed.");
      }
      setRecoveryCodes(data.recoveryCodes || []);
      setTwoFactorCode("");
      setTwoFactorSetup(null);
      setMessage(data.message || "Two-factor authentication enabled.");
      await loadSecurityData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to verify authenticator code.");
    } finally {
      setSecurityBusy(false);
    }
  };

  const disableTwoFactor = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!window.confirm("Are you sure you want to disable two-factor authentication?")) return;
    try {
      setSecurityBusy(true);
      setError("");
      setMessage("");
      const response = await fetch(`${API_URL}/api/auth/2fa/disable`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: twoFactorPassword, code: twoFactorCode })
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to disable two-factor authentication.");
      }
      setTwoFactorPassword("");
      setTwoFactorCode("");
      setRecoveryCodes([]);
      setMessage(data.message || "Two-factor authentication disabled.");
      await loadSecurityData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to disable 2FA.");
    } finally {
      setSecurityBusy(false);
    }
  };

  const copyRecoveryCodes = async () => {
    try {
      await navigator.clipboard.writeText(recoveryCodes.join("\n"));
      setMessage("Recovery codes copied. Store them somewhere safe.");
    } catch {
      setError("Unable to copy recovery codes. Please copy them manually.");
    }
  };

  useEffect(() => {
    if (activeSection === "security") {
      loadSecurityData();
    }
    // loadSecurityData is intentionally called only when the selected section changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSection]);

  const selectSection = (section: string) => {
    setActiveSection(section);
    setMessage("");
    setError("");
  };

  const Toggle = ({
    label,
    description,
    checked,
    onChange
  }: {
    label: string;
    description: string;
    checked: boolean;
    onChange: (value: boolean) => void;
  }) => (
    <div className="flex items-center justify-between gap-4 border-b border-border py-5 last:border-0">
      <div>
        <p className="text-sm font-semibold">{label}</p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          {description}
        </p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          checked ? "bg-[#641C32]" : "bg-muted-foreground/30"
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
            checked ? "left-6" : "left-1"
          }`}
        />
      </button>
    </div>
  );

  const Field = ({
    label,
    value,
    onChange,
    placeholder,
    type = "text",
    maxLength,
    disabled = false
  }: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    type?: string;
    maxLength?: number;
    disabled?: boolean;
  }) => (
    <div>
      <label className="mb-2 block text-sm font-semibold">{label}</label>
      <input
        type={type}
        value={value}
        maxLength={maxLength}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-[#641C32] focus:ring-2 focus:ring-[#641C32]/10 disabled:cursor-not-allowed disabled:opacity-60"
      />
    </div>
  );

  const Card = ({
    title,
    description,
    children
  }: {
    title: string;
    description?: string;
    children: ReactNode;
  }) => (
    <section className="rounded-2xl border border-border bg-card p-5 sm:p-7">
      <div className="mb-5">
        <h2 className="text-lg font-bold">{title}</h2>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {children}
    </section>
  );

  const SaveButton = ({ label }: { label: string }) => (
    <button
      type="button"
      disabled={saving}
      onClick={savePreferences}
      className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#641C32] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#4F1628] disabled:opacity-60"
    >
      {saving ? (
        <Loader2 size={17} className="animate-spin" />
      ) : (
        <Save size={17} />
      )}
      {saving ? "Saving..." : label}
    </button>
  );

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-background text-foreground">
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 md:block">
        <Sidebar />
      </aside>

      <main className="min-h-screen w-full md:ml-64 md:w-[calc(100%-16rem)]">
        <div className="sticky top-0 z-40 w-full">
          <Topbar />
        </div>

        <div className="mx-auto max-w-7xl space-y-7 px-5 py-8 sm:px-8 lg:px-10">
          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <SettingsIcon size={16} />
              Workspace
              <ChevronRight size={14} />
              Settings
            </div>

            <h1 className="mt-4 text-3xl font-bold tracking-tight">
              Settings
            </h1>

            <p className="mt-2 text-sm text-muted-foreground">
              Manage your profile, account, privacy and ZUNO experience.
            </p>
          </div>

          {message && (
            <div className="flex items-center justify-between gap-3 rounded-xl border border-green-500/30 bg-green-500/5 px-4 py-3 text-sm text-green-600 dark:text-green-400">
              <span className="flex items-center gap-2">
                <Check size={17} />
                {message}
              </span>
              <button onClick={() => setMessage("")} aria-label="Dismiss">
                <X size={16} />
              </button>
            </div>
          )}

          {error && (
            <div className="flex items-center justify-between gap-3 rounded-xl border border-red-500/30 bg-red-500/5 px-4 py-3 text-sm text-red-600 dark:text-red-400">
              <span>{error}</span>
              <button onClick={() => setError("")} aria-label="Dismiss">
                <X size={16} />
              </button>
            </div>
          )}

          {loading ? (
            <div className="flex min-h-64 items-center justify-center gap-3 text-sm text-muted-foreground">
              <Loader2 size={22} className="animate-spin text-[#641C32]" />
              Loading your settings...
            </div>
          ) : (
            <div className="grid items-start gap-6 lg:grid-cols-[240px_1fr]">
              <nav className="rounded-2xl border border-border bg-card p-3">
                <p className="px-3 pb-3 pt-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Settings menu
                </p>

                <div className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
                  {sections.map((section) => {
                    const Icon = section.icon;
                    const active = activeSection === section.id;

                    return (
                      <button
                        key={section.id}
                        onClick={() => selectSection(section.id)}
                        className={`flex shrink-0 items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition lg:w-full ${
                          active
                            ? "bg-[#641C32] text-white"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        }`}
                      >
                        <Icon size={18} />
                        {section.label}
                      </button>
                    );
                  })}
                </div>
              </nav>

              <div className="min-w-0 space-y-5">
                {activeSection === "profile" && (
                  <Card
                    title="Profile information"
                    description="Manage the information displayed on your ZUNO profile."
                  >
                    <form onSubmit={saveProfile} className="space-y-5">
                      <div className="flex items-center gap-4 rounded-xl bg-muted/40 p-4">
                        <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-[#641C32]/15 text-[#641C32]">
                          {profile.profileImage ? (
                            <img
                              src={profile.profileImage}
                              alt="Profile"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <UserRound size={30} />
                          )}
                        </div>

                        <div>
                          <p className="font-semibold">Profile picture</p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            Profile photo uploads require file storage integration.
                          </p>
                          <span className="mt-2 inline-flex items-center gap-2 text-xs text-muted-foreground">
                            <Camera size={14} />
                            Upload photo · Coming soon
                          </span>
                        </div>
                      </div>

                      <Field
                        label="Full name"
                        value={profile.name}
                        onChange={(value) => updateProfile("name", value)}
                        placeholder="Your full name"
                        maxLength={80}
                      />

                      <Field
                        label="Username"
                        value={profile.username}
                        onChange={(value) => updateProfile("username", value)}
                        placeholder="Choose a username"
                        maxLength={30}
                      />

                      <Field
                        label="University"
                        value={profile.university}
                        onChange={(value) => updateProfile("university", value)}
                        placeholder="Your university"
                        maxLength={120}
                      />

                      <Field
                        label="Course"
                        value={profile.course}
                        onChange={(value) => updateProfile("course", value)}
                        placeholder="Your course"
                      />

                      <Field
                        label="Academic year"
                        value={profile.year}
                        onChange={(value) => updateProfile("year", value)}
                        placeholder="Your current year"
                      />

                      <div>
                        <label className="mb-2 block text-sm font-semibold">
                          About you
                        </label>
                        <textarea
                          rows={4}
                          maxLength={500}
                          value={profile.bio}
                          onChange={(event) =>
                            updateProfile("bio", event.target.value)
                          }
                          placeholder="Tell the ZUNO community about yourself..."
                          className="w-full resize-y rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-[#641C32]"
                        />
                        <p className="mt-1 text-right text-xs text-muted-foreground">
                          {profile.bio.length}/500
                        </p>
                      </div>

                      <Field
                        label="Personal website"
                        value={profile.website}
                        onChange={(value) => updateProfile("website", value)}
                        placeholder="https://yourwebsite.com"
                      />

                      <button
                        type="submit"
                        disabled={saving}
                        className="inline-flex items-center gap-2 rounded-xl bg-[#641C32] px-5 py-3 text-sm font-semibold text-white hover:bg-[#4F1628] disabled:opacity-60"
                      >
                        {saving ? (
                          <Loader2 size={17} className="animate-spin" />
                        ) : (
                          <Save size={17} />
                        )}
                        {saving ? "Saving..." : "Save profile"}
                      </button>
                    </form>
                  </Card>
                )}

                {activeSection === "account" && (
                  <Card
                    title="Account information"
                    description="Manage your registered account information."
                  >
                    <div className="space-y-5">
                      <div>
                        <label className="mb-2 block text-sm font-semibold">
                          Email address
                        </label>
                        <div className="relative">
                          <Mail
                            size={17}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                          />
                          <input
                            type="email"
                            value={profile.email}
                            readOnly
                            className="w-full rounded-xl border border-border bg-muted/40 py-3 pl-11 pr-4 text-sm outline-none"
                          />
                        </div>
                      </div>

                      <p className="text-xs leading-6 text-muted-foreground">
                        Your registered email is read-only. Changing it requires
                        a separate email verification process.
                      </p>

                      <Field
                        label="Account type"
                        value="ZUNO Member"
                        onChange={() => {}}
                        disabled
                      />
                    </div>
                  </Card>
                )}

                {activeSection === "appearance" && (
                  <Card
                    title="Appearance"
                    description="Choose how ZUNO looks on your device."
                  >
                    <div className="grid gap-4 sm:grid-cols-3">
                      {[
                        { name: "Light", icon: Sun },
                        { name: "Dark", icon: Moon },
                        { name: "System", icon: Monitor }
                      ].map((item) => {
                        const Icon = item.icon;
                        const active =
                          mounted && theme === item.name.toLowerCase();

                        return (
                          <button
                            key={item.name}
                            onClick={() => setTheme(item.name.toLowerCase())}
                            className={`rounded-2xl border p-5 text-center transition ${
                              active
                                ? "border-[#641C32] bg-[#641C32]/10"
                                : "border-border hover:bg-muted"
                            }`}
                          >
                            <Icon
                              size={27}
                              className="mx-auto mb-3 text-[#641C32]"
                            />
                            <p className="text-sm font-semibold">{item.name}</p>
                            {active && (
                              <span className="mt-2 inline-flex items-center gap-1 text-xs text-[#641C32]">
                                <Check size={13} />
                                Selected
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </Card>
                )}

                {activeSection === "notifications" && (
                  <Card
                    title="Notification preferences"
                    description="Choose which updates you want to receive."
                  >
                    <Toggle
                      label="Platform notifications"
                      description="Receive notifications inside ZUNO."
                      checked={preferences.platformNotifications}
                      onChange={(value) =>
                        updatePreference("platformNotifications", value)
                      }
                    />

                    <Toggle
                      label="Email notifications"
                      description="Receive updates through your registered email."
                      checked={preferences.emailNotifications}
                      onChange={(value) =>
                        updatePreference("emailNotifications", value)
                      }
                    />

                    <Toggle
                      label="Event updates"
                      description="Updates about events and registrations."
                      checked={preferences.eventUpdates}
                      onChange={(value) =>
                        updatePreference("eventUpdates", value)
                      }
                    />

                    <Toggle
                      label="Connection requests"
                      description="Notifications about new connection requests."
                      checked={preferences.connectionRequests}
                      onChange={(value) =>
                        updatePreference("connectionRequests", value)
                      }
                    />

                    <Toggle
                      label="Startup updates"
                      description="Updates from startups and collaborations."
                      checked={preferences.startupUpdates}
                      onChange={(value) =>
                        updatePreference("startupUpdates", value)
                      }
                    />

                    <SaveButton label="Save notification preferences" />
                  </Card>
                )}

                {activeSection === "privacy" && (
                  <Card
                    title="Privacy controls"
                    description="Choose what information other ZUNO members can see."
                  >
                    <Toggle
                      label="Public profile"
                      description="Allow other ZUNO members to discover your profile."
                      checked={preferences.publicProfile}
                      onChange={(value) =>
                        updatePreference("publicProfile", value)
                      }
                    />

                    <Toggle
                      label="Show university"
                      description="Display your university on your profile."
                      checked={preferences.showUniversity}
                      onChange={(value) =>
                        updatePreference("showUniversity", value)
                      }
                    />

                    <Toggle
                      label="Show email address"
                      description="Allow other members to see your email address."
                      checked={preferences.showEmail}
                      onChange={(value) =>
                        updatePreference("showEmail", value)
                      }
                    />

                    <SaveButton label="Save privacy settings" />
                  </Card>
                )}

                {activeSection === "security" && (
                  <div className="space-y-5">
                    {securityLoading ? (
                      <div className="flex min-h-48 items-center justify-center gap-3 text-sm text-muted-foreground">
                        <Loader2 size={22} className="animate-spin text-[#641C32]" />
                        Loading security information...
                      </div>
                    ) : (
                      <>
                        <Card title="Security overview" description="Monitor and protect your ZUNO account.">
                          <div className="grid gap-4 sm:grid-cols-3">
                            <div className="rounded-xl border border-border p-4">
                              <ShieldCheck className="mb-3 text-green-500" size={24} />
                              <p className="text-2xl font-bold">{securityStatus?.twoFactorEnabled ? "Enabled" : "Disabled"}</p>
                              <p className="mt-1 text-xs text-muted-foreground">Two-factor authentication</p>
                            </div>
                            <div className="rounded-xl border border-border p-4">
                              <MonitorSmartphone className="mb-3 text-[#641C32]" size={24} />
                              <p className="text-2xl font-bold">{securityStatus?.activeSessions ?? sessions.length}</p>
                              <p className="mt-1 text-xs text-muted-foreground">Active sessions</p>
                            </div>
                            <div className="rounded-xl border border-border p-4">
                              <KeyRound className="mb-3 text-[#641C32]" size={24} />
                              <p className="text-sm font-bold">{securityStatus?.passwordChangedAt ? new Date(securityStatus.passwordChangedAt).toLocaleDateString() : "Not available"}</p>
                              <p className="mt-1 text-xs text-muted-foreground">Last password change</p>
                            </div>
                          </div>
                          <button type="button" onClick={loadSecurityData} disabled={securityLoading} className="mt-5 inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold hover:bg-muted disabled:opacity-60">
                            <RefreshCw size={16} /> Refresh security information
                          </button>
                        </Card>

                        <Card title="Change password" description="Use a strong password with at least 12 characters.">
                          <form onSubmit={changePassword} className="space-y-4">
                            <Field label="Current password" value={currentPassword} onChange={setCurrentPassword} type="password" placeholder="Enter current password" />
                            <Field label="New password" value={newPassword} onChange={setNewPassword} type="password" placeholder="Enter new password" />
                            <Field label="Confirm new password" value={confirmPassword} onChange={setConfirmPassword} type="password" placeholder="Confirm new password" />
                            <label className="flex items-start gap-3 rounded-xl border border-border p-4">
                              <input type="checkbox" checked={revokeOtherSessions} onChange={(event) => setRevokeOtherSessions(event.target.checked)} className="mt-1 accent-[#641C32]" />
                              <span><span className="block text-sm font-semibold">Log out other devices</span><span className="mt-1 block text-xs text-muted-foreground">Your current session remains active. Other sessions will be revoked.</span></span>
                            </label>
                            <button type="submit" disabled={securityBusy} className="inline-flex items-center gap-2 rounded-xl bg-[#641C32] px-5 py-3 text-sm font-semibold text-white hover:bg-[#4F1628] disabled:opacity-60">
                              {securityBusy ? <Loader2 size={17} className="animate-spin" /> : <LockKeyhole size={17} />} Change password
                            </button>
                          </form>
                        </Card>

                        <Card title="Active sessions" description="Review devices currently signed in to your ZUNO account.">
                          {sessions.length === 0 ? <p className="text-sm text-muted-foreground">No active sessions found.</p> : (
                            <div className="space-y-4">
                              {sessions.map((session) => (
                                <div key={session.sessionId} className="flex flex-col gap-4 rounded-xl border border-border p-4 sm:flex-row sm:items-center sm:justify-between">
                                  <div className="flex min-w-0 items-start gap-3">
                                    <div className="rounded-xl bg-[#641C32]/10 p-3 text-[#641C32]"><Smartphone size={22} /></div>
                                    <div className="min-w-0">
                                      <div className="flex flex-wrap items-center gap-2">
                                        <p className="break-all text-sm font-semibold">{session.device || "Unknown device"}</p>
                                        {session.current && <span className="rounded-full bg-green-500/10 px-2 py-1 text-xs font-semibold text-green-600">This device</span>}
                                      </div>
                                      <p className="mt-1 text-xs text-muted-foreground">IP address: {session.ipAddress || "Unavailable"}</p>
                                      <p className="mt-1 text-xs text-muted-foreground">Signed in: {new Date(session.createdAt).toLocaleString()}</p>
                                      <p className="mt-1 text-xs text-muted-foreground">Last active: {new Date(session.lastActiveAt).toLocaleString()}</p>
                                    </div>
                                  </div>
                                  <button type="button" onClick={() => revokeSession(session.sessionId, session.current)} disabled={securityBusy} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-red-500/30 px-4 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-500/10 disabled:opacity-50"><X size={16} /> Revoke session</button>
                                </div>
                              ))}
                            </div>
                          )}
                          <button type="button" onClick={logoutAllDevices} disabled={securityBusy || sessions.length === 0} className="mt-5 inline-flex items-center gap-2 rounded-xl border border-red-500/30 px-4 py-3 text-sm font-semibold text-red-500 hover:bg-red-500/10 disabled:opacity-50"><LogOut size={17} /> Log out all devices</button>
                        </Card>

                        <Card title="Two-factor authentication" description="Add another layer of protection using an authenticator app.">
                          {securityStatus?.twoFactorEnabled ? (
                            <div className="space-y-5">
                              <div className="flex items-center gap-3 rounded-xl border border-green-500/30 bg-green-500/5 p-4">
                                <ShieldCheck size={24} className="text-green-500" />
                                <div><p className="text-sm font-semibold">Two-factor authentication is enabled</p><p className="mt-1 text-xs text-muted-foreground">Your account has an additional verification step.</p></div>
                              </div>
                              <form onSubmit={disableTwoFactor} className="space-y-4">
                                <Field label="Current password" value={twoFactorPassword} onChange={setTwoFactorPassword} type="password" placeholder="Enter your current password" />
                                <Field label="Authenticator or recovery code" value={twoFactorCode} onChange={setTwoFactorCode} placeholder="Enter verification code" />
                                <button type="submit" disabled={securityBusy} className="inline-flex items-center gap-2 rounded-xl border border-red-500/30 px-4 py-3 text-sm font-semibold text-red-500 hover:bg-red-500/10 disabled:opacity-50">Disable two-factor authentication</button>
                              </form>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              <div className="rounded-xl border border-border p-4">
                                <div className="flex items-center gap-3"><ShieldCheck size={23} className="text-[#641C32]" /><div><p className="text-sm font-semibold">Authenticator app protection</p><p className="mt-1 text-xs text-muted-foreground">Use an authenticator app to generate verification codes.</p></div></div>
                              </div>
                              {!twoFactorSetup ? (
                                <button type="button" onClick={startTwoFactorSetup} disabled={securityBusy} className="inline-flex items-center gap-2 rounded-xl bg-[#641C32] px-5 py-3 text-sm font-semibold text-white hover:bg-[#4F1628] disabled:opacity-50"><Shield size={17} /> Set up two-factor authentication</button>
                              ) : (
                                <div className="space-y-5">
                                  <div className="rounded-xl border border-border p-5">
                                    <p className="mb-3 text-sm font-semibold">Step 1: Scan this QR code</p>
                                    <img src={twoFactorSetup.qrCode} alt="Authenticator setup QR code" className="mx-auto h-52 w-52 rounded-xl border border-border bg-white p-2" />
                                    <p className="mt-4 text-center text-xs text-muted-foreground">Scan using Google Authenticator, Microsoft Authenticator, or another compatible authenticator app.</p>
                                    <div className="mt-4 rounded-xl bg-muted/50 p-3"><p className="text-xs font-semibold">Manual setup key</p><p className="mt-2 break-all font-mono text-sm">{twoFactorSetup.manualEntryKey}</p></div>
                                  </div>
                                  <form onSubmit={verifyTwoFactorSetup} className="space-y-4">
                                    <p className="text-sm font-semibold">Step 2: Verify your authenticator</p>
                                    <Field label="Six-digit verification code" value={twoFactorCode} onChange={setTwoFactorCode} placeholder="Enter code from authenticator app" />
                                    <button type="submit" disabled={securityBusy || !twoFactorCode.trim()} className="inline-flex items-center gap-2 rounded-xl bg-[#641C32] px-5 py-3 text-sm font-semibold text-white hover:bg-[#4F1628] disabled:opacity-50"><Check size={17} /> Verify and enable</button>
                                    <button type="button" onClick={() => { setTwoFactorSetup(null); setTwoFactorCode(""); }} className="ml-3 rounded-xl border border-border px-4 py-3 text-sm font-semibold hover:bg-muted">Cancel setup</button>
                                  </form>
                                </div>
                              )}
                            </div>
                          )}
                          {recoveryCodes.length > 0 && (
                            <div className="mt-6 rounded-xl border border-amber-500/30 bg-amber-500/5 p-5">
                              <h3 className="font-semibold text-amber-600">Save your recovery codes</h3>
                              <p className="mt-2 text-xs leading-5 text-muted-foreground">These codes are displayed now. Store them somewhere secure. Each code should be used only once.</p>
                              <div className="my-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
                                {recoveryCodes.map((code) => <code key={code} className="rounded-lg border border-border bg-background p-2 text-center text-sm">{code}</code>)}
                              </div>
                              <button type="button" onClick={copyRecoveryCodes} className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold hover:bg-muted"><Copy size={16} /> Copy recovery codes</button>
                              <button type="button" onClick={() => setRecoveryCodes([])} className="ml-3 rounded-xl bg-[#641C32] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#4F1628]">I have saved them</button>
                            </div>
                          )}
                        </Card>
                      </>
                    )}
                  </div>
                )}

                {activeSection === "preferences" && (
                  <Card
                    title="General preferences"
                    description="Customize your ZUNO experience."
                  >
                    <div>
                      <label className="mb-2 block text-sm font-semibold">
                        Language
                      </label>
                      <select
                        value={preferences.language}
                        onChange={(event) =>
                          updatePreference("language", event.target.value)
                        }
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-[#641C32]"
                      >
                        <option>English</option>
                        <option>Telugu</option>
                        <option>Hindi</option>
                      </select>
                    </div>

                    <div className="mt-5 rounded-xl border border-border p-4">
                      <div className="flex items-center gap-3">
                        <Globe size={21} className="text-[#641C32]" />
                        <div>
                          <p className="text-sm font-semibold">
                            Regional preferences
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            Your language preference is saved with your account.
                          </p>
                        </div>
                      </div>
                    </div>

                    <SaveButton label="Save preferences" />
                  </Card>
                )}
              </div>
            </div>
          )}

          <footer className="border-t border-border py-5 text-center text-xs text-muted-foreground">
            ZUNO · Discover. Connect. Build. Grow.
          </footer>
        </div>
      </main>
    </div>
  );
}
