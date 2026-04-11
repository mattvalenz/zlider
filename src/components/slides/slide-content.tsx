import type { SlideData } from "@/lib/types/deck";

type Props = {
  slide: SlideData;
  className?: string;
  /** `canvas` fills a fixed 16:9 / PDF box; `editor` grows with content (deck preview). */
  variant?: "canvas" | "editor";
};

export function SlideContent({
  slide,
  className = "",
  variant = "canvas",
}: Props) {
  const showImage = slide.layout === "title-image" && slide.image;
  const fillParent = variant === "canvas";

  return (
    <div
      className={`flex flex-col p-8 md:p-10 ${fillParent ? "h-full" : "h-auto min-h-0"} ${className}`}
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
        className={`mt-6 grid gap-6 ${fillParent ? "flex-1" : ""} ${showImage ? "md:grid-cols-2" : ""}`}
      >
        {slide.bullets.length > 0 ? (
          <ul className="list-none space-y-3 text-left">
            {slide.bullets.map((b, i) => (
              <li
                key={i}
                className="relative pl-6 text-base leading-relaxed md:text-lg"
                style={{ color: "var(--slide-text)" }}
              >
                <span
                  className="absolute left-0 top-[0.35em] h-2 w-2 rounded-full"
                  style={{ background: "var(--slide-accent)" }}
                  aria-hidden
                />
                {b}
              </li>
            ))}
          </ul>
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
