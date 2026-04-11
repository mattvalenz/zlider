import Link from "next/link";
import { Download, Presentation, Sparkles } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    label: "Prompt to outline & slides",
  },
  {
    icon: Presentation,
    label: "Edit in a focused canvas",
  },
  {
    icon: Download,
    label: "Export when you are ready",
  },
] as const;

export function LandingPage() {
  return (
    <div className="relative flex h-dvh max-h-dvh flex-col overflow-hidden bg-[var(--md-background)] text-[var(--md-on-surface)]">
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden
      >
        <div
          className="absolute -right-24 -top-24 h-[min(50vh,22rem)] w-[min(50vw,22rem)] rounded-full bg-[color-mix(in_srgb,var(--md-primary)_14%,transparent)] blur-3xl"
        />
        <div
          className="absolute -bottom-28 -left-20 h-[min(45vh,18rem)] w-[min(55vw,20rem)] rounded-full bg-[color-mix(in_srgb,var(--md-secondary-container)_55%,transparent)] blur-3xl"
        />
      </div>

      <header className="relative z-10 flex shrink-0 items-center justify-between px-5 pt-5 md:px-10 md:pt-6">
        <span
          className="font-[family-name:var(--font-slide-heading)] text-xl font-semibold tracking-tight"
          style={{ color: "var(--md-on-surface)" }}
        >
          Zlider
        </span>
        <Link href="/auth/login" className="mdui-btn-text">
          Sign in
        </Link>
      </header>

      <main className="relative z-10 flex min-h-0 flex-1 flex-col items-center justify-center px-5 py-4 md:px-10">
        <div className="w-full max-w-xl text-center">
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-[var(--md-on-surface-variant)]">
            mvalenz dev
          </p>
          <h1
            className="mt-3 font-[family-name:var(--font-slide-heading)] text-[clamp(1.75rem,5vw,2.75rem)] font-semibold leading-tight tracking-tight text-balance"
            style={{ color: "var(--md-on-surface)" }}
          >
            Decks from a prompt polished in the editor
          </h1>
          <p className="mt-3 text-pretty text-sm leading-relaxed text-[var(--md-on-surface-variant)] md:text-base">
            Zlider is an AI slide maker for people who still want control: generate a
            first draft, refine titles and body copy, attach imagery, then export to
            PowerPoint or Pdf for the room or the webinar.
          </p>

          <ul className="mt-6 flex flex-col items-stretch gap-2 sm:mx-auto sm:max-w-md sm:flex-row sm:flex-wrap sm:justify-center sm:gap-3">
            {features.map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="flex items-center justify-center gap-2 rounded-[var(--md-radius-md)] bg-[color-mix(in_srgb,var(--md-surface-container)_85%,transparent)] px-3 py-2 text-left text-sm text-[var(--md-on-surface)] md:inline-flex md:justify-start"
              >
                <Icon
                  className="h-4 w-4 shrink-0 text-[var(--md-primary)]"
                  aria-hidden
                />
                <span>{label}</span>
              </li>
            ))}
          </ul>

          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
            <Link href="/auth/signup" className="landing-cta">
              Get started
            </Link>
            <Link href="/auth/login" className="mdui-btn-tonal">
              I already have an account
            </Link>
          </div>
        </div>
      </main>

      <footer className="relative z-10 shrink-0 px-5 pb-5 text-center text-xs text-[var(--md-on-surface-variant)] md:px-10 md:pb-6">
        Built for clear stories, fast drafts, careful edits, confident exports.
      </footer>
    </div>
  );
}
