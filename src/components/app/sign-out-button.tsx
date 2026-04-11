"use client";

import { createClient } from "@/lib/supabase/client";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export function SignOutButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push("/auth/login");
        router.refresh();
      }}
      className="mdui-btn-text inline-flex items-center gap-2 !px-3 !text-[var(--md-on-surface-variant)] hover:!bg-[color-mix(in_srgb,var(--md-on-surface)_6%,transparent)]"
    >
      <LogOut className="h-4 w-4" aria-hidden />
      Sign out
    </button>
  );
}
