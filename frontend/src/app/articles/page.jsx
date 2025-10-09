import ArticleList from "@/components/ArticleList";
import { draftMode } from 'next/headers'; // Next.js server function for Draft Mode

async function getArticles() {
  const { isEnabled } = await draftMode();

  const publicationState = isEnabled ? 'preview' : 'live';

  const queryString = new URLSearchParams({
    'populate': '*',
    'publicationState': publicationState,
  }).toString();
  
  try {
    const baseUrl = "http://localhost:1337/api/articles";

    const params = new URLSearchParams({
      populate: "*",
      publicationState: isEnabled ? "preview" : "live",
      "filters[isApproved][$eq]": true,
    });

    const url = `${baseUrl}?${params.toString()}`;
    console.log("Fetching articles:", url);

    const res = await fetch(url, { cache: "no-store" }); // or { next: { revalidate: 60 } } for production
    const data = await res.json();

    if (!res.ok) throw new Error(`Failed to fetch articles. Status: ${res.status}`);
    return data.data || [];
  } catch (err) {
    console.error("Error fetching articles:", err);
    return [];
  }
}

export default async function ArticlesPage() {
  const articles = await getArticles();

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 px-5 py-12 max-w-4xl mx-auto w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Latest Articles
        </h1>
        {articles.length > 0 ? (
          <ArticleList articles={articles} />
        ) : (
          <p className="text-center text-gray-600">
            No articles have been published yet.
          </p>
        )}
      </main>
    </div>
  );
}