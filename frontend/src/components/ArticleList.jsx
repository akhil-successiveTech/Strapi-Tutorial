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
      console.log("Decoded JWT payload:", payload); // <-- added console.log
      setUserId(payload.id); // Strapi user ID
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
    <div>
      {articles.map((article) => (
        <div
          key={article.id}
          style={{
            marginBottom: "30px",
            border: "1px solid #ccc",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <Link href={`/articles/${article.slug}`}>
            <h2 style={{ marginBottom: "10px" }}>{article.title}</h2>
          </Link>
          <p><strong>Excerpt:</strong> {article.excerpt}</p>
          {article.category && <p><strong>Category:</strong> {article.category.name}</p>}
          <p><strong>Published At:</strong> {new Date(article.publishedAt).toLocaleDateString()}</p>
          <p><strong>Updated At:</strong> {new Date(article.updatedAt).toLocaleDateString()}</p>

          {/* Comment Button */}
          {user && (
            <Link href={`/articles/${article.slug}/comment`}>
              <button style={commentBtn}>Comment</button>
            </Link>
          )}

          {/* Admin Actions */}
          {isSuperUser && (
            <div style={{ marginTop: "15px" }}>
              <Link href={`/articles/edit/${article.id}`}>
                <button style={actionBtn}>Edit</button>
              </Link>
              <button
                onClick={() => handleDelete(article.id)}
                style={{ ...actionBtn, background: "#ff4444" }}
              >
                Delete
              </button>
            </div>
          )}

          {/* Elegant Comments Display */}
          {article.comments && article.comments.length > 0 && (
            <div style={{ marginTop: "20px" }}>
              <h3 style={{ marginBottom: "10px" }}>Comments:</h3>
              {article.comments.map((comment) => {
                // Determine username: use comment.user from Strapi or fallback to logged-in user if it matches
                const commentUsername =
                  comment.user?.username || (comment.user?.id === userId ? username : "Anonymous");

                return (
                  <div
                    key={comment.id}
                    style={{
                      background: "#f9f9f9",
                      padding: "10px 15px",
                      marginBottom: "10px",
                      borderRadius: "8px",
                      borderLeft: "4px solid #0070f3",
                    }}
                  >
                    <p style={{ margin: 0, fontWeight: 500 }}>{commentUsername}</p>
                    <p style={{ margin: "5px 0 0 0" }}>{comment.content}</p>
                    <small style={{ color: "#555" }}>{new Date(comment.createdAt).toLocaleString()}</small>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

const actionBtn = {
  background: "#0070f3",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  padding: "6px 12px",
  marginRight: "10px",
  cursor: "pointer",
  fontWeight: 500,
};

const commentBtn = {
  background: "#28a745",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  padding: "6px 12px",
  marginTop: "10px",
  cursor: "pointer",
  fontWeight: 500,
};
