import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import {
  aiDeckOutputSchema,
  singleSlideOutputSchema,
  type AiDeckOutput,
  type SingleSlideOutput,
} from "@/lib/ai/schema";
import {
  buildGenerationSystemPrompt,
  buildRegenerateSlidePrompt,
} from "@/lib/ai/prompts";
import type { SlideTone } from "@/lib/types/deck";

function getClient() {
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    throw new Error("OPENAI_API_KEY is not configured");
  }
  return new OpenAI({ apiKey: key });
}

function clampDeck(output: AiDeckOutput, maxSlides: number): AiDeckOutput {
  const slides = output.slides.slice(0, maxSlides).map((s) => ({
    ...s,
    bullets: s.bullets.slice(0, 6).map((b) =>
      b.length > 200 ? `${b.slice(0, 197)}...` : b,
    ),
  }));
  return {
    ...output,
    slides,
    outline: output.outline.slice(0, 12),
  };
}

export async function generateDeckContent(params: {
  prompt: string;
  tone: SlideTone;
  maxSlides: number;
}): Promise<AiDeckOutput> {
  const client = getClient();
  const system = buildGenerationSystemPrompt(params.tone);
  const user = `User request:\n${params.prompt}\n\nTarget: at most ${params.maxSlides} slides.`;

  const completion = await client.chat.completions.parse({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    response_format: zodResponseFormat(aiDeckOutputSchema, "deck_output"),
  });

  const message = completion.choices[0]?.message;
  if (!message?.parsed) {
    throw new Error("No parsed response from model");
  }

  return clampDeck(message.parsed, params.maxSlides);
}

export async function regenerateSlideContent(params: {
  deckTitle: string;
  tone: SlideTone;
  siblingSummary: string;
  currentTitle: string;
  currentBullets: string[];
}): Promise<SingleSlideOutput> {
  const client = getClient();
  const system = buildRegenerateSlidePrompt(params.tone);
  const user = `Deck: ${params.deckTitle}
Context (other slides summarized): ${params.siblingSummary}
Current slide title: ${params.currentTitle}
Current bullets: ${params.currentBullets.join(" | ")}

Rewrite this slide with fresh content; keep the same general intent but improve clarity.`;

  const completion = await client.chat.completions.parse({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    response_format: zodResponseFormat(
      singleSlideOutputSchema,
      "single_slide",
    ),
  });

  const message = completion.choices[0]?.message;
  if (!message?.parsed) {
    throw new Error("No parsed response from model");
  }

  return message.parsed;
}
