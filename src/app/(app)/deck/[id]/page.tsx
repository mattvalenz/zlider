import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { DeckRow } from "@/lib/types/deck";
import { DeckEditorClient } from "./deck-editor-client";

type Props = { params: Promise<{ id: string }> };

export default async function DeckPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims?.sub) {
    redirect("/auth/login");
  }

  const { data: deck, error } = await supabase
    .from("decks")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !deck) {
    notFound();
  }

  if (deck.user_id !== claims.claims.sub) {
    notFound();
  }

  return (
    <div>
      <Link
        href="/decks"
        className="text-sm font-medium text-[var(--slide-muted)] hover:text-[var(--slide-text)]"
      >
        ← All decks
      </Link>
      <DeckEditorClient initialDeck={deck as DeckRow} />
    </div>
  );
}
