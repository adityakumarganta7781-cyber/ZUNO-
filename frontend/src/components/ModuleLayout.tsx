
"use client";

import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import Sidebar from "@/components/sidebar";
import Topbar from "@/components/topbar";

type ModuleLayoutProps = {
  children: ReactNode;
};

export default function ModuleLayout({ children }: ModuleLayoutProps) {
  const [menuOpen, setMenuOpen] = useState(true);

  const sidebarWidth = menuOpen ? "256px" : "76px";

  const layoutStyle = {
    "--zuno-sidebar-width": sidebarWidth,
  } as CSSProperties;

  return (
    <div
      className="min-h-screen w-full overflow-x-hidden bg-background text-foreground"
      style={layoutStyle}
    >
      <aside
        className="fixed inset-y-0 left-0 z-50 hidden md:block"
        style={{ width: "var(--zuno-sidebar-width)" }}
      >
        <Sidebar
          menuOpen={menuOpen}
          onMenuToggle={() => setMenuOpen((previous) => !previous)}
        />
      </aside>

      <div
        className="min-h-screen min-w-0 transition-[margin-left,width] duration-300 ease-in-out"
        style={{
          marginLeft: "var(--zuno-sidebar-width)",
          width: "calc(100% - var(--zuno-sidebar-width))",
        }}
      >
        <header className="sticky top-0 z-40 w-full">
          <Topbar />
        </header>

        <main className="mx-auto w-full max-w-7xl min-w-0 px-5 py-8 sm:px-8 lg:px-10">
          {children}
        </main>
      </div>
    </div>
  );
}
