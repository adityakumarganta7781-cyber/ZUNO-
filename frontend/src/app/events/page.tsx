
"use client";

import { useState } from "react";
import Sidebar from "@/components/sidebar";
import Topbar from "@/components/topbar";
import {
  CalendarDays,
  Search,
  Sparkles,
  MapPin,
  Globe2,
  Code2,
  Lightbulb,
  Rocket,
  GraduationCap,
  Trophy,
  Users,
  CalendarCheck,
  Clock3,
  Plus,
  ArrowUpRight,
  SlidersHorizontal,
  PartyPopper,
  FlaskConical,
  BriefcaseBusiness,
  BookOpen,
  Laptop,
} from "lucide-react";

type EventTab = "discover" | "registered" | "hosted";

const categories = [
  { name: "All Events", icon: CalendarDays },
  { name: "Hackathons", icon: Code2 },
  { name: "Workshops", icon: Lightbulb },
  { name: "Conferences", icon: Users },
  { name: "Technical Competitions", icon: Trophy },
  { name: "Cultural Festivals", icon: PartyPopper },
  { name: "Startup & Entrepreneurship", icon: Rocket },
  { name: "Research Events", icon: FlaskConical },
  { name: "Seminars & Webinars", icon: Globe2 },
  { name: "Career Fairs", icon: BriefcaseBusiness },
  { name: "Scholarships & Academic Events", icon: BookOpen },
];

const tabs = [
  {
    key: "discover" as EventTab,
    label: "Discover Events",
    icon: CalendarDays,
  },
  {
    key: "registered" as EventTab,
    label: "My Registrations",
    icon: CalendarCheck,
  },
  {
    key: "hosted" as EventTab,
    label: "Hosted by Me",
    icon: Plus,
  },
];

