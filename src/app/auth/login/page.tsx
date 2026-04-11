import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LoginForm } from "./login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    redirect("/decks");
  }

  const params = await searchParams;

  return (
    <main className="mx-auto flex min-h-full max-w-md flex-col justify-center px-6 py-16">
      <div className="rounded-[var(--slide-radius,12px)] border border-[var(--slide-border,#e5e7eb)] bg-[var(--slide-surface-elevated,#fff)] p-8 shadow-sm">
        <h1 className="font-[family-name:var(--font-slide-heading)] text-2xl font-semibold tracking-tight text-[var(--slide-text,#111827)]">
          Sign in
        </h1>
        <p className="mt-2 text-sm text-[var(--slide-muted,#6b7280)]">
          Use your email and password to access your decks.
        </p>
        {params.error ? (
          <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">
            Something went wrong. Try again.
          </p>
        ) : null}
        <div className="mt-8">
          <LoginForm />
        </div>
        <p className="mt-8 text-center text-sm text-[var(--slide-muted,#6b7280)]">
          No account?{" "}
          <Link
            href="/auth/signup"
            className="font-medium text-[var(--slide-primary,#0d9488)] underline-offset-4 hover:underline"
          >
            Create one
          </Link>
        </p>
      </div>
    </main>
  );
}
