
"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  Rocket,
  Search,
  Plus,
  Users,
  Building2,
  GraduationCap,
  Handshake,
  Bookmark,
  BookmarkCheck,
  Globe,
  Cpu,
  HeartPulse,
  Leaf,
  FlaskConical,
  BriefcaseBusiness,
  X,
  ArrowUpRight,
  LoaderCircle,
  RefreshCw,
  Lightbulb,
  Target,
  ChevronRight,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import Sidebar from "@/components/sidebar";
import Topbar from "@/components/topbar";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

const categories = [
  "Technology & AI",
  "Healthcare & Biotech",
  "Education",
  "Sustainability",
  "Research & Innovation",
  "Business & Finance",
  "Agriculture",
  "Social Impact",
  "Other",
];

const stages = [
  "Idea Stage",
  "MVP Development",
  "Early Stage",
  "Growth Stage",
];

const tabs = [
  { name: "Discover Startups", icon: Rocket },
  { name: "Find Co-founders", icon: Users },
  { name: "My Startups", icon: Building2 },
  { name: "Mentorship", icon: GraduationCap },
  { name: "Funding", icon: Handshake },
];

type Startup = {
  _id: string;
  name: string;
  tagline: string;
  description: string;
  industry: string;
  stage: string;
  university: string;
  website: string;
  founder?: string;
  createdAt?: string;
};

const emptyForm = {
  name: "",
  tagline: "",
  description: "",
  industry: "Technology & AI",
  stage: "Idea Stage",
  university: "",
  website: "",
};

