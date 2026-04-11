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
    <main className="relative flex min-h-dvh flex-col justify-center overflow-hidden px-6 py-16">
      <div className="mdui-atmosphere" aria-hidden>
        <div className="mdui-blob mdui-blob-tertiary -right-16 top-20 h-72 w-72 translate-x-1/4" />
        <div className="mdui-blob mdui-blob-primary left-10 bottom-10 h-80 w-80 -translate-x-1/4 translate-y-1/4" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-md">
        <div className="mdui-card p-8 sm:p-10">
          <h1 className="text-[2rem] font-medium leading-snug tracking-tight text-[var(--md-on-surface)]">
            Create account
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-[var(--md-on-surface-variant)]">
            Start building AI-generated slide decks.
          </p>
          <div className="mt-8">
            <SignupForm />
          </div>
          <p className="mt-8 text-center text-sm text-[var(--md-on-surface-variant)]">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="mdui-btn-text !inline !min-h-0 !px-1 !py-0 !text-[var(--md-primary)]"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
