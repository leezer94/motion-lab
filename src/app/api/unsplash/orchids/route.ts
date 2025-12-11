import { NextResponse } from "next/server";

const UNSPLASH_ENDPOINT = "https://api.unsplash.com/search/photos";
const DEFAULT_QUERY = "orchid botanical macro";
const RESULTS_PER_PAGE = 9;

type UnsplashPhoto = {
  id: string;
  alt_description?: string | null;
  urls: {
    small: string;
  };
  links: {
    html: string;
  };
  user: {
    name: string;
  };
};

type UnsplashResponse = {
  results: UnsplashPhoto[];
};

export async function GET() {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;

  if (!accessKey) {
    return NextResponse.json(
      { error: "Missing Unsplash access key" },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }

  const searchParams = new URLSearchParams({
    query: DEFAULT_QUERY,
    per_page: RESULTS_PER_PAGE.toString(),
    orientation: "portrait",
  });

  const response = await fetch(`${UNSPLASH_ENDPOINT}?${searchParams}`, {
    headers: {
      Authorization: `Client-ID ${accessKey}`,
      "Accept-Version": "v1",
    },
    next: { revalidate: 60 * 60 },
  });

  if (!response.ok) {
    return NextResponse.json(
      { error: "Failed to load Unsplash gallery" },
      { status: response.status, headers: { "Cache-Control": "no-store" } },
    );
  }

  const data = (await response.json()) as UnsplashResponse;

  const normalized = data.results.map((photo) => ({
    id: photo.id,
    alt: photo.alt_description ?? "Orchid specimen detail",
    src: photo.urls.small,
    photographer: photo.user.name,
    link: photo.links.html,
  }));

  return NextResponse.json(
    { results: normalized },
    { headers: { "Cache-Control": "public, max-age=3600" } },
  );
}
