import type { SlideData } from "@/lib/types/deck";
import {
  parseSlideBodyLines,
  slideBodyHasContent,
} from "@/lib/slide/body";

type Props = {
  slide: SlideData;
  className?: string;
  /**
   * `fixed` — fill a fixed-size box (PDF/PPTX capture). `flow` — grow with content (editor preview scroll).
   */
  mode?: "fixed" | "flow";
};

/** Fills parent box (1920×1080 slide, PDF export, etc.). */
export function SlideContent({ slide, className = "", mode = "fixed" }: Props) {
  const showImage = slide.layout === "title-image" && slide.image;
  const segments = parseSlideBodyLines(slide.bullets);
  const showBody = slideBodyHasContent(slide.bullets);
  const fill = mode === "fixed";

  return (
    <div
      className={`flex flex-col p-8 md:p-10 ${fill ? "h-full min-h-0" : "min-h-full"} ${className}`}
      style={{
        background: "var(--slide-bg)",
        borderRadius: "var(--slide-radius)",
        color: "var(--slide-text)",
        fontFamily: "var(--slide-font-body)",
      }}
    >
      <h2
        className="text-balance font-[family-name:var(--slide-font-heading)] font-semibold leading-tight tracking-tight"
        style={{
          fontSize: slide.layout === "title" ? "2.25rem" : "1.75rem",
          color: "var(--slide-text)",
        }}
      >
        {slide.title}
      </h2>

      <div
        className={`mt-6 grid gap-6 ${fill ? "min-h-0 flex-1" : ""} ${showImage ? "md:grid-cols-2" : ""}`}
      >
        {showBody ? (
          <div
            className={`space-y-3 text-left ${fill ? "min-h-0" : ""}`}
          >
            {segments.map((seg, i) => {
              if (seg.kind === "gap") {
                return (
                  <div key={i} className="h-3 shrink-0" aria-hidden />
                );
              }
              if (seg.kind === "paragraph") {
                return (
                  <p
                    key={i}
                    className="text-base leading-relaxed md:text-lg"
                    style={{ color: "var(--slide-text)" }}
                  >
                    {seg.text}
                  </p>
                );
              }
              return (
                <div
                  key={i}
                  className="relative pl-6 text-base leading-relaxed md:text-lg"
                  style={{ color: "var(--slide-text)" }}
                >
                  <span
                    className="absolute left-0 top-[0.35em] h-2 w-2 rounded-full"
                    style={{ background: "var(--slide-accent)" }}
                    aria-hidden
                  />
                  {seg.text}
                </div>
              );
            })}
          </div>
        ) : null}

        {showImage ? (
          <figure className="flex flex-col gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={slide.image!.url}
              alt={slide.image!.alt}
              className="max-h-64 w-full rounded-[var(--slide-radius)] object-cover shadow-md"
            />
            <figcaption
              className="text-xs leading-snug"
              style={{ color: "var(--slide-muted)" }}
            >
              {slide.image!.attribution}
            </figcaption>
          </figure>
        ) : null}
      </div>

      {slide.notes ? (
        <p
          className="mt-4 border-t pt-3 text-sm"
          style={{
            borderColor: "var(--slide-border)",
            color: "var(--slide-muted)",
          }}
        >
          <span className="font-medium text-[var(--slide-text)]">Notes: </span>
          {slide.notes}
        </p>
      ) : null}
    </div>
  );
}
