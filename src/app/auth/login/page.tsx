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
    <main className="relative flex min-h-full flex-col justify-center overflow-hidden px-6 py-16">
      <div className="mdui-atmosphere" aria-hidden>
        <div className="mdui-blob mdui-blob-primary -left-24 top-1/4 h-80 w-80 -translate-y-1/2" />
        <div className="mdui-blob mdui-blob-secondary right-0 bottom-0 h-96 w-96 translate-x-1/3 translate-y-1/3" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-md">
        <div className="mdui-card p-8 sm:p-10">
          <h1 className="text-[2rem] font-medium leading-snug tracking-tight text-[var(--md-on-surface)]">
            Sign in
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-[var(--md-on-surface-variant)]">
            Use your email and password to access your decks.
          </p>
          {params.error ? (
            <p
              className="mt-4 rounded-[var(--md-radius-sm)] px-3 py-2 text-sm text-[var(--md-error)]"
              style={{ background: "var(--md-error-container)" }}
              role="alert"
            >
              Something went wrong. Try again.
            </p>
          ) : null}
          <div className="mt-8">
            <LoginForm />
          </div>
          <p className="mt-8 text-center text-sm text-[var(--md-on-surface-variant)]">
            No account?{" "}
            <Link
              href="/auth/signup"
              className="mdui-btn-text !inline !min-h-0 !px-1 !py-0 !text-[var(--md-primary)]"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
