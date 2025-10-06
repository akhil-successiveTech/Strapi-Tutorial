// components/ArticleList.jsx

import Link from "next/link";

export default function ArticleList({ articles }) {
  // Removed: const previewSecret = process.env.NEXT_PUBLIC_PREVIEW_SECRET;

  return (
    <div className="grid gap-8 md:grid-cols-2">
      {articles.map((article) => {
        const coverUrl = article.coverImage?.formats?.medium?.url || article.coverImage?.url || "/default-cover.jpg";

        return (
          <div 
            key={article.id} 
            className="bg-white border rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden"
          >
            {/* Image Link - Removed ?preview_secret */}
            <Link href={`/articles/${article.slug}`}>
              <img 
                src={`http://localhost:1337${coverUrl}`} 
                alt={article.title} 
                className="w-full h-56 object-cover" 
              />
            </Link>

            <div className="p-5">
              {/* Title Link - Removed ?preview_secret */}
              <Link href={`/articles/${article.slug}`}>
                <h2 className="text-xl font-semibold mb-2 hover:text-blue-600 transition-colors">{article.title}</h2>
              </Link>

              {/* Excerpt */}
              <p className="text-gray-700 mb-3">{article.excerpt}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}