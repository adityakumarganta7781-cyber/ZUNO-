
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    const handleIntroComplete = (event: MessageEvent) => {
      if (event.data?.type !== "ZUNO_INTRO_COMPLETE") return;

      if (loading) return;

      router.replace(user ? "/dashboard" : "/login");
    };

    window.addEventListener("message", handleIntroComplete);

    return () => {
      window.removeEventListener("message", handleIntroComplete);
    };
  }, [router, user, loading]);

  return (
    <main className="fixed inset-0 overflow-hidden bg-[#14040A]">
      <iframe
        src="/zuno-intro.html"
        title="ZUNO Animated Introduction"
        className="h-full w-full border-0"
        allow="autoplay"
      />
    </main>
  );
}
