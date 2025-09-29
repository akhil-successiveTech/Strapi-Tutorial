import ArticleList from "@/components/ArticleList";

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
    <>
      <main style={{ padding: "50px 20px" }}>
        <h1>Latest Articles</h1>
        {articles.length > 0 ? (
          <ArticleList articles={articles} />
        ) : (
          <p>No articles have been published yet.</p>
        )}
      </main>
    </>
  );
}
