
"use client";

import { useEffect, useState, type FormEvent } from "react";
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
} from "lucide-react";

import Sidebar from "@/components/sidebar";
import Topbar from "@/components/topbar";

type Profile = {
  name: string;
  username: string;
  email: string;
  university: string;
  bio: string;
  website: string;
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
};

const defaultProfile: Profile = {
  name: "",
  username: "",
  email: "",
  university: "",
  bio: "",
  website: "",
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
};

const sections = [
  { id: "profile", label: "Profile", icon: UserRound },
  { id: "account", label: "Account", icon: Shield },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "privacy", label: "Privacy", icon: Eye },
  { id: "security", label: "Security", icon: LockKeyhole },
  { id: "preferences", label: "Preferences", icon: Globe },
];

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();

  const [activeSection, setActiveSection] = useState("profile");
  const [profile, setProfile] = useState(defaultProfile);
  const [preferences, setPreferences] = useState(defaultPreferences);
  const [mounted, setMounted] = useState(false);
  const [message, setMessage] = useState("");
  const [language, setLanguage] = useState("English");
  const [menuOpen, setMenuOpen] = useState(true);

  useEffect(() => {
    setMounted(true);

    try {
      const storedProfile = localStorage.getItem("zuno-settings-profile");
      const storedPreferences = localStorage.getItem(
        "zuno-settings-preferences"
      );
      const storedLanguage = localStorage.getItem("zuno-settings-language");

      if (storedProfile) {
        setProfile({ ...defaultProfile, ...JSON.parse(storedProfile) });
      }

      if (storedPreferences) {
        setPreferences({
          ...defaultPreferences,
          ...JSON.parse(storedPreferences),
        });
      }

      if (storedLanguage) {
        setLanguage(storedLanguage);
      }
    } catch {
      setMessage("Unable to load some saved preferences.");
    }
  }, []);

  const updateProfile = (key: keyof Profile, value: string) => {
    setProfile((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  const updatePreference = (key: keyof Preferences, value: boolean) => {
    setPreferences((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  const saveProfile = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      localStorage.setItem("zuno-settings-profile", JSON.stringify(profile));
      setMessage("Profile preferences saved on this device.");
    } catch {
      setMessage("Unable to save your profile preferences.");
    }
  };

  const savePreferences = () => {
    try {
      localStorage.setItem(
        "zuno-settings-preferences",
        JSON.stringify(preferences)
      );
      localStorage.setItem("zuno-settings-language", language);
      setMessage("Your preferences have been saved on this device.");
    } catch {
      setMessage("Unable to save your preferences.");
    }
  };

  const selectSection = (section: string) => {
    setActiveSection(section);
    setMessage("");
  };

  const Toggle = ({
    label,
    description,
    checked,
    onChange,
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
  }: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    type?: string;
    maxLength?: number;
  }) => (
    <div>
      <label className="mb-2 block text-sm font-semibold">{label}</label>
      <input
        type={type}
        value={value}
        maxLength={maxLength}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-[#641C32] focus:ring-2 focus:ring-[#641C32]/10"
      />
    </div>
  );

  const Card = ({
    title,
    description,
    children,
  }: {
    title: string;
    description?: string;
    children: React.ReactNode;
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

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-background text-foreground">
      <aside
        className={`fixed inset-y-0 left-0 z-50 hidden md:block transition-[width] duration-300 ease-in-out ${
          menuOpen ? "w-64" : "w-[76px]"
        }`}
      >
        <Sidebar
          menuOpen={menuOpen}
          onMenuToggle={() => setMenuOpen((previous) => !previous)}
        />
      </aside>

      <div
        className={`min-h-screen w-full transition-[margin-left,width] duration-300 ease-in-out ${
          menuOpen
            ? "md:ml-64 md:w-[calc(100%-16rem)]"
            : "md:ml-[76px] md:w-[calc(100%-76px)]"
        }`}
      >
        <div className="sticky top-0 z-40 w-full">
          <Topbar />
        </div>

        <main className="mx-auto w-full max-w-7xl space-y-7 px-5 py-8 sm:px-8 lg:px-10">
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
              <button
                onClick={() => setMessage("")}
                aria-label="Dismiss"
              >
                <X size={16} />
              </button>
            </div>
          )}

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
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#641C32]/10 text-[#641C32] dark:text-[#D7A9B8]">
                        <UserRound size={30} />
                      </div>

                      <div>
                        <p className="font-semibold">Profile picture</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Profile photo uploads will be enabled with file storage.
                        </p>
                        <button
                          type="button"
                          disabled
                          className="mt-2 inline-flex cursor-not-allowed items-center gap-2 text-xs font-semibold text-muted-foreground"
                        >
                          <Camera size={14} />
                          Upload photo
                        </button>
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
                      className="inline-flex items-center gap-2 rounded-xl bg-[#641C32] px-5 py-3 text-sm font-semibold text-white hover:bg-[#4D1426]"
                    >
                      <Save size={17} />
                      Save profile
                    </button>
                  </form>
                </Card>
              )}

              {activeSection === "account" && (
                <Card
                  title="Account information"
                  description="Manage your account contact information."
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
                          onChange={(event) =>
                            updateProfile("email", event.target.value)
                          }
                          placeholder="your@email.com"
                          className="w-full rounded-xl border border-border bg-background py-3 pl-11 pr-4 text-sm outline-none focus:border-[#641C32]"
                        />
                      </div>
                    </div>

                    <p className="text-xs leading-6 text-muted-foreground">
                      Email changes will require account authentication and
                      email verification when the account API is implemented.
                    </p>

                    <button
                      onClick={() =>
                        setMessage("Account details are currently stored locally only.")
                      }
                      className="rounded-xl bg-[#641C32] px-5 py-3 text-sm font-semibold text-white hover:bg-[#4D1426]"
                    >
                      Save account details
                    </button>
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
                      { name: "System", icon: Monitor },
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
                            className="mx-auto mb-3 text-[#641C32] dark:text-[#D7A9B8]"
                          />
                          <p className="text-sm font-semibold">{item.name}</p>
                          {active && (
                            <span className="mt-2 inline-flex items-center gap-1 text-xs text-[#641C32] dark:text-[#D7A9B8]">
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

                  <button
                    onClick={savePreferences}
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#641C32] px-5 py-3 text-sm font-semibold text-white hover:bg-[#4D1426]"
                  >
                    <Save size={17} />
                    Save notification preferences
                  </button>
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

                  <button
                    onClick={savePreferences}
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#641C32] px-5 py-3 text-sm font-semibold text-white hover:bg-[#4D1426]"
                  >
                    <Save size={17} />
                    Save privacy settings
                  </button>
                </Card>
              )}

              {activeSection === "security" && (
                <Card
                  title="Security and password"
                  description="Protect your ZUNO account."
                >
                  <div className="rounded-xl border border-border p-4">
                    <div className="flex items-center gap-3">
                      <LockKeyhole
                        size={22}
                        className="text-[#641C32] dark:text-[#D7A9B8]"
                      />
                      <div>
                        <p className="text-sm font-semibold">
                          Password management
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Change password and manage account security.
                        </p>
                      </div>
                    </div>

                    <button
                      disabled
                      className="mt-5 cursor-not-allowed rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-muted-foreground"
                    >
                      Change password · Coming soon
                    </button>
                  </div>

                  <div className="mt-4 rounded-xl border border-border p-4">
                    <div className="flex items-center gap-3">
                      <Shield
                        size={22}
                        className="text-[#641C32] dark:text-[#D7A9B8]"
                      />
                      <div>
                        <p className="text-sm font-semibold">
                          Account protection
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Login sessions and additional security controls.
                        </p>
                      </div>
                    </div>

                    <p className="mt-4 text-xs text-muted-foreground">
                      Session management and two-factor authentication will
                      be implemented with the authentication backend.
                    </p>
                  </div>
                </Card>
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
                      value={language}
                      onChange={(event) => setLanguage(event.target.value)}
                      className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-[#641C32]"
                    >
                      <option>English</option>
                      <option>Telugu</option>
                      <option>Hindi</option>
                    </select>
                  </div>

                  <div className="mt-5 rounded-xl border border-border p-4">
                    <div className="flex items-center gap-3">
                      <Globe
                        size={21}
                        className="text-[#641C32] dark:text-[#D7A9B8]"
                      />
                      <div>
                        <p className="text-sm font-semibold">
                          Regional preferences
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Additional regional and content preferences can be
                          configured here in a future update.
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={savePreferences}
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#641C32] px-5 py-3 text-sm font-semibold text-white hover:bg-[#4D1426]"
                  >
                    <Save size={17} />
                    Save preferences
                  </button>
                </Card>
              )}
            </div>
          </div>

          <footer className="border-t border-border py-5 text-center text-xs text-muted-foreground">
            ZUNO · Discover. Connect. Build. Grow.
          </footer>
        </main>
      </div>
    </div>
  );
}
