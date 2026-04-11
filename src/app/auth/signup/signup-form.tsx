"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SignupForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    const supabase = createClient();
    const { error: signError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    setLoading(false);
    if (signError) {
      setError(signError.message);
      return;
    }
    setMessage("Check your email to confirm your account, then sign in.");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <label className="flex flex-col gap-2 text-sm font-medium text-[var(--md-on-surface)]">
        Email
        <input
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mdui-field"
        />
      </label>
      <label className="flex flex-col gap-2 text-sm font-medium text-[var(--md-on-surface)]">
        Password
        <input
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mdui-field"
        />
      </label>
      {error ? (
        <p className="text-sm text-[var(--md-error)]" role="alert">
          {error}
        </p>
      ) : null}
      {message ? (
        <p className="text-sm text-emerald-900 dark:text-emerald-200" role="status">
          {message}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={loading}
        className="mdui-btn-filled mt-1 w-full disabled:pointer-events-none"
      >
        {loading ? "Creating…" : "Create account"}
      </button>
    </form>
  );
}
