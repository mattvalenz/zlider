import type { SlideImage } from "@/lib/types/deck";

type UnsplashResult = {
  id: string;
  urls: { regular: string; thumb: string };
  alt_description: string | null;
  user: { name: string; links: { html: string } };
};

/** Why no images were returned (for UI hints; safe to expose) */
export type UnsplashEmptyReason =
  | "no_key"
  | "empty_query"
  | "unauthorized"
  | "forbidden"
  | "rate_limited"
  | "bad_response"
  | "unknown";

export type UnsplashSearchResult = {
  images: SlideImage[];
  emptyReason?: UnsplashEmptyReason;
};

function mapStatusToReason(status: number): UnsplashEmptyReason {
  if (status === 401) return "unauthorized";
  if (status === 403) return "forbidden";
  if (status === 429) return "rate_limited";
  if (status >= 500) return "bad_response";
  return "unknown";
}

export async function searchUnsplash(
  query: string,
  perPage = 6,
): Promise<UnsplashSearchResult> {
  const raw = process.env.UNSPLASH_ACCESS_KEY;
  const key = typeof raw === "string" ? raw.trim() : "";
  if (!key) {
    return { images: [], emptyReason: "no_key" };
  }
  if (!query.trim()) {
    return { images: [], emptyReason: "empty_query" };
  }

  const url = new URL("https://api.unsplash.com/search/photos");
  url.searchParams.set("query", query);
  url.searchParams.set("per_page", String(perPage));

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Client-ID ${key}` },
    cache: "no-store",
  });

  if (!res.ok) {
    const reason = mapStatusToReason(res.status);
    let snippet = "";
    try {
      snippet = (await res.text()).slice(0, 200);
    } catch {
      /* ignore */
    }
    console.error(
      `[Unsplash] ${res.status} ${res.statusText}${snippet ? `: ${snippet}` : ""}`,
    );
    return { images: [], emptyReason: reason };
  }

  let data: { results?: UnsplashResult[] };
  try {
    data = (await res.json()) as { results?: UnsplashResult[] };
  } catch {
    return { images: [], emptyReason: "bad_response" };
  }

  const results = data.results ?? [];
  const images = results.map((r) => ({
    provider: "unsplash" as const,
    id: r.id,
    url: r.urls.regular,
    thumbUrl: r.urls.thumb,
    alt: r.alt_description ?? query,
    attribution: `Photo by ${r.user.name} on Unsplash (${r.user.links.html})`,
  }));

  return { images };
}
