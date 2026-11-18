
"use client";

import { useState } from "react";
import Sidebar from "@/components/sidebar";
import Topbar from "@/components/topbar";
import {
  SlidersHorizontal,
  RotateCcw,
  Search,
  GraduationCap,
  CalendarDays,
  BriefcaseBusiness,
  Rocket,
  FolderKanban,
  BookOpen,
  Store,
  Check,
} from "lucide-react";

const sections = [
  {
    title: "Content & Categories",
    icon: BookOpen,
    key: "category",
    options: [
      "Technology",
      "Biotechnology",
      "Science",
      "Business",
      "Design",
      "Engineering",
      "Healthcare",
      "Research",
      "Arts & Culture",
    ],
  },
  {
    title: "Content Type",
    icon: SlidersHorizontal,
    key: "contentType",
    options: [
      "Articles",
      "Tutorials",
      "Courses",
      "Certifications",
      "Research Papers",
      "Videos",
      "Study Materials",
      "Digital Products",
    ],
  },
  {
    title: "Platform Modules",
    icon: FolderKanban,
    key: "module",
    options: [
      "Discover",
      "Network",
      "Projects",
      "Events",
      "Opportunities",
      "Startups",
      "Knowledge Hub",
      "Marketplace",
    ],
  },
];

const initialFilters = {
  category: [] as string[],
  contentType: [] as string[],
  module: [] as string[],
  pricing: "All",
  university: "",
  format: "All",
  level: "All",
  duration: "All",
  date: "Any time",
  rating: "Any rating",
};

type FilterKey = "category" | "contentType" | "module";

