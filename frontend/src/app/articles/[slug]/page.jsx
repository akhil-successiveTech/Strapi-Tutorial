"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ArticleDetailPage() {
  const { slug } = useParams();
  const router = useRouter();

  const [article, setArticle] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    async function fetchArticle() {
      const res = await fetch(
        `http://localhost:1337/api/articles?filters[slug][$eq]=${slug}&populate=*,comments.user`
      );
      const data = await res.json();
      if (data.data.length > 0) {
        const artData = data.data[0];
        const art = {
          id: artData.id,
          title: artData.attributes.title,
          content: artData.attributes.content,
          image: artData.attributes.image?.data?.attributes?.url,
          comments: artData.attributes.comments || [],
        };
        setArticle(art);
        setComments(art.comments);
      }
    }

    fetchArticle();
  }, [slug]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    if (!user) return alert("You must be logged in to comment.");

    const jwt = localStorage.getItem("jwt");

    try {
      const res = await fetch("http://localhost:1337/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          data: {
            text: newComment,
            article: article.id,
            user: user.id,
          },
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error?.message || "Failed to add comment");
      }

      const result = await res.json();
      setComments([...comments, { id: result.data.id, ...result.data.attributes }]);
      setNewComment("");
      setShowCommentBox(false);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  if (!article)
    return <p className="text-center mt-10 text-gray-500">Loading...</p>;

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-4">{article.title}</h1>

      {article.image && (
        <img
          src={`http://localhost:1337${article.image}`}
          alt={article.title}
          className="w-full max-h-96 object-cover rounded-lg mb-6"
        />
      )}

      <p className="text-lg mb-10 whitespace-pre-line">{article.content}</p>

      {/* Comments Section */}
      <section className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">Comments</h2>

        {comments.length === 0 && (
          <p className="text-gray-500 mb-4">No comments yet.</p>
        )}

        <ul className="space-y-3">
          {comments.map((comment) => (
            <li
              key={comment.id}
              className="border p-3 rounded-md bg-gray-50"
            >
              <strong className="text-gray-800">
                {comment.user?.username || "Anonymous"}:
              </strong>{" "}
              {comment.text}
            </li>
          ))}
        </ul>

        {/* Add Comment */}
        {user ? (
          <>
            {!showCommentBox && (
              <button
                onClick={() => setShowCommentBox(true)}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Add Comment
              </button>
            )}

            {showCommentBox && (
              <div className="mt-4 flex flex-col gap-2">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write your comment..."
                  className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  rows={4}
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleAddComment}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                  >
                    Post Comment
                  </button>
                  <button
                    onClick={() => setShowCommentBox(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <p className="mt-4 text-gray-600">
            Please <a href="/login" className="text-blue-600 underline">login</a> to comment.
          </p>
        )}
      </section>
    </main>
  );
}
