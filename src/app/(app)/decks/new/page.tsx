import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CreateDeckForm } from "./create-deck-form";

export default async function NewDeckPage() {
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims?.sub) {
    redirect("/auth/login");
  }

  return (
    <div className="mx-auto max-w-xl">
      <Link href="/decks" className="mdui-nav-link !inline-flex text-[var(--md-on-surface-variant)]">
        ← Back to decks
      </Link>
      <h1 className="mt-6 text-[2rem] font-medium leading-snug tracking-tight text-[var(--md-on-surface)] sm:text-[2.25rem]">
        New deck
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-[var(--md-on-surface-variant)]">
        Describe what you want to present. We will generate an outline and slides with
        tone-aware copy.
      </p>
      <div className="mdui-card mt-8 p-6 sm:p-8">
        <CreateDeckForm />
      </div>
    </div>
  );
}
