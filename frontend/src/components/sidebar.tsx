
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
  Menu,
  X,
} from "lucide-react";

type SidebarProps = {
  menuOpen: boolean;
  onMenuToggle: () => void;
};

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

export default function Sidebar({
  menuOpen,
  onMenuToggle,
}: SidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <aside
      className={`flex h-full w-full flex-col overflow-hidden border-r border-white/15 bg-[#641C32] transition-all duration-300 ease-in-out`}
    >
      <div
        className={`flex h-20 shrink-0 items-center border-b border-white/15 ${
          menuOpen ? "justify-between px-5" : "justify-center px-2"
        }`}
      >
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#641C32] shadow-md">
            <Sparkles size={22} />
          </div>

          {menuOpen && (
            <div className="min-w-0">
              <h1 className="text-2xl font-extrabold tracking-tight text-white">
                ZUNO
              </h1>
              <p className="whitespace-nowrap text-[9px] font-semibold tracking-[0.12em] text-[#E8DADF]">
                DISCOVER. CONNECT.
              </p>
              <p className="whitespace-nowrap text-[9px] font-semibold tracking-[0.12em] text-[#E8DADF]">
                BUILD. GROW.
              </p>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={onMenuToggle}
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
          className={`shrink-0 rounded-lg p-2 text-white transition hover:bg-white/15 ${
            menuOpen ? "" : "absolute right-2"
          }`}
        >
          {menuOpen ? <X size={22} /> : <Menu size={23} />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-6">
        {menuOpen && (
          <p className="mb-4 px-3 text-xs font-bold uppercase tracking-wider text-[#E8DADF]">
            Workspace
          </p>
        )}

        <nav className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            if (!menuOpen && item.name !== "Dashboard") return null;

            return (
              <Link
                key={item.href}
                href={item.href}
                title={!menuOpen ? item.name : undefined}
                className={`flex items-center rounded-xl py-3 text-sm font-medium transition-all duration-200 ${
                  menuOpen
                    ? "gap-3 px-3"
                    : "justify-center px-0"
                } ${
                  active
                    ? "bg-white text-[#641C32] shadow-md"
                    : "text-white/90 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon size={19} className="shrink-0" />
                {menuOpen && (
                  <span className="whitespace-nowrap">{item.name}</span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {menuOpen && (
        <div className="shrink-0 border-t border-white/15 p-4">
          <Link
            href="/settings"
            className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all ${
              isActive("/settings")
                ? "bg-white text-[#641C32] shadow-md"
                : "text-white/90 hover:bg-white/10 hover:text-white"
            }`}
          >
            <Settings size={19} />
            Settings
          </Link>
        </div>
      )}
    </aside>
  );
}
