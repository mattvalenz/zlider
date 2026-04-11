"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error: signError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (signError) {
      setError(signError.message);
      return;
    }
    router.refresh();
    router.push("/decks");
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1 text-sm font-medium text-[var(--slide-text,#111827)]">
        Email
        <input
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-lg border border-[var(--slide-border,#e5e7eb)] bg-white px-3 py-2 text-base text-[var(--slide-on-light-text)] outline-none ring-[var(--slide-primary,#0d9488)] focus-visible:ring-2"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm font-medium text-[var(--slide-text,#111827)]">
        Password
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-lg border border-[var(--slide-border,#e5e7eb)] bg-white px-3 py-2 text-base text-[var(--slide-on-light-text)] outline-none ring-[var(--slide-primary,#0d9488)] focus-visible:ring-2"
        />
      </label>
      {error ? (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={loading}
        className="mt-2 inline-flex h-11 items-center justify-center rounded-lg bg-[var(--slide-primary,#0d9488)] px-4 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
      >
        {loading ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
