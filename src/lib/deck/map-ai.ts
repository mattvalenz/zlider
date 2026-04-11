import type { AiDeckOutput } from "@/lib/ai/schema";
import type { OutlineSection, SlideData, SlideLayout } from "@/lib/types/deck";

function pickLayout(index: number, total: number): SlideLayout {
  if (index === 0) return "title";
  if (index === total - 1 && total > 2) return "bullets";
  return "bullets";
}

export function mapAiToSlides(output: AiDeckOutput): {
  slides: SlideData[];
  outline: OutlineSection[];
} {
  const total = output.slides.length;
  const slides: SlideData[] = output.slides.map((s, i) => ({
    id: crypto.randomUUID(),
    order: i,
    layout: pickLayout(i, total),
    title: s.title,
    bullets: s.bullets,
    notes: s.notes,
  }));

  return {
    slides,
    outline: output.outline.map((o) => ({
      sectionTitle: o.sectionTitle,
      summary: o.summary,
    })),
  };
}
