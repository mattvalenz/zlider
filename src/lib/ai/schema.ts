import { z } from "zod";

export const outlineSectionSchema = z.object({
  sectionTitle: z.string(),
  summary: z.string(),
});

export const slideOutputSchema = z.object({
  title: z.string(),
  bullets: z.array(z.string()).min(1).max(6),
  // JSON schema / Gemini: use null when speaker notes are absent
  notes: z.string().nullable(),
});

export const aiDeckOutputSchema = z.object({
  deckTitle: z.string(),
  outline: z.array(outlineSectionSchema).min(1).max(12),
  slides: z.array(slideOutputSchema).min(1).max(20),
});

export type AiDeckOutput = z.infer<typeof aiDeckOutputSchema>;

export const singleSlideOutputSchema = z.object({
  title: z.string(),
  bullets: z.array(z.string()).min(1).max(6),
  notes: z.string().nullable(),
});

export type SingleSlideOutput = z.infer<typeof singleSlideOutputSchema>;
