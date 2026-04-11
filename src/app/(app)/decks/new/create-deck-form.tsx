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
      <label className="flex flex-col gap-2 text-sm font-medium text-[var(--md-on-surface)]">
        Prompt
        <textarea
          required
          rows={5}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g. A 10-minute product update for the team: Q1 goals, roadmap, and risks."
          className="mdui-field min-h-[120px] resize-y"
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm font-medium text-[var(--md-on-surface)]">
          Tone
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value as SlideTone)}
            className="mdui-field min-h-[3.25rem] cursor-pointer py-2.5"
          >
            {TONES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium text-[var(--md-on-surface)]">
          Theme
          <select
            value={themeId}
            onChange={(e) => setThemeId(e.target.value as ThemeId)}
            className="mdui-field min-h-[3.25rem] cursor-pointer py-2.5"
          >
            {THEME_IDS.map((id) => (
              <option key={id} value={id}>
                {themes[id].name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="flex flex-col gap-2 text-sm font-medium text-[var(--md-on-surface)]">
        Max slides
        <input
          type="number"
          min={3}
          max={20}
          value={maxSlides}
          onChange={(e) => setMaxSlides(Number(e.target.value))}
          className="mdui-field min-h-[3.25rem]"
        />
      </label>

      {error ? (
        <p
          className="rounded-[var(--md-radius-sm)] px-3 py-2 text-sm text-[var(--md-error)]"
          style={{ background: "var(--md-error-container)" }}
          role="alert"
        >
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="mdui-btn-filled w-full gap-2 disabled:pointer-events-none"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            Generating…
          </>
        ) : (
          "Generate deck"
        )}
      </button>
    </form>
  );
}
