
"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  BookOpen,
  Search,
  Bookmark,
  BookmarkCheck,
  Code2,
  Dna,
  BrainCircuit,
  BriefcaseBusiness,
  FlaskConical,
  Cpu,
  Globe,
  GraduationCap,
  FileText,
  Video,
  Link as LinkIcon,
  Plus,
  X,
  ArrowUpRight,
  LoaderCircle,
  RefreshCw,
  Sparkles,
  Library,
  Lightbulb,
  ExternalLink,
} from "lucide-react";
import Sidebar from "@/components/sidebar";
import Topbar from "@/components/topbar";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

const categories = [
  { name: "All Topics", icon: Globe },
  { name: "Programming", icon: Code2 },
  { name: "Biotechnology", icon: Dna },
  { name: "Artificial Intelligence", icon: BrainCircuit },
  { name: "Engineering", icon: Cpu },
  { name: "Research", icon: FlaskConical },
  { name: "Business", icon: BriefcaseBusiness },
  { name: "Science", icon: GraduationCap },
  { name: "Other", icon: BookOpen },
];

const contentTypes = [
  "All Types",
  "Article",
  "Tutorial",
  "Study Guide",
  "Video",
  "Research Paper",
  "External Resource",
];

const tabs = [
  { name: "Discover", icon: Globe },
  { name: "Saved Resources", icon: Bookmark },
  { name: "My Contributions", icon: Library },
];

type Resource = {
  _id: string;
  title: string;
  description: string;
  category: string;
  type: string;
  author?: string;
  university?: string;
  url?: string;
  createdAt?: string;
};

const emptyForm = {
  title: "",
  description: "",
  category: "Programming",
  type: "Article",
  url: "",
};

