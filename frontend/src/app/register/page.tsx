
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
    return <div className="min-h-screen grid place-items-center">Loading...</div>;
  }

  if (user) {
    return (
      <div className="min-h-screen grid place-items-center">
        <Link href="/dashboard" className="text-violet-500">
          Go to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0b0d16] px-5 py-10 text-white">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#171a27] p-8 shadow-2xl">
        <div className="mb-7 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-600">
            <UserPlus size={27} />
          </div>
          <h1 className="text-3xl font-bold">Join ZUNO</h1>
          <p className="mt-2 text-sm text-gray-400">
            Discover. Connect. Build. Grow.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium">Full name</label>
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#0d0f18] px-4">
              <User size={18} className="text-gray-400" />
              <input
                required
                type="text"
                placeholder="Enter your full name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-transparent py-3 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Email address</label>
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#0d0f18] px-4">
              <Mail size={18} className="text-gray-400" />
              <input
                required
                type="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-transparent py-3 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Phone number</label>
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#0d0f18] px-4">
              <Phone size={18} className="text-gray-400" />
              <input
                required
                type="tel"
                placeholder="Enter your phone number"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full bg-transparent py-3 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Password</label>
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#0d0f18] px-4">
              <Lock size={18} className="text-gray-400" />
              <input
                required
                type="password"
                minLength={8}
                placeholder="Create a password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full bg-transparent py-3 outline-none"
              />
            </div>
          </div>

          {error && (
            <p className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-violet-600 py-3 font-semibold transition hover:bg-violet-700 disabled:opacity-50"
          >
            {submitting ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-violet-400 hover:text-violet-300">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
