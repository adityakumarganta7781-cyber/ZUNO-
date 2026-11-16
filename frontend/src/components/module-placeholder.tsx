
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";

export default function ModulePlaceholder({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="max-w-lg text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-muted text-primary">
          <Sparkles size={30} />
        </div>

        <p className="mt-7 text-xs font-semibold tracking-widest text-primary">
          ZUNO ECOSYSTEM
        </p>

        <h1 className="mt-3 text-3xl font-bold">{title}</h1>

        <p className="mt-4 leading-7 text-gray-500">{description}</p>

        <p className="mt-5 text-sm text-gray-500">
          This module is planned for a future development milestone.
        </p>

        <Link
          href="/dashboard"
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white"
        >
          <ArrowLeft size={17} />
          Back to Dashboard
        </Link>
      </div>
    </main>
  );
}
