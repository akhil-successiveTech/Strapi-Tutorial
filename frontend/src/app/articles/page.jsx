import ArticleList from "@/components/ArticleList";
import { draftMode } from 'next/headers'; // Next.js server function for Draft Mode

// Fetch articles, checking for Draft Mode to include unpublished drafts
async function getArticles() {
  const { isEnabled } = await draftMode(); // Check if Draft Mode is active
  
  // 'live' is the default (published only). 'preview' includes published and draft content.
  const publicationState = isEnabled ? 'preview' : 'live';

  const queryString = new URLSearchParams({
      'filters[isApproved][$eq]': 'true',
      'populate': '*',
      // Tell Strapi which content to return
      'publicationState': publicationState, 
  }).toString();
  
  try {
    const res = await fetch(
      `http://localhost:1337/api/articles?${queryString}`,
      {
        // Bypass cache when in preview mode to always get the latest draft
        cache: isEnabled ? 'no-store' : 'force-cache',
      }
    );

    if (!res.ok) throw new Error(`Failed to fetch articles. Status: ${res.status}`);

    const data = await res.json();
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
          // The ArticleList component is unchanged, it just renders the data
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