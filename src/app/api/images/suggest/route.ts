import { requireUserId } from "@/lib/auth/require-user";
import { searchUnsplash } from "@/lib/images/unsplash";
import { rateLimit } from "@/lib/rate-limit";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const userId = await requireUserId();
    if (!rateLimit(`img:${userId}`, 60, 60 * 60 * 1000)) {
      return NextResponse.json({ error: "Rate limited" }, { status: 429 });
    }

    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") ?? "";
    const images = await searchUnsplash(q, 6);
    return NextResponse.json({ images });
  } catch (e) {
    if (e instanceof Error && e.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
