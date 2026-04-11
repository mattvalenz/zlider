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
    <div className="relative min-h-full bg-[var(--md-background)] text-[var(--md-on-surface)]">
      <div className="mdui-atmosphere" aria-hidden>
        <div className="mdui-blob mdui-blob-primary -left-28 top-0 h-72 w-72 -translate-y-1/4" />
        <div className="mdui-blob mdui-blob-tertiary left-1/3 top-40 h-64 w-64 -translate-x-1/2" />
        <div className="mdui-blob mdui-blob-secondary -right-20 top-24 h-96 w-96 translate-x-1/4" />
      </div>

      <header className="relative z-10 border-b border-[color-mix(in_srgb,var(--md-outline)_22%,transparent)] bg-[color-mix(in_srgb,var(--md-background)_82%,transparent)] backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/decks"
            className="flex items-center gap-2 text-sm font-medium tracking-tight text-[var(--md-on-surface)]"
          >
            <Presentation className="mdui-brand-icon h-5 w-5" aria-hidden />
            Zlider
          </Link>
          <nav className="flex items-center gap-1 sm:gap-2">
            <Link href="/decks/new" className="mdui-nav-link">
              New deck
            </Link>
            <SignOutButton />
          </nav>
        </div>
      </header>
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {children}
      </div>
    </div>
  );
}
