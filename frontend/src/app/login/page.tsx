
"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Mail, Lock, LogIn } from "lucide-react";

export default function LoginPage() {
  const { login, loading, user } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await login(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#F8F3F4] text-[#641C32]">
        Loading...
      </div>
    );
  }

  if (user) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#F8F3F4]">
        <Link
          href="/dashboard"
          className="rounded-xl bg-[#641C32] px-6 py-3 font-semibold text-white transition hover:bg-[#4F1628]"
        >
          Go to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F8F3F4] px-5 py-10 text-[#301B22]">
      <div className="w-full max-w-md rounded-2xl border border-[#E8DADF] bg-white p-8 shadow-xl shadow-[#641C32]/5">
        <div className="mb-7 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#641C32] text-white shadow-lg shadow-[#641C32]/20">
            <LogIn size={27} />
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-[#641C32]">
            Welcome Back
          </h1>

          <p className="mt-2 text-sm text-[#7D656D]">
            Sign in to your ZUNO account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#301B22]">
              Email address
            </label>

            <div className="flex items-center gap-3 rounded-xl border border-[#E8DADF] bg-[#F8F3F4] px-4 transition focus-within:border-[#641C32] focus-within:ring-2 focus-within:ring-[#641C32]/10">
              <Mail size={18} className="shrink-0 text-[#8F5368]" />

              <input
                required
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent py-3 text-[#301B22] outline-none placeholder:text-[#A48D95]"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-[#301B22]">
              Password
            </label>

            <div className="flex items-center gap-3 rounded-xl border border-[#E8DADF] bg-[#F8F3F4] px-4 transition focus-within:border-[#641C32] focus-within:ring-2 focus-within:ring-[#641C32]/10">
              <Lock size={18} className="shrink-0 text-[#8F5368]" />

              <input
                required
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent py-3 text-[#301B22] outline-none placeholder:text-[#A48D95]"
              />
            </div>
          </div>

          {error && (
            <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-[#641C32] py-3 font-semibold text-white shadow-md shadow-[#641C32]/15 transition hover:bg-[#4F1628] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#7D656D]">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-semibold text-[#641C32] transition hover:text-[#8F5368] hover:underline"
          >
            Create account
          </Link>
        </p>
      </div>
    </main>
  );
}
