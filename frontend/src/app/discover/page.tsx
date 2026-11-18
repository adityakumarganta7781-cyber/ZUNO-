
"use client";

import { useMemo, useState } from "react";
import Sidebar from "@/components/sidebar";
import Topbar from "@/components/topbar";
import {
  Search,
  GraduationCap,
  Rocket,
  Trophy,
  BriefcaseBusiness,
  FlaskConical,
  CalendarDays,
  Lightbulb,
  Users,
  Bookmark,
  ArrowUpRight,
  Clock3,
  Sparkles,
  ChevronRight,
  BadgeCheck,
  X,
} from "lucide-react";

const categories = [
  "For You",
  "Courses",
  "Startups",
  "Hackathons",
  "Internships",
  "Research",
  "Events",
  "Scholarships",
];

const discoveryCategories = [
  {
    title: "Certification Courses",
    description: "Develop industry-ready skills and earn certifications.",
    icon: GraduationCap,
    category: "Courses",
  },
  {
    title: "Startup Ecosystem",
    description: "Discover startup programs, founders and mentors.",
    icon: Rocket,
    category: "Startups",
  },
  {
    title: "Hackathons & Competitions",
    description: "Challenge yourself and showcase your ideas.",
    icon: Trophy,
    category: "Hackathons",
  },
  {
    title: "Internships & Careers",
    description: "Explore internships, jobs and career programs.",
    icon: BriefcaseBusiness,
    category: "Internships",
  },
  {
    title: "Research & Innovation",
    description: "Explore research projects and innovation programs.",
    icon: FlaskConical,
    category: "Research",
  },
  {
    title: "Workshops & Events",
    description: "Learn from experts and participate in events.",
    icon: CalendarDays,
    category: "Events",
  },
  {
    title: "Student Projects",
    description: "Discover projects and find collaborators.",
    icon: Lightbulb,
    category: "For You",
  },
  {
    title: "Scholarships & Fellowships",
    description: "Find financial support and academic opportunities.",
    icon: GraduationCap,
    category: "Scholarships",
  },
];

const opportunities = [
  {
    id: 1,
    title: "AI & Machine Learning Certification",
    organization: "Learning & Certification",
    category: "Courses",
    description:
      "Explore artificial intelligence, machine learning fundamentals and practical applications.",
    duration: "Self-paced",
    type: "Certification",
    featured: true,
  },
  {
    id: 2,
    title: "Student Startup Incubation",
    organization: "Entrepreneurship",
    category: "Startups",
    description:
      "Turn your ideas into real projects with mentorship and startup development support.",
    duration: "Program-based",
    type: "Incubation",
    featured: true,
  },
  {
    id: 3,
    title: "Innovation & Project Challenge",
    organization: "Student Innovation",
    category: "Hackathons",
    description:
      "Build creative solutions, collaborate with a team and showcase your innovation.",
    duration: "Event-based",
    type: "Competition",
    featured: false,
  },
  {
    id: 4,
    title: "Research Internship Program",
    organization: "Research Opportunities",
    category: "Internships",
    description:
      "Explore research-oriented learning and gain practical experience.",
    duration: "Varies",
    type: "Internship",
    featured: false,
  },
  {
    id: 5,
    title: "Emerging Technologies Workshop",
    organization: "Learning & Development",
    category: "Events",
    description:
      "Explore new technologies through expert sessions and interactive learning.",
    duration: "Workshop",
    type: "Event",
    featured: false,
  },
  {
    id: 6,
    title: "Student Research Fellowship",
    organization: "Academic Opportunities",
    category: "Research",
    description:
      "Explore research opportunities, academic mentorship and project development.",
    duration: "Program-based",
    type: "Fellowship",
    featured: false,
  },
  {
    id: 7,
    title: "Academic Excellence Scholarship",
    organization: "Scholarship Opportunities",
    category: "Scholarships",
    description:
      "Explore scholarship opportunities and check eligibility requirements.",
    duration: "Application-based",
    type: "Scholarship",
    featured: false,
  },
];

