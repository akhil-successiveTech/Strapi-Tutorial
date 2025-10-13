import Link from "next/link";
import { createApolloClient } from "../../../../lib/apollo";
import { GET_ARTICLE_BY_SLUG } from "@/queries/article";

const client = createApolloClient();

export default async function ArticleDetailPage({ params }) {
  const { slug } = await params;

  try {
    const { data } = await client.query({
      query: GET_ARTICLE_BY_SLUG,
      variables: { filters: { slug: { eq: slug } } },
      fetchPolicy: "no-cache",
    });

    const articleData = data?.articles?.[0];

    if (!articleData) {
      return (
        <p className="text-center mt-10 text-red-500">
          Article not found.
        </p>
      );
    }

    const imgSrc = articleData.coverImage?.url
      ? articleData.coverImage.url.startsWith("http")
        ? articleData.coverImage.url
        : `http://localhost:1337${articleData.coverImage.url}`
      : null;

    // ✅ Only show approved comments
    const approvedComments =
      articleData.comments?.filter((c) => c.isApproved) || [];

    return (
      <main className="max-w-4xl mx-auto p-6">
        <h1 className="text-4xl font-bold mb-4">{articleData.title}</h1>

        {imgSrc && (
          <img
            src={imgSrc}
            alt={articleData.title}
            className="w-full max-h-96 object-cover rounded-lg mb-6"
          />
        )}

        <div
          className="text-lg mb-10 whitespace-pre-line"
          dangerouslySetInnerHTML={{ __html: articleData.content }}
        />

        {/* ✅ Comments Section */}
        <section className="mt-12 border-t pt-6" id="comments">
          <h2 className="text-2xl font-semibold mb-4">Comments</h2>

          {approvedComments.length > 0 ? (
            <div className="space-y-4">
              {approvedComments.map((comment, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-50 border rounded-lg shadow-sm"
                >
                  <p className="text-gray-800">{comment.content}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {new Date(comment.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 mt-4">No comments yet.</p>
          )}

          {/* ✅ Button to go to comment page */}
          <div className="mt-8 text-center">
            <Link
              href={`/articles/${slug}/comment`}
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-5 rounded-lg transition"
            >
              Write a Comment
            </Link>
          </div>
        </section>
      </main>
    );
  } catch (err) {
    console.error("Error fetching article:", err);
    return (
      <p className="text-center mt-10 text-red-500">
        Failed to load article.
      </p>
    );
  }
}
