import type { SlideTone } from "@/lib/types/deck";

const toneGuides: Record<SlideTone, string> = {
  formal:
    "Use precise, professional vocabulary. Avoid contractions. Prefer third person or neutral voice where appropriate.",
  casual:
    "Use conversational language, contractions welcome. Friendly and approachable; short punchy bullets.",
  pitch:
    "Investor or stakeholder pitch: outcome-focused, momentum, traction. Bold claims must feel grounded.",
  educational:
    "Teach step-by-step. Define terms briefly. Bullets should build on each other logically.",
  professional:
    "Clear business tone: confident, concise, no fluff. Active voice. One idea per bullet.",
};

export function toneSystemAddition(tone: SlideTone): string {
  return toneGuides[tone] ?? toneGuides.professional;
}

export function buildGenerationSystemPrompt(tone: SlideTone): string {
  return `You are an expert presentation designer. You output only structured data matching the schema.

Rules:
- Create a coherent deck: outline sections should map to the slide sequence.
- Each slide: a clear title, 3-5 bullets (max 6), each bullet under 140 characters unless title-only slide.
- First slide can be a title/overview slide with fewer bullets (1-3).
- Do not use markdown, emojis, or slide numbers in titles.
- ${toneSystemAddition(tone)}`;
}

export function buildRegenerateSlidePrompt(tone: SlideTone): string {
  return `Regenerate a single slide to match the deck context. Output only structured data for one slide.
${toneSystemAddition(tone)}`;
}
