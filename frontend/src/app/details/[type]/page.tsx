
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ExternalLink,
  Loader2,
  AlertCircle,
  UserRound,
  Building2,
  Users,
  FileText,
  BookOpen,
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

type DetailData = Record<string, any>;

const typeConfig: Record<
  string,
  { title: string; icon: any; endpoint: (id: string) => string }
> = {
  student: {
    title: "Student Profile",
    icon: UserRound,
    endpoint: (id) => `/api/discovery/students/${id}`,
  },
  university: {
    title: "University Details",
    icon: Building2,
    endpoint: (id) => `/api/universities/${id}`,
  },
  community: {
    title: "Community Details",
    icon: Users,
    endpoint: (id) => `/api/communities/${id}`,
  },
  resource: {
    title: "Resource Details",
    icon: BookOpen,
    endpoint: (id) => `/api/resources/${id}`,
  },
};

function getObject(data: any): DetailData {
  if (!data || typeof data !== "object") return {};
  return (
    data.data ||
    data.user ||
    data.university ||
    data.community ||
    data.resource ||
    data
  );
}

function readableLabel(value: string) {
  return value
    .replace(/([A-Z])/g, " $1")
    .replace(/[_-]/g, " ")
    .replace(/^./, (letter) => letter.toUpperCase());
}

function isDisplayable(value: any) {
  return (
    value !== null &&
    value !== undefined &&
    value !== "" &&
    typeof value !== "function" &&
    typeof value !== "object"
  );
}

export default function DetailsPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const type = String(params.type || "");
  const id = String(params.id || "");
  const communityId = searchParams.get("communityId");

  const [data, setData] = useState<DetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadDetails() {
      setLoading(true);
      setError("");
      setData(null);

      try {
        let result: any;

        if (type === "post") {
          if (!communityId) {
            throw new Error("Community information is missing for this post.");
          }

          const response = await fetch(
            `${API_URL}/api/communities/${communityId}/posts?page=1&limit=50`,
            { credentials: "include" }
          );

          if (!response.ok) {
            throw new Error(`Unable to load post (${response.status}).`);
          }

          const payload = await response.json();
          const posts = payload.posts || payload.data?.posts || payload.data || [];
          const postList = Array.isArray(posts) ? posts : [];

          result = postList.find(
            (post: any) => String(post._id || post.id) === id
          );

          if (!result) {
            throw new Error("Post not found in the community response.");
          }
        } else {
          const config = typeConfig[type];

          if (!config) {
            throw new Error("This detail type is not supported.");
          }

          const response = await fetch(
            `${API_URL}${config.endpoint(id)}`,
            { credentials: "include" }
          );

          if (!response.ok) {
            throw new Error(`Unable to load details (${response.status}).`);
          }

          const payload = await response.json();
          result = getObject(payload);

          if (payload.success === false) {
            throw new Error(payload.message || "Unable to load details.");
          }
        }

        if (!cancelled) {
          setData(result);
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(err.message || "Something went wrong.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    if (type && id) {
      loadDetails();
    } else {
      setError("The requested details could not be identified.");
      setLoading(false);
    }

    return () => {
      cancelled = true;
    };
  }, [type, id, communityId]);

  const config = typeConfig[type];
  const Icon = type === "post" ? FileText : config?.icon || FileText;

  const title =
    data?.name ||
    data?.title ||
    data?.fullName ||
    data?.username ||
    (type === "post" ? "Community Post" : "Details");

  const excludedKeys = [
    "_id",
    "__v",
    "password",
    "passwordHash",
    "token",
    "refreshToken",
    "createdAt",
    "updatedAt",
  ];

  const fields = data
    ? Object.entries(data).filter(
        ([key, value]) =>
          !excludedKeys.includes(key) &&
          isDisplayable(value) &&
          !key.toLowerCase().includes("password")
      )
    : [];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
      <main className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8">
        <button
          onClick={() => router.back()}
          className="mb-7 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <ArrowLeft size={17} />
          Go Back
        </button>

        {loading && (
          <div className="flex min-h-[350px] flex-col items-center justify-center gap-4">
            <Loader2 className="animate-spin text-violet-600" size={38} />
            <p className="text-sm text-slate-500">Loading details...</p>
          </div>
        )}

        {!loading && error && (
          <div className="mx-auto mt-12 max-w-xl rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm dark:border-red-900 dark:bg-slate-900">
            <AlertCircle className="mx-auto mb-4 text-red-500" size={42} />
            <h1 className="text-xl font-bold">Unable to Load Details</h1>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
              {error}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-700"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && data && (
          <>
            <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="h-2 bg-gradient-to-r from-violet-600 to-indigo-600" />

              <div className="p-7 sm:p-10">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300">
                  <Icon size={30} />
                </div>

                <p className="text-sm font-semibold uppercase tracking-wider text-violet-600">
                  {config?.title || "Community Post"}
                </p>

                <h1 className="mt-3 break-words text-3xl font-bold sm:text-4xl">
                  {title}
                </h1>

                {data.description && (
                  <p className="mt-4 max-w-3xl whitespace-pre-wrap leading-7 text-slate-600 dark:text-slate-300">
                    {data.description}
                  </p>
                )}

                {data.content && (
                  <p className="mt-4 max-w-3xl whitespace-pre-wrap leading-7 text-slate-600 dark:text-slate-300">
                    {data.content}
                  </p>
                )}

                {data.image && (
                  <img
                    src={data.image}
                    alt={title}
                    className="mt-7 max-h-96 w-full rounded-2xl object-cover"
                  />
                )}

                {data.logo && (
                  <img
                    src={data.logo}
                    alt={`${title} logo`}
                    className="mt-7 h-24 w-24 rounded-xl border border-slate-200 bg-white object-contain p-2"
                  />
                )}
              </div>
            </section>

            <section className="mt-7 rounded-3xl border border-slate-200 bg-white p-7 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-9">
              <h2 className="mb-6 text-xl font-bold">Information</h2>

              {fields.length === 0 ? (
                <p className="text-sm text-slate-500">
                  No additional information is available.
                </p>
              ) : (
                <div className="grid gap-5 sm:grid-cols-2">
                  {fields.map(([key, value]) => {
                    if (
                      ["description", "content", "image", "logo"].includes(key)
                    ) {
                      return null;
                    }

                    return (
                      <div
                        key={key}
                        className="min-w-0 rounded-xl bg-slate-50 p-4 dark:bg-slate-800/70"
                      >
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                          {readableLabel(key)}
                        </p>
                        <p className="break-words text-sm font-medium">
                          {String(value)}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}

              {data.website && (
                <a
                  href={data.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-7 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white hover:bg-violet-700"
                >
                  Visit Website
                  <ExternalLink size={16} />
                </a>
              )}

              {data.resourceUrl && (
                <a
                  href={data.resourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-7 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white hover:bg-violet-700"
                >
                  Open Resource
                  <ExternalLink size={16} />
                </a>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}
