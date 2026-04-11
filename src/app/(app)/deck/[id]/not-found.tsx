import Link from "next/link";

export default function DeckNotFound() {
  return (
    <div className="rounded-xl border border-[var(--slide-border)] bg-[var(--slide-surface-elevated)] p-12 text-center">
      <h1 className="font-[family-name:var(--font-slide-heading)] text-xl font-semibold">
        Deck not found
      </h1>
      <p className="mt-2 text-sm text-[var(--slide-muted)]">
        It may have been deleted or you do not have access.
      </p>
      <Link
        href="/decks"
        className="mt-6 inline-block text-sm font-medium text-[var(--slide-primary)] hover:underline"
      >
        Back to decks
      </Link>
    </div>
  );
}
