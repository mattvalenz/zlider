import { requireUserId } from "@/lib/auth/require-user";
import { buildPptxArrayBuffer } from "@/lib/export/pptx";
import { createClient } from "@/lib/supabase/server";
import type { DeckRow } from "@/lib/types/deck";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const userId = await requireUserId();
    const { id } = await context.params;
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("decks")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data || data.user_id !== userId) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const buffer = await buildPptxArrayBuffer(data as DeckRow);
    const safeName = (data.title as string)
      .replace(/[^\w\s-]/g, "")
      .slice(0, 80);

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "Content-Disposition": `attachment; filename="${safeName || "deck"}.pptx"`,
      },
    });
  } catch (e) {
    if (e instanceof Error && e.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Export failed" }, { status: 500 });
  }
}