export default function DiscoverPage() {
  const [activeCategory, setActiveCategory] = useState("For You");
  const [search, setSearch] = useState("");
  const [savedItems, setSavedItems] = useState<number[]>([]);
  const [expandedItem, setExpandedItem] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(true);

  const filteredOpportunities = useMemo(() => {
    return opportunities.filter((item) => {
      const matchesCategory =
        activeCategory === "For You" ||
        item.category === activeCategory;

      const searchText = search.toLowerCase();

      const matchesSearch =
        item.title.toLowerCase().includes(searchText) ||
        item.organization.toLowerCase().includes(searchText) ||
        item.description.toLowerCase().includes(searchText) ||
        item.category.toLowerCase().includes(searchText);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, search]);

  const toggleSave = (id: number) => {
    setSavedItems((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id]
    );
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-background text-foreground">
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
        className={`relative min-h-screen w-full transition-[margin-left,width] duration-300 ease-in-out ${
          menuOpen
            ? "md:ml-64 md:w-[calc(100%-16rem)]"
            : "md:ml-[76px] md:w-[calc(100%-76px)]"
        }`}
      >
        <div className="sticky top-0 z-40 w-full">
          <Topbar />
        </div>

        <main className="mx-auto w-full max-w-[1600px] space-y-10 px-5 py-7 md:px-8 lg:px-10">
          <section className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-[#8F5368]">
              <Sparkles size={16} />
              ZUNO OPPORTUNITY HUB
            </div>

            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              Discover your next opportunity.
            </h1>

            <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
              Explore certifications, startup programs, internships,
              research opportunities and experiences that help you grow.
            </p>
          </section>

          <section className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 md:p-9">
            <div className="pointer-events-none absolute -right-12 -top-20 h-64 w-64 rounded-full bg-[#641C32]/10 blur-3xl" />

            <div className="relative max-w-2xl space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#641C32]/20 bg-[#641C32]/10 px-3 py-1.5 text-xs font-semibold text-[#641C32] dark:text-[#D7A9B8]">
                <Sparkles size={14} />
                EXPLORE. LEARN. ACHIEVE.
              </div>

              <h2 className="text-2xl font-bold md:text-3xl">
                Your journey doesn&apos;t stop at the classroom.
              </h2>

              <p className="text-sm leading-6 text-muted-foreground">
                Find learning programs, connect with innovation
                opportunities and take your next step.
              </p>

              <div className="flex max-w-xl items-center gap-3 rounded-xl border border-border bg-background px-4 py-3">
                <Search size={19} className="shrink-0 text-muted-foreground" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search courses, startups, internships..."
                  className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    aria-label="Clear search"
                  >
                    <X size={17} className="text-muted-foreground" />
                  </button>
                )}
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <div>
              <h2 className="text-xl font-bold">Explore categories</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Find opportunities based on your interests.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {discoveryCategories.map((category) => {
                const Icon = category.icon;

                return (
                  <button
                    key={category.title}
                    type="button"
                    onClick={() => {
                      setActiveCategory(category.category);
                      setSearch("");
                    }}
                    className="group rounded-2xl border border-border bg-card p-5 text-left transition hover:-translate-y-1 hover:border-[#8F5368]/50 hover:shadow-lg"
                  >
                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#F8F3F4] text-[#641C32] dark:bg-[#39212B] dark:text-[#D7A9B8]">
                      <Icon size={22} />
                    </div>

                    <h3 className="font-semibold">{category.title}</h3>

                    <p className="mt-2 text-sm leading-5 text-muted-foreground">
                      {category.description}
                    </p>

                    <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-[#641C32] dark:text-[#D7A9B8]">
                      Explore
                      <ArrowUpRight size={14} />
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="space-y-5">
            <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles size={18} className="text-[#8F5368]" />
                  <h2 className="text-xl font-bold">
                    Opportunities for you
                  </h2>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Explore programs and experiences worth discovering.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setActiveCategory(category)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                      activeCategory === category
                        ? "border-[#641C32] bg-[#641C32] text-white"
                        : "border-border bg-card text-muted-foreground hover:border-[#8F5368]/50 hover:text-foreground"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {filteredOpportunities.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {filteredOpportunities.map((item) => (
                  <article
                    key={item.id}
                    className="rounded-2xl border border-border bg-card p-5 transition hover:border-[#8F5368]/40"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-[#F8F3F4] px-2.5 py-1 text-xs font-medium text-[#641C32] dark:bg-[#39212B] dark:text-[#D7A9B8]">
                            {item.category}
                          </span>

                          {item.featured && (
                            <span className="rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-600">
                              Featured
                            </span>
                          )}
                        </div>

                        <h3 className="text-lg font-semibold">
                          {item.title}
                        </h3>

                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <BadgeCheck size={14} />
                          {item.organization}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleSave(item.id)}
                        aria-label={
                          savedItems.includes(item.id)
                            ? "Remove saved opportunity"
                            : "Save opportunity"
                        }
                        className={`rounded-xl border p-2 transition ${
                          savedItems.includes(item.id)
                            ? "border-[#641C32] bg-[#F8F3F4] text-[#641C32] dark:bg-[#39212B] dark:text-[#D7A9B8]"
                            : "border-border text-muted-foreground hover:text-[#641C32]"
                        }`}
                      >
                        <Bookmark
                          size={18}
                          fill={
                            savedItems.includes(item.id)
                              ? "currentColor"
                              : "none"
                          }
                        />
                      </button>
                    </div>

                    <p className="mt-4 text-sm leading-6 text-muted-foreground">
                      {item.description}
                    </p>

                    <div className="mt-5 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Clock3 size={14} />
                        {item.duration}
                      </span>

                      <span className="flex items-center gap-1.5">
                        <Lightbulb size={14} />
                        {item.type}
                      </span>
                    </div>

                    {expandedItem === item.id && (
                      <div className="mt-4 rounded-xl bg-muted p-4">
                        <p className="text-sm font-semibold">
                          Opportunity information
                        </p>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
                          This is sample demonstration content.
                          Verified program details, eligibility,
                          application links and deadlines can be added
                          when the opportunity is published.
                        </p>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() =>
                        setExpandedItem(
                          expandedItem === item.id ? null : item.id
                        )
                      }
                      className="mt-5 flex w-full items-center justify-between border-t border-border pt-4 text-sm font-semibold text-[#641C32] dark:text-[#D7A9B8]"
                    >
                      {expandedItem === item.id
                        ? "Hide details"
                        : "View details"}
                      <ChevronRight
                        size={17}
                        className={`transition ${
                          expandedItem === item.id ? "rotate-90" : ""
                        }`}
                      />
                    </button>
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-border bg-card px-5 py-14 text-center">
                <Search
                  size={30}
                  className="mx-auto text-muted-foreground"
                />
                <h3 className="mt-4 font-semibold">
                  No opportunities found
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Try another search term or category.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setActiveCategory("For You");
                  }}
                  className="mt-4 rounded-lg bg-[#641C32] px-4 py-2 text-sm font-semibold text-white"
                >
                  Clear filters
                </button>
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-border bg-card p-6 md:p-8">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[#8F5368]">
                  <Users size={19} />
                  <span className="text-xs font-semibold tracking-wider">
                    THE ZUNO COMMUNITY
                  </span>
                </div>

                <h2 className="text-xl font-bold">
                  Have an opportunity to share?
                </h2>

                <p className="max-w-xl text-sm leading-6 text-muted-foreground">
                  Verified university departments and organizations
                  can contribute opportunities for students to explore.
                </p>
              </div>

              <div className="shrink-0 rounded-xl bg-muted px-5 py-3 text-sm font-semibold text-muted-foreground">
                Opportunity submissions coming soon
              </div>
            </div>
          </section>

          <footer className="border-t border-border py-5 text-center text-xs text-muted-foreground">
            ZUNO · Discover opportunities. Build your future.
          </footer>
        </main>
      </div>
    </div>
  );
}
