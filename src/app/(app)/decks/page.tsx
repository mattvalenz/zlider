import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { DeckRow } from "@/lib/types/deck";
import { ChevronRight, Plus } from "lucide-react";

export default async function DecksPage() {
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims?.sub) {
    redirect("/auth/login");
  }

  const { data: decks, error } = await supabase
    .from("decks")
    .select("id, title, updated_at, tone")
    .order("updated_at", { ascending: false });

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-900">
        Could not load decks. Check your Supabase configuration and migrations.
      </div>
    );
  }

  const list = (decks ?? []) as Pick<DeckRow, "id" | "title" | "updated_at" | "tone">[];

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-slide-heading)] text-3xl font-semibold tracking-tight">
            Your decks
          </h1>
          <p className="mt-2 max-w-lg text-sm text-[var(--slide-muted,#64748b)]">
            Create a deck from a prompt, then refine slides in the editor.
          </p>
        </div>
        <Link
          href="/decks/new"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[var(--slide-primary,#0d9488)] px-5 text-sm font-medium text-white transition hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          New deck
        </Link>
      </div>

      {list.length === 0 ? (
        <div className="mt-12 rounded-xl border border-dashed border-[var(--slide-border)] bg-[var(--slide-surface-elevated)] p-12 text-center">
          <p className="text-[var(--slide-muted)]">No decks yet.</p>
          <Link
            href="/decks/new"
            className="mt-4 inline-flex h-10 items-center justify-center rounded-lg bg-[var(--slide-primary,#0d9488)] px-4 text-sm font-medium text-white"
          >
            Create your first deck
          </Link>
        </div>
      ) : (
        <ul className="mt-10 divide-y divide-[var(--slide-border)] rounded-xl border border-[var(--slide-border)] bg-[var(--slide-surface-elevated)]">
          {list.map((d) => (
            <li key={d.id}>
              <Link
                href={`/deck/${d.id}`}
                className="flex items-center justify-between gap-4 px-4 py-4 transition hover:bg-[var(--slide-surface)] sm:px-6"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-[var(--slide-text)]">
                    {d.title}
                  </p>
                  <p className="mt-1 text-xs text-[var(--slide-muted)]">
                    {d.tone} · Updated{" "}
                    {new Date(d.updated_at).toLocaleString(undefined, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 shrink-0 text-[var(--slide-muted)]" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
