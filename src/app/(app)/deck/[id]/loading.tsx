import { Loader2 } from "lucide-react";

export default function DeckLoading() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center gap-3 text-[var(--slide-muted)]">
      <Loader2 className="h-6 w-6 animate-spin" aria-hidden />
      <span className="text-sm font-medium">Loading deck…</span>
    </div>
  );
}
