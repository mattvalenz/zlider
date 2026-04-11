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
      <div
        className="rounded-[var(--md-radius-lg)] px-4 py-3 text-sm text-[var(--md-error)]"
        style={{ background: "var(--md-error-container)" }}
      >
        Could not load decks. Check your Supabase configuration and migrations.
      </div>
    );
  }

  const list = (decks ?? []) as Pick<DeckRow, "id" | "title" | "updated_at" | "tone">[];

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-[2rem] font-medium leading-snug tracking-tight text-[var(--md-on-surface)] sm:text-[2.25rem]">
            Your decks
          </h1>
          <p className="mt-2 max-w-lg text-sm leading-relaxed text-[var(--md-on-surface-variant)]">
            Create a deck from a prompt, then refine slides in the editor.
          </p>
        </div>
        <Link href="/decks/new" className="mdui-btn-filled shrink-0 gap-2">
          <Plus className="h-4 w-4" aria-hidden />
          New deck
        </Link>
      </div>

      {list.length === 0 ? (
        <div className="mt-12 rounded-[var(--md-radius-lg)] border-2 border-dashed border-[color-mix(in_srgb,var(--md-outline)_35%,transparent)] bg-[var(--md-surface-container)] px-8 py-14 text-center shadow-sm">
          <p className="text-[var(--md-on-surface-variant)]">No decks yet.</p>
          <Link href="/decks/new" className="mdui-btn-tonal mt-6 inline-flex">
            Create your first deck
          </Link>
        </div>
      ) : (
        <ul className="mt-10 divide-y divide-[color-mix(in_srgb,var(--md-outline)_18%,transparent)] overflow-hidden rounded-[var(--md-radius-lg)] bg-[var(--md-surface-container)] shadow-sm">
          {list.map((d) => (
            <li key={d.id}>
              <Link
                href={`/deck/${d.id}`}
                className="group flex items-center justify-between gap-4 px-4 py-4 transition-colors duration-300 ease-[cubic-bezier(0.2,0,0,1)] hover:bg-[color-mix(in_srgb,var(--md-primary)_6%,transparent)] sm:px-6"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-[var(--md-on-surface)]">
                    {d.title}
                  </p>
                  <p className="mt-1 text-xs text-[var(--md-on-surface-variant)]">
                    {d.tone} · Updated{" "}
                    {new Date(d.updated_at).toLocaleString(undefined, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 shrink-0 text-[var(--md-on-surface-variant)] transition-transform duration-300 ease-[cubic-bezier(0.2,0,0,1)] group-hover:translate-x-0.5" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
