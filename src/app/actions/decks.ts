"use server";

import { generateDeckContent, regenerateSlideContent } from "@/lib/ai/generate";
import { requireUserId } from "@/lib/auth/require-user";
import { getDeckForUserId } from "@/lib/deck/get-deck";
import { mapAiToSlides } from "@/lib/deck/map-ai";
import { rateLimit } from "@/lib/rate-limit";
import { createClient } from "@/lib/supabase/server";
import type { ThemeId } from "@/lib/themes/presets";
import type { DeckRow, SlideData, SlideImage, SlideTone } from "@/lib/types/deck";
import { revalidatePath } from "next/cache";

export type CreateDeckResult =
  | { ok: true; deckId: string }
  | { ok: false; error: string };

export async function createDeckFromPrompt(input: {
  prompt: string;
  tone: SlideTone;
  themeId: ThemeId;
  maxSlides: number;
}): Promise<CreateDeckResult> {
  try {
    const userId = await requireUserId();
    if (!input.prompt.trim()) {
      return { ok: false, error: "Prompt is required." };
    }
    const maxSlides = Math.min(Math.max(input.maxSlides, 3), 20);
    if (
      !rateLimit(`create-deck:${userId}`, 20, 60 * 60 * 1000)
    ) {
      return {
        ok: false,
        error: "Rate limit reached. Try again in a little while.",
      };
    }

    const ai = await generateDeckContent({
      prompt: input.prompt,
      tone: input.tone,
      maxSlides,
    });
    const { slides, outline } = mapAiToSlides(ai);

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("decks")
      .insert({
        user_id: userId,
        title: ai.deckTitle,
        theme_id: input.themeId,
        tone: input.tone,
        slides,
        outline,
      })
      .select("id")
      .single();

    if (error || !data) {
      return { ok: false, error: error?.message ?? "Could not save deck." };
    }

    revalidatePath("/decks");
    return { ok: true, deckId: data.id };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Something went wrong.";
    return { ok: false, error: msg };
  }
}

export async function updateDeckSlides(input: {
  deckId: string;
  title: string;
  slides: SlideData[];
  outline: DeckRow["outline"];
}): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const userId = await requireUserId();
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("decks")
      .update({
        title: input.title,
        slides: input.slides,
        outline: input.outline,
        updated_at: new Date().toISOString(),
      })
      .eq("id", input.deckId)
      .eq("user_id", userId)
      .select("id")
      .single();

    if (error || !data) {
      return { ok: false, error: error?.message ?? "Not found." };
    }

    revalidatePath(`/deck/${input.deckId}`);
    revalidatePath("/decks");
    return { ok: true };
  } catch {
    return { ok: false, error: "Unauthorized." };
  }
}

export async function updateDeckMeta(input: {
  deckId: string;
  themeId: ThemeId;
  tone: SlideTone;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const userId = await requireUserId();
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("decks")
      .update({
        theme_id: input.themeId,
        tone: input.tone,
        updated_at: new Date().toISOString(),
      })
      .eq("id", input.deckId)
      .eq("user_id", userId)
      .select("id")
      .single();

    if (error || !data) {
      return { ok: false, error: error?.message ?? "Not found." };
    }

    revalidatePath(`/deck/${input.deckId}`);
    return { ok: true };
  } catch {
    return { ok: false, error: "Unauthorized." };
  }
}

export async function deleteDeck(
  deckId: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const userId = await requireUserId();
    const supabase = await createClient();
    const { error } = await supabase
      .from("decks")
      .delete()
      .eq("id", deckId)
      .eq("user_id", userId);

    if (error) {
      return { ok: false, error: error.message };
    }

    revalidatePath("/decks");
    return { ok: true };
  } catch {
    return { ok: false, error: "Unauthorized." };
  }
}

export async function regenerateSlideAction(input: {
  deckId: string;
  slideId: string;
}): Promise<
  { ok: true; slide: SlideData } | { ok: false; error: string }
> {
  try {
    const userId = await requireUserId();
    if (!rateLimit(`regen:${userId}`, 40, 60 * 60 * 1000)) {
      return {
        ok: false,
        error: "Rate limit reached for AI actions. Try again later.",
      };
    }

    const row = await getDeckForUserId(input.deckId, userId);
    if (!row) {
      return { ok: false, error: "Not found." };
    }

    const slides = row.slides as SlideData[];
    const idx = slides.findIndex((s) => s.id === input.slideId);
    if (idx === -1) {
      return { ok: false, error: "Slide not found." };
    }

    const siblingSummary = slides
      .filter((_, i) => i !== idx)
      .map((s) => s.title)
      .slice(0, 12)
      .join("; ");

    const out = await regenerateSlideContent({
      deckTitle: row.title,
      tone: row.tone as SlideTone,
      siblingSummary,
      currentTitle: slides[idx].title,
      currentBullets: slides[idx].bullets,
    });

    const updated: SlideData = {
      ...slides[idx],
      title: out.title,
      bullets: out.bullets,
      notes: out.notes ?? slides[idx].notes,
    };

    const nextSlides = slides.map((s) => (s.id === input.slideId ? updated : s));

    const supabase = await createClient();
    await supabase
      .from("decks")
      .update({
        slides: nextSlides,
        updated_at: new Date().toISOString(),
      })
      .eq("id", input.deckId);

    revalidatePath(`/deck/${input.deckId}`);
    return { ok: true, slide: updated };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed to regenerate.";
    return { ok: false, error: msg };
  }
}

export async function attachSlideImage(input: {
  deckId: string;
  slideId: string;
  image: SlideImage | null;
}): Promise<{ ok: true; slides: SlideData[] } | { ok: false; error: string }> {
  try {
    const userId = await requireUserId();
    const deck = await getDeckForUserId(input.deckId, userId);
    if (!deck) {
      return { ok: false, error: "Not found." };
    }

    const slides = deck.slides as SlideData[];
    const next = slides.map((s) => {
      if (s.id !== input.slideId) return s;
      const layout = input.image
        ? "title-image"
        : s.layout === "title-image"
          ? "bullets"
          : s.layout;
      return {
        ...s,
        image: input.image ?? undefined,
        layout: layout as SlideData["layout"],
      };
    });

    const supabase = await createClient();
    const { error: up } = await supabase
      .from("decks")
      .update({
        slides: next,
        updated_at: new Date().toISOString(),
      })
      .eq("id", input.deckId);

    if (up) {
      return { ok: false, error: up.message };
    }

    revalidatePath(`/deck/${input.deckId}`);
    return { ok: true, slides: next };
  } catch {
    return { ok: false, error: "Unauthorized." };
  }
}
