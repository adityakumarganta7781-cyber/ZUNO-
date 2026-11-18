
"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { UserPlus, Mail, Lock, Phone, User } from "lucide-react";

export default function RegisterPage() {
  const { register, loading, user } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await register(form);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Registration failed."
      );
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
            <UserPlus size={27} />
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-[#641C32]">
            Join ZUNO
          </h1>

          <p className="mt-2 text-sm text-[#7D656D]">
            Discover. Connect. Build. Grow.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#301B22]">
              Full name
            </label>

            <div className="flex items-center gap-3 rounded-xl border border-[#E8DADF] bg-[#F8F3F4] px-4 transition focus-within:border-[#641C32] focus-within:ring-2 focus-within:ring-[#641C32]/10">
              <User size={18} className="shrink-0 text-[#8F5368]" />

              <input
                required
                type="text"
                placeholder="Enter your full name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-transparent py-3 text-[#301B22] outline-none placeholder:text-[#A48D95]"
              />
            </div>
          </div>

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
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-transparent py-3 text-[#301B22] outline-none placeholder:text-[#A48D95]"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-[#301B22]">
              Phone number
            </label>

            <div className="flex items-center gap-3 rounded-xl border border-[#E8DADF] bg-[#F8F3F4] px-4 transition focus-within:border-[#641C32] focus-within:ring-2 focus-within:ring-[#641C32]/10">
              <Phone size={18} className="shrink-0 text-[#8F5368]" />

              <input
                required
                type="tel"
                placeholder="Enter your phone number"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
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
                minLength={8}
                placeholder="Create a password"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
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
            {submitting ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#7D656D]">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-[#641C32] transition hover:text-[#8F5368] hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
