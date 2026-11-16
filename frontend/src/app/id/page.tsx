
"use client";

import { Suspense, useEffect, useState } from "react";
import type { ElementType, ReactNode } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  GraduationCap,
  Users,
  Globe,
  FileText,
  ExternalLink,
  Loader2,
  Sparkles,
  Tag,
  AlertCircle,
} from "lucide-react";

import Sidebar from "@/components/sidebar";
import Topbar from "@/components/topbar";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

type DetailData = Record<string, any>;

const typeConfig: Record<
  string,
  { title: string; icon: ElementType }
> = {
  student: { title: "Student Profile", icon: Users },
  university: { title: "University Details", icon: GraduationCap },
  community: { title: "Community Details", icon: Globe },
  post: { title: "Community Post", icon: FileText },
  resource: { title: "Learning Resource", icon: BookOpen },
};

function DetailPageContent() {
  const params = useParams<{ type: string; id: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();

  const type = params.type;
  const id = params.id;
  const communityId = searchParams.get("communityId");

  const [item, setItem] = useState<DetailData | null>(null);
  const [community, setCommunity] = useState<DetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const config = typeConfig[type];
  const Icon = config?.icon || Sparkles;

  useEffect(() => {
    const controller = new AbortController();

    async function loadDetails() {
      if (!config || !id) {
        setError("The requested result could not be identified.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");
        setItem(null);
        setCommunity(null);

        if (type === "post") {
          if (!communityId) {
            throw new Error(
              "Community information is missing for this post."
            );
          }

          const [communityResponse, postsResponse] = await Promise.all([
            fetch(`${API_URL}/api/communities/${communityId}`, {
              credentials: "include",
              signal: controller.signal,
            }),
            fetch(
              `${API_URL}/api/communities/${communityId}/posts?page=1&limit=50`,
              {
                credentials: "include",
                signal: controller.signal,
              }
            ),
          ]);

          if (
            communityResponse.status === 401 ||
            postsResponse.status === 401
          ) {
            router.replace("/login");
            return;
          }

          const communityData = await communityResponse.json();
          const postsData = await postsResponse.json();

          if (!communityResponse.ok || !communityData.success) {
            throw new Error(
              communityData.message || "Unable to load community."
            );
          }

          if (!postsResponse.ok || !postsData.success) {
            throw new Error(
              postsData.message || "Unable to load community posts."
            );
          }

          const foundPost = (postsData.posts || []).find(
            (post: DetailData) => String(post._id) === String(id)
          );

          if (!foundPost) {
            throw new Error(
              "Post not found in the first 50 loaded community posts."
            );
          }

          setCommunity(communityData.community);
          setItem(foundPost);
          return;
        }

        const endpoints: Record<string, string> = {
          student: `/api/discovery/students/${id}`,
          university: `/api/universities/${id}`,
          community: `/api/communities/${id}`,
          resource: `/api/resources/${id}`,
        };

        const endpoint = endpoints[type];

        if (!endpoint) {
          throw new Error("Unsupported detail type.");
        }

        const response = await fetch(`${API_URL}${endpoint}`, {
          method: "GET",
          credentials: "include",
          signal: controller.signal,
        });

        if (response.status === 401) {
          router.replace("/login");
          return;
        }

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Unable to load details.");
        }

        const record =
          data.student ||
          data.university ||
          data.community ||
          data.resource;

        if (!record) {
          throw new Error("The requested record was not found.");
        }

        setItem(record);

        if (type === "community") {
          setCommunity(record);
        }
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadDetails();

    return () => controller.abort();
  }, [type, id, communityId, config, router]);

  const openExternal = (url?: string) => {
    if (!url) return;

    try {
      const parsedUrl = new URL(url);

      if (parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:") {
        window.open(parsedUrl.href, "_blank", "noopener,noreferrer");
      }
    } catch {
      setError("This external link is invalid.");
    }
  };

  const renderStudent = () => (
    <>
      <div className="flex flex-col items-center text-center sm:flex-row sm:text-left">
        {item?.profileImage ? (
          <img
            src={item.profileImage}
            alt={item.name || "Student"}
            className="h-24 w-24 rounded-2xl object-cover"
          />
        ) : (
          <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Users size={38} />
          </div>
        )}

        <div className="mt-4 sm:ml-6 sm:mt-0">
          <h2 className="text-2xl font-bold">
            {item?.name || "Student"}
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            {item?.course || "Student"}
          </p>
          {item?.university && (
            <p className="mt-1 text-sm text-gray-500">
              {item.university}
            </p>
          )}
        </div>
      </div>

      <DetailSection title="About">
        {item?.bio || "No introduction has been added yet."}
      </DetailSection>

      <DetailSection title="Academic Information">
        <DetailRow label="University" value={item?.university} />
        <DetailRow label="University ID" value={item?.universityId} />
        <DetailRow label="Course" value={item?.course} />
        <DetailRow label="Year" value={item?.year} />
      </DetailSection>

      <TagList title="Skills" values={item?.skills} />
      <TagList title="Interests" values={item?.interests} />
    </>
  );

  const renderUniversity = () => (
    <>
      <div className="flex flex-col items-center gap-5 sm:flex-row">
        {item?.logo ? (
          <img
            src={item.logo}
            alt={item.name || "University"}
            className="h-20 w-20 rounded-2xl object-contain"
          />
        ) : (
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <GraduationCap size={36} />
          </div>
        )}

        <div className="text-center sm:text-left">
          <h2 className="text-2xl font-bold">
            {item?.name || "University"}
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            {item?.code || "University"}
          </p>
        </div>
      </div>

      <DetailSection title="About the University">
        {item?.description || "No description is available."}
      </DetailSection>

      <DetailSection title="University Information">
        <DetailRow label="Code" value={item?.code} />
        <DetailRow label="Country" value={item?.country} />
        <DetailRow label="State" value={item?.state} />
        <DetailRow label="City" value={item?.city} />
        <DetailRow label="Established" value={item?.establishedYear} />
      </DetailSection>

      {item?.website && (
        <button
          type="button"
          onClick={() => openExternal(item.website)}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
        >
          Visit University Website
          <ExternalLink size={16} />
        </button>
      )}
    </>
  );

  const renderCommunity = () => (
    <>
      {item?.coverImage && (
        <img
          src={item.coverImage}
          alt={item.name || "Community"}
          className="h-56 w-full rounded-2xl object-cover"
        />
      )}

      <div>
        <h2 className="text-2xl font-bold">
          {item?.name || "Community"}
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          {item?.category || "ZUNO Community"}
        </p>
      </div>

      <DetailSection title="About this Community">
        {item?.description || "No description is available."}
      </DetailSection>

      <DetailSection title="Community Information">
        <DetailRow
          label="Members"
          value={item?.members?.length ?? 0}
        />
        <DetailRow label="Category" value={item?.category} />
        <DetailRow label="Privacy" value={item?.privacy} />
      </DetailSection>

      <button
        type="button"
        onClick={() => router.push("/network")}
        className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
      >
        Explore Network
        <ArrowRight size={16} />
      </button>
    </>
  );

  const renderPost = () => (
    <>
      <div className="flex items-center gap-3">
        {item?.author?.profileImage ? (
          <img
            src={item.author.profileImage}
            alt={item.author.name || "Author"}
            className="h-12 w-12 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Users size={22} />
          </div>
        )}

        <div>
          <p className="font-semibold">
            {item?.author?.name || "Community Member"}
          </p>
          <p className="text-xs text-gray-500">
            {community?.name || "ZUNO Community"}
          </p>
        </div>
      </div>

      <DetailSection title="Post">
        <p className="whitespace-pre-wrap leading-7">
          {item?.content || "No post content available."}
        </p>
      </DetailSection>

      {item?.image && (
        <img
          src={item.image}
          alt="Community post"
          className="max-h-[500px] w-full rounded-2xl object-contain"
        />
      )}

      <DetailSection title="Engagement">
        <DetailRow label="Likes" value={item?.likes?.length ?? 0} />
        <DetailRow label="Comments" value={item?.comments?.length ?? 0} />
      </DetailSection>

      <button
        type="button"
        onClick={() => router.push(`/details/community/${communityId}`)}
        className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
      >
        View Community
        <ArrowRight size={16} />
      </button>
    </>
  );

  const renderResource = () => (
    <>
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <BookOpen size={32} />
      </div>

      <div>
        <h2 className="text-2xl font-bold">
          {item?.title || "Learning Resource"}
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          {item?.category || "Resource"}
          {item?.subject ? ` · ${item.subject}` : ""}
        </p>
      </div>

      <DetailSection title="Description">
        {item?.description || "No description is available."}
      </DetailSection>

      <DetailSection title="Resource Information">
        <DetailRow label="Category" value={item?.category} />
        <DetailRow label="Subject" value={item?.subject} />
        <DetailRow label="Type" value={item?.resourceType} />
        <DetailRow
          label="Uploaded by"
          value={item?.uploadedBy?.name || "ZUNO Member"}
        />
        <DetailRow label="Downloads" value={item?.downloads ?? 0} />
      </DetailSection>

      {Array.isArray(item?.tags) && (
        <TagList title="Tags" values={item.tags} />
      )}

      {item?.resourceUrl && (
        <button
          type="button"
          onClick={() => openExternal(item.resourceUrl)}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
        >
          Open Learning Resource
          <ExternalLink size={16} />
        </button>
      )}
    </>
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 md:block">
        <Sidebar />
      </aside>

      <main className="min-h-screen min-w-0 md:ml-64">
        <div className="sticky top-0 z-40">
          <Topbar />
        </div>

        <div className="mx-auto max-w-5xl px-5 py-8 md:px-8">
          <button
            type="button"
            onClick={() => router.back()}
            className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-primary"
          >
            <ArrowLeft size={17} />
            Back to Search
          </button>

          <section className="mb-7 rounded-3xl bg-gradient-to-r from-[#641C32] via-[#762B45] to-[#4F1628] p-7 text-white">
            <div className="flex items-center gap-3">
              <Icon size={27} />
              <span className="text-sm font-semibold uppercase tracking-wider">
                ZUNO {config?.title || "Details"}
              </span>
            </div>

            <h1 className="mt-4 text-3xl font-bold">
              Explore ZUNO
            </h1>

            <p className="mt-2 text-sm text-white/80">
              Discover more information about this result.
            </p>
          </section>

          {loading ? (
            <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-border bg-card">
              <Loader2 size={34} className="animate-spin text-primary" />
              <p className="mt-4 text-sm text-gray-500">
                Loading details...
              </p>
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-red-500/20 bg-card p-10 text-center">
              <AlertCircle size={35} className="mx-auto text-red-500" />
              <h2 className="mt-4 text-xl font-bold">
                Unable to load details
              </h2>
              <p className="mt-2 text-sm text-gray-500">{error}</p>
              <button
                type="button"
                onClick={() => router.back()}
                className="mt-6 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white"
              >
                Return to Search
              </button>
            </div>
          ) : item ? (
            <article className="space-y-7 rounded-3xl border border-border bg-card p-6 shadow-sm md:p-9">
              {type === "student" && renderStudent()}
              {type === "university" && renderUniversity()}
              {type === "community" && renderCommunity()}
              {type === "post" && renderPost()}
              {type === "resource" && renderResource()}
            </article>
          ) : null}

          <footer className="mt-10 border-t border-border py-6 text-center text-xs text-gray-500">
            ZUNO · Discover. Connect. Build. Grow.
          </footer>
        </div>
      </main>
    </div>
  );
}


export default function DetailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
          <div className="flex flex-col items-center gap-3">
            <Loader2 size={34} className="animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading details...</p>
          </div>
        </div>
      }
    >
      <DetailPageContent />
    </Suspense>
  );
}

function DetailSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="border-t border-border pt-5">
      <h3 className="mb-3 font-semibold">{title}</h3>
      <div className="text-sm leading-7 text-gray-500">{children}</div>
    </section>
  );
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: ReactNode;
}) {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  return (
    <div className="flex flex-wrap justify-between gap-3 border-b border-border/60 py-2 last:border-0">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}

function TagList({
  title,
  values,
}: {
  title: string;
  values?: string[];
}) {
  if (!values?.length) return null;

  return (
    <section className="border-t border-border pt-5">
      <h3 className="mb-3 font-semibold">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {values.map((value, index) => (
          <span
            key={`${value}-${index}`}
            className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary"
          >
            <Tag size={12} />
            {value}
          </span>
        ))}
      </div>
    </section>
  );
}
