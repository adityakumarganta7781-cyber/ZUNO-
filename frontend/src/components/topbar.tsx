
"use client";

import { useEffect, useState } from "react";
import type { ElementType, FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  ChevronDown,
  Search,
  X,
  UserRound,
  Settings,
  Compass,
  LogOut,
  Loader2,
  Users,
  GraduationCap,
  Globe,
  FileText,
  BookOpen,
} from "lucide-react";

import ThemeToggle from "@/components/theme-toggle";
import { useAuth } from "@/context/AuthContext";

type SearchResult = {
  id: string;
  type: string;
  title: string;
  description?: string;
  href?: string;
};

type SearchResponse = {
  success: boolean;
  totalResults: number;
  results: {
    students: SearchResult[];
    universities: SearchResult[];
    communities: SearchResult[];
    posts: SearchResult[];
    resources: SearchResult[];
  };
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

const categoryIcons: Record<string, ElementType> = {
  student: Users,
  university: GraduationCap,
  community: Globe,
  post: FileText,
  resource: BookOpen,
};

const categoryLabels: Record<string, string> = {
  student: "Student",
  university: "University",
  community: "Community",
  post: "Community Post",
  resource: "Learning Resource",
};

export default function Topbar() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const displayName = user?.name || "ZUNO Member";

  const initials =
    displayName
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("") || "Z";

  useEffect(() => {
    const query = search.trim();

    if (query.length < 2 || !searchOpen) {
      setSearchResults([]);
      setSearchLoading(false);
      return;
    }

    const controller = new AbortController();

    const timeout = setTimeout(async () => {
      try {
        setSearchLoading(true);

        const response = await fetch(
          `${API_URL}/api/search?q=${encodeURIComponent(query)}`,
          {
            method: "GET",
            credentials: "include",
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          throw new Error("Search request failed");
        }

        const data: SearchResponse = await response.json();

        if (data.success && data.results) {
          const combinedResults = [
            ...(data.results.students || []),
            ...(data.results.universities || []),
            ...(data.results.communities || []),
            ...(data.results.posts || []),
            ...(data.results.resources || []),
          ];

          setSearchResults(combinedResults.slice(0, 8));
        } else {
          setSearchResults([]);
        }
      } catch (error) {
        if (error instanceof Error && error.name !== "AbortError") {
          console.error("Global search error:", error);
          setSearchResults([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setSearchLoading(false);
        }
      }
    }, 350);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [search, searchOpen]);

  const clearSearch = () => {
    setSearch("");
    setSearchResults([]);
    setSearchOpen(false);
  };

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const query = search.trim();

    if (query.length < 2) return;

    setSearchOpen(false);
    setSearchResults([]);
    setSearch("");
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  const handleSuggestionClick = (result: SearchResult) => {
    const fallbackHref = `/search?q=${encodeURIComponent(search.trim())}`;
    const destination = result.href || fallbackHref;

    clearSearch();
    setNotificationsOpen(false);
    setProfileOpen(false);

    router.push(destination);
  };

  const handleLogout = async () => {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      await logout();
    } finally {
      setLoggingOut(false);
      setProfileOpen(false);
    }
  };

  const handleViewAllResults = () => {
    const query = search.trim();

    if (query.length < 2) return;

    setSearchOpen(false);
    setSearchResults([]);
    setSearch("");
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <header className="relative z-20 flex min-h-20 flex-wrap items-center justify-between gap-4 border-b border-border bg-card px-5 py-4 md:px-8">
      <div>
        <h2 className="text-lg font-semibold">
          Welcome{user?.name ? `, ${user.name.split(" ")[0]}` : " to ZUNO"}
        </h2>

        <p className="text-sm text-gray-500">
          Discover. Connect. Build. Grow.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <form
            onSubmit={handleSearch}
            className="flex items-center gap-2 rounded-xl bg-muted px-3 py-2"
          >
            <button type="submit" aria-label="Search ZUNO">
              <Search size={18} />
            </button>

            <input
              type="search"
              value={search}
              onFocus={() => setSearchOpen(true)}
              onChange={(e) => {
                setSearch(e.target.value);
                setSearchOpen(true);
              }}
              placeholder="Search ZUNO..."
              className="w-32 bg-transparent text-sm text-foreground outline-none sm:w-48"
            />

            {searchLoading && (
              <Loader2
                size={16}
                className="animate-spin text-primary"
              />
            )}

            {search && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={clearSearch}
              >
                <X size={15} />
              </button>
            )}
          </form>

          {searchOpen && search.trim().length >= 2 && (
            <div className="absolute right-0 top-14 z-[60] w-80 max-w-[90vw] overflow-hidden rounded-2xl border border-border bg-card shadow-2xl sm:w-96">
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <p className="text-sm font-semibold">
                  Search Results
                </p>

                <span className="text-xs text-gray-500">
                  {searchLoading
                    ? "Searching..."
                    : `${searchResults.length} found`}
                </span>
              </div>

              {searchLoading ? (
                <div className="flex items-center justify-center gap-2 px-4 py-8 text-sm text-gray-500">
                  <Loader2 size={18} className="animate-spin" />
                  Searching ZUNO...
                </div>
              ) : searchResults.length > 0 ? (
                <div className="max-h-80 overflow-y-auto">
                  {searchResults.map((result, index) => {
                    const Icon =
                      categoryIcons[result.type] || Search;

                    return (
                      <button
                        key={`${result.type}-${result.id}-${index}`}
                        type="button"
                        onClick={() => handleSuggestionClick(result)}
                        className="flex w-full items-center gap-3 border-b border-border px-4 py-3 text-left transition hover:bg-muted"
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          <Icon size={17} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">
                            {result.title}
                          </p>

                          <p className="truncate text-xs text-gray-500">
                            {categoryLabels[result.type] || result.type}
                            {result.description
                              ? ` · ${result.description}`
                              : ""}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="px-4 py-8 text-center">
                  <Search
                    size={25}
                    className="mx-auto mb-2 text-gray-400"
                  />

                  <p className="text-sm font-medium">
                    No results found
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    Try another keyword.
                  </p>
                </div>
              )}

              <button
                type="button"
                onClick={handleViewAllResults}
                disabled={searchLoading}
                className="w-full bg-primary/5 px-4 py-3 text-sm font-semibold text-primary transition hover:bg-primary/10 disabled:opacity-50"
              >
                View all results →
              </button>
            </div>
          )}
        </div>

        <ThemeToggle />

        <div className="relative">
          <button
            type="button"
            aria-label="Notifications"
            aria-expanded={notificationsOpen}
            onClick={() => {
              setNotificationsOpen(!notificationsOpen);
              setProfileOpen(false);
              setSearchOpen(false);
            }}
            className="rounded-xl p-2 transition hover:bg-muted"
          >
            <Bell size={20} />
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 top-12 z-50 w-72 rounded-2xl border border-border bg-card p-4 shadow-xl">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-semibold">Notifications</h3>

                <button
                  type="button"
                  aria-label="Close notifications"
                  onClick={() => setNotificationsOpen(false)}
                >
                  <X size={17} />
                </button>
              </div>

              <p className="text-sm text-gray-500">
                Your latest ZUNO notifications will appear here.
              </p>
            </div>
          )}
        </div>

        <div className="relative">
          <button
            type="button"
            aria-expanded={profileOpen}
            onClick={() => {
              setProfileOpen(!profileOpen);
              setNotificationsOpen(false);
              setSearchOpen(false);
            }}
            className="flex items-center gap-2 rounded-xl p-2 transition hover:bg-muted"
          >
            {user?.profileImage ? (
              <img
                src={user.profileImage}
                alt="Profile"
                className="h-9 w-9 rounded-full border border-border object-cover"
              />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                {initials}
              </div>
            )}

            <span className="hidden max-w-32 truncate text-sm font-medium sm:block">
              {displayName}
            </span>

            <ChevronDown size={16} />
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-14 z-50 w-64 rounded-2xl border border-border bg-card p-2 shadow-xl">
              <div className="border-b border-border px-3 py-3">
                <p className="truncate text-sm font-semibold">
                  {displayName}
                </p>

                <p className="mt-1 truncate text-xs text-gray-500">
                  {user?.email || "ZUNO Student"}
                </p>

                {user?.role && (
                  <span className="mt-2 inline-block rounded-full bg-primary/10 px-2 py-1 text-[10px] font-medium capitalize text-primary">
                    {user.role}
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={() => {
                  setProfileOpen(false);
                  router.push("/discover");
                }}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm transition hover:bg-muted"
              >
                <Compass size={17} />
                Explore ZUNO
              </button>

              <button
                type="button"
                onClick={() => {
                  setProfileOpen(false);
                  router.push("/settings");
                }}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm transition hover:bg-muted"
              >
                <UserRound size={17} />
                My Profile
              </button>

              <button
                type="button"
                onClick={() => {
                  setProfileOpen(false);
                  router.push("/settings");
                }}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm transition hover:bg-muted"
              >
                <Settings size={17} />
                Settings
              </button>

              <div className="my-1 border-t border-border" />

              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm text-red-500 transition hover:bg-red-500/10 disabled:opacity-50"
              >
                {loggingOut ? (
                  <Loader2 size={17} className="animate-spin" />
                ) : (
                  <LogOut size={17} />
                )}

                {loggingOut ? "Logging out..." : "Logout"}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
