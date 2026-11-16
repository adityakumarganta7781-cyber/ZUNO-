
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Compass,
  SlidersHorizontal,
  Users,
  FolderKanban,
  CalendarDays,
  BriefcaseBusiness,
  Rocket,
  BookOpen,
  Store,
  Settings,
  Sparkles,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Discover", href: "/discover", icon: Compass },
  { name: "Filters", href: "/filters", icon: SlidersHorizontal },
  { name: "Network", href: "/network", icon: Users },
  { name: "Projects", href: "/projects", icon: FolderKanban },
  { name: "Events", href: "/events", icon: CalendarDays },
  { name: "Opportunities", href: "/opportunities", icon: BriefcaseBusiness },
  { name: "Startups", href: "/startups", icon: Rocket },
  { name: "Knowledge Hub", href: "/knowledge-hub", icon: BookOpen },
  { name: "Marketplace", href: "/marketplace", icon: Store },
];

const upcoming: { name: string; icon: typeof Store }[] = [];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-[#E8DADF] bg-white dark:border-[#49202F] dark:bg-[#1D1117]">

      <div className="flex h-20 shrink-0 items-center gap-3 border-b border-[#E8DADF] px-6 dark:border-[#49202F]">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#641C32] text-white shadow-md shadow-[#641C32]/20">
          <Sparkles size={22} />
        </div>

        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#641C32] dark:text-white">
            ZUNO
          </h1>
          <p className="text-[10px] font-semibold tracking-[0.2em] text-[#8F5368] dark:text-[#C99AA9]">
            DISCOVER. CONNECT. BUILD. GROW.
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6">
        <p className="mb-4 px-3 text-xs font-bold uppercase tracking-wider text-[#8F5368] dark:text-[#C99AA9]">
          Workspace
        </p>

        <nav className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;

            const active =
              pathname === item.href ||
              pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200 ${
                  active
                    ? "bg-[#641C32] text-white shadow-md shadow-[#641C32]/20"
                    : "text-[#59434B] hover:bg-[#F8F3F4] hover:text-[#641C32] dark:text-[#D9C5CC] dark:hover:bg-[#39212B] dark:hover:text-white"
                }`}
              >
                <Icon size={19} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {upcoming.length > 0 && (
          <>
            <div className="mb-4 mt-9 px-3 text-xs font-bold uppercase tracking-wider text-[#8F5368] dark:text-[#C99AA9]">
              Coming Soon
            </div>

            <div className="space-y-1">
              {upcoming.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.name}
                    className="flex cursor-not-allowed items-center justify-between rounded-xl px-3 py-3 text-sm text-[#B8A5AC] dark:text-[#80616D]"
                  >
                    <span className="flex items-center gap-3">
                      <Icon size={19} />
                      {item.name}
                    </span>

                    <span className="rounded-md bg-[#F8F3F4] px-2 py-1 text-[9px] font-bold text-[#8F5368] dark:bg-[#39212B] dark:text-[#D5A9B8]">
                      SOON
                    </span>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      <div className="shrink-0 border-t border-[#E8DADF] p-4 dark:border-[#49202F]">
        <Link
          href="/settings"
          className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200 ${
            pathname === "/settings"
              ? "bg-[#641C32] text-white shadow-md shadow-[#641C32]/20"
              : "text-[#59434B] hover:bg-[#F8F3F4] hover:text-[#641C32] dark:text-[#D9C5CC] dark:hover:bg-[#39212B] dark:hover:text-white"
          }`}
        >
          <Settings size={19} />
          Settings
        </Link>
      </div>
    </aside>
  );
}
