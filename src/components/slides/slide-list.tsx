"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import type { SlideData } from "@/lib/types/deck";

type Props = {
  slides: SlideData[];
  activeId: string;
  onSelect: (id: string) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
};

export function SlideList({
  slides,
  activeId,
  onSelect,
  onReorder,
}: Props) {
  return (
    <nav
      aria-label="Slides"
      className="flex max-h-[calc(100vh-8rem)] flex-col gap-2 overflow-y-auto pr-1"
    >
      {slides.map((s, index) => {
        const active = s.id === activeId;
        return (
          <div
            key={s.id}
            className={`flex items-stretch gap-1 rounded-lg border p-1 ${
              active
                ? "border-[var(--slide-primary)] bg-[var(--slide-primary-muted)]"
                : "border-[var(--slide-border)] bg-[var(--slide-surface-elevated)]"
            }`}
          >
            <button
              type="button"
              onClick={() => onSelect(s.id)}
              className="min-w-0 flex-1 rounded-md px-2 py-2 text-left text-sm transition hover:opacity-90"
              style={{ color: "var(--slide-text)" }}
            >
              <span className="text-xs font-medium text-[var(--slide-muted)]">
                {index + 1}
              </span>
              <span className="line-clamp-2 block font-medium">{s.title}</span>
            </button>
            <div className="flex flex-col justify-center gap-0.5">
              <button
                type="button"
                aria-label={`Move slide ${index + 1} up`}
                disabled={index === 0}
                onClick={() => onReorder(index, index - 1)}
                className="rounded p-1 text-[var(--slide-muted)] hover:bg-black/5 disabled:opacity-30"
              >
                <ChevronUp className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label={`Move slide ${index + 1} down`}
                disabled={index === slides.length - 1}
                onClick={() => onReorder(index, index + 1)}
                className="rounded p-1 text-[var(--slide-muted)] hover:bg-black/5 disabled:opacity-30"
              >
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          </div>
        );
      })}
    </nav>
  );
}