export default function FiltersPage() {
  const [filters, setFilters] = useState(initialFilters);
  const [applied, setApplied] = useState(false);
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(true);

  const toggleOption = (key: FilterKey, option: string) => {
    setFilters((previous) => ({
      ...previous,
      [key]: previous[key].includes(option)
        ? previous[key].filter((item) => item !== option)
        : [...previous[key], option],
    }));
    setApplied(false);
  };

  const resetFilters = () => {
    setFilters(initialFilters);
    setSearch("");
    setApplied(false);
  };

  const selectedCount =
    filters.category.length +
    filters.contentType.length +
    filters.module.length +
    (filters.pricing !== "All" ? 1 : 0) +
    (filters.university ? 1 : 0) +
    (filters.format !== "All" ? 1 : 0) +
    (filters.level !== "All" ? 1 : 0) +
    (filters.duration !== "All" ? 1 : 0) +
    (filters.date !== "Any time" ? 1 : 0) +
    (filters.rating !== "Any rating" ? 1 : 0);

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

        <main className="mx-auto w-full max-w-7xl space-y-7 px-5 py-8 md:px-8">
          <section className="rounded-3xl bg-gradient-to-br from-[#641C32] via-[#762B45] to-[#8F5368] p-8 text-white">
            <div className="flex items-center gap-3">
              <SlidersHorizontal size={25} />
              <span className="text-sm font-semibold tracking-widest">
                ZUNO PERSONALIZATION
              </span>
            </div>

            <h1 className="mt-4 text-3xl font-extrabold md:text-4xl">
              Discover what matters to you.
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/85 md:text-base">
              Use centralized filters to narrow down content, opportunities,
              events, projects, courses and resources across ZUNO.
            </p>
          </section>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold">All Platform Filters</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Select your preferences to refine your discovery experience.
              </p>
            </div>

            <span className="rounded-full bg-[#F8F3F4] px-4 py-2 text-sm font-semibold text-[#4D1527] dark:bg-[#3B202B] dark:text-[#D8AAB9]">
              {selectedCount} selected
            </span>
          </div>

          <div className="relative">
            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search filter options..."
              className="w-full rounded-xl border border-gray-200 bg-white py-4 pl-12 pr-4 text-sm outline-none focus:border-[#641C32] dark:border-gray-800 dark:bg-gray-900"
            />
          </div>

          {sections.map((section) => {
            const Icon = section.icon;
            const visibleOptions = section.options.filter((option) =>
              option.toLowerCase().includes(search.toLowerCase())
            );
            const key = section.key as FilterKey;

            return (
              <section
                key={section.key}
                className="rounded-2xl border border-border bg-card p-5 md:p-6"
              >
                <h3 className="mb-5 flex items-center gap-3 font-bold">
                  <span className="rounded-xl bg-[#F8F3F4] p-2 text-[#641C32] dark:bg-[#3B202B]">
                    <Icon size={20} />
                  </span>
                  {section.title}
                </h3>

                <div className="flex flex-wrap gap-2">
                  {visibleOptions.map((option) => {
                    const checked = filters[key].includes(option);

                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => toggleOption(key, option)}
                        className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition ${
                          checked
                            ? "border-[#8F5368] bg-[#F8F3F4] text-[#4D1527] dark:bg-[#3B202B] dark:text-[#D8AAB9]"
                            : "border-border text-muted-foreground hover:border-[#D8AAB9]"
                        }`}
                      >
                        {checked && <Check size={15} />}
                        {option}
                      </button>
                    );
                  })}

                  {visibleOptions.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      No matching options found.
                    </p>
                  )}
                </div>
              </section>
            );
          })}

          <section className="rounded-2xl border border-border bg-card p-5 md:p-6">
            <h3 className="mb-5 flex items-center gap-3 font-bold">
              <Store size={21} className="text-[#641C32]" />
              Pricing
            </h3>

            <div className="flex flex-wrap gap-2">
              {["All", "Free", "Paid", "Premium", "Subscription"].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    setFilters((previous) => ({
                      ...previous,
                      pricing: item,
                    }));
                    setApplied(false);
                  }}
                  className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition ${
                    filters.pricing === item
                      ? "border-[#8F5368] bg-[#F8F3F4] text-[#4D1527] dark:bg-[#3B202B] dark:text-[#D8AAB9]"
                      : "border-border text-muted-foreground"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-5 md:p-6">
            <h3 className="mb-5 flex items-center gap-3 font-bold">
              <GraduationCap size={21} className="text-[#641C32]" />
              Education & Learning
            </h3>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground">
                  Course Level
                </label>
                <select
                  value={filters.level}
                  onChange={(event) => {
                    setFilters((previous) => ({
                      ...previous,
                      level: event.target.value,
                    }));
                    setApplied(false);
                  }}
                  className="w-full rounded-xl border border-border bg-background p-3 text-sm"
                >
                  {["All", "Beginner", "Intermediate", "Advanced"].map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground">
                  Duration
                </label>
                <select
                  value={filters.duration}
                  onChange={(event) => {
                    setFilters((previous) => ({
                      ...previous,
                      duration: event.target.value,
                    }));
                    setApplied(false);
                  }}
                  className="w-full rounded-xl border border-border bg-background p-3 text-sm"
                >
                  {[
                    "All",
                    "Under 1 week",
                    "1–4 weeks",
                    "1–3 months",
                    "3+ months",
                  ].map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-5 md:p-6">
            <h3 className="mb-5 flex items-center gap-3 font-bold">
              <BriefcaseBusiness size={21} className="text-[#641C32]" />
              Location & Format
            </h3>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground">
                  University
                </label>
                <input
                  value={filters.university}
                  onChange={(event) => {
                    setFilters((previous) => ({
                      ...previous,
                      university: event.target.value,
                    }));
                    setApplied(false);
                  }}
                  placeholder="Enter university name"
                  className="w-full rounded-xl border border-border bg-background p-3 text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground">
                  Format
                </label>
                <select
                  value={filters.format}
                  onChange={(event) => {
                    setFilters((previous) => ({
                      ...previous,
                      format: event.target.value,
                    }));
                    setApplied(false);
                  }}
                  className="w-full rounded-xl border border-border bg-background p-3 text-sm"
                >
                  {["All", "Online", "Offline", "Hybrid", "Self-paced", "Live"].map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground">
                  Date
                </label>
                <select
                  value={filters.date}
                  onChange={(event) => {
                    setFilters((previous) => ({
                      ...previous,
                      date: event.target.value,
                    }));
                    setApplied(false);
                  }}
                  className="w-full rounded-xl border border-border bg-background p-3 text-sm"
                >
                  {["Any time", "Today", "This week", "This month", "Upcoming"].map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground">
                  Minimum Rating
                </label>
                <select
                  value={filters.rating}
                  onChange={(event) => {
                    setFilters((previous) => ({
                      ...previous,
                      rating: event.target.value,
                    }));
                    setApplied(false);
                  }}
                  className="w-full rounded-xl border border-border bg-background p-3 text-sm"
                >
                  {["Any rating", "3+ stars", "4+ stars", "4.5+ stars"].map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-5 md:p-6">
            <h3 className="mb-5 flex items-center gap-3 font-bold">
              <CalendarDays size={21} className="text-[#641C32]" />
              More ZUNO Areas
            </h3>

            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { name: "Events", icon: CalendarDays },
                { name: "Opportunities", icon: BriefcaseBusiness },
                { name: "Startups", icon: Rocket },
                { name: "Projects", icon: FolderKanban },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.name}
                    className="flex items-center gap-3 rounded-xl bg-muted p-4 text-sm font-medium"
                  >
                    <Icon size={19} className="text-[#641C32]" />
                    {item.name}
                  </div>
                );
              })}
            </div>
          </section>

          {applied && (
            <p className="rounded-xl bg-green-50 p-4 text-sm text-green-700 dark:bg-green-950 dark:text-green-300">
              Your filter preferences have been selected. Platform-wide filtering
              will take effect when the shared discovery system is connected.
            </p>
          )}

          <div className="sticky bottom-0 flex flex-wrap justify-between gap-3 border-t border-border bg-background/95 py-5 backdrop-blur">
            <button
              type="button"
              onClick={resetFilters}
              className="flex items-center gap-2 rounded-xl border border-border px-5 py-3 text-sm font-semibold transition hover:bg-muted"
            >
              <RotateCcw size={17} />
              Reset All
            </button>

            <button
              type="button"
              onClick={() => setApplied(true)}
              className="rounded-xl bg-[#641C32] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#4D1527]"
            >
              Apply Preferences
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
