"use client";

import { createDeckFromPrompt } from "@/app/actions/decks";
import { THEME_IDS, themes, type ThemeId } from "@/lib/themes/presets";
import type { SlideTone } from "@/lib/types/deck";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const TONES: SlideTone[] = [
  "formal",
  "casual",
  "pitch",
  "educational",
  "professional",
];

export function CreateDeckForm() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [tone, setTone] = useState<SlideTone>("professional");
  const [themeId, setThemeId] = useState<ThemeId>("ocean");
  const [maxSlides, setMaxSlides] = useState(8);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const result = await createDeckFromPrompt({
      prompt,
      tone,
      themeId,
      maxSlides,
    });
    setLoading(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    router.push(`/deck/${result.deckId}`);
    router.refresh();
  }

  return (
    <form onSubmit={(e) => void onSubmit(e)} className="flex flex-col gap-6">
      <label className="flex flex-col gap-2 text-sm font-medium text-[var(--slide-text)]">
        Prompt
        <textarea
          required
          rows={5}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g. A 10-minute product update for the team: Q1 goals, roadmap, and risks."
          className="min-h-[120px] rounded-lg border border-[var(--slide-border)] bg-white px-3 py-2 text-base font-normal text-[var(--slide-on-light-text)] placeholder:text-slate-500 outline-none ring-[var(--slide-primary)] focus-visible:ring-2"
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm font-medium text-[var(--slide-text)]">
          Tone
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value as SlideTone)}
            className="h-11 rounded-lg border border-[var(--slide-border)] bg-white px-3 text-[var(--slide-on-light-text)] outline-none ring-[var(--slide-primary)] focus-visible:ring-2"
          >
            {TONES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium text-[var(--slide-text)]">
          Theme
          <select
            value={themeId}
            onChange={(e) => setThemeId(e.target.value as ThemeId)}
            className="h-11 rounded-lg border border-[var(--slide-border)] bg-white px-3 text-[var(--slide-on-light-text)] outline-none ring-[var(--slide-primary)] focus-visible:ring-2"
          >
            {THEME_IDS.map((id) => (
              <option key={id} value={id}>
                {themes[id].name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="flex flex-col gap-2 text-sm font-medium text-[var(--slide-text)]">
        Max slides
        <input
          type="number"
          min={3}
          max={20}
          value={maxSlides}
          onChange={(e) => setMaxSlides(Number(e.target.value))}
          className="h-11 rounded-lg border border-[var(--slide-border)] bg-white px-3 text-[var(--slide-on-light-text)] outline-none ring-[var(--slide-primary)] focus-visible:ring-2"
        />
      </label>

      {error ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[var(--slide-primary,#0d9488)] px-4 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Generating…
          </>
        ) : (
          "Generate deck"
        )}
      </button>
    </form>
  );
}
