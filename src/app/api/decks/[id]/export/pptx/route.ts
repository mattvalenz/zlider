import { requireUserId } from "@/lib/auth/require-user";
import { getDeckForUserId } from "@/lib/deck/get-deck";
import { buildPptxArrayBuffer } from "@/lib/export/pptx";
import type { DeckRow } from "@/lib/types/deck";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const userId = await requireUserId();
    const { id } = await context.params;
    const deck = await getDeckForUserId(id, userId);
    if (!deck) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const buffer = await buildPptxArrayBuffer(deck as DeckRow);
    const safeName = (deck.title as string)
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
