
"use client";

import { useMemo, useState } from "react";
import Sidebar from "@/components/sidebar";
import Topbar from "@/components/topbar";
import {
  Store,
  Search,
  SlidersHorizontal,
  Plus,
  Package,
  Laptop,
  Palette,
  BookOpen,
  Wrench,
  ShoppingBag,
  Heart,
  ArrowRight,
  X,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";

type Listing = {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  currency: string;
  seller: string;
  university: string;
  contact: string;
};

const categories = [
  { name: "All Listings", icon: Store },
  { name: "Digital Products", icon: Laptop },
  { name: "Student Services", icon: Wrench },
  { name: "Design & Creative", icon: Palette },
  { name: "Books & Resources", icon: BookOpen },
  { name: "Physical Products", icon: Package },
];

const initialForm = {
  title: "",
  description: "",
  category: "Digital Products",
  price: "",
  currency: "INR",
  university: "",
  contact: "",
};

export default function MarketplacePage() {
  const [tab, setTab] = useState("Explore Marketplace");
  const [category, setCategory] = useState("All Listings");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("Newest First");
  const [listings] = useState<Listing[]>([]);
  const [saved, setSaved] = useState<string[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [notice, setNotice] = useState("");
  const [menuOpen, setMenuOpen] = useState(true);

  const filteredListings = useMemo(() => {
    const results = listings.filter((listing) => {
      const matchesCategory =
        category === "All Listings" ||
        listing.category === category;

      const matchesSearch = [
        listing.title,
        listing.description,
        listing.category,
        listing.university,
      ]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesSaved =
        tab !== "Saved Listings" || saved.includes(listing.id);

      return matchesCategory && matchesSearch && matchesSaved;
    });

    if (sort === "Price: Low to High") {
      return [...results].sort((a, b) => a.price - b.price);
    }

    if (sort === "Price: High to Low") {
      return [...results].sort((a, b) => b.price - a.price);
    }

    return results;
  }, [listings, category, search, sort, saved, tab]);

  const submitListing = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setNotice(
      "Listing submission is not available yet. Marketplace publishing will be enabled after the backend and member authentication are connected."
    );
    setShowForm(false);
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

        <main className="mx-auto max-w-7xl space-y-8 px-5 py-8 md:px-8">
          <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#641C32] via-[#762B45] to-[#8F5368] p-8 text-white md:p-10">
            <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
              <div className="max-w-2xl">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-xs font-bold tracking-wide">
                  <Store size={16} />
                  ZUNO MARKETPLACE
                </div>

                <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">
                  Discover. Create. Exchange.
                </h1>

                <p className="mt-4 max-w-xl text-sm leading-7 text-white/85 md:text-base">
                  Explore student-created products, discover talented
                  creators, and connect with sellers from universities
                  around the world.
                </p>

                <div className="mt-7 flex flex-wrap gap-3">
                  <button
                    onClick={() => {
                      setTab("Explore Marketplace");
                      document
                        .getElementById("marketplace-listings")
                        ?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#641C32] hover:bg-[#F8F3F4]"
                  >
                    Explore Listings
                    <ArrowRight size={17} />
                  </button>

                  <button
                    onClick={() => {
                      setNotice("");
                      setShowForm(true);
                    }}
                    className="inline-flex items-center gap-2 rounded-xl border border-white/40 bg-white/10 px-5 py-3 text-sm font-semibold text-white hover:bg-white/20"
                  >
                    <Plus size={18} />
                    Create Listing
                  </button>
                </div>
              </div>

              <ShoppingBag
                size={145}
                strokeWidth={1}
                className="hidden text-white/20 lg:block"
              />
            </div>
          </section>

          <section className="grid gap-4 sm:grid-cols-3">
            {[
              {
                label: "Student Marketplace",
                description: "A space for university creators",
                icon: Store,
              },
              {
                label: "Explore Services",
                description: "Discover skills and expertise",
                icon: Wrench,
              },
              {
                label: "Creator Community",
                description: "Connect across universities",
                icon: ShieldCheck,
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5"
                >
                  <div className="rounded-xl bg-[#F8F3F4] p-3 text-[#641C32] dark:bg-[#39212B]">
                    <Icon size={22} />
                  </div>
                  <div>
                    <h3 className="font-bold">{item.label}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </section>

          <section>
            <h2 className="mb-4 text-xl font-bold">
              Explore Categories
            </h2>

            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
              {categories.map((item) => {
                const Icon = item.icon;
                const active = category === item.name;

                return (
                  <button
                    key={item.name}
                    onClick={() => {
                      setCategory(item.name);
                      setTab("Explore Marketplace");
                    }}
                    className={`flex flex-col items-center gap-3 rounded-2xl border p-5 text-center transition ${
                      active
                        ? "border-[#641C32] bg-[#F8F3F4] text-[#641C32] dark:bg-[#39212B] dark:text-[#D9B8C4]"
                        : "border-border bg-card hover:border-[#C9AAB5]"
                    }`}
                  >
                    <Icon size={25} />
                    <span className="text-xs font-semibold">
                      {item.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          <section id="marketplace-listings" className="space-y-5">
            <div className="flex flex-wrap gap-3">
              {[
                "Explore Marketplace",
                "Saved Listings",
                "My Listings",
              ].map((item) => (
                <button
                  key={item}
                  onClick={() => setTab(item)}
                  className={`rounded-xl px-5 py-3 text-sm font-semibold transition ${
                    tab === item
                      ? "bg-[#641C32] text-white"
                      : "border border-border bg-card text-muted-foreground hover:border-[#C9AAB5]"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-3 md:flex-row">
              <div className="relative flex-1">
                <Search
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search products, services, creators..."
                  className="w-full rounded-xl border border-border bg-card py-4 pl-12 pr-4 text-sm outline-none focus:border-[#641C32]"
                />
              </div>

              <div className="relative md:w-56">
                <SlidersHorizontal
                  size={17}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <select
                  value={sort}
                  onChange={(event) => setSort(event.target.value)}
                  className="w-full appearance-none rounded-xl border border-border bg-card py-4 pl-11 pr-4 text-sm"
                >
                  <option>Newest First</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                </select>
              </div>
            </div>

            {notice && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200">
                {notice}
              </div>
            )}

            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">{tab}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {filteredListings.length} listings available
                </p>
              </div>
            </div>

            {filteredListings.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F8F3F4] text-[#641C32] dark:bg-[#39212B]">
                  {tab === "Saved Listings" ? (
                    <Heart size={30} />
                  ) : (
                    <Store size={30} />
                  )}
                </div>

                <h3 className="text-lg font-bold">
                  {tab === "Saved Listings"
                    ? "No saved listings yet"
                    : tab === "My Listings"
                    ? "You have not published any listings"
                    : "No marketplace listings available"}
                </h3>

                <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground">
                  {tab === "Saved Listings"
                    ? "Listings you save will appear here when the Marketplace is connected."
                    : tab === "My Listings"
                    ? "Your published products and services will appear here after listing creation is enabled."
                    : "Marketplace listings will appear here when the listing service is connected and creators start publishing."}
                </p>

                {tab === "My Listings" && (
                  <button
                    onClick={() => setShowForm(true)}
                    className="mt-6 rounded-xl bg-[#641C32] px-5 py-3 text-sm font-semibold text-white"
                  >
                    <Plus size={16} className="mr-2 inline" />
                    Create Listing
                  </button>
                )}
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {filteredListings.map((listing) => (
                  <article
                    key={listing.id}
                    className="rounded-2xl border border-border bg-card p-5"
                  >
                    <div className="flex justify-between gap-3">
                      <span className="text-xs font-bold text-[#641C32]">
                        {listing.category}
                      </span>
                      <button
                        onClick={() =>
                          setSaved((current) =>
                            current.includes(listing.id)
                              ? current.filter((id) => id !== listing.id)
                              : [...current, listing.id]
                          )
                        }
                        aria-label="Save listing"
                      >
                        <Heart
                          size={19}
                          fill={
                            saved.includes(listing.id)
                              ? "currentColor"
                              : "none"
                          }
                        />
                      </button>
                    </div>

                    <h3 className="mt-3 text-lg font-bold">
                      {listing.title}
                    </h3>

                    <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                      {listing.description}
                    </p>

                    <p className="mt-4 font-bold">
                      {listing.currency} {listing.price}
                    </p>

                    <p className="mt-2 text-xs text-muted-foreground">
                      {listing.seller} · {listing.university}
                    </p>

                    {listing.contact && (
                      <a
                        href={listing.contact}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#641C32]"
                      >
                        Contact Seller
                        <ExternalLink size={15} />
                      </a>
                    )}
                  </article>
                ))}
              </div>
            )}
          </section>

          <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
            ZUNO · Discover. Connect. Build. Grow.
          </footer>
        </main>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/60 p-4">
          <form
            onSubmit={submitListing}
            className="my-8 w-full max-w-xl space-y-4 rounded-2xl bg-card p-6 text-foreground shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">
                Create Marketplace Listing
              </h2>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                aria-label="Close"
              >
                <X size={22} />
              </button>
            </div>

            <p className="text-sm text-muted-foreground">
              Prepare your listing details. Publishing will be enabled
              when Marketplace accounts and backend services are ready.
            </p>

            <input
              required
              placeholder="Product or service title"
              value={form.title}
              onChange={(event) =>
                setForm({ ...form, title: event.target.value })
              }
              className="w-full rounded-xl border border-border bg-transparent p-3 text-sm"
            />

            <textarea
              required
              rows={4}
              placeholder="Describe your product or service"
              value={form.description}
              onChange={(event) =>
                setForm({ ...form, description: event.target.value })
              }
              className="w-full rounded-xl border border-border bg-transparent p-3 text-sm"
            />

            <select
              value={form.category}
              onChange={(event) =>
                setForm({ ...form, category: event.target.value })
              }
              className="w-full rounded-xl border border-border bg-transparent p-3 text-sm"
            >
              {categories.slice(1).map((item) => (
                <option key={item.name}>{item.name}</option>
              ))}
            </select>

            <div className="grid grid-cols-2 gap-3">
              <input
                required
                min="0"
                type="number"
                placeholder="Price"
                value={form.price}
                onChange={(event) =>
                  setForm({ ...form, price: event.target.value })
                }
                className="w-full rounded-xl border border-border bg-transparent p-3 text-sm"
              />

              <select
                value={form.currency}
                onChange={(event) =>
                  setForm({ ...form, currency: event.target.value })
                }
                className="w-full rounded-xl border border-border bg-transparent p-3 text-sm"
              >
                <option value="INR">INR</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>

            <input
              required
              placeholder="University"
              value={form.university}
              onChange={(event) =>
                setForm({ ...form, university: event.target.value })
              }
              className="w-full rounded-xl border border-border bg-transparent p-3 text-sm"
            />

            <input
              required
              type="url"
              placeholder="Contact or portfolio URL (https://...)"
              value={form.contact}
              onChange={(event) =>
                setForm({ ...form, contact: event.target.value })
              }
              className="w-full rounded-xl border border-border bg-transparent p-3 text-sm"
            />

            <button
              type="submit"
              className="w-full rounded-xl bg-[#641C32] py-3 font-semibold text-white"
            >
              Continue
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
