"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { flushSync } from "react-dom";
import { ThemeBridge } from "@/components/slides/theme-bridge";
import { SlideContent } from "@/components/slides/slide-content";
import type { SlideData } from "@/lib/types/deck";
import type { ThemeId } from "@/lib/themes/presets";

type Props = {
  fileName: string;
  slides: SlideData[];
  themeId: ThemeId | string;
};

export function PdfExportButton({ fileName, slides, themeId }: Props) {
  const [mounted, setMounted] = useState(false);
  const [busy, setBusy] = useState(false);

  async function handleClick() {
    if (slides.length === 0) return;
    setBusy(true);
    flushSync(() => setMounted(true));
    await new Promise((r) =>
      requestAnimationFrame(() => requestAnimationFrame(r)),
    );

    try {
      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF } = await import("jspdf");

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [960, 540],
      });

      for (let i = 0; i < slides.length; i++) {
        const el = document.getElementById(`pdf-slide-${i}`);
        if (!el) continue;
        const canvas = await html2canvas(el, {
          scale: 2,
          useCORS: true,
          backgroundColor: "#ffffff",
        });
        const img = canvas.toDataURL("image/png");
        if (i > 0) pdf.addPage([960, 540], "landscape");
        pdf.addImage(img, "PNG", 0, 0, 960, 540);
      }

      const safe = fileName.replace(/[^\w\s-]/g, "").slice(0, 80) || "deck";
      pdf.save(`${safe}.pdf`);
    } finally {
      setMounted(false);
      setBusy(false);
    }
  }

  const portal =
    mounted &&
    typeof document !== "undefined" &&
    createPortal(
      <div
        className="pointer-events-none fixed left-0 top-0 z-[9999] -translate-x-[10000px]"
        aria-hidden
      >
        <ThemeBridge themeId={themeId}>
          {slides.map((slide, i) => (
            <div
              key={slide.id}
              id={`pdf-slide-${i}`}
              className="h-[540px] w-[960px] overflow-hidden bg-white shadow-lg"
            >
              <SlideContent slide={slide} />
            </div>
          ))}
        </ThemeBridge>
      </div>,
      document.body,
    );

  return (
    <>
      <button
        type="button"
        onClick={() => void handleClick()}
        disabled={busy || slides.length === 0}
        className="inline-flex h-10 items-center justify-center rounded-lg border border-[var(--slide-border)] bg-[var(--slide-surface-elevated)] px-4 text-sm font-medium text-[var(--slide-text)] transition hover:bg-[var(--slide-surface)] disabled:opacity-50"
      >
        {busy ? "Preparing PDF…" : "Export PDF"}
      </button>
      {portal}
    </>
  );
}
