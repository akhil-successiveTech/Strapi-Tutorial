"use client";
import Link from "next/link";

export default function ArticleList({ articles }) {
  if (!articles || articles.length === 0) {
    return <div>No articles found.</div>;
  }

  return (
    <div>
      {articles.map((article) => {
        const attrs = article?.attributes || {};
        const slug = attrs.slug || article.id;

        return (
          <div
            key={article.id}
            style={{
              marginBottom: "20px",
              border: "1px solid #ccc",
              padding: "15px",
              borderRadius: "8px",
            }}
          >
            <Link href={`/articles/${slug}`}>
              <h2>{attrs.title || "Untitled"}</h2>
            </Link>

            {attrs.excerpt && <p><strong>Excerpt:</strong> {attrs.excerpt}</p>}
            {attrs.publishedAt && (
              <p>
                <strong>Published At:</strong>{" "}
                {new Date(attrs.publishedAt).toLocaleDateString()}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
