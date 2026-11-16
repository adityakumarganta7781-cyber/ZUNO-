
"use client";

import { useMemo, useState } from "react";
import {
  Search,
  FolderKanban,
  Code2,
  BrainCircuit,
  FlaskConical,
  Smartphone,
  Palette,
  Leaf,
  Users,
  Rocket,
  ArrowUpRight,
  SlidersHorizontal,
  Microscope,
  HeartPulse,
  Dna,
  Cpu,
  Globe,
  Lightbulb,
  X,
  Bookmark,
  Plus,
  Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import Sidebar from "@/components/sidebar";
import Topbar from "@/components/topbar";

type Category = {
  name: string;
  icon: LucideIcon;
  description: string;
};

const categories: Category[] = [
  {
    name: "All Projects",
    icon: FolderKanban,
    description: "Explore projects from every discipline.",
  },
  {
    name: "AI & Machine Learning",
    icon: BrainCircuit,
    description: "Artificial intelligence, machine learning and data science.",
  },
  {
    name: "Web Development",
    icon: Code2,
    description: "Websites, platforms and full-stack applications.",
  },
  {
    name: "Mobile Applications",
    icon: Smartphone,
    description: "Mobile apps and digital experiences.",
  },
  {
    name: "Biotechnology & Life Sciences",
    icon: FlaskConical,
    description: "Biological research, genetics and life science innovation.",
  },
  {
    name: "Healthcare & Medical Innovation",
    icon: HeartPulse,
    description: "Healthcare technology, diagnostics and medical solutions.",
  },
  {
    name: "Bioinformatics",
    icon: Dna,
    description: "Computational biology, genomics and biological data.",
  },
  {
    name: "Robotics & IoT",
    icon: Cpu,
    description: "Robotics, automation and connected devices.",
  },
  {
    name: "Electronics & Embedded Systems",
    icon: Lightbulb,
    description: "Electronic circuits, embedded devices and hardware.",
  },
  {
    name: "Research & Innovation",
    icon: Microscope,
    description: "Scientific research, experiments and new discoveries.",
  },
  {
    name: "UI/UX & Design",
    icon: Palette,
    description: "User experiences, interfaces and creative design.",
  },
  {
    name: "Environmental & Sustainability",
    icon: Leaf,
    description: "Climate solutions, green technology and sustainability.",
  },
  {
    name: "Open Source",
    icon: Globe,
    description: "Community-driven and open-source contributions.",
  },
];

const projectTypes = [
  "All Types",
  "Individual Projects",
  "Team Projects",
  "Open for Collaboration",
];

const tabs = [
  "Explore Projects",
  "My Projects",
  "Find Collaborations",
];

export default function ProjectsPage() {
  const [activeTab, setActiveTab] = useState("Explore Projects");
  const [selectedCategory, setSelectedCategory] = useState("All Projects");
  const [searchQuery, setSearchQuery] = useState("");
  const [projectType, setProjectType] = useState("All Types");
  const [showCategories, setShowCategories] = useState(true);

  const filteredCategories = useMemo(() => {
    return categories.filter((category) =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const activeCategory = categories.find(
    (category) => category.name === selectedCategory
  );

  const resetFilters = () => {
    setSelectedCategory("All Projects");
    setSearchQuery("");
    setProjectType("All Types");
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

          <section className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-[#641C32]/10 via-background to-[#8F5368]/10 p-7 sm:p-10">
            <div className="absolute -right-12 -top-16 h-64 w-64 rounded-full bg-[#641C32]/10 blur-3xl" />
            <div className="absolute -bottom-20 right-1/3 h-48 w-48 rounded-full bg-[#8F5368]/10 blur-3xl" />

            <div className="relative z-10 max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#641C32]/20 bg-[#641C32]/10 px-3 py-1.5 text-xs font-semibold text-[#641C32] dark:text-[#D9B8C4]">
                <Sparkles size={14} />
                CREATE. INNOVATE. COLLABORATE.
              </div>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Ideas become <span className="text-[#641C32]">innovation.</span>
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
                Discover student projects, explore innovative research,
                showcase your work and connect with people who can help
                bring your ideas to life.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <button
                  onClick={() => setActiveTab("Explore Projects")}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#641C32] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#4F1628]"
                >
                  <FolderKanban size={17} />
                  Explore Projects
                  <ArrowUpRight size={16} />
                </button>

                <button
                  onClick={() => setActiveTab("My Projects")}
                  className="inline-flex items-center gap-2 rounded-xl border border-border bg-background/70 px-5 py-3 text-sm font-semibold transition hover:bg-muted"
                >
                  <Plus size={17} />
                  My Projects
                </button>
              </div>
            </div>
          </section>

          <section className="space-y-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[#641C32]">
                  Explore by discipline
                </p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight">
                  Project Categories
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Discover innovation across different fields and industries.
                </p>
              </div>

              <button
                onClick={() => setShowCategories(!showCategories)}
                className="inline-flex items-center gap-2 self-start rounded-lg border border-border px-3 py-2 text-sm font-medium transition hover:bg-muted sm:self-auto"
              >
                {showCategories ? "Hide categories" : "Show categories"}
                <SlidersHorizontal size={15} />
              </button>
            </div>

            {showCategories && (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredCategories.map((category) => {
                  const Icon = category.icon;
                  const isSelected = selectedCategory === category.name;

                  return (
                    <button
                      key={category.name}
                      onClick={() => setSelectedCategory(category.name)}
                      className={`group rounded-2xl border p-4 text-left transition duration-200 hover:-translate-y-1 hover:shadow-md ${
                        isSelected
                          ? "border-[#641C32] bg-[#641C32]/10 shadow-sm"
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
                          <Icon size={21} />
                        </div>

                        <ArrowUpRight
                          size={17}
                          className="text-muted-foreground transition group-hover:text-[#641C32]"
                        />
                      </div>

                      <h3 className="mt-4 text-sm font-semibold leading-5">
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
                <p className="mt-3 font-semibold">No categories found</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Try searching with another keyword.
                </p>
              </div>
            )}
          </section>

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
                  {tab}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-xl font-bold">
                  {activeTab === "Explore Projects"
                    ? "Explore Projects"
                    : activeTab === "My Projects"
                    ? "My Projects"
                    : "Find Collaborations"}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {activeTab === "Explore Projects"
                    ? "Discover ideas and work from the ZUNO community."
                    : activeTab === "My Projects"
                    ? "Your published and saved project workspace."
                    : "Find projects looking for collaborators."}
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1 sm:min-w-64">
                  <Search
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search project categories..."
                    className="w-full rounded-xl border border-border bg-card py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#641C32] focus:ring-2 focus:ring-[#641C32]/10"
                  />
                </div>

                <select
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value)}
                  className="rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-[#641C32]"
                >
                  {projectTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground">
                Selected category:
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-[#641C32]/10 px-3 py-1.5 text-xs font-semibold text-[#641C32] dark:text-[#D9B8C4]">
                {selectedCategory}
                {selectedCategory !== "All Projects" && (
                  <button
                    onClick={() => setSelectedCategory("All Projects")}
                    aria-label="Clear selected category"
                  >
                    <X size={13} />
                  </button>
                )}
              </span>

              {projectType !== "All Types" && (
                <span className="rounded-full bg-muted px-3 py-1.5 text-xs font-medium">
                  {projectType}
                </span>
              )}

              {(selectedCategory !== "All Projects" ||
                projectType !== "All Types" ||
                searchQuery !== "") && (
                <button
                  onClick={resetFilters}
                  className="text-xs font-semibold text-[#641C32] hover:underline"
                >
                  Clear filters
                </button>
              )}
            </div>

            <div className="rounded-2xl border border-dashed border-border bg-card/50 px-5 py-12 text-center sm:px-10">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#641C32]/10 text-[#641C32]">
                {activeTab === "My Projects" ? (
                  <FolderKanban size={27} />
                ) : activeTab === "Find Collaborations" ? (
                  <Users size={27} />
                ) : (
                  <Rocket size={27} />
                )}
              </div>

              <h3 className="mt-5 text-lg font-bold">
                {activeTab === "My Projects"
                  ? "Your project space is ready"
                  : activeTab === "Find Collaborations"
                  ? "Find your next collaboration"
                  : "Discover something innovative"}
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                {activeTab === "My Projects"
                  ? "Projects you create and publish will appear here. Build your portfolio and showcase your work."
                  : activeTab === "Find Collaborations"
                  ? "Projects seeking team members will appear here. Connect with students who share your interests and skills."
                  : "Projects from registered ZUNO members will appear here. Explore different disciplines and find ideas worth building."}
              </p>

              <p className="mt-5 text-xs text-muted-foreground">
                {activeCategory?.name || "All disciplines"}
                {projectType !== "All Types" ? ` · ${projectType}` : ""}
              </p>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-[#641C32]/10 p-3 text-[#641C32]">
                <Users size={23} />
              </div>
              <div>
                <h3 className="font-bold">Build something together.</h3>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  Great ideas happen when different disciplines meet.
                  Connect developers, designers, researchers, biotechnology
                  students and innovators to create meaningful solutions.
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
