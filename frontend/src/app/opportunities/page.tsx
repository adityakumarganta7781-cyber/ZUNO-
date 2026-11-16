
"use client";

import { useMemo, useState } from "react";
import {
  Search,
  BriefcaseBusiness,
  GraduationCap,
  Trophy,
  Microscope,
  Lightbulb,
  Rocket,
  Sparkles,
  Bookmark,
  CalendarDays,
  SlidersHorizontal,
  ArrowUpRight,
  ShieldCheck,
  Target,
  FileText,
  Globe,
  Building2,
  X,
  Users,
  BrainCircuit,
  CircleDashed,
  Send,
  Filter,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import Sidebar from "@/components/sidebar";
import Topbar from "@/components/topbar";

type OpportunityCategory = {
  name: string;
  description: string;
  icon: LucideIcon;
};

const categories: OpportunityCategory[] = [
  {
    name: "Internships & Jobs",
    description: "Internships, graduate roles and professional careers.",
    icon: BriefcaseBusiness,
  },
  {
    name: "Scholarships & Fellowships",
    description: "Academic funding, scholarships and fellowships.",
    icon: GraduationCap,
  },
  {
    name: "Hackathons & Competitions",
    description: "Innovation challenges, contests and hackathons.",
    icon: Trophy,
  },
  {
    name: "Research Opportunities",
    description: "Research internships, labs and academic programs.",
    icon: Microscope,
  },
  {
    name: "Mentorship & Development",
    description: "Mentors, training programs and career development.",
    icon: Lightbulb,
  },
  {
    name: "Startup & Entrepreneurship",
    description: "Incubators, startup grants and founder programs.",
    icon: Rocket,
  },
];

const locations = [
  "All Locations",
  "Remote",
  "India",
  "International",
  "Hybrid",
  "On-site",
];

const compensationOptions = [
  "Any Compensation",
  "Paid",
  "Unpaid",
  "Stipend",
  "Prize / Grant",
];

const experienceOptions = [
  "All Experience Levels",
  "Beginner",
  "Intermediate",
  "Advanced",
];

const applicationStages = [
  "Saved",
  "Preparing Application",
  "Applied",
  "Assessment",
  "Interview",
  "Shortlisted",
  "Selected",
  "Rejected",
  "Withdrawn",
];

const tabs = ["Discover", "Saved", "My Applications"];

export default function OpportunitiesPage() {
  const [activeTab, setActiveTab] = useState("Discover");
  const [selectedCategory, setSelectedCategory] = useState("All Opportunities");
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("All Locations");
  const [compensation, setCompensation] = useState("Any Compensation");
  const [experience, setExperience] = useState("All Experience Levels");
  const [deadline, setDeadline] = useState("Any Deadline");
  const [showFilters, setShowFilters] = useState(false);
  const [showCategories, setShowCategories] = useState(true);

  const filteredCategories = useMemo(() => {
    return categories.filter(
      (category) =>
        category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const selectedFilters = [
    selectedCategory !== "All Opportunities",
    location !== "All Locations",
    compensation !== "Any Compensation",
    experience !== "All Experience Levels",
    deadline !== "Any Deadline",
  ].filter(Boolean).length;

  const resetFilters = () => {
    setSelectedCategory("All Opportunities");
    setSearchQuery("");
    setLocation("All Locations");
    setCompensation("Any Compensation");
    setExperience("All Experience Levels");
    setDeadline("Any Deadline");
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-background text-foreground">
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 md:block">
        <Sidebar />
      </aside>

      <main className="min-h-screen w-full md:ml-64 md:w-[calc(100%-16rem)]">
        <div className="sticky top-0 z-40 w-full">
          <Topbar />
        </div>

        <div className="mx-auto max-w-7xl space-y-8 px-5 py-8 sm:px-8 lg:px-10">

          {/* HERO SECTION */}

          <section className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-[#641C32]/10 via-background to-[#8F5368]/10 p-7 sm:p-10">
            <div className="absolute -right-16 -top-20 h-72 w-72 rounded-full bg-[#641C32]/10 blur-3xl" />
            <div className="absolute -bottom-20 right-1/3 h-56 w-56 rounded-full bg-[#8F5368]/10 blur-3xl" />

            <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#641C32]/20 bg-[#641C32]/10 px-3 py-1.5 text-xs font-semibold text-[#641C32] dark:text-[#D9B8C4]">
                <Sparkles size={14} />
                DISCOVER YOUR NEXT OPPORTUNITY
              </div>

              <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
                Your next big step
                <span className="text-[#641C32]"> starts here.</span>
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
                Discover internships, scholarships, research programs,
                competitions and opportunities that move your ambitions forward.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <button
                  onClick={() => setActiveTab("Discover")}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#641C32] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#4F1628]"
                >
                  <Search size={17} />
                  Explore Opportunities
                  <ArrowUpRight size={16} />
                </button>

                <button
                  onClick={() => setActiveTab("My Applications")}
                  className="inline-flex items-center gap-2 rounded-xl border border-border bg-background/70 px-5 py-3 text-sm font-semibold transition hover:bg-muted"
                >
                  <FileText size={17} />
                  Track Applications
                </button>
              </div>
            </div>
          </section>

          {/* QUICK FEATURES */}

          <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {[
              {
                title: "AI Opportunity Match",
                description: "Find opportunities aligned with your goals.",
                icon: BrainCircuit,
              },
              {
                title: "Deadline Intelligence",
                description: "Stay aware of important application dates.",
                icon: CalendarDays,
              },
              {
                title: "Verified Listings",
                description: "Know where each opportunity comes from.",
                icon: ShieldCheck,
              },
              {
                title: "Application Tracker",
                description: "Manage your applications in one place.",
                icon: Target,
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-2xl border border-border bg-card p-4 transition hover:border-[#641C32]/40"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-[#641C32]/10 p-3 text-[#641C32]">
                      <Icon size={20} />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold">{item.title}</h3>
                      <p className="mt-1 text-xs leading-5 text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </section>

          {/* AI MATCHING */}

          <section className="relative overflow-hidden rounded-2xl border border-[#641C32]/20 bg-gradient-to-r from-[#641C32]/10 to-[#8F5368]/10 p-5 sm:p-7">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="rounded-2xl bg-[#8F5368]/15 p-3 text-[#641C32]">
                  <BrainCircuit size={27} />
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-bold">ZUNO Intelligence</h2>
                    <span className="rounded-full bg-[#8F5368]/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#641C32] dark:text-[#D9B8C4]">
                      AI-powered
                    </span>
                  </div>

                  <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
                    Get personalized opportunity recommendations based on
                    your skills, interests, education and career goals.
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {[
                      "Skill matching",
                      "Eligibility analysis",
                      "Career recommendations",
                    ].map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-border bg-background/60 px-3 py-1 text-xs text-muted-foreground"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <button
                disabled
                title="Available after AI integration"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#641C32]/50 px-5 py-3 text-sm font-semibold text-white"
              >
                <Sparkles size={16} />
                Coming with AI integration
              </button>
            </div>
          </section>

          {/* CATEGORIES */}

          <section className="space-y-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[#641C32]">
                  Explore possibilities
                </p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight">
                  Opportunity Categories
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Discover pathways for learning, research and career growth.
                </p>
              </div>

              <button
                onClick={() => setShowCategories(!showCategories)}
                className="inline-flex items-center gap-2 self-start rounded-lg border border-border px-3 py-2 text-sm font-medium transition hover:bg-muted"
              >
                <SlidersHorizontal size={15} />
                {showCategories ? "Hide categories" : "Show categories"}
              </button>
            </div>

            {showCategories && (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {filteredCategories.map((category) => {
                  const Icon = category.icon;
                  const isSelected = selectedCategory === category.name;

                  return (
                    <button
                      key={category.name}
                      onClick={() => {
                        setSelectedCategory(category.name);
                        setActiveTab("Discover");
                      }}
                      className={`group rounded-2xl border p-5 text-left transition duration-200 hover:-translate-y-1 hover:shadow-md ${
                        isSelected
                          ? "border-[#641C32] bg-[#641C32]/10"
                          : "border-border bg-card hover:border-[#641C32]/40"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div
                          className={`rounded-xl p-3 ${
                            isSelected
                              ? "bg-[#641C32] text-white"
                              : "bg-muted text-foreground group-hover:bg-[#641C32]/10 group-hover:text-[#641C32]"
                          }`}
                        >
                          <Icon size={22} />
                        </div>

                        <ArrowUpRight
                          size={17}
                          className="text-muted-foreground transition group-hover:text-[#641C32]"
                        />
                      </div>

                      <h3 className="mt-4 text-sm font-bold">
                        {category.name}
                      </h3>

                      <p className="mt-2 text-xs leading-5 text-muted-foreground">
                        {category.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            )}

            {filteredCategories.length === 0 && (
              <div className="rounded-2xl border border-border bg-card p-8 text-center">
                <Search className="mx-auto text-muted-foreground" size={28} />
                <p className="mt-3 font-semibold">No matching categories</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Try another search term.
                </p>
              </div>
            )}
          </section>

          {/* DISCOVERY AND APPLICATION TABS */}

          <section className="space-y-5">
            <div className="flex flex-wrap gap-2 border-b border-border">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`border-b-2 px-4 py-3 text-sm font-semibold transition ${
                    activeTab === tab
                      ? "border-[#641C32] text-[#641C32]"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab === "Saved" ? (
                    <span className="inline-flex items-center gap-2">
                      <Bookmark size={15} />
                      {tab}
                    </span>
                  ) : tab === "My Applications" ? (
                    <span className="inline-flex items-center gap-2">
                      <FileText size={15} />
                      {tab}
                    </span>
                  ) : (
                    tab
                  )}
                </button>
              ))}
            </div>

            {activeTab === "Discover" && (
              <>
                <div className="flex flex-col gap-4">
                  <div>
                    <h2 className="text-xl font-bold">
                      Discover Opportunities
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Find opportunities that match your ambitions.
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 lg:flex-row">
                    <div className="relative flex-1">
                      <Search
                        size={17}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                      />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search opportunities, organizations or skills..."
                        className="w-full rounded-xl border border-border bg-card py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#641C32] focus:ring-2 focus:ring-[#641C32]/10"
                      />
                    </div>

                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold transition hover:bg-muted"
                    >
                      <Filter size={16} />
                      Filters
                      {selectedFilters > 0 && (
                        <span className="rounded-full bg-[#641C32] px-2 py-0.5 text-xs text-white">
                          {selectedFilters}
                        </span>
                      )}
                    </button>
                  </div>
                </div>

                {showFilters && (
                  <div className="grid grid-cols-1 gap-4 rounded-2xl border border-border bg-card p-5 sm:grid-cols-2 xl:grid-cols-4">
                    <div>
                      <label className="mb-2 block text-xs font-semibold text-muted-foreground">
                        Location
                      </label>
                      <select
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full rounded-xl border border-border bg-background px-3 py-3 text-sm outline-none focus:border-[#641C32]"
                      >
                        {locations.map((item) => (
                          <option key={item} value={item}>
                            {item}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-semibold text-muted-foreground">
                        Compensation
                      </label>
                      <select
                        value={compensation}
                        onChange={(e) => setCompensation(e.target.value)}
                        className="w-full rounded-xl border border-border bg-background px-3 py-3 text-sm outline-none focus:border-[#641C32]"
                      >
                        {compensationOptions.map((item) => (
                          <option key={item} value={item}>
                            {item}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-semibold text-muted-foreground">
                        Experience
                      </label>
                      <select
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                        className="w-full rounded-xl border border-border bg-background px-3 py-3 text-sm outline-none focus:border-[#641C32]"
                      >
                        {experienceOptions.map((item) => (
                          <option key={item} value={item}>
                            {item}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-semibold text-muted-foreground">
                        Deadline
                      </label>
                      <select
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                        className="w-full rounded-xl border border-border bg-background px-3 py-3 text-sm outline-none focus:border-[#641C32]"
                      >
                        <option>Any Deadline</option>
                        <option>Closing Today</option>
                        <option>Closing This Week</option>
                        <option>Closing This Month</option>
                        <option>Upcoming</option>
                      </select>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 sm:col-span-2 xl:col-span-4">
                      <button
                        onClick={resetFilters}
                        className="text-sm font-semibold text-[#641C32] hover:underline"
                      >
                        Reset all filters
                      </button>
                      <button
                        onClick={() => setShowFilters(false)}
                        className="rounded-lg bg-[#641C32] px-4 py-2 text-sm font-semibold text-white hover:bg-[#4F1628]"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-medium text-muted-foreground">
                    Selected:
                  </span>

                  <span className="rounded-full bg-[#641C32]/10 px-3 py-1.5 text-xs font-semibold text-[#641C32] dark:text-[#D9B8C4]">
                    {selectedCategory}
                  </span>

                  {location !== "All Locations" && (
                    <span className="rounded-full bg-muted px-3 py-1.5 text-xs">
                      {location}
                    </span>
                  )}

                  {compensation !== "Any Compensation" && (
                    <span className="rounded-full bg-muted px-3 py-1.5 text-xs">
                      {compensation}
                    </span>
                  )}

                  {experience !== "All Experience Levels" && (
                    <span className="rounded-full bg-muted px-3 py-1.5 text-xs">
                      {experience}
                    </span>
                  )}

                  {deadline !== "Any Deadline" && (
                    <span className="rounded-full bg-muted px-3 py-1.5 text-xs">
                      {deadline}
                    </span>
                  )}

                  {selectedFilters > 0 && (
                    <button
                      onClick={resetFilters}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#641C32] hover:underline"
                    >
                      <X size={13} />
                      Clear
                    </button>
                  )}
                </div>
              </>
            )}

            {activeTab === "Saved" && (
              <div>
                <h2 className="text-xl font-bold">Saved Opportunities</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Keep interesting opportunities together and revisit them
                  when you are ready to apply.
                </p>
              </div>
            )}

            {activeTab === "My Applications" && (
              <div>
                <h2 className="text-xl font-bold">Application Tracker</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Keep track of your application journey and important
                  follow-up dates.
                </p>

                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                  {applicationStages.slice(0, 5).map((stage, index) => (
                    <div
                      key={stage}
                      className="rounded-xl border border-border bg-card p-3"
                    >
                      <div className="flex items-center gap-2 text-muted-foreground">
                        {index === 0 ? (
                          <Bookmark size={15} />
                        ) : index === 1 ? (
                          <FileText size={15} />
                        ) : index === 2 ? (
                          <Send size={15} />
                        ) : index === 3 ? (
                          <CircleDashed size={15} />
                        ) : (
                          <Users size={15} />
                        )}
                        <span className="text-xs font-medium">{stage}</span>
                      </div>
                      <p className="mt-3 text-xl font-bold">—</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* OPPORTUNITY EMPTY STATE */}

            <div className="rounded-2xl border border-dashed border-border bg-card/50 px-5 py-12 text-center sm:px-10">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#641C32]/10 text-[#641C32]">
                {activeTab === "Saved" ? (
                  <Bookmark size={29} />
                ) : activeTab === "My Applications" ? (
                  <FileText size={29} />
                ) : (
                  <Globe size={29} />
                )}
              </div>

              <h3 className="mt-5 text-lg font-bold">
                {activeTab === "Saved"
                  ? "Your saved opportunities will appear here"
                  : activeTab === "My Applications"
                  ? "Your application journey starts here"
                  : "Discover your next opportunity"}
              </h3>

              <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-muted-foreground">
                {activeTab === "Saved"
                  ? "Bookmark opportunities to create your personal collection."
                  : activeTab === "My Applications"
                  ? "Applications you track will appear here with their stages, notes and follow-up dates."
                  : "Opportunities from verified organizations and approved sources will appear here when the live opportunity database is connected."}
              </p>

              {activeTab === "Discover" && (
                <div className="mx-auto mt-6 flex max-w-md flex-wrap justify-center gap-3">
                  <div className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-xs text-muted-foreground">
                    <ShieldCheck size={14} />
                    Source verification
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-xs text-muted-foreground">
                    <CalendarDays size={14} />
                    Deadline tracking
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-xs text-muted-foreground">
                    <Target size={14} />
                    Eligibility matching
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* ORGANIZATION SECTION */}

          <section className="rounded-2xl border border-border bg-card p-5 sm:p-7">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-[#641C32]/10 p-3 text-[#641C32]">
                  <Building2 size={24} />
                </div>

                <div>
                  <h3 className="font-bold">Are you an organization?</h3>
                  <p className="mt-1 max-w-xl text-sm leading-6 text-muted-foreground">
                    Universities, companies, research institutions and
                    verified organizations will be able to publish
                    opportunities and manage applications on ZUNO.
                  </p>
                </div>
              </div>

              <button
                disabled
                title="Available after organization portal development"
                className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-border px-4 py-3 text-sm font-semibold text-muted-foreground"
              >
                Organization Portal
                <ArrowUpRight size={16} />
              </button>
            </div>
          </section>

          {/* TRUST INFORMATION */}

          <section className="rounded-2xl border border-border bg-muted/30 p-5">
            <div className="flex items-start gap-3">
              <ShieldCheck size={21} className="mt-0.5 shrink-0 text-[#641C32]" />
              <div>
                <h3 className="text-sm font-bold">
                  Opportunities you can trust
                </h3>
                <p className="mt-1 text-xs leading-6 text-muted-foreground">
                  ZUNO will distinguish verified organization listings,
                  externally sourced opportunities and community-submitted
                  listings. Each listing should include its source, deadline,
                  eligibility and last-checked date. Always verify application
                  details with the original organization before applying.
                </p>
              </div>
            </div>
          </section>

          <footer className="border-t border-border py-5 text-center text-xs text-muted-foreground">
            ZUNO · Discover. Connect. Build. Grow.
          </footer>
        </div>
      </main>
    </div>
  );
}
