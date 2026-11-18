
"use client";

import { useState } from "react";
import Sidebar from "@/components/sidebar";
import Topbar from "@/components/topbar";
import {
  Search,
  Users,
  UserCheck,
  UserRoundPlus,
  Clock3,
  Sparkles,
  GraduationCap,
  ArrowUpRight,
  Network as NetworkIcon,
} from "lucide-react";

type Tab = "discover" | "connections" | "requests";

export default function NetworkPage() {
  const [activeTab, setActiveTab] = useState<Tab>("discover");
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(true);

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

        <main className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
          <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-xs font-semibold tracking-wide text-muted-foreground">
                <Sparkles size={14} />
                ZUNO GLOBAL NETWORK
              </div>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Network
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                Discover and connect with students, researchers, creators
                and professionals who are part of the ZUNO community.
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-border bg-card px-5 py-3">
              <Users size={21} className="text-muted-foreground" />
              <div>
                <p className="text-sm font-bold">ZUNO Community</p>
                <p className="text-xs text-muted-foreground">
                  Grow together
                </p>
              </div>
            </div>
          </div>

          <section className="relative mb-8 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#641C32] via-[#762B45] to-[#8F5368] p-7 text-white sm:p-9">
            <div className="relative z-10 max-w-2xl">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#F3E5E9]">
                Discover. Connect. Build. Grow.
              </p>

              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Great opportunities begin with meaningful connections.
              </h2>

              <p className="mt-3 text-sm leading-6 text-[#F3E5E9]">
                Find people who share your interests, exchange ideas
                and build meaningful collaborations within the ZUNO
                global community.
              </p>

              <button
                type="button"
                onClick={() => {
                  setActiveTab("discover");
                  document.getElementById("network-directory")?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#641C32] transition hover:bg-[#F8F3F4]"
              >
                Discover members
                <ArrowUpRight size={17} />
              </button>
            </div>

            <div className="pointer-events-none absolute -right-12 -top-16 h-64 w-64 rounded-full border border-white/20" />
            <div className="pointer-events-none absolute -bottom-28 right-12 h-72 w-72 rounded-full border border-white/20" />
          </section>

          <section id="network-directory" className="scroll-mt-24">
            <div className="mb-6 flex flex-wrap gap-2 border-b border-border pb-4">
              {[
                {
                  key: "discover" as Tab,
                  label: "Discover People",
                  icon: Search,
                },
                {
                  key: "connections" as Tab,
                  label: "My Network",
                  icon: UserCheck,
                },
                {
                  key: "requests" as Tab,
                  label: "Requests",
                  icon: Clock3,
                },
              ].map((tab) => {
                const Icon = tab.icon;

                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveTab(tab.key)}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                      activeTab === tab.key
                        ? "bg-[#641C32] text-white"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <Icon size={16} />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {activeTab === "discover" && (
              <>
                <label className="mb-6 flex items-center gap-3 rounded-xl border border-border bg-card px-4">
                  <Search
                    size={18}
                    className="shrink-0 text-muted-foreground"
                  />
                  <input
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search ZUNO members by name, university or skills..."
                    className="h-12 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                  />
                </label>

                <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                    <NetworkIcon
                      size={30}
                      className="text-muted-foreground"
                    />
                  </div>

                  <h3 className="mt-5 text-xl font-bold">
                    Your ZUNO network starts here
                  </h3>

                  <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-muted-foreground">
                    {search.trim()
                      ? "Member search will be available when registered ZUNO accounts are connected."
                      : "There are no members to display yet. As people register on ZUNO, their profiles will appear here so you can discover and connect with them."}
                  </p>

                  <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-muted px-4 py-2 text-xs font-medium text-muted-foreground">
                    <UserRoundPlus size={15} />
                    Waiting for ZUNO members
                  </div>
                </div>
              </>
            )}

            {activeTab === "connections" && (
              <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
                <UserCheck
                  size={34}
                  className="mx-auto text-muted-foreground"
                />

                <h3 className="mt-5 text-xl font-bold">
                  Your connections will appear here
                </h3>

                <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-muted-foreground">
                  Once you connect with registered ZUNO members,
                  you can find and manage your network here.
                </p>
              </div>
            )}

            {activeTab === "requests" && (
              <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
                <Clock3
                  size={34}
                  className="mx-auto text-muted-foreground"
                />

                <h3 className="mt-5 text-xl font-bold">
                  No connection requests yet
                </h3>

                <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-muted-foreground">
                  Connection requests from registered ZUNO members
                  will appear here.
                </p>
              </div>
            )}
          </section>

          <section className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-muted">
                <GraduationCap size={21} />
              </div>
              <h3 className="mt-4 font-bold">
                Connect across universities
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Meet students and professionals from universities
                participating in ZUNO.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-muted">
                <Users size={21} />
              </div>
              <h3 className="mt-4 font-bold">
                Build your community
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Find collaborators, exchange knowledge and grow
                your professional relationships.
              </p>
            </div>
          </section>

          <div className="mt-10 border-t border-border pt-6 text-xs text-muted-foreground">
            ZUNO Network · A community built around real members.
          </div>
        </main>
      </div>
    </div>
  );
}
