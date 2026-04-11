import type { DeckRow, SlideData } from "@/lib/types/deck";
import { getTheme } from "@/lib/themes/presets";

export async function buildPptxArrayBuffer(deck: DeckRow): Promise<ArrayBuffer> {
  const PptxGenJS = (await import("pptxgenjs")).default;
  const pptx = new PptxGenJS();
  const theme = getTheme(deck.theme_id);
  const { tokens } = theme;

  pptx.author = "Zlider";
  pptx.title = deck.title;
  pptx.layout = "LAYOUT_WIDE";

  const slides = deck.slides as SlideData[];
  const primary = tokens.primary.replace("#", "");

  for (const slide of slides) {
    const s = pptx.addSlide();
    s.background = { color: tokens.surface.replace("#", "") };

    s.addText(slide.title, {
      x: 0.5,
      y: 0.35,
      w: 12.33,
      h: 1.1,
      fontSize: slide.layout === "title" ? 36 : 28,
      bold: true,
      color: tokens.text.replace("#", ""),
      fontFace: "Calibri",
    });

    if (slide.bullets.length > 0) {
      s.addText(
        slide.bullets.map((b) => ({
          text: b,
          options: { bullet: { type: "bullet" as const } },
        })),
        {
          x: 0.6,
          y: slide.layout === "title" ? 1.65 : 1.45,
          w: 11.5,
          h: 4.5,
          fontSize: 18,
          color: tokens.text.replace("#", ""),
          valign: "top",
          fontFace: "Calibri",
        },
      );
    }

    if (slide.image?.url) {
      try {
        s.addImage({
          path: slide.image.url,
          x: 6.8,
          y: 1.45,
          w: 5.5,
          h: 4,
        });
      } catch {
        s.addText(slide.image.attribution, {
          x: 6.8,
          y: 5.6,
          w: 5.5,
          h: 0.4,
          fontSize: 8,
          color: tokens.muted.replace("#", ""),
        });
      }
    }

    if (slide.notes) {
      s.addNotes(slide.notes);
    }

    s.addText("Zlider", {
      x: 0.5,
      y: 6.85,
      w: 3,
      h: 0.35,
      fontSize: 10,
      color: primary,
    });
  }

  const credits = slides
    .filter((sl) => sl.image?.attribution)
    .map((sl) => `${sl.title}: ${sl.image!.attribution}`)
    .join("\n");

  if (credits) {
    const last = pptx.addSlide();
    last.addText("Image credits", {
      x: 0.5,
      y: 0.4,
      w: 12,
      h: 0.6,
      fontSize: 24,
      bold: true,
      color: tokens.text.replace("#", ""),
    });
    last.addText(credits, {
      x: 0.5,
      y: 1.2,
      w: 12,
      h: 5,
      fontSize: 14,
      color: tokens.muted.replace("#", ""),
      valign: "top",
    });
  }

  const out = await pptx.write({ outputType: "arraybuffer" });
  if (out instanceof ArrayBuffer) {
    return out;
  }
  if (out instanceof Uint8Array) {
    const copy = new Uint8Array(out.byteLength);
    copy.set(out);
    return copy.buffer;
  }
  throw new Error("Unexpected pptx output type");
}
