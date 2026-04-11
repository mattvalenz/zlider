import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SignupForm } from "./signup-form";

export default async function SignupPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    redirect("/decks");
  }

  return (
    <main className="mx-auto flex min-h-full max-w-md flex-col justify-center px-6 py-16">
      <div className="rounded-[var(--slide-radius,12px)] border border-[var(--slide-border,#e5e7eb)] bg-[var(--slide-surface-elevated,#fff)] p-8 shadow-sm">
        <h1 className="font-[family-name:var(--font-slide-heading)] text-2xl font-semibold tracking-tight text-[var(--slide-text,#111827)]">
          Create account
        </h1>
        <p className="mt-2 text-sm text-[var(--slide-muted,#6b7280)]">
          Start building AI-generated slide decks.
        </p>
        <div className="mt-8">
          <SignupForm />
        </div>
        <p className="mt-8 text-center text-sm text-[var(--slide-muted,#6b7280)]">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="font-medium text-[var(--slide-primary,#0d9488)] underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
