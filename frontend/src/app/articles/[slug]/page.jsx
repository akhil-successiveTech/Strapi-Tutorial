"use client";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";

const API_URL = "http://localhost:1337/api";

export default function ArticleDetailPage() {
  const { slug } = useParams();
  const searchParams = useSearchParams();
  const previewSecret = searchParams.get("preview_secret");
  const isPreview = previewSecret === process.env.NEXT_PUBLIC_PREVIEW_SECRET;

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    let aborted = false;

    async function fetchArticle() {
      try {
        const params = new URLSearchParams();
        params.set("filters[slug][$eq]", slug);
        // populate image fully and comments -> user (optional)
        params.set("populate[image]", "*");
        params.set("populate[comments][populate]", "user");

        if (!isPreview) {
          params.set("filters[isApproved][$eq]", "true");
        }

        const url = `${API_URL}/articles?${params.toString()}`;
        console.log("Fetching article URL:", url);

        const res = await fetch(url);
        const data = await res.json();
        console.log("Strapi response:", data);

        if (aborted) return;

        if (!data?.data || data.data.length === 0) {
          setArticle(null);
          setLoading(false);
          return;
        }

        const artData = data.data[0];
        const imagePath = artData.attributes.image?.data?.attributes?.url || null;

        setArticle({
          id: artData.id,
          slug: artData.attributes.slug,
          title: artData.attributes.title,
          // If using Rich Text (Strapi WYSIWYG), use innerHTML below
          content: artData.attributes.content,
          image: imagePath,
        });

        setLoading(false);
      } catch (err) {
        console.error("Error fetching article:", err);
        if (!aborted) setLoading(false);
      }
    }

    fetchArticle();
    return () => {
      aborted = true;
    };
  }, [slug, isPreview]);

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading...</p>;
  if (!article) return <p className="text-center mt-10 text-red-500 text-xl">Article not found.</p>;

  const imgSrc = article.image
    ? article.image.startsWith("http")
      ? article.image
      : `http://localhost:1337${article.image}`
    : null;

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-4">{article.title}</h1>

      {imgSrc && (
        <img
          src={imgSrc}
          alt={article.title}
          className="w-full max-h-96 object-cover rounded-lg mb-6"
        />
      )}

      {/* If content is rich HTML from Strapi, render as HTML */}
      <div className="text-lg mb-10 whitespace-pre-line" dangerouslySetInnerHTML={{ __html: article.content }} />
    </main>
  );
}
