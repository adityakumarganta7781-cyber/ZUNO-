
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/sidebar";
import Topbar from "@/components/topbar";
import { useAuth } from "@/context/AuthContext";
import {
  ArrowUpRight,
  Compass,
  Users,
  FolderKanban,
  Sparkles,
  Plus,
  ArrowRight,
  Bell,
  MessageCircle,
  UsersRound,
  Bookmark,
  BookOpen,
  RefreshCw,
  Loader2,
  Clock,
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

type DashboardData = {
  profile: {
    name: string;
    email: string;
    university?: string;
    course?: string;
    year?: string;
    bio?: string;
    profileImage?: string;
  };
  statistics: {
    totalConnections: number;
    pendingRequests: number;
    communitiesJoined: number;
    publishedResources: number;
    myResources: number;
    savedResources: number;
    unreadNotifications: number;
    totalConversations: number;
    unreadMessages: number;
  };
  recentNotifications: {
    _id: string;
    title: string;
    message: string;
    type: string;
    isRead: boolean;
    createdAt: string;
    sender?: {
      _id?: string;
      name?: string;
      profileImage?: string;
    };
  }[];
  recentMessages: {
    _id: string;
    text: string;
    isRead: boolean;
    createdAt: string;
    sender?: {
      _id?: string;
      name?: string;
      profileImage?: string;
    };
    receiver?: {
      _id?: string;
      name?: string;
      profileImage?: string;
    };
  }[];
};

const quickLinks = [
  {
    title: "Discover",
    description: "Explore courses, startups and opportunities",
    icon: Compass,
    href: "/discover",
  },
  {
    title: "Network",
    description: "Build meaningful connections",
    icon: Users,
    href: "/network",
  },
  {
    title: "Projects",
    description: "Turn your ideas into reality",
    icon: FolderKanban,
    href: "/projects",
  },
];

function formatDate(date: string) {
  const value = new Date(date);

  if (Number.isNaN(value.getTime())) return "Recently";

  return value.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/dashboard`, {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      const data = await response.json();

      if (response.status === 401) {
        router.replace("/login");
        return;
      }

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to load dashboard.");
      }

      setDashboard(data.dashboard);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to connect to the ZUNO server."
      );
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    fetchDashboard();
  }, [authLoading, user, router, fetchDashboard]);

  const profile = dashboard?.profile;
  const statistics = dashboard?.statistics;

  const stats = [
    {
      title: "Connections",
      value: statistics?.totalConnections ?? 0,
      description: "Your growing student network",
      icon: Users,
      href: "/network",
    },
    {
      title: "Pending Requests",
      value: statistics?.pendingRequests ?? 0,
      description: "Connection requests waiting",
      icon: UsersRound,
      href: "/network",
    },
    {
      title: "Communities Joined",
      value: statistics?.communitiesJoined ?? 0,
      description: "Communities you belong to",
      icon: UsersRound,
      href: "/discover",
    },
    {
      title: "Saved Resources",
      value: statistics?.savedResources ?? 0,
      description: "Your bookmarked resources",
      icon: Bookmark,
      href: "/knowledge-hub",
    },
    {
      title: "My Resources",
      value: statistics?.myResources ?? 0,
      description: "Resources you have published",
      icon: BookOpen,
      href: "/knowledge-hub",
    },
    {
      title: "Unread Messages",
      value: statistics?.unreadMessages ?? 0,
      description: "Messages waiting for you",
      icon: MessageCircle,
      href: "/network",
    },
  ];

  if (authLoading || (loading && !dashboard && !error)) {
    return (
      <div className="min-h-screen grid place-items-center bg-background text-foreground">
        <div className="text-center">
          <Loader2 className="mx-auto animate-spin text-primary" size={35} />
          <p className="mt-4 text-sm text-gray-500">
            Loading your ZUNO Dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 md:block">
        <Sidebar />
      </aside>

      <div className="min-h-screen w-full md:ml-64 md:w-[calc(100%-16rem)]">
        <div className="sticky top-0 z-40 w-full">
          <Topbar />
        </div>

        <main className="mx-auto w-full max-w-7xl space-y-9 px-5 py-8 md:px-9">
          {error && (
            <div className="flex flex-col gap-4 rounded-2xl border border-red-500/30 bg-red-500/5 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold text-red-500">
                  Dashboard connection failed
                </p>
                <p className="mt-1 text-sm text-gray-500">{error}</p>
              </div>

              <button
                onClick={fetchDashboard}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white"
              >
                <RefreshCw size={16} />
                Retry
              </button>
            </div>
          )}

          {/* Burgundy Hero Banner */}
          <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#641C32] via-[#762B45] to-[#8F5368] p-7 text-white md:p-10">
            <div className="relative z-10 max-w-2xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs">
                <Sparkles size={14} />
                YOUR GLOBAL ECOSYSTEM
              </div>

              <h1 className="text-3xl font-bold leading-tight md:text-5xl">
                Welcome{profile?.name ? `, ${profile.name.split(" ")[0]}` : ""}.
                <br />
                Discover more.
                <br />
                Build something meaningful.
              </h1>

              <p className="mt-5 max-w-lg text-sm leading-7 text-white/80 md:text-base">
                Connect with talented people, discover opportunities,
                collaborate on projects and turn your ideas into impact.
              </p>

              {profile?.university && (
                <p className="mt-3 text-sm text-white/80">
                  {profile.university}
                  {profile.course ? ` · ${profile.course}` : ""}
                  {profile.year ? ` · ${profile.year}` : ""}
                </p>
              )}

              <Link
                href="/discover"
                className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#641C32] transition hover:bg-[#F8F3F4]"
              >
                Explore ZUNO
                <ArrowUpRight size={17} />
              </Link>
            </div>

            <div className="pointer-events-none absolute -right-16 -top-24 h-80 w-80 rounded-full border border-white/10" />
            <div className="pointer-events-none absolute -bottom-48 right-20 h-96 w-96 rounded-full border border-white/10" />
          </section>

          <section>
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">Your overview</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Your ZUNO journey begins here.
                </p>
              </div>

              <button
                onClick={fetchDashboard}
                disabled={loading}
                title="Refresh dashboard"
                className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-medium transition hover:bg-muted disabled:opacity-50"
              >
                <RefreshCw
                  size={14}
                  className={loading ? "animate-spin" : ""}
                />
                Refresh
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {stats.map((stat) => {
                const Icon = stat.icon;

                return (
                  <Link
                    key={stat.title}
                    href={stat.href}
                    className="block rounded-2xl border border-border bg-card p-6 transition hover:-translate-y-1 hover:border-primary/50"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-muted text-primary">
                        <Icon size={21} />
                      </div>
                      <ArrowUpRight size={18} className="text-gray-400" />
                    </div>

                    <p className="mt-6 text-3xl font-bold">{stat.value}</p>
                    <p className="mt-1 font-medium">{stat.title}</p>
                    <p className="mt-2 text-xs text-gray-500">
                      {stat.description}
                    </p>
                  </Link>
                );
              })}
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold">Recent Notifications</h2>
                  <p className="mt-1 text-xs text-gray-500">
                    Your latest ZUNO updates
                  </p>
                </div>

                <div className="relative rounded-xl bg-muted p-3 text-primary">
                  <Bell size={20} />
                  {(statistics?.unreadNotifications ?? 0) > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] text-white">
                      {statistics?.unreadNotifications}
                    </span>
                  )}
                </div>
              </div>

              {dashboard?.recentNotifications.length ? (
                <div className="space-y-4">
                  {dashboard.recentNotifications.map((notification) => (
                    <div
                      key={notification._id}
                      className="flex gap-3 border-b border-border pb-4 last:border-0 last:pb-0"
                    >
                      <div className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-primary" />

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="text-sm font-semibold">
                            {notification.title}
                          </p>

                          {!notification.isRead && (
                            <span className="rounded-full bg-primary/10 px-2 py-1 text-[10px] text-primary">
                              NEW
                            </span>
                          )}
                        </div>

                        <p className="mt-1 text-sm text-gray-500">
                          {notification.message}
                        </p>

                        <p className="mt-2 text-xs text-gray-400">
                          {formatDate(notification.createdAt)}
                          {notification.sender?.name
                            ? ` · ${notification.sender.name}`
                            : ""}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <Bell className="mx-auto text-gray-400" size={28} />
                  <p className="mt-3 text-sm text-gray-500">
                    No notifications yet.
                  </p>
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold">Recent Messages</h2>
                  <p className="mt-1 text-xs text-gray-500">
                    Your latest conversations
                  </p>
                </div>

                <div className="rounded-xl bg-muted p-3 text-primary">
                  <MessageCircle size={20} />
                </div>
              </div>

              {dashboard?.recentMessages.length ? (
                <div className="space-y-4">
                  {dashboard.recentMessages.map((message) => {
                    const isSender =
                      message.sender?._id === user?.id ||
                      message.sender?.name === profile?.name;

                    const contact = isSender
                      ? message.receiver?.name
                      : message.sender?.name;

                    return (
                      <div
                        key={message._id}
                        className="flex gap-3 border-b border-border pb-4 last:border-0 last:pb-0"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                          {(contact || "U").charAt(0).toUpperCase()}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold">
                            {contact || "ZUNO Member"}
                          </p>

                          <p className="mt-1 truncate text-sm text-gray-500">
                            {message.text}
                          </p>

                          <p className="mt-2 flex items-center gap-1 text-xs text-gray-400">
                            <Clock size={12} />
                            {formatDate(message.createdAt)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <MessageCircle className="mx-auto text-gray-400" size={28} />
                  <p className="mt-3 text-sm text-gray-500">
                    No messages yet.
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    Start connecting with other students.
                  </p>
                </div>
              )}
            </div>
          </section>

          <section>
            <div className="mb-5">
              <h2 className="text-xl font-bold">Explore the ecosystem</h2>
              <p className="mt-1 text-sm text-gray-500">
                Find your next opportunity to discover and create.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {quickLinks.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.title}
                    href={item.href}
                    className="block rounded-2xl border border-border bg-card p-6 transition hover:-translate-y-1 hover:border-primary/50"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted text-primary">
                      <Icon size={23} />
                    </div>

                    <h3 className="mt-5 font-semibold">{item.title}</h3>

                    <p className="mt-2 text-sm text-gray-500">
                      {item.description}
                    </p>

                    <div className="mt-5 flex items-center gap-2 text-xs font-semibold text-primary">
                      EXPLORE NOW
                      <ArrowRight size={15} />
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          <section className="rounded-2xl border border-dashed border-border bg-card p-7 text-center md:p-10">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted text-primary">
              <Plus size={23} />
            </div>

            <h2 className="mt-4 text-lg font-bold">
              Your journey starts with an idea.
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
              Publish projects, discover collaborators and showcase your
              achievements as the ZUNO ecosystem grows.
            </p>
          </section>

          <footer className="border-t border-border py-6 text-center text-xs text-gray-500">
            ZUNO © 2026 · DISCOVER. CONNECT. BUILD. GROW.
          </footer>
        </main>
      </div>
    </div>
  );
}
