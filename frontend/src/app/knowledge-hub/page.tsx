"use client";

import { useEffect, useMemo, useState } from "react";
import Sidebar from "@/components/sidebar";
import Topbar from "@/components/topbar";
import {
  BookOpen,
  Search,
  Bookmark,
  Plus,
  X,
  FileText,
  Video,
  GraduationCap,
  ExternalLink,
  Loader2,
  Filter,
} from "lucide-react";

type Resource = {
  _id?: string;
  id?: string;
  title: string;
  description: string;
  category: string;
  type: string;
  url: string;
  author?: string;
};

const categories = [
  "All Resources",
  "Programming",
  "Biotechnology",
  "AI & Machine Learning",
  "Engineering",
  "Research",
  "Business",
  "Science",
  "Other",
];

const resourceTypes = [
  "All Types",
  "Article",
  "Tutorial",
  "Study Guide",
  "Video",
  "Research Paper",
  "External Resource",
];

export default function KnowledgeHubPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [activeCategory, setActiveCategory] = useState("All Resources");
  const [activeType, setActiveType] = useState("All Types");
  const [activeTab, setActiveTab] = useState("Discover");
  const [search, setSearch] = useState("");
  const [saved, setSaved] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState<Resource | null>(null);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Programming",
    type: "Article",
    url: "",
  });

  useEffect(() => {
    const stored = localStorage.getItem("zuno-knowledge-saved");
    if (stored) setSaved(JSON.parse(stored));

    const loadResources = async () => {
      try {
        const response = await fetch(
          "http://localhost:5001/api/knowledge-hub"
        );

        if (response.ok) {
          const data = await response.json();
          setResources(Array.isArray(data) ? data : data.resources || []);
        }
      } catch {
        setMessage("Knowledge Hub resources are currently unavailable.");
      } finally {
        setLoading(false);
      }
    };

    loadResources();
  }, []);

  const filteredResources = useMemo(() => {
    return resources.filter((resource) => {
      const matchesCategory =
        activeCategory === "All Resources" ||
        resource.category === activeCategory;

      const matchesType =
        activeType === "All Types" || resource.type === activeType;

      const matchesSearch =
        `${resource.title} ${resource.description} ${resource.category}`
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesTab =
        activeTab !== "Saved Resources" ||
        saved.includes(resource._id || resource.id || "");

      return (
        matchesCategory &&
        matchesType &&
        matchesSearch &&
        matchesTab
      );
    });
  }, [resources, activeCategory, activeType, search, activeTab, saved]);

  const toggleSaved = (resource: Resource) => {
    const id = resource._id || resource.id;
    if (!id) return;

    const updated = saved.includes(id)
      ? saved.filter((item) => item !== id)
      : [...saved, id];

    setSaved(updated);
    localStorage.setItem("zuno-knowledge-saved", JSON.stringify(updated));
  };

  const submitResource = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");

    try {
      const response = await fetch(
        "http://localhost:5001/api/knowledge-hub",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      if (!response.ok) {
        throw new Error("Resource submission failed.");
      }

      const result = await response.json();
      const newResource = result.resource || result;

      setResources((previous) => [newResource, ...previous]);
      setShowForm(false);
      setForm({
        title: "",
        description: "",
        category: "Programming",
        type: "Article",
        url: "",
      });
      setMessage("Resource submitted successfully.");
    } catch {
      setMessage(
        "Unable to submit. The Knowledge Hub backend API may not be available yet."
      );
    }
  };

  const resourceIcon = (type: string) => {
    if (type === "Video") return <Video size={20} />;
    if (type === "Study Guide") return <GraduationCap size={20} />;
    return <FileText size={20} />;
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

        <div className="mx-auto max-w-7xl space-y-8 px-5 py-8 md:px-8">
          <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-[#641C32] via-[#762B45] to-[#8F5368] p-8 text-white md:p-10">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
              <div className="max-w-2xl">
                <div className="mb-4 flex items-center gap-2 text-sm font-medium text-white/80">
                  <BookOpen size={18} />
                  ZUNO LEARNING SPACE
                </div>
                <h1 className="text-3xl font-bold md:text-4xl">
                  Knowledge Hub
                </h1>
                <p className="mt-3 text-sm leading-7 text-white/85 md:text-base">
                  Discover learning resources, explore new subjects, and share
                  knowledge with the ZUNO community.
                </p>
              </div>

              <button
                onClick={() => setShowForm(true)}
                className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-[#641C32] transition hover:bg-[#F8F3F4]"
              >
                <Plus size={18} />
                Share Knowledge
              </button>
            </div>
          </section>

          <section className="flex flex-wrap gap-3">
            {["Discover", "Saved Resources", "My Contributions"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-xl px-5 py-3 text-sm font-semibold transition ${
                  activeTab === tab
                    ? "bg-[#641C32] text-white"
                    : "border border-gray-200 bg-white text-gray-600 hover:border-[#C9AAB5] dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                }`}
              >
                {tab}
              </button>
            ))}
          </section>

          <section className="grid gap-4 md:grid-cols-[1fr_220px]">
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={19}
              />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search articles, tutorials, research..."
                className="w-full rounded-xl border border-gray-200 bg-white py-4 pl-12 pr-4 text-sm outline-none focus:border-[#8F5368] dark:border-gray-700 dark:bg-gray-900"
              />
            </div>

            <div className="relative">
              <Filter
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={17}
              />
              <select
                value={activeType}
                onChange={(event) => setActiveType(event.target.value)}
                className="w-full appearance-none rounded-xl border border-gray-200 bg-white py-4 pl-11 pr-4 text-sm outline-none dark:border-gray-700 dark:bg-gray-900"
              >
                {resourceTypes.map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </select>
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-lg font-bold">Explore Categories</h2>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`rounded-full px-4 py-2 text-sm transition ${
                    activeCategory === category
                      ? "bg-[#641C32] text-white"
                      : "border border-gray-200 bg-white text-gray-600 hover:border-[#C9AAB5] dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </section>

          {message && (
            <p className="rounded-xl bg-[#F8F3F4] p-4 text-sm text-[#641C32] dark:bg-[#3B202B] dark:text-[#F2DDE4]">
              {message}
            </p>
          )}

          <section>
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">
                  {activeTab === "Saved Resources"
                    ? "Your Saved Resources"
                    : activeTab === "My Contributions"
                    ? "My Contributions"
                    : "Explore Resources"}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  {filteredResources.length} resources found
                </p>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center py-16">
                <Loader2 className="animate-spin text-[#641C32]" size={30} />
              </div>
            ) : filteredResources.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-300 px-6 py-16 text-center dark:border-gray-700">
                <BookOpen className="mx-auto mb-4 text-gray-400" size={38} />
                <h3 className="text-lg font-semibold">No resources available</h3>
                <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
                  Resources will appear here when they are available. You can
                  also contribute useful learning material to the community.
                </p>
                <button
                  onClick={() => setShowForm(true)}
                  className="mt-5 rounded-xl bg-[#641C32] px-5 py-3 text-sm font-semibold text-white hover:bg-[#4F1628]"
                >
                  Share a Resource
                </button>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {filteredResources.map((resource) => {
                  const id = resource._id || resource.id || "";
                  return (
                    <article
                      key={id || resource.title}
                      className="rounded-2xl border border-gray-200 bg-white p-5 transition hover:-translate-y-1 hover:shadow-lg dark:border-gray-700 dark:bg-gray-900"
                    >
                      <div className="mb-5 flex items-start justify-between">
                        <div className="rounded-xl bg-[#F8F3F4] p-3 text-[#641C32] dark:bg-[#3B202B] dark:text-[#D7B7C2]">
                          {resourceIcon(resource.type)}
                        </div>
                        <button
                          onClick={() => toggleSaved(resource)}
                          aria-label="Save resource"
                          className={`rounded-lg p-2 ${
                            saved.includes(id)
                              ? "text-[#641C32]"
                              : "text-gray-400 hover:text-[#641C32]"
                          }`}
                        >
                          <Bookmark
                            size={20}
                            fill={saved.includes(id) ? "currentColor" : "none"}
                          />
                        </button>
                      </div>

                      <p className="text-xs font-semibold uppercase tracking-wide text-[#641C32]">
                        {resource.category} · {resource.type}
                      </p>
                      <h3 className="mt-2 line-clamp-2 text-lg font-bold">
                        {resource.title}
                      </h3>
                      <p className="mt-2 line-clamp-3 text-sm leading-6 text-gray-500">
                        {resource.description}
                      </p>

                      <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-800">
                        <button
                          onClick={() => setSelected(resource)}
                          className="text-sm font-semibold text-[#641C32] hover:underline"
                        >
                          View details
                        </button>
                        {resource.url && (
                          <a
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Open resource"
                            className="text-gray-400 hover:text-[#641C32]"
                          >
                            <ExternalLink size={18} />
                          </a>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </main>

      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/60 p-4">
          <form
            onSubmit={submitResource}
            className="my-8 w-full max-w-xl space-y-4 rounded-2xl bg-white p-6 text-gray-900 shadow-2xl dark:bg-gray-900 dark:text-white"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Share Knowledge</h2>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                aria-label="Close form"
              >
                <X />
              </button>
            </div>

            <input
              required
              placeholder="Resource title"
              value={form.title}
              onChange={(event) =>
                setForm({ ...form, title: event.target.value })
              }
              className="w-full rounded-xl border border-gray-300 bg-transparent p-3 text-sm dark:border-gray-700"
            />

            <textarea
              required
              rows={4}
              placeholder="Describe this resource"
              value={form.description}
              onChange={(event) =>
                setForm({ ...form, description: event.target.value })
              }
              className="w-full rounded-xl border border-gray-300 bg-transparent p-3 text-sm dark:border-gray-700"
            />

            <select
              value={form.category}
              onChange={(event) =>
                setForm({ ...form, category: event.target.value })
              }
              className="w-full rounded-xl border border-gray-300 bg-transparent p-3 text-sm dark:border-gray-700"
            >
              {categories.slice(1).map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>

            <select
              value={form.type}
              onChange={(event) =>
                setForm({ ...form, type: event.target.value })
              }
              className="w-full rounded-xl border border-gray-300 bg-transparent p-3 text-sm dark:border-gray-700"
            >
              {resourceTypes.slice(1).map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>

            <input
              required
              type="url"
              placeholder="Resource URL (https://...)"
              value={form.url}
              onChange={(event) =>
                setForm({ ...form, url: event.target.value })
              }
              className="w-full rounded-xl border border-gray-300 bg-transparent p-3 text-sm dark:border-gray-700"
            />

            <button
              type="submit"
              className="w-full rounded-xl bg-[#641C32] py-3 font-semibold text-white hover:bg-[#4F1628]"
            >
              Submit Resource
            </button>
          </form>
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 text-gray-900 shadow-2xl dark:bg-gray-900 dark:text-white">
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-xl font-bold">{selected.title}</h2>
              <button onClick={() => setSelected(null)} aria-label="Close details">
                <X />
              </button>
            </div>
            <p className="mt-3 text-sm text-[#641C32]">
              {selected.category} · {selected.type}
            </p>
            <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-gray-600 dark:text-gray-300">
              {selected.description}
            </p>
            {selected.url && (
              <a
                href={selected.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#641C32] px-5 py-3 text-sm font-semibold text-white"
              >
                Open Resource <ExternalLink size={16} />
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
