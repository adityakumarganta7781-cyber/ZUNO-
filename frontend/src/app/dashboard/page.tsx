
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

  // Shared sidebar state
  const [menuOpen, setMenuOpen] = useState(false);

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

  const sidebarWidth = menuOpen ? "256px" : "76px";

  return (
    <div className="min-h-screen w-full bg-[#FFF8FC] text-[#30101F]">

      {/* Sidebar: width is controlled by the same state as main content */}
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

      {/* Main content moves with the sidebar */}
      <div
        className="min-h-screen w-full transition-[margin-left,width] duration-300 ease-in-out"
        style={{
          marginLeft: `var(--zuno-sidebar-width)`,
          width: `calc(100% - var(--zuno-sidebar-width))`,
          "--zuno-sidebar-width": sidebarWidth,
        } as React.CSSProperties}
      >
        <div className="sticky top-0 z-40 w-full">
          <Topbar />
        </div>

        <main className="mx-auto w-full max-w-[1600px] space-y-8 px-5 py-7 md:px-8 xl:px-10">

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
          <section className="relative isolate min-h-[390px] overflow-hidden rounded-[30px] bg-gradient-to-br from-[#3D0B25] via-[#641C32] to-[#A83E70] p-7 text-white shadow-[0_22px_60px_rgba(100,28,50,0.20)] md:min-h-[420px] md:p-10 xl:p-12">
            <div
              aria-hidden="true"
              className="absolute inset-y-0 right-0 z-0 w-full opacity-35 md:w-[58%] md:opacity-100"
              style={{
                backgroundImage:
                  "linear-gradient(90deg, #641C32 0%, rgba(100,28,50,0.72) 24%, rgba(61,11,37,0.05) 100%), url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1400&q=85')",
                backgroundPosition: "center",
                backgroundSize: "cover",
              }}
            />
            <div className="pointer-events-none absolute -right-20 top-[-110px] h-80 w-80 rounded-full border border-white/15" />
            <div className="pointer-events-none absolute right-[28%] top-10 h-48 w-48 rounded-full bg-[#F2A6C5]/20 blur-3xl" />
            <div className="relative z-10 max-w-2xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs">
                <Sparkles size={14} />
                YOUR GLOBAL CAMPUS ECOSYSTEM
              </div>

              <h1 className="max-w-[680px] text-3xl font-extrabold leading-[1.08] tracking-tight md:text-5xl xl:text-[58px]">
                Discover ideas.
                <br />
                Connect people.
                <br />
                <span className="text-[#F6A9CB] italic">Build impact. ✨</span>
              </h1>

              <p className="mt-5 max-w-lg text-sm leading-7 text-white/85 md:text-base">
                A student-first platform to explore opportunities, collaborate
                on projects, grow your network and turn ideas into reality.
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
              <Link
                href="/projects"
                className="mt-7 ml-3 inline-flex items-center gap-2 rounded-xl border border-white/60 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
              >
                Create Project
                <Plus size={17} />
              </Link>
            </div>

            <div className="pointer-events-none absolute -bottom-48 right-20 h-96 w-96 rounded-full border border-white/15" />
            <div className="pointer-events-none absolute bottom-5 right-8 hidden rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-xs font-semibold leading-6 text-white/90 backdrop-blur-md md:block">
              STUDENTS ✦ PROJECTS ✦ STARTUPS
              <br />
              OPPORTUNITIES ✦ COMMUNITY
            </div>
          </section>

          {/* Overview */}
          <section>
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight text-[#30101F]">Your Overview ✨</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Track, connect and grow on ZUNO.
                </p>
              </div>

              <button
                onClick={fetchDashboard}
                disabled={loading}
                title="Refresh dashboard"
                className="flex items-center gap-2 rounded-xl border border-[#F1C9D9] bg-white px-4 py-2.5 text-xs font-semibold text-[#641C32] shadow-sm transition hover:-translate-y-0.5 hover:shadow-md disabled:opacity-50"
              >
                <RefreshCw
                  size={14}
                  className={loading ? "animate-spin" : ""}
                />
                Refresh
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                const cardStyles = [
                  "from-[#FFF0F6] to-[#FCE1EE]",
                  "from-[#F5ECFF] to-[#EBDDFF]",
                  "from-[#FFF3E8] to-[#FFE5D2]",
                  "from-[#FFEAF3] to-[#FAD8E8]",
                  "from-[#F1EAFF] to-[#E6D9FF]",
                  "from-[#FFF0E5] to-[#FFE1CA]",
                ];

                return (
                  <Link
                    key={stat.title}
                    href={stat.href}
                    className={`group block rounded-[24px] border border-white/90 bg-gradient-to-br ${cardStyles[index]} p-5 shadow-[0_8px_24px_rgba(75,20,48,0.07)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_32px_rgba(75,20,48,0.13)]`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/75 text-[#641C32] shadow-sm">
                        <Icon size={21} />
                      </div>
                      <ArrowUpRight size={19} className="text-[#641C32]/65 transition group-hover:-translate-y-1 group-hover:translate-x-1" />
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

          {/* Notifications and Messages */}
          <section className="grid gap-6 lg:grid-cols-2">

            {/* Recent Notifications */}
            <div className="rounded-[24px] border border-[#F3D8E4] bg-white/90 p-6 shadow-[0_8px_28px_rgba(75,20,48,0.05)]">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold">Recent Notifications</h2>
                  <p className="mt-1 text-xs text-gray-500">
                    Your latest ZUNO updates
                  </p>
                </div>

                <div className="relative rounded-2xl bg-[#FCE8F1] p-3 text-[#641C32]">
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

            {/* Recent Messages */}
            <div className="rounded-[24px] border border-[#F3D8E4] bg-white/90 p-6 shadow-[0_8px_28px_rgba(75,20,48,0.05)]">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold">Recent Messages</h2>
                  <p className="mt-1 text-xs text-gray-500">
                    Your latest conversations
                  </p>
                </div>

                <div className="rounded-2xl bg-[#F1E8FF] p-3 text-[#641C32]">
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

          {/* Explore the Ecosystem */}
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
                    className="block rounded-[24px] border border-[#F3D8E4] bg-white p-6 shadow-[0_8px_24px_rgba(75,20,48,0.05)] transition duration-300 hover:-translate-y-1 hover:border-[#DFA2BB] hover:shadow-lg"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FCE8F1] text-[#641C32]">
                      <Icon size={23} />
                    </div>

                    <h3 className="mt-5 font-semibold">{item.title}</h3>

                    <p className="mt-2 text-sm text-gray-500">
                      {item.description}
                    </p>

                    <div className="mt-5 flex items-center gap-2 text-xs font-bold text-[#8B244B]">
                      EXPLORE NOW
                      <ArrowRight size={15} />
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* Getting Started */}
          <section className="rounded-[26px] border border-dashed border-[#DFA2BB] bg-gradient-to-r from-[#FFF0F6] via-white to-[#F2EBFF] p-7 text-center md:p-10">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#641C32] shadow-sm">
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

          {/* Footer */}
          <footer className="border-t border-[#F1DCE5] py-6 text-center text-xs text-[#8B7180]">
            ZUNO © 2026 · DISCOVER. CONNECT. BUILD. GROW.
          </footer>

        </main>
      </div>
    </div>
  );
}