export default function KnowledgeHubPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [activeTab, setActiveTab] = useState("Discover");
  const [activeCategory, setActiveCategory] = useState("All Topics");
  const [activeType, setActiveType] = useState("All Types");
  const [search, setSearch] = useState("");

  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [showSubmit, setShowSubmit] = useState(false);
  const [selectedResource, setSelectedResource] =
    useState<Resource | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [menuOpen, setMenuOpen] = useState(true);

  const loadResources = async () => {
    setLoading(true);
    setApiError("");

    try {
      const response = await fetch(`${API_URL}/api/knowledge-hub`);

      if (!response.ok) {
        throw new Error(
          response.status === 404
            ? "The Knowledge Hub API has not been created in the backend yet."
            : `Unable to load resources. Server returned ${response.status}.`
        );
      }

      const result = await response.json();
      const records = Array.isArray(result)
        ? result
        : result.resources || result.data || [];

      setResources(records);
    } catch (error) {
      setApiError(
        error instanceof Error
          ? error.message
          : "Could not connect to the Knowledge Hub service."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResources();

    try {
      const stored = localStorage.getItem("zuno-knowledge-saved");
      if (stored) {
        setSavedIds(JSON.parse(stored));
      }
    } catch {
      setSavedIds([]);
    }
  }, []);

  const filteredResources = useMemo(() => {
    return resources.filter((resource) => {
      const matchesSearch = [
        resource.title,
        resource.description,
        resource.category,
        resource.type,
        resource.author,
        resource.university,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        activeCategory === "All Topics" ||
        resource.category === activeCategory;

      const matchesType =
        activeType === "All Types" || resource.type === activeType;

      const matchesSaved =
        activeTab !== "Saved Resources" ||
        savedIds.includes(resource._id);

      return (
        matchesSearch &&
        matchesCategory &&
        matchesType &&
        matchesSaved
      );
    });
  }, [
    resources,
    search,
    activeCategory,
    activeType,
    activeTab,
    savedIds,
  ]);

  const toggleSave = (id: string) => {
    setSavedIds((previous) => {
      const updated = previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id];

      try {
        localStorage.setItem(
          "zuno-knowledge-saved",
          JSON.stringify(updated)
        );
      } catch {
        setApiError("Unable to save bookmarks in this browser.");
      }

      return updated;
    });
  };

  const submitResource = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setApiError("");
    setSuccessMessage("");

    try {
      const response = await fetch(`${API_URL}/api/knowledge-hub`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          result.message || "Unable to submit the resource."
        );
      }

      const created = result.resource || result.data || result;

      if (created._id) {
        setResources((previous) => [created, ...previous]);
      } else {
        await loadResources();
      }

      setForm(emptyForm);
      setShowSubmit(false);
      setActiveTab("Discover");
      setSuccessMessage("Your resource was submitted successfully.");
    } catch (error) {
      setApiError(
        error instanceof Error
          ? error.message
          : "Unable to submit your resource."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const resetFilters = () => {
    setSearch("");
    setActiveCategory("All Topics");
    setActiveType("All Types");
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Video":
        return Video;
      case "Research Paper":
        return FlaskConical;
      case "Tutorial":
        return Code2;
      case "External Resource":
        return LinkIcon;
      default:
        return FileText;
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

        <main className="mx-auto w-full max-w-7xl space-y-8 px-5 py-8 sm:px-8 lg:px-10">
          <section className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-[#641C32]/10 via-background to-[#8F5368]/10 p-7 sm:p-10">
            <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-[#641C32]/10 blur-3xl" />

            <div className="relative z-10 max-w-3xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#641C32]/20 bg-[#641C32]/10 px-3 py-1.5 text-xs font-semibold text-[#641C32] dark:text-[#D7A9B8]">
                <Sparkles size={14} />
                LEARN. EXPLORE. SHARE.
              </div>

              <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
                Knowledge grows when
                <span className="block bg-gradient-to-r from-[#641C32] to-[#8F5368] bg-clip-text text-transparent">
                  we share it.
                </span>
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                Explore learning resources, discover new ideas, share
                knowledge and learn from students and creators across
                universities.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <button
                  onClick={() => setActiveTab("Discover")}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#641C32] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#4D1426]"
                >
                  Explore Resources
                  <ArrowUpRight size={17} />
                </button>

                <button
                  onClick={() => setShowSubmit(true)}
                  className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-5 py-3 text-sm font-semibold transition hover:bg-muted"
                >
                  <Plus size={17} />
                  Share Knowledge
                </button>
              </div>
            </div>

            <BookOpen
              size={150}
              strokeWidth={0.8}
              className="pointer-events-none absolute bottom-5 right-8 hidden text-[#641C32]/20 lg:block"
            />
          </section>

          {apiError && (
            <div className="flex flex-col gap-3 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-amber-600 dark:text-amber-400">
                  Knowledge Hub service unavailable
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {apiError}
                </p>
              </div>

              <button
                onClick={loadResources}
                className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium hover:bg-muted"
              >
                <RefreshCw size={15} />
                Retry
              </button>
            </div>
          )}

          {successMessage && (
            <div className="rounded-xl border border-green-500/30 bg-green-500/5 px-4 py-3 text-sm text-green-600 dark:text-green-400">
              {successMessage}
            </div>
          )}

          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              {
                icon: Code2,
                title: "Learn New Skills",
                description: "Explore tutorials and practical learning materials.",
              },
              {
                icon: FlaskConical,
                title: "Explore Research",
                description: "Discover research papers and scientific resources.",
              },
              {
                icon: Library,
                title: "Build Your Library",
                description: "Save and organize resources you find useful.",
              },
              {
                icon: Lightbulb,
                title: "Share Knowledge",
                description: "Contribute useful learning resources to the community.",
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-2xl border border-border bg-card p-5 transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#641C32]/10 text-[#641C32] dark:text-[#D7A9B8]">
                    <Icon size={21} />
                  </div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </section>

          <section className="space-y-5">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                Knowledge library
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Discover and organize learning materials from the ZUNO community.
              </p>
            </div>

            <div className="flex gap-2 overflow-x-auto border-b border-border pb-3">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.name;

                return (
                  <button
                    key={tab.name}
                    onClick={() => setActiveTab(tab.name)}
                    className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition ${
                      active
                        ? "bg-[#641C32] text-white"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <Icon size={17} />
                    {tab.name}
                  </button>
                );
              })}
            </div>

            <div className="grid gap-3 md:grid-cols-[1fr_220px]">
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search resources, topics or authors..."
                  className="w-full rounded-xl border border-border bg-card py-3 pl-11 pr-4 text-sm outline-none focus:border-[#641C32]"
                />
              </div>

              <select
                value={activeType}
                onChange={(event) => setActiveType(event.target.value)}
                className="rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-[#641C32]"
              >
                {contentTypes.map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">Explore by topic</h3>
                <button
                  onClick={() => setActiveCategory("All Topics")}
                  className="text-xs font-semibold text-[#641C32] hover:underline dark:text-[#D7A9B8]"
                >
                  View all
                </button>
              </div>

              <div className="flex gap-2 overflow-x-auto pb-2">
                {categories.map((category) => {
                  const Icon = category.icon;
                  const active = activeCategory === category.name;

                  return (
                    <button
                      key={category.name}
                      onClick={() => setActiveCategory(category.name)}
                      className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-xs font-medium transition ${
                        active
                          ? "border-[#641C32] bg-[#641C32] text-white"
                          : "border-border hover:border-[#8F5368] hover:bg-[#641C32]/5"
                      }`}
                    >
                      <Icon size={15} />
                      {category.name}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">
                  {activeTab === "Saved Resources"
                    ? "Your saved resources"
                    : activeTab === "My Contributions"
                      ? "Your contributions"
                      : "Explore resources"}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  {loading
                    ? "Loading resources..."
                    : `${filteredResources.length} resource${filteredResources.length === 1 ? "" : "s"} found`}
                </p>
              </div>

              <button
                onClick={resetFilters}
                className="text-xs font-semibold text-[#641C32] hover:underline dark:text-[#D7A9B8]"
              >
                Clear filters
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center rounded-2xl border border-border bg-card p-16">
                <LoaderCircle size={30} className="animate-spin text-[#641C32]" />
              </div>
            ) : filteredResources.length > 0 ? (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {filteredResources.map((resource) => {
                  const TypeIcon = getTypeIcon(resource.type);
                  const isSaved = savedIds.includes(resource._id);

                  return (
                    <article
                      key={resource._id}
                      className="flex flex-col rounded-2xl border border-border bg-card p-5 transition hover:-translate-y-1 hover:shadow-lg"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#641C32]/10 text-[#641C32] dark:text-[#D7A9B8]">
                          <TypeIcon size={23} />
                        </div>

                        <button
                          onClick={() => toggleSave(resource._id)}
                          aria-label={isSaved ? "Remove bookmark" : "Save resource"}
                          className="rounded-lg border border-border p-2 text-muted-foreground transition hover:bg-muted hover:text-[#641C32]"
                        >
                          {isSaved ? (
                            <BookmarkCheck size={18} />
                          ) : (
                            <Bookmark size={18} />
                          )}
                        </button>
                      </div>

                      <div className="mt-5 flex-1">
                        <div className="flex flex-wrap gap-2">
                          <span className="rounded-full bg-[#641C32]/10 px-2.5 py-1 text-xs font-medium text-[#641C32] dark:text-[#D7A9B8]">
                            {resource.category}
                          </span>
                          <span className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
                            {resource.type}
                          </span>
                        </div>

                        <h3 className="mt-4 text-lg font-bold">
                          {resource.title}
                        </h3>

                        <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">
                          {resource.description}
                        </p>

                        {(resource.author || resource.university) && (
                          <div className="mt-4 space-y-1 text-xs text-muted-foreground">
                            {resource.author && <p>By {resource.author}</p>}
                            {resource.university && <p>{resource.university}</p>}
                          </div>
                        )}
                      </div>

                      <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                        <button
                          onClick={() => setSelectedResource(resource)}
                          className="text-sm font-semibold text-[#641C32] hover:underline dark:text-[#D7A9B8]"
                        >
                          View details
                        </button>

                        <ArrowUpRight size={18} className="text-muted-foreground" />
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-2xl border border-border bg-card px-6 py-16 text-center">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#641C32]/10 text-[#641C32] dark:text-[#D7A9B8]">
                  {activeTab === "Saved Resources" ? (
                    <Bookmark size={29} />
                  ) : activeTab === "My Contributions" ? (
                    <Library size={29} />
                  ) : (
                    <BookOpen size={29} />
                  )}
                </div>

                <h3 className="text-xl font-bold">
                  {activeTab === "Saved Resources"
                    ? "Your library is waiting"
                    : activeTab === "My Contributions"
                      ? "Share your first resource"
                      : "Discover something worth learning"}
                </h3>

                <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-muted-foreground">
                  {apiError
                    ? "Connect the Knowledge Hub API to retrieve resources from MongoDB."
                    : activeTab === "Saved Resources"
                      ? "Bookmark useful resources and they will appear here."
                      : activeTab === "My Contributions"
                        ? "Resources you contribute will be available in this section."
                        : "No published resources are available yet. Be among the first to contribute to ZUNO."}
                </p>

                {!apiError && activeTab !== "Saved Resources" && (
                  <button
                    onClick={() => setShowSubmit(true)}
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#641C32] px-5 py-3 text-sm font-semibold text-white hover:bg-[#4D1426]"
                  >
                    <Plus size={17} />
                    Share a Resource
                  </button>
                )}
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-border bg-gradient-to-r from-[#641C32]/10 to-[#8F5368]/10 p-6 sm:p-8">
            <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-[#641C32]/10 p-3 text-[#641C32] dark:text-[#D7A9B8]">
                  <Lightbulb size={24} />
                </div>

                <div>
                  <h3 className="text-lg font-bold">
                    Have something valuable to share?
                  </h3>
                  <p className="mt-1 max-w-xl text-sm leading-6 text-muted-foreground">
                    Contribute tutorials, articles, research and learning
                    resources to help students across universities.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowSubmit(true)}
                className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#641C32] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#4D1426]"
              >
                Share Knowledge
                <ArrowUpRight size={17} />
              </button>
            </div>
          </section>

          <footer className="border-t border-border py-5 text-center text-xs text-muted-foreground">
            ZUNO · Discover. Connect. Build. Grow.
          </footer>
        </main>
      </div>

      {showSubmit && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/60 p-4">
          <div className="my-auto w-full max-w-2xl rounded-2xl border border-border bg-card p-6 shadow-2xl sm:p-8">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold">Share knowledge</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Contribute a useful resource to the community.
                </p>
              </div>

              <button
                onClick={() => setShowSubmit(false)}
                className="rounded-lg p-2 text-muted-foreground hover:bg-muted"
                aria-label="Close form"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={submitResource} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Resource title *
                </label>
                <input
                  required
                  maxLength={150}
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Enter the resource title"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-[#641C32]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Description *
                </label>
                <textarea
                  required
                  minLength={20}
                  maxLength={2000}
                  rows={4}
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="Explain what this resource teaches and who can benefit..."
                  className="w-full resize-y rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-[#641C32]"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Category *
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value })
                    }
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-[#641C32]"
                  >
                    {categories.slice(1).map((category) => (
                      <option key={category.name}>{category.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Resource type *
                  </label>
                  <select
                    value={form.type}
                    onChange={(e) =>
                      setForm({ ...form, type: e.target.value })
                    }
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-[#641C32]"
                  >
                    {contentTypes.slice(1).map((type) => (
                      <option key={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Resource URL *
                </label>
                <input
                  required
                  type="url"
                  value={form.url}
                  onChange={(e) => setForm({ ...form, url: e.target.value })}
                  placeholder="https://..."
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-[#641C32]"
                />
              </div>

              {apiError && (
                <p className="rounded-lg bg-red-500/10 p-3 text-sm text-red-500">
                  {apiError}
                </p>
              )}

              <div className="flex flex-col-reverse gap-3 pt-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setShowSubmit(false)}
                  className="rounded-xl border border-border px-5 py-3 text-sm font-semibold hover:bg-muted"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#641C32] px-5 py-3 text-sm font-semibold text-white hover:bg-[#4D1426] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <LoaderCircle size={17} className="animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Plus size={17} />
                      Submit Resource
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedResource && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/60 p-4">
          <div className="my-auto w-full max-w-xl rounded-2xl border border-border bg-card p-6 shadow-2xl sm:p-8">
            <div className="flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#641C32]/10 text-[#641C32]">
                <BookOpen size={24} />
              </div>

              <button
                onClick={() => setSelectedResource(null)}
                className="rounded-lg p-2 text-muted-foreground hover:bg-muted"
                aria-label="Close details"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-full bg-[#641C32]/10 px-3 py-1 text-xs font-medium text-[#641C32]">
                {selectedResource.category}
              </span>
              <span className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                {selectedResource.type}
              </span>
            </div>

            <h2 className="mt-4 text-2xl font-bold">
              {selectedResource.title}
            </h2>

            <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
              {selectedResource.description}
            </p>

            {selectedResource.author && (
              <p className="mt-4 text-sm text-muted-foreground">
                Contributed by {selectedResource.author}
              </p>
            )}

            {selectedResource.url && (
              <a
                href={selectedResource.url}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#641C32] px-5 py-3 text-sm font-semibold text-white hover:bg-[#4D1426]"
              >
                Open Resource
                <ExternalLink size={16} />
              </a>
            )}

            <button
              onClick={() => toggleSave(selectedResource._id)}
              className="ml-2 mt-6 inline-flex items-center gap-2 rounded-xl border border-border px-4 py-3 text-sm font-semibold hover:bg-muted"
            >
              {savedIds.includes(selectedResource._id) ? (
                <BookmarkCheck size={17} />
              ) : (
                <Bookmark size={17} />
              )}
              {savedIds.includes(selectedResource._id) ? "Saved" : "Save"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