const emptyContent = {
  discover: {
    icon: CalendarDays,
    title: "Your next experience starts here",
    description:
      "No events have been published yet. Once universities and ZUNO members start sharing events, you will discover them here.",
  },
  registered: {
    icon: CalendarCheck,
    title: "No registrations yet",
    description:
      "Events you register for will appear here, so you can keep track of your upcoming activities.",
  },
  hosted: {
    icon: Plus,
    title: "Your hosted events will appear here",
    description:
      "Create and publish events through ZUNO when event hosting becomes available.",
  },
};

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState<EventTab>("discover");
  const [activeCategory, setActiveCategory] = useState("All Events");
  const [search, setSearch] = useState("");
  const [eventType, setEventType] = useState("All Formats");

  const EmptyIcon = emptyContent[activeTab].icon;

  function clearFilters() {
    setSearch("");
    setActiveCategory("All Events");
    setEventType("All Formats");
  }

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-background text-foreground">
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 md:block">
        <Sidebar />
      </aside>

      <main className="min-h-screen w-full md:ml-64 md:w-[calc(100%-16rem)]">
        <div className="sticky top-0 z-40 w-full">
          <Topbar />
        </div>

        <div className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 lg:px-10">

          <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-xs font-semibold tracking-wide text-muted-foreground">
                <Sparkles size={14} />
                ZUNO EVENTS
              </div>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Events
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                Discover opportunities to learn, compete, collaborate
                and connect through events across the ZUNO community.
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-border bg-card px-5 py-3">
              <CalendarDays size={21} className="text-muted-foreground" />
              <div>
                <p className="text-sm font-bold">Your next experience</p>
                <p className="text-xs text-muted-foreground">
                  Starts with discovery
                </p>
              </div>
            </div>
          </div>

          <section className="relative mb-8 overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-[#641C32] via-[#762B45] to-[#8F5368] p-7 text-white sm:p-9">
            <div className="relative z-10 max-w-2xl">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#F3E5E9]">
                Learn. Participate. Achieve.
              </p>

              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Make every opportunity an experience.
              </h2>

              <p className="mt-3 text-sm leading-6 text-[#F3E5E9]">
                Explore hackathons, workshops, conferences,
                competitions and academic events from the ZUNO
                university community.
              </p>

              <button
                type="button"
                onClick={() => {
                  setActiveTab("discover");
                  document.getElementById("events-directory")?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#641C32] transition hover:bg-[#F8F3F4]"
              >
                Explore events
                <ArrowUpRight size={17} />
              </button>
            </div>

            <div className="pointer-events-none absolute -right-12 -top-16 h-64 w-64 rounded-full border border-white/20" />
            <div className="pointer-events-none absolute -bottom-28 right-12 h-72 w-72 rounded-full border border-white/20" />
          </section>

          <section id="events-directory" className="scroll-mt-24">

            <div className="mb-6 flex flex-wrap gap-2 border-b border-border pb-4">
              {tabs.map((tab) => {
                const Icon = tab.icon;

                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveTab(tab.key)}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                      activeTab === tab.key
                        ? "bg-[#641C32] text-white shadow-sm"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <Icon size={16} />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <div className="mb-6">
              <div className="mb-3 flex items-center gap-2">
                <SlidersHorizontal
                  size={17}
                  className="text-muted-foreground"
                />
                <h3 className="text-sm font-bold">
                  Explore by category
                </h3>
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                  10 categories
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {categories.map((category) => {
                  const Icon = category.icon;
                  const selected = activeCategory === category.name;

                  return (
                    <button
                      key={category.name}
                      type="button"
                      onClick={() => {
                        setActiveCategory(category.name);
                        setActiveTab("discover");
                      }}
                      className={`flex min-h-[76px] items-center gap-3 rounded-xl border p-3 text-left transition ${
                        selected
                          ? "border-[#641C32] bg-[#641C32] text-white"
                          : "border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      <Icon size={19} className="shrink-0" />
                      <span className="text-xs font-semibold leading-5">
                        {category.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mb-7 grid gap-3 lg:grid-cols-[minmax(0,1fr)_200px]">
              <label className="flex min-w-0 items-center gap-3 rounded-xl border border-border bg-card px-4">
                <Search
                  size={18}
                  className="shrink-0 text-muted-foreground"
                />
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search events, universities or topics..."
                  className="h-12 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
              </label>

              <select
                aria-label="Event format"
                value={eventType}
                onChange={(event) => setEventType(event.target.value)}
                className="h-12 rounded-xl border border-border bg-card px-4 text-sm outline-none"
              >
                <option>All Formats</option>
                <option>Online</option>
                <option>Offline</option>
                <option>Hybrid</option>
              </select>
            </div>

            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-xl font-bold">
                  {activeTab === "discover"
                    ? activeCategory === "All Events"
                      ? "Discover events"
                      : activeCategory
                    : activeTab === "registered"
                      ? "My registrations"
                      : "Events hosted by me"}
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  {activeTab === "discover"
                    ? "Explore events published by the ZUNO community."
                    : activeTab === "registered"
                      ? "Keep track of the events you join."
                      : "Manage the events you organize."}
                </p>
              </div>

              {(search ||
                activeCategory !== "All Events" ||
                eventType !== "All Formats") && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-sm font-semibold text-muted-foreground transition hover:text-foreground"
                >
                  Clear filters
                </button>
              )}
            </div>

            <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                <EmptyIcon
                  size={30}
                  className="text-muted-foreground"
                />
              </div>

              <h3 className="mt-5 text-xl font-bold">
                {emptyContent[activeTab].title}
              </h3>

              <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-muted-foreground">
                {emptyContent[activeTab].description}
              </p>

              {activeTab === "discover" && (
                <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                  {[
                    { label: "Hackathons", icon: Code2 },
                    { label: "Workshops", icon: Lightbulb },
                    { label: "Competitions", icon: Trophy },
                    { label: "Research", icon: FlaskConical },
                  ].map((item) => {
                    const Icon = item.icon;

                    return (
                      <span
                        key={item.label}
                        className="rounded-full bg-muted px-3 py-2 text-xs font-medium text-muted-foreground"
                      >
                        <Icon size={13} className="mr-1 inline" />
                        {item.label}
                      </span>
                    );
                  })}
                </div>
              )}

              {(search ||
                activeCategory !== "All Events" ||
                eventType !== "All Formats") && (
                <p className="mt-5 text-xs text-muted-foreground">
                  Event listings and filtering will become active when
                  published event data is connected.
                </p>
              )}
            </div>
          </section>

          <section className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-muted">
                <Globe2 size={21} />
              </div>

              <h3 className="mt-4 font-bold">
                Global participation
              </h3>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Discover online and offline experiences from
                universities and organizations in the ZUNO ecosystem.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-muted">
                <MapPin size={21} />
              </div>

              <h3 className="mt-4 font-bold">
                Experiences that matter
              </h3>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Participate in activities that help you learn,
                showcase your skills and meet new collaborators.
              </p>
            </div>
          </section>

          <div className="mt-10 border-t border-border pt-6 text-xs text-muted-foreground">
            ZUNO Events · Discover experiences. Create opportunities.
          </div>
        </div>
      </main>
    </div>
  );
}
