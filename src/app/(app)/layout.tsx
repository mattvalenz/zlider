import Link from "next/link";
import { redirect } from "next/navigation";
import { SignOutButton } from "@/components/app/sign-out-button";
import { createClient } from "@/lib/supabase/server";
import { Presentation } from "lucide-react";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims?.sub) {
    redirect("/auth/login");
  }

  return (
    <div className="min-h-full bg-[var(--slide-surface,#f8fafc)] text-[var(--slide-text,#0f172a)]">
      <header className="border-b border-[var(--slide-border,#e2e8f0)] bg-[var(--slide-surface-elevated,#ffffff)]">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/decks"
            className="flex items-center gap-2 text-sm font-semibold tracking-tight text-[var(--slide-text)]"
          >
            <Presentation className="h-5 w-5 text-[var(--slide-primary,#0d9488)]" />
            Zlider
          </Link>
          <nav className="flex items-center gap-4">
            <Link
              href="/decks/new"
              className="text-sm font-medium text-[var(--slide-muted)] hover:text-[var(--slide-text)]"
            >
              New deck
            </Link>
            <SignOutButton />
          </nav>
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">{children}</div>
    </div>
  );
}