export default function StartupsPage() {
  const [menuOpen, setMenuOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("Discover Startups");
  const [startups, setStartups] = useState<Startup[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [industry, setIndustry] = useState("All Industries");
  const [stage, setStage] = useState("All Stages");

  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [showCreate, setShowCreate] = useState(false);
  const [selectedStartup, setSelectedStartup] =
    useState<Startup | null>(null);

  const [form, setForm] = useState(emptyForm);

  const loadStartups = async () => {
    setLoading(true);
    setApiError("");

    try {
      const response = await fetch(`${API_URL}/api/startups`);

      if (!response.ok) {
        throw new Error(
          response.status === 404
            ? "The startup API has not been created in the backend yet."
            : `Unable to load startups. Server returned ${response.status}.`
        );
      }

      const result = await response.json();

      const records = Array.isArray(result)
        ? result
        : result.startups || result.data || [];

      setStartups(records);
    } catch (error) {
      setApiError(
        error instanceof Error
          ? error.message
          : "Could not connect to the startup service."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStartups();
  }, []);

  const filteredStartups = useMemo(() => {
    return startups.filter((startup) => {
      const matchesSearch = [
        startup.name,
        startup.tagline,
        startup.description,
        startup.industry,
        startup.university,
        startup.founder,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesIndustry =
        industry === "All Industries" ||
        startup.industry === industry;

      const matchesStage =
        stage === "All Stages" || startup.stage === stage;

      const matchesSaved =
        activeTab !== "Saved Startups" ||
        savedIds.includes(startup._id);

      return (
        matchesSearch &&
        matchesIndustry &&
        matchesStage &&
        matchesSaved
      );
    });
  }, [startups, search, industry, stage, activeTab, savedIds]);

  const createStartup = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setApiError("");
    setSuccessMessage("");

    try {
      const response = await fetch(`${API_URL}/api/startups`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          result.message || "Startup creation failed. Check the backend API."
        );
      }

      const createdStartup = result.startup || result.data || result;

      if (createdStartup._id) {
        setStartups((previous) => [createdStartup, ...previous]);
      } else {
        await loadStartups();
      }

      setForm(emptyForm);
      setShowCreate(false);
      setActiveTab("Discover Startups");
      setSuccessMessage("Your startup was published successfully.");
    } catch (error) {
      setApiError(
        error instanceof Error
          ? error.message
          : "Unable to publish your startup."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const toggleSave = (id: string) => {
    setSavedIds((previous) =>
      previous.includes(id)
        ? previous.filter((savedId) => savedId !== id)
        : [...previous, id]
    );
  };

  const resetFilters = () => {
    setSearch("");
    setIndustry("All Industries");
    setStage("All Stages");
  };

  const getTabDescription = () => {
    switch (activeTab) {
      case "Find Co-founders":
        return "Connect with people who share your startup vision and complement your skills.";
      case "My Startups":
        return "Manage startups you have created or joined.";
      case "Mentorship":
        return "Discover mentors and guidance for your startup journey.";
      case "Funding":
        return "Explore funding opportunities, incubators and startup programs.";
      default:
        return "Discover innovative ventures and ideas from the ZUNO ecosystem.";
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

        <div className="mx-auto max-w-7xl space-y-8 px-5 py-8 sm:px-8 lg:px-10">

          <section className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-[#641C32]/15 via-background to-[#8F5368]/15 p-7 sm:p-10">
            <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-[#641C32]/10 blur-3xl" />

            <div className="relative z-10 max-w-3xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#641C32]/20 bg-[#641C32]/10 px-3 py-1.5 text-xs font-semibold text-[#641C32] dark:text-[#D9B8C4]">
                <Sparkles size={14} />
                INNOVATE. CONNECT. BUILD.
              </div>

              <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
                Turn your ideas into
                <span className="block bg-gradient-to-r from-[#641C32] to-[#8F5368] bg-clip-text text-transparent">
                  something extraordinary.
                </span>
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                Discover startups, meet potential co-founders, build teams
                and find the connections that can help your ideas grow.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <button
                  onClick={() => setActiveTab("Discover Startups")}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#641C32] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#4F1628]"
                >
                  Explore Startups
                  <ArrowUpRight size={17} />
                </button>

                <button
                  onClick={() => setShowCreate(true)}
                  className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-5 py-3 text-sm font-semibold transition hover:bg-muted"
                >
                  <Plus size={17} />
                  Create Startup
                </button>
              </div>
            </div>

            <Rocket
              size={150}
              strokeWidth={0.8}
              className="pointer-events-none absolute bottom-5 right-8 hidden text-[#641C32]/20 lg:block"
            />
          </section>

          {apiError && (
            <div className="flex flex-col gap-3 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-amber-600 dark:text-amber-400">
                  Startup service unavailable
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {apiError}
                </p>
              </div>

              <button
                onClick={loadStartups}
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
                icon: Rocket,
                title: "Discover Startups",
                description: "Explore ventures and innovative ideas.",
                tab: "Discover Startups",
              },
              {
                icon: Users,
                title: "Find Co-founders",
                description: "Connect with potential team members.",
                tab: "Find Co-founders",
              },
              {
                icon: GraduationCap,
                title: "Get Mentorship",
                description: "Find guidance for your startup.",
                tab: "Mentorship",
              },
              {
                icon: Handshake,
                title: "Explore Funding",
                description: "Discover incubators and opportunities.",
                tab: "Funding",
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <button
                  key={item.title}
                  onClick={() => setActiveTab(item.tab)}
                  className="rounded-2xl border border-border bg-card p-5 text-left transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#641C32]/10 text-[#641C32] dark:text-[#D9B8C4]">
                    <Icon size={21} />
                  </div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {item.description}
                  </p>
                  <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-[#641C32] dark:text-[#D9B8C4]">
                    Explore <ChevronRight size={14} />
                  </div>
                </button>
              );
            })}
          </section>

          <section className="space-y-5">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                Startup ecosystem
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {getTabDescription()}
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

              <button
                onClick={() => setActiveTab("Saved Startups")}
                className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  activeTab === "Saved Startups"
                    ? "bg-[#641C32] text-white"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Bookmark size={17} />
                Saved
              </button>
            </div>

            {activeTab === "Discover Startups" ||
            activeTab === "Saved Startups" ? (
              <>
                <div className="grid gap-3 md:grid-cols-[1fr_220px_190px]">
                  <div className="relative">
                    <Search
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />
                    <input
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Search startups, founders or industries..."
                      className="w-full rounded-xl border border-border bg-card py-3 pl-11 pr-4 text-sm outline-none focus:border-[#641C32]"
                    />
                  </div>

                  <select
                    value={industry}
                    onChange={(event) => setIndustry(event.target.value)}
                    className="rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-[#641C32]"
                  >
                    <option>All Industries</option>
                    {categories.map((category) => (
                      <option key={category}>{category}</option>
                    ))}
                  </select>

                  <select
                    value={stage}
                    onChange={(event) => setStage(event.target.value)}
                    className="rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-[#641C32]"
                  >
                    <option>All Stages</option>
                    {stages.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    {loading
                      ? "Loading startups..."
                      : `${filteredStartups.length} startup${filteredStartups.length === 1 ? "" : "s"} found`}
                  </p>

                  <button
                    onClick={resetFilters}
                    className="text-xs font-semibold text-[#641C32] hover:underline dark:text-[#D9B8C4]"
                  >
                    Clear filters
                  </button>
                </div>

                {loading ? (
                  <div className="flex justify-center rounded-2xl border border-border bg-card p-16">
                    <LoaderCircle
                      size={30}
                      className="animate-spin text-[#641C32]"
                    />
                  </div>
                ) : filteredStartups.length > 0 ? (
                  <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {filteredStartups.map((startup) => {
                      const saved = savedIds.includes(startup._id);

                      return (
                        <article
                          key={startup._id}
                          className="flex flex-col rounded-2xl border border-border bg-card p-5 transition hover:-translate-y-1 hover:shadow-lg"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#641C32]/10 text-[#641C32] dark:text-[#D9B8C4]">
                              <Rocket size={23} />
                            </div>

                            <button
                              onClick={() => toggleSave(startup._id)}
                              aria-label={
                                saved ? "Remove saved startup" : "Save startup"
                              }
                              className="rounded-lg border border-border p-2 text-muted-foreground transition hover:bg-muted hover:text-[#641C32]"
                            >
                              {saved ? (
                                <BookmarkCheck size={18} />
                              ) : (
                                <Bookmark size={18} />
                              )}
                            </button>
                          </div>

                          <div className="mt-5 flex-1">
                            <div className="flex flex-wrap gap-2">
                              <span className="rounded-full bg-[#641C32]/10 px-2.5 py-1 text-xs font-medium text-[#641C32] dark:text-[#D9B8C4]">
                                {startup.industry}
                              </span>
                              <span className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
                                {startup.stage}
                              </span>
                            </div>

                            <h3 className="mt-4 text-lg font-bold">
                              {startup.name}
                            </h3>

                            <p className="mt-1 text-sm font-medium text-muted-foreground">
                              {startup.tagline}
                            </p>

                            <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">
                              {startup.description}
                            </p>

                            {startup.university && (
                              <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                                <GraduationCap size={15} />
                                {startup.university}
                              </p>
                            )}
                          </div>

                          <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                            <button
                              onClick={() => setSelectedStartup(startup)}
                              className="text-sm font-semibold text-[#641C32] hover:underline dark:text-[#D9B8C4]"
                            >
                              View details
                            </button>

                            <button
                              onClick={() => setSelectedStartup(startup)}
                              className="rounded-lg p-2 text-muted-foreground transition hover:bg-muted"
                              aria-label="Open startup details"
                            >
                              <ArrowUpRight size={18} />
                            </button>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-border bg-card px-6 py-16 text-center">
                    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#641C32]/10 text-[#641C32] dark:text-[#D9B8C4]">
                      {activeTab === "Saved Startups" ? (
                        <Bookmark size={29} />
                      ) : (
                        <Rocket size={29} />
                      )}
                    </div>

                    <h3 className="text-xl font-bold">
                      {apiError
                        ? "Startup data is not available"
                        : activeTab === "Saved Startups"
                          ? "No saved startups yet"
                          : "Your startup discovery starts here"}
                    </h3>

                    <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-muted-foreground">
                      {apiError
                        ? "Connect the startup API to load startup listings from MongoDB."
                        : activeTab === "Saved Startups"
                          ? "Save interesting startups and find them here later."
                          : "There are no published startup listings yet. Create a startup and be among the first founders on ZUNO."}
                    </p>

                    {!apiError && (
                      <button
                        onClick={() => setShowCreate(true)}
                        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#641C32] px-5 py-3 text-sm font-semibold text-white hover:bg-[#4F1628]"
                      >
                        <Plus size={17} />
                        Create a Startup
                      </button>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="rounded-2xl border border-border bg-card px-6 py-16 text-center">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#641C32]/10 text-[#641C32] dark:text-[#D9B8C4]">
                  {activeTab === "Find Co-founders" && <Users size={29} />}
                  {activeTab === "My Startups" && <Building2 size={29} />}
                  {activeTab === "Mentorship" && <GraduationCap size={29} />}
                  {activeTab === "Funding" && <Handshake size={29} />}
                </div>

                <h3 className="text-xl font-bold">
                  {activeTab === "Find Co-founders" &&
                    "Find people to build with"}
                  {activeTab === "My Startups" &&
                    "Your startup workspace"}
                  {activeTab === "Mentorship" &&
                    "Grow with experienced mentors"}
                  {activeTab === "Funding" &&
                    "Explore growth opportunities"}
                </h3>

                <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-muted-foreground">
                  {activeTab === "Find Co-founders" &&
                    "Co-founder profiles, skill matching and collaboration requests will be available when member profiles and authentication are implemented."}
                  {activeTab === "My Startups" &&
                    "Startups you create or join will appear here when membership and user authentication are implemented."}
                  {activeTab === "Mentorship" &&
                    "Mentor profiles, incubator listings and mentorship requests will be added in the next development phase."}
                  {activeTab === "Funding" &&
                    "Funding programs, incubators, pitch decks and application tracking will be added in a later phase."}
                </p>

                {activeTab === "My Startups" && (
                  <button
                    onClick={() => setShowCreate(true)}
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#641C32] px-5 py-3 text-sm font-semibold text-white hover:bg-[#4F1628]"
                  >
                    <Plus size={17} />
                    Create Startup
                  </button>
                )}
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-border bg-gradient-to-r from-[#641C32]/10 to-[#8F5368]/10 p-6 sm:p-8">
            <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-[#641C32]/10 p-3 text-[#641C32] dark:text-[#D9B8C4]">
                  <Lightbulb size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold">
                    Have an idea worth building?
                  </h3>
                  <p className="mt-1 max-w-xl text-sm leading-6 text-muted-foreground">
                    Create your startup profile and take the first step
                    towards building your venture.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowCreate(true)}
                className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#641C32] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#4F1628]"
              >
                Create Startup
                <ArrowUpRight size={17} />
              </button>
            </div>
          </section>

          <footer className="border-t border-border py-5 text-center text-xs text-muted-foreground">
            ZUNO · Discover. Connect. Build. Grow.
          </footer>
        </div>
      </div>

      {showCreate && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/60 p-4">
          <div className="my-auto w-full max-w-2xl rounded-2xl border border-border bg-card p-6 shadow-2xl sm:p-8">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold">Create your startup</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Introduce your venture to the ZUNO ecosystem.
                </p>
              </div>

              <button
                onClick={() => setShowCreate(false)}
                className="rounded-lg p-2 text-muted-foreground hover:bg-muted"
                aria-label="Close form"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={createStartup} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Startup name *
                </label>
                <input
                  required
                  maxLength={80}
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  placeholder="Enter your startup name"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-[#641C32]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Tagline *
                </label>
                <input
                  required
                  maxLength={120}
                  value={form.tagline}
                  onChange={(e) =>
                    setForm({ ...form, tagline: e.target.value })
                  }
                  placeholder="A short description of your startup"
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
                  placeholder="Explain the problem, your solution and your vision..."
                  className="w-full resize-y rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-[#641C32]"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Industry *
                  </label>
                  <select
                    value={form.industry}
                    onChange={(e) =>
                      setForm({ ...form, industry: e.target.value })
                    }
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-[#641C32]"
                  >
                    {categories.map((category) => (
                      <option key={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Startup stage *
                  </label>
                  <select
                    value={form.stage}
                    onChange={(e) =>
                      setForm({ ...form, stage: e.target.value })
                    }
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-[#641C32]"
                  >
                    {stages.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  University
                </label>
                <input
                  value={form.university}
                  onChange={(e) =>
                    setForm({ ...form, university: e.target.value })
                  }
                  placeholder="University or institution"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-[#641C32]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Website
                </label>
                <input
                  type="url"
                  value={form.website}
                  onChange={(e) =>
                    setForm({ ...form, website: e.target.value })
                  }
                  placeholder="https://yourstartup.com"
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
                  onClick={() => setShowCreate(false)}
                  className="rounded-xl border border-border px-5 py-3 text-sm font-semibold hover:bg-muted"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#641C32] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#4F1628] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <LoaderCircle size={17} className="animate-spin" />
                      Publishing...
                    </>
                  ) : (
                    <>
                      <Rocket size={17} />
                      Publish Startup
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedStartup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/60 p-4">
          <div className="my-auto w-full max-w-xl rounded-2xl border border-border bg-card p-6 shadow-2xl sm:p-8">
            <div className="flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#641C32]/10 text-[#641C32]">
                <Rocket size={24} />
              </div>

              <button
                onClick={() => setSelectedStartup(null)}
                className="rounded-lg p-2 text-muted-foreground hover:bg-muted"
                aria-label="Close details"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-full bg-[#641C32]/10 px-3 py-1 text-xs font-medium text-[#641C32]">
                {selectedStartup.industry}
              </span>
              <span className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                {selectedStartup.stage}
              </span>
            </div>

            <h2 className="mt-4 text-2xl font-bold">
              {selectedStartup.name}
            </h2>

            <p className="mt-2 font-medium text-muted-foreground">
              {selectedStartup.tagline}
            </p>

            <p className="mt-5 whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
              {selectedStartup.description}
            </p>

            {selectedStartup.university && (
              <p className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
                <GraduationCap size={17} />
                {selectedStartup.university}
              </p>
            )}

            {selectedStartup.website && (
              <a
                href={selectedStartup.website}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#641C32] hover:underline"
              >
                Visit website
                <ExternalLink size={15} />
              </a>
            )}

            <div className="mt-7 flex flex-wrap gap-3 border-t border-border pt-5">
              <button
                onClick={() => toggleSave(selectedStartup._id)}
                className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-3 text-sm font-semibold hover:bg-muted"
              >
                {savedIds.includes(selectedStartup._id) ? (
                  <BookmarkCheck size={17} />
                ) : (
                  <Bookmark size={17} />
                )}
                {savedIds.includes(selectedStartup._id)
                  ? "Saved"
                  : "Save Startup"}
              </button>

              <button
                onClick={() => setSelectedStartup(null)}
                className="rounded-xl bg-[#641C32] px-5 py-3 text-sm font-semibold text-white hover:bg-[#4F1628]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
