import type { SlideImage } from "@/lib/types/deck";

type UnsplashResult = {
  id: string;
  urls: { regular: string; thumb: string };
  alt_description: string | null;
  user: { name: string; links: { html: string } };
};

export async function searchUnsplash(
  query: string,
  perPage = 6,
): Promise<SlideImage[]> {
  const key = process.env.UNSPLASH_ACCESS_KEY;
  if (!key || !query.trim()) {
    return [];
  }

  const url = new URL("https://api.unsplash.com/search/photos");
  url.searchParams.set("query", query);
  url.searchParams.set("per_page", String(perPage));

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Client-ID ${key}` },
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    return [];
  }

  const data = (await res.json()) as { results: UnsplashResult[] };

  return data.results.map((r) => ({
    provider: "unsplash" as const,
    id: r.id,
    url: r.urls.regular,
    thumbUrl: r.urls.thumb,
    alt: r.alt_description ?? query,
    attribution: `Photo by ${r.user.name} on Unsplash (${r.user.links.html})`,
  }));
}
