import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CreateDeckForm } from "./create-deck-form";

export default async function NewDeckPage() {
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims?.sub) {
    redirect("/auth/login");
  }

  return (
    <div className="mx-auto max-w-xl">
      <Link
        href="/decks"
        className="text-sm font-medium text-[var(--slide-muted)] hover:text-[var(--slide-text)]"
      >
        ← Back to decks
      </Link>
      <h1 className="mt-6 font-[family-name:var(--font-slide-heading)] text-3xl font-semibold tracking-tight">
        New deck
      </h1>
      <p className="mt-2 text-sm text-[var(--slide-muted)]">
        Describe what you want to present. We will generate an outline and
        slides with tone-aware copy.
      </p>
      <div className="mt-8 rounded-xl border border-[var(--slide-border)] bg-[var(--slide-surface-elevated)] p-6 shadow-sm">
        <CreateDeckForm />
      </div>
    </div>
  );
}
