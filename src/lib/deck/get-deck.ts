import { createClient } from "@/lib/supabase/server";
import type { DeckRow } from "@/lib/types/deck";

/**
 * Fetch a deck only if it belongs to `userId`.
 * Returns null when the deck does not exist or is not owned by the user.
 */
export async function getDeckForUserId(
  deckId: string,
  userId: string,
): Promise<DeckRow | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("decks")
    .select("*")
    .eq("id", deckId)
    .eq("user_id", userId)
    .single();

  if (error || !data) return null;
  return data as DeckRow;
}

