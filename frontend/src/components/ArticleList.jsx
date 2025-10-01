"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ArticleList({ articles }) {
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState("Anonymous");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const jwt = localStorage.getItem("jwt");

    if (storedUser) setUser(JSON.parse(storedUser));

    if (jwt) {
      try {
        const payload = JSON.parse(atob(jwt.split(".")[1]));
        setUserId(payload.id);
        setUsername(payload.username || payload.email || "Anonymous");
      } catch (err) {
        console.error("Error decoding JWT:", err);
      }
    }
  }, []);

  const isSuperUser = user?.role?.type === "super-admin";

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this article?")) return;
    try {
      const jwt = localStorage.getItem("jwt");
      const res = await fetch(`http://localhost:1337/api/articles/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${jwt}` },
      });

      if (!res.ok) throw new Error("Failed to delete article");
      alert("Article deleted!");
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  return (
    <div className="grid gap-8 md:grid-cols-2">
      {articles.map((article) => {
        // Use coverImage instead of cover
        const coverData = article.coverImage;
        console.log(coverData);
        const coverUrl = coverData
          ? coverData.formats?.medium?.url || coverData.url
          : "/default-cover.jpg";

        return (
          <div
            key={article.id}
            className="bg-white border rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden"
          >
            {/* Cover Image */}
            <Link href={`/articles/${article.slug}`}>
              <img
                src={`http://localhost:1337${coverUrl}`}
                alt={article.title}
                className="w-full h-56 object-cover"
              />
            </Link>

            <div className="p-5">
              {/* Title */}
              <Link href={`/articles/${article.slug}`}>
                <h2 className="text-xl font-semibold mb-2 hover:text-blue-600 transition-colors">
                  {article.title}
                </h2>
              </Link>

              {/* Excerpt */}
              <p className="text-gray-700 mb-3">{article.excerpt}</p>

              {/* Category */}
              {article.category && (
                <p className="text-sm text-gray-500 mb-1">
                  <strong>Category:</strong> {article.category.name}
                </p>
              )}

              {/* Published / Updated */}
              <p className="text-sm text-gray-500">
                <strong>Published:</strong>{" "}
                {new Date(article.publishedAt).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-500 mb-3">
                <strong>Updated:</strong>{" "}
                {new Date(article.updatedAt).toLocaleDateString()}
              </p>

              {/* Comment Button */}
              {user && (
                <Link href={`/articles/${article.slug}/comment`}>
                  <button className="bg-green-600 text-white px-4 py-2 rounded-md font-medium hover:bg-green-700 transition">
                    Comment
                  </button>
                </Link>
              )}

              {/* Admin Actions */}
              {isSuperUser && (
                <div className="mt-3 flex">
                  <Link href={`/articles/edit/${article.id}`}>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-md mr-2 hover:bg-blue-700 transition">
                      Edit
                    </button>
                  </Link>
                  <button
                    onClick={() => handleDelete(article.id)}
                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </div>
              )}

              {/* Comments */}
              {article.comments && article.comments.length > 0 && (
                <div className="mt-5">
                  <h3 className="font-semibold mb-2">Comments:</h3>
                  {article.comments.map((comment) => {
                    const commentUsername =
                      comment.user?.username ||
                      (comment.user?.id === userId ? username : "Anonymous");

                    return (
                      <div
                        key={comment.id}
                        className="bg-gray-100 p-3 mb-2 rounded-md border-l-4 border-blue-500"
                      >
                        <p className="font-medium">{commentUsername}</p>
                        <p>{comment.content}</p>
                        <small className="text-gray-600">
                          {new Date(comment.createdAt).toLocaleString()}
                        </small>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
