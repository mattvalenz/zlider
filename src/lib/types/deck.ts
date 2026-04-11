import type { ThemeId } from "@/lib/themes/presets";

export type SlideLayout = "title" | "bullets" | "title-image";

export type SlideTone =
  | "formal"
  | "casual"
  | "pitch"
  | "educational"
  | "professional";

export type SlideImage = {
  provider: "unsplash";
  id: string;
  url: string;
  thumbUrl: string;
  attribution: string;
  alt: string;
};

export type SlideData = {
  id: string;
  order: number;
  layout: SlideLayout;
  title: string;
  bullets: string[];
  notes?: string;
  image?: SlideImage;
};

export type OutlineSection = {
  sectionTitle: string;
  summary: string;
};

export type DeckRow = {
  id: string;
  user_id: string;
  title: string;
  theme_id: ThemeId;
  tone: SlideTone;
  slides: SlideData[];
  outline: OutlineSection[] | null;
  created_at: string;
  updated_at: string;
};
