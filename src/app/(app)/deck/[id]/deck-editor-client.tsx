"use client";

import {
  attachSlideImage,
  deleteDeck,
  regenerateSlideAction,
  updateDeckMeta,
  updateDeckSlides,
} from "@/app/actions/decks";
import { PdfExportButton } from "@/components/slides/export-pdf";
import { SlideContent } from "@/components/slides/slide-content";
import { SlideList } from "@/components/slides/slide-list";
import { ThemeBridge } from "@/components/slides/theme-bridge";
import { THEME_IDS, themes, type ThemeId } from "@/lib/themes/presets";
import type { DeckRow, SlideData, SlideImage, SlideLayout, SlideTone } from "@/lib/types/deck";
import {
  ImageIcon,
  Loader2,
  RefreshCw,
  Trash2,
  Wand2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

type Props = {
  initialDeck: DeckRow;
};

const LAYOUTS: SlideLayout[] = ["title", "bullets", "title-image"];
const TONES: SlideTone[] = [
  "formal",
  "casual",
  "pitch",
  "educational",
  "professional",
];

export function DeckEditorClient({ initialDeck }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState(initialDeck.title);
  const [slides, setSlides] = useState<SlideData[]>(initialDeck.slides);
  const [outline] = useState(initialDeck.outline);
  const [themeId, setThemeId] = useState<ThemeId>(initialDeck.theme_id as ThemeId);
  const [tone, setTone] = useState<SlideTone>(initialDeck.tone as SlideTone);
  const [activeId, setActiveId] = useState(slides[0]?.id ?? "");
  const [regenId, setRegenId] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<SlideImage[]>([]);
  const [imgLoading, setImgLoading] = useState(false);
  const [imgError, setImgError] = useState<string | null>(null);
  const skipSave = useRef(true);

  const activeSlide = slides.find((s) => s.id === activeId) ?? slides[0];

  const persist = useCallback(async () => {
    const res = await updateDeckSlides({
      deckId: initialDeck.id,
      title,
      slides,
      outline,
    });
    if (!res.ok) {
      console.error(res.error);
    }
  }, [initialDeck.id, title, slides, outline]);

  useEffect(() => {
    if (skipSave.current) {
      skipSave.current = false;
      return;
    }
    const t = window.setTimeout(() => {
      void persist();
    }, 900);
    return () => window.clearTimeout(t);
  }, [title, slides, persist]);

  const persistMeta = async (nextTheme: ThemeId, nextTone: SlideTone) => {
    await updateDeckMeta({
      deckId: initialDeck.id,
      themeId: nextTheme,
      tone: nextTone,
    });
  };

  const reorder = (from: number, to: number) => {
    if (to < 0 || to >= slides.length) return;
    setSlides((prev) => {
      const next = [...prev];
      const [m] = next.splice(from, 1);
      next.splice(to, 0, m);
      return next.map((s, i) => ({ ...s, order: i }));
    });
  };

  const updateActiveField = (patch: Partial<SlideData>) => {
    if (!activeSlide) return;
    setSlides((prev) =>
      prev.map((s) => (s.id === activeSlide.id ? { ...s, ...patch } : s)),
    );
  };

  const onRegenerate = async () => {
    if (!activeSlide) return;
    setRegenId(activeSlide.id);
    const res = await regenerateSlideAction({
      deckId: initialDeck.id,
      slideId: activeSlide.id,
    });
    setRegenId(null);
    if (res.ok) {
      setSlides((prev) =>
        prev.map((s) => (s.id === res.slide.id ? res.slide : s)),
      );
    }
  };

  const loadSuggestions = async () => {
    if (!activeSlide) return;
    setImgLoading(true);
    setImgError(null);
    try {
      const q = `${activeSlide.title} ${activeSlide.bullets[0] ?? ""}`.slice(
        0,
        120,
      );
      const res = await fetch(
        `/api/images/suggest?q=${encodeURIComponent(q)}`,
      );
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setImgError((err as { error?: string }).error ?? "Could not load images.");
        setSuggestions([]);
        return;
      }
      const data = (await res.json()) as { images: SlideImage[] };
      setSuggestions(data.images);
      if (data.images.length === 0) {
        setImgError(
          "No suggestions (add UNSPLASH_ACCESS_KEY or try another slide).",
        );
      }
    } catch {
      setImgError("Network error loading suggestions.");
    } finally {
      setImgLoading(false);
    }
  };

  const onAttachImage = async (img: SlideImage | null) => {
    const res = await attachSlideImage({
      deckId: initialDeck.id,
      slideId: activeSlide.id,
      image: img,
    });
    if (res.ok) {
      setSlides(res.slides);
    }
  };

  const onDeleteDeck = async () => {
    if (!window.confirm("Delete this deck permanently?")) return;
    const res = await deleteDeck(initialDeck.id);
    if (res.ok) {
      router.push("/decks");
      router.refresh();
    }
  };

  return (
    <ThemeBridge themeId={themeId} className="mt-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <label className="sr-only" htmlFor="deck-title">
            Deck title
          </label>
          <input
            id="deck-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border-b border-transparent bg-transparent pb-1 font-[family-name:var(--font-slide-heading)] text-2xl font-semibold tracking-tight text-[var(--slide-text)] outline-none focus-visible:border-[var(--slide-primary)]"
          />
          <p className="mt-2 text-sm text-[var(--slide-muted)]">
            Tone: {tone} · Theme saves automatically.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <a
            href={`/api/decks/${initialDeck.id}/export/pptx`}
            className="inline-flex h-10 items-center justify-center rounded-lg bg-[var(--slide-primary,#0d9488)] px-4 text-sm font-medium text-white transition hover:opacity-90"
          >
            Export PPTX
          </a>
          <PdfExportButton
            fileName={title}
            slides={slides}
            themeId={themeId}
          />
          <button
            type="button"
            onClick={() => void onDeleteDeck()}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-red-200 px-3 text-sm font-medium text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,220px)_minmax(0,1fr)_minmax(0,280px)]">
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--slide-muted)]">
            Slides
          </h2>
          <div className="mt-3">
            <SlideList
              slides={slides}
              activeId={activeId}
              onSelect={setActiveId}
              onReorder={reorder}
            />
          </div>
        </div>

        <div className="min-w-0">
          <div
            className="aspect-video w-full overflow-hidden rounded-[var(--slide-radius)] border border-[var(--slide-border)] shadow-lg"
            style={{ background: "var(--slide-bg)" }}
          >
            {activeSlide ? (
              <SlideContent slide={activeSlide} />
            ) : (
              <div className="flex h-full items-center justify-center p-8 text-[var(--slide-muted)]">
                No slides
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--slide-muted)]">
              Deck style
            </h2>
            <div className="mt-3 flex flex-col gap-3">
              <label className="text-sm font-medium text-[var(--slide-text)]">
                Theme
                <select
                  value={themeId}
                  onChange={(e) => {
                    const v = e.target.value as ThemeId;
                    setThemeId(v);
                    void persistMeta(v, tone);
                  }}
                  className="mt-1 w-full rounded-lg border border-[var(--slide-border)] bg-[var(--slide-surface-elevated)] px-3 py-2 text-sm"
                >
                  {THEME_IDS.map((id) => (
                    <option key={id} value={id}>
                      {themes[id].name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-sm font-medium text-[var(--slide-text)]">
                Tone (saved; regenerate slide to re-apply)
                <select
                  value={tone}
                  onChange={(e) => {
                    const v = e.target.value as SlideTone;
                    setTone(v);
                    void persistMeta(themeId, v);
                  }}
                  className="mt-1 w-full rounded-lg border border-[var(--slide-border)] bg-[var(--slide-surface-elevated)] px-3 py-2 text-sm"
                >
                  {TONES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </section>

          {activeSlide ? (
            <section>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--slide-muted)]">
                Edit slide
              </h2>
              <div className="mt-3 flex flex-col gap-3">
                <label className="text-sm font-medium text-[var(--slide-text)]">
                  Title
                  <input
                    value={activeSlide.title}
                    onChange={(e) =>
                      updateActiveField({ title: e.target.value })
                    }
                    className="mt-1 w-full rounded-lg border border-[var(--slide-border)] bg-[var(--slide-surface-elevated)] px-3 py-2 text-sm"
                  />
                </label>
                <label className="text-sm font-medium text-[var(--slide-text)]">
                  Bullets (one per line)
                  <textarea
                    rows={6}
                    value={activeSlide.bullets.join("\n")}
                    onChange={(e) =>
                      updateActiveField({
                        bullets: e.target.value
                          .split("\n")
                          .map((l) => l.trim())
                          .filter(Boolean),
                      })
                    }
                    className="mt-1 w-full rounded-lg border border-[var(--slide-border)] bg-[var(--slide-surface-elevated)] px-3 py-2 text-sm"
                  />
                </label>
                <label className="text-sm font-medium text-[var(--slide-text)]">
                  Speaker notes
                  <textarea
                    rows={3}
                    value={activeSlide.notes ?? ""}
                    onChange={(e) =>
                      updateActiveField({ notes: e.target.value || undefined })
                    }
                    className="mt-1 w-full rounded-lg border border-[var(--slide-border)] bg-[var(--slide-surface-elevated)] px-3 py-2 text-sm"
                  />
                </label>
                <label className="text-sm font-medium text-[var(--slide-text)]">
                  Layout
                  <select
                    value={activeSlide.layout}
                    onChange={(e) =>
                      updateActiveField({
                        layout: e.target.value as SlideLayout,
                      })
                    }
                    className="mt-1 w-full rounded-lg border border-[var(--slide-border)] bg-[var(--slide-surface-elevated)] px-3 py-2 text-sm"
                  >
                    {LAYOUTS.map((l) => (
                      <option key={l} value={l}>
                        {l}
                      </option>
                    ))}
                  </select>
                </label>
                <button
                  type="button"
                  onClick={() => void onRegenerate()}
                  disabled={regenId === activeSlide.id}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-[var(--slide-border)] px-3 text-sm font-medium text-[var(--slide-text)] hover:bg-[var(--slide-surface)] disabled:opacity-50"
                >
                  {regenId === activeSlide.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Wand2 className="h-4 w-4" />
                  )}
                  Regenerate slide (AI)
                </button>
              </div>
            </section>
          ) : null}

          <section>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--slide-muted)]">
              Image suggestions
            </h2>
            <p className="mt-2 text-xs text-[var(--slide-muted)]">
              Unsplash results based on this slide. Selecting attaches credit
              metadata for export.
            </p>
            <button
              type="button"
              onClick={() => void loadSuggestions()}
              disabled={imgLoading || !activeSlide}
              className="mt-3 inline-flex h-10 items-center gap-2 rounded-lg border border-[var(--slide-border)] px-3 text-sm font-medium text-[var(--slide-text)] hover:bg-[var(--slide-surface)] disabled:opacity-50"
            >
              {imgLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              Load suggestions
            </button>
            {imgError ? (
              <p className="mt-2 text-xs text-amber-800">{imgError}</p>
            ) : null}
            <div className="mt-3 grid grid-cols-2 gap-2">
              {suggestions.map((img) => (
                <button
                  key={img.id}
                  type="button"
                  onClick={() => void onAttachImage(img)}
                  className="group relative overflow-hidden rounded-lg border border-[var(--slide-border)] text-left"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.thumbUrl}
                    alt={img.alt}
                    className="aspect-video w-full object-cover transition group-hover:opacity-90"
                  />
                  <span className="sr-only">Use image</span>
                </button>
              ))}
            </div>
            {activeSlide?.image ? (
              <button
                type="button"
                onClick={() => void onAttachImage(null)}
                className="mt-3 inline-flex items-center gap-2 text-sm text-red-700 hover:underline"
              >
                <ImageIcon className="h-4 w-4" />
                Remove image
              </button>
            ) : null}
          </section>

          {outline && outline.length > 0 ? (
            <section>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--slide-muted)]">
                Outline
              </h2>
              <ol className="mt-3 list-decimal space-y-2 pl-4 text-sm text-[var(--slide-muted)]">
                {outline.map((o, i) => (
                  <li key={i}>
                    <span className="font-medium text-[var(--slide-text)]">
                      {o.sectionTitle}
                    </span>
                    <span className="block text-xs">{o.summary}</span>
                  </li>
                ))}
              </ol>
            </section>
          ) : null}

          <Link
            href="/decks/new"
            className="text-sm font-medium text-[var(--slide-primary)] hover:underline"
          >
            Create another deck
          </Link>
        </div>
      </div>
    </ThemeBridge>
  );
}
