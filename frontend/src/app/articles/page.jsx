import ArticleList from "@/components/ArticleList";
import Footer from "@/components/Footer"; // ✅ assuming you already have Footer

// Fetch only approved & published articles
async function getArticles() {
  try {
    const res = await fetch(
      "http://localhost:1337/api/articles?filters[isApproved][$eq]=true&filters[publishedAt][$notNull]=true&populate=*",
      {
        cache: "no-store",
      }
    );

    if (!res.ok) throw new Error("Failed to fetch articles");

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
      {/* Main Content */}
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
