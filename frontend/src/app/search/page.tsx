
"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  Users,
  GraduationCap,
  Globe,
  FileText,
  BookOpen,
  Loader2,
  ArrowRight,
  X,
  RefreshCw,
  Sparkles,
  MapPin,
  Building2,
} from "lucide-react";

import Sidebar from "@/components/sidebar";
import Topbar from "@/components/topbar";

type SearchResult = {
  id: string;
  type: "student" | "university" | "community" | "post" | "resource";
  title: string;
  description?: string;
  image?: string;
  href?: string;
  category?: string;
  membersCount?: number;
  community?: string;
  subject?: string;
  resourceType?: string;
  resourceUrl?: string;
  uploadedBy?: string;
};

type SearchResults = {
  students: SearchResult[];
  universities: SearchResult[];
  communities: SearchResult[];
  posts: SearchResult[];
  resources: SearchResult[];
};

type SearchResponse = {
  success: boolean;
  message?: string;
  query?: string;
  totalResults: number;
  results: SearchResults;
};

type Category = {
  id: string;
  label: string;
  icon: React.ElementType;
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

const categories: Category[] = [
  { id: "all", label: "All Results", icon: Sparkles },
  { id: "students", label: "Students", icon: Users },
  { id: "universities", label: "Universities", icon: GraduationCap },
  { id: "communities", label: "Communities", icon: Globe },
  { id: "posts", label: "Posts", icon: FileText },
  { id: "resources", label: "Resources", icon: BookOpen },
];

const emptyResults: SearchResults = {
  students: [],
  universities: [],
  communities: [],
  posts: [],
  resources: [],
};

const typeLabels: Record<string, string> = {
  student: "Student",
  university: "University",
  community: "Community",
  post: "Community Post",
  resource: "Learning Resource",
};

const typeIcons: Record<string, React.ElementType> = {
  student: Users,
  university: GraduationCap,
  community: Globe,
  post: FileText,
  resource: BookOpen,
};

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const urlQuery = searchParams.get("q") || "";

  const [input, setInput] = useState(urlQuery);
  const [activeCategory, setActiveCategory] = useState("all");
  const [data, setData] = useState<SearchResults>(emptyResults);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [menuOpen, setMenuOpen] = useState(true);

  const fetchResults = useCallback(
    async (query: string, signal?: AbortSignal) => {
      if (query.trim().length < 2) {
        setData(emptyResults);
        setTotalResults(0);
        setError("Enter at least two characters to search.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/api/search?q=${encodeURIComponent(query.trim())}`,
          {
            method: "GET",
            credentials: "include",
            signal,
          }
        );

        const result: SearchResponse = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message || "Unable to load search results."
          );
        }

        setData(result.results || emptyResults);
        setTotalResults(result.totalResults || 0);
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
          setError(err.message || "Something went wrong. Please try again.");
          setData(emptyResults);
          setTotalResults(0);
        }
      } finally {
        if (!signal?.aborted) {
          setLoading(false);
        }
      }
    },
    []
  );

  useEffect(() => {
    setInput(urlQuery);

    if (!urlQuery.trim()) {
      setData(emptyResults);
      setTotalResults(0);
      setError("");
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    fetchResults(urlQuery, controller.signal);

    return () => controller.abort();
  }, [urlQuery, fetchResults]);

  const categoryCounts = useMemo(
    () => ({
      students: data.students.length,
      universities: data.universities.length,
      communities: data.communities.length,
      posts: data.posts.length,
      resources: data.resources.length,
    }),
    [data]
  );

  const filteredResults = useMemo(() => {
    if (activeCategory === "all") {
      return [
        ...data.students,
        ...data.universities,
        ...data.communities,
        ...data.posts,
        ...data.resources,
      ];
    }

    return data[activeCategory as keyof SearchResults] || [];
  }, [activeCategory, data]);

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const query = input.trim();

    if (query.length < 2) {
      setError("Please enter at least two characters.");
      return;
    }

    setError("");
    setActiveCategory("all");
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  const openResult = (result: SearchResult) => {
    if (result.href) {
      router.push(result.href);
    } else if (result.type === "resource" && result.resourceUrl) {
      window.open(result.resourceUrl, "_blank", "noopener,noreferrer");
    }
  };

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

        <main className="mx-auto w-full max-w-7xl px-5 py-8 md:px-8">
          <section className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-[#641C32] via-[#762B45] to-[#8F5368] p-7 text-white shadow-lg md:p-10">
            <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-20 right-1/3 h-48 w-48 rounded-full bg-white/10 blur-3xl" />

            <div className="relative z-10">
              <div className="mb-4 flex items-center gap-2 text-sm font-medium text-white/80">
                <Sparkles size={17} />
                ZUNO DISCOVERY
              </div>

              <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                Search across ZUNO.
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/85 md:text-base">
                Find students, universities, communities, discussions and
                learning resources from one place.
              </p>

              <form
                onSubmit={handleSearch}
                className="mt-7 flex max-w-3xl items-center gap-2 rounded-2xl bg-white p-2 shadow-xl"
              >
                <Search className="ml-3 shrink-0 text-gray-500" size={21} />

                <input
                  type="search"
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="What are you looking for?"
                  className="min-w-0 flex-1 bg-transparent px-2 py-3 text-sm text-gray-900 outline-none placeholder:text-gray-400"
                />

                {input && (
                  <button
                    type="button"
                    onClick={() => {
                      setInput("");
                      setError("");
                    }}
                    aria-label="Clear search"
                    className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                  >
                    <X size={17} />
                  </button>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="flex shrink-0 items-center gap-2 rounded-xl bg-[#641C32] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#4D1426] disabled:opacity-60"
                >
                  Search
                  <ArrowRight size={16} />
                </button>
              </form>
            </div>
          </section>

          <section className="mb-7">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold">Explore results</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {urlQuery
                    ? `Showing results for "${urlQuery}"`
                    : "Search for anything across the ZUNO ecosystem."}
                </p>
              </div>

              {urlQuery && !loading && !error && (
                <div className="rounded-xl bg-[#641C32]/10 px-4 py-2 text-sm font-semibold text-[#641C32] dark:text-[#D7A9B8]">
                  {totalResults} results found
                </div>
              )}
            </div>

            <div className="flex gap-2 overflow-x-auto pb-3">
              {categories.map((category) => {
                const Icon = category.icon;
                const count =
                  category.id === "all"
                    ? totalResults
                    : categoryCounts[
                        category.id as keyof typeof categoryCounts
                      ];

                const active = activeCategory === category.id;

                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setActiveCategory(category.id)}
                    className={`flex shrink-0 items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition ${
                      active
                        ? "border-[#641C32] bg-[#641C32] text-white shadow-md"
                        : "border-border bg-card text-foreground hover:bg-muted"
                    }`}
                  >
                    <Icon size={17} />
                    {category.label}
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        active
                          ? "bg-white/20 text-white"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {loading && (
            <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-border bg-card">
              <Loader2 size={34} className="animate-spin text-[#641C32]" />
              <p className="mt-4 font-semibold">Searching ZUNO...</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Finding relevant results for you.
              </p>
            </div>
          )}

          {!loading && error && (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center">
              <Search size={32} className="mx-auto text-red-500" />
              <h3 className="mt-3 font-semibold">Search unavailable</h3>
              <p className="mt-2 text-sm text-muted-foreground">{error}</p>

              <button
                type="button"
                onClick={() => fetchResults(urlQuery)}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#641C32] px-5 py-3 text-sm font-semibold text-white hover:bg-[#4D1426]"
              >
                <RefreshCw size={16} />
                Try again
              </button>
            </div>
          )}

          {!loading && !error && !urlQuery && (
            <div className="rounded-2xl border border-border bg-card px-6 py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#641C32]/10 text-[#641C32] dark:text-[#D7A9B8]">
                <Search size={30} />
              </div>
              <h3 className="mt-5 text-lg font-bold">
                Start exploring ZUNO
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                Search for students, universities, communities, posts and
                learning materials using the search bar above.
              </p>
            </div>
          )}

          {!loading &&
            !error &&
            urlQuery &&
            filteredResults.length === 0 && (
              <div className="rounded-2xl border border-border bg-card px-6 py-16 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                  <Search size={30} />
                </div>

                <h3 className="mt-5 text-lg font-bold">
                  No results found
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                  We couldn't find anything matching "{urlQuery}" in this
                  category. Try another keyword or choose a different category.
                </p>

                {activeCategory !== "all" && (
                  <button
                    type="button"
                    onClick={() => setActiveCategory("all")}
                    className="mt-5 rounded-xl bg-[#641C32] px-5 py-3 text-sm font-semibold text-white hover:bg-[#4D1426]"
                  >
                    View all categories
                  </button>
                )}
              </div>
            )}

          {!loading && !error && filteredResults.length > 0 && (
            <section>
              <div className="mb-5 flex items-center justify-between">
                <h3 className="font-semibold">
                  {activeCategory === "all"
                    ? "All matching results"
                    : categories.find((item) => item.id === activeCategory)
                        ?.label}
                </h3>

                <span className="text-sm text-muted-foreground">
                  {filteredResults.length} items
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {filteredResults.map((result, index) => {
                  const Icon = typeIcons[result.type] || Search;

                  return (
                    <article
                      key={`${result.type}-${result.id}-${index}`}
                      className="group flex min-w-0 gap-4 rounded-2xl border border-border bg-card p-5 transition duration-200 hover:-translate-y-1 hover:border-[#8F5368]/50 hover:shadow-lg"
                    >
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#641C32]/10 text-[#641C32] dark:text-[#D7A9B8]">
                        {result.image ? (
                          <img
                            src={result.image}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <Icon size={23} />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-[#641C32]/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#641C32] dark:text-[#D7A9B8]">
                            {typeLabels[result.type] || result.type}
                          </span>

                          {result.category && (
                            <span className="text-xs text-muted-foreground">
                              {result.category}
                            </span>
                          )}
                        </div>

                        <h4 className="truncate font-semibold">
                          {result.title}
                        </h4>

                        {result.description && (
                          <p className="mt-1 line-clamp-2 text-sm leading-5 text-muted-foreground">
                            {result.description}
                          </p>
                        )}

                        {result.type === "community" &&
                          typeof result.membersCount === "number" && (
                            <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                              <Users size={13} />
                              {result.membersCount} members
                            </p>
                          )}

                        {result.type === "university" && (
                          <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin size={13} />
                            University
                          </p>
                        )}

                        {result.type === "resource" && (
                          <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                            <Building2 size={13} />
                            {result.subject ||
                              result.resourceType ||
                              "Learning material"}
                            {result.uploadedBy
                              ? ` · Uploaded by ${result.uploadedBy}`
                              : ""}
                          </p>
                        )}

                        {result.type === "post" && result.community && (
                          <p className="mt-2 text-xs text-muted-foreground">
                            Posted in {result.community}
                          </p>
                        )}

                        <button
                          type="button"
                          onClick={() => openResult(result)}
                          disabled={!result.href && !(result.type === "resource" && result.resourceUrl)}
                          className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#641C32] transition group-hover:gap-3 disabled:cursor-not-allowed disabled:opacity-50 dark:text-[#D7A9B8]"
                        >
                          Explore
                          <ArrowRight size={16} />
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          )}

          <footer className="mt-12 border-t border-border py-6 text-center text-xs text-muted-foreground">
            ZUNO — Discover. Connect. Build. Grow.
          </footer>
        </main>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background">
          <Loader2 size={32} className="animate-spin text-[#641C32]" />
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
