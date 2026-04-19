import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import type { DeckRow } from "@/lib/types/deck";
import { requireUserId } from "@/lib/auth/require-user";
import { getDeckForUserId } from "@/lib/deck/get-deck";
import { DeckEditorClient } from "./deck-editor-client";

type Props = { params: Promise<{ id: string }> };

export default async function DeckPage({ params }: Props) {
  const { id } = await params;
  let userId: string;
  try {
    userId = await requireUserId();
  } catch {
    redirect("/auth/login");
  }

  const deck = await getDeckForUserId(id, userId);
  if (!deck) notFound();

  return (
    <div>
      <Link
        href="/decks"
        className="text-sm font-medium text-(--slide-muted) hover:text-(--slide-text)"
      >
        ← All decks
      </Link>
      <DeckEditorClient initialDeck={deck as DeckRow} />
    </div>
  );
}
