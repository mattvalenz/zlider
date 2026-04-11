import { GoogleGenAI } from "@google/genai";
import { toJSONSchema, type z } from "zod";
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

/** JSON Schema for Gemini `responseJsonSchema` (draft-07 matches API docs) */
function geminiResponseJsonSchema(schema: z.ZodType) {
  return toJSONSchema(schema, { target: "draft-07" });
}

function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }
  return new GoogleGenAI({ apiKey });
}

function modelId(): string {
  return process.env.GEMINI_MODEL?.trim() || "gemini-2.0-flash";
}

function parseJsonResponse<T>(
  text: string | undefined,
  schema: { parse: (data: unknown) => T },
  label: string,
): T {
  if (text == null || text === "") {
    throw new Error(`No text in Gemini response (${label})`);
  }
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    throw new Error(`Gemini returned invalid JSON (${label})`);
  }
  return schema.parse(raw);
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
  const ai = getGenAI();
  const system = buildGenerationSystemPrompt(params.tone);
  const user = `User request:\n${params.prompt}\n\nTarget: at most ${params.maxSlides} slides.`;

  const response = await ai.models.generateContent({
    model: modelId(),
    contents: user,
    config: {
      systemInstruction: system,
      responseMimeType: "application/json",
      responseJsonSchema: geminiResponseJsonSchema(aiDeckOutputSchema),
    },
  });

  const parsed = parseJsonResponse(
    response.text,
    aiDeckOutputSchema,
    "deck_output",
  );
  return clampDeck(parsed, params.maxSlides);
}

export async function regenerateSlideContent(params: {
  deckTitle: string;
  tone: SlideTone;
  siblingSummary: string;
  currentTitle: string;
  currentBullets: string[];
}): Promise<SingleSlideOutput> {
  const ai = getGenAI();
  const system = buildRegenerateSlidePrompt(params.tone);
  const user = `Deck: ${params.deckTitle}
Context (other slides summarized): ${params.siblingSummary}
Current slide title: ${params.currentTitle}
Current bullets: ${params.currentBullets.join(" | ")}

Rewrite this slide with fresh content; keep the same general intent but improve clarity.`;

  const response = await ai.models.generateContent({
    model: modelId(),
    contents: user,
    config: {
      systemInstruction: system,
      responseMimeType: "application/json",
      responseJsonSchema: geminiResponseJsonSchema(singleSlideOutputSchema),
    },
  });

  return parseJsonResponse(response.text, singleSlideOutputSchema, "single_slide");
}
