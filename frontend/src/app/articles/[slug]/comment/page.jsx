"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CommentPage({ params }) {
  const router = useRouter();
  const { slug } = params;

  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("Anonymous");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const jwt = localStorage.getItem("jwt");

    if (storedUser) setUser(JSON.parse(storedUser));

    if (jwt) {
      try {
        const payload = JSON.parse(atob(jwt.split(".")[1]));
        console.log("Decoded JWT payload:", payload); // ✅ debug username
        setUsername(payload.username || payload.email || "Anonymous");
      } catch (err) {
        console.error("Error decoding JWT:", err);
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("You must be logged in to comment.");

    const jwt = localStorage.getItem("jwt");
    if (!jwt) return alert("Authentication required.");

    setLoading(true);

    try {
      // Fetch article ID from slug
      const articleRes = await fetch(`http://localhost:1337/api/articles?filters[slug][$eq]=${slug}`);
      const articleData = await articleRes.json();
      const articleId = articleData.data?.[0]?.id;
      if (!articleId) throw new Error("Article not found.");

      // Post the comment
      const res = await fetch("http://localhost:1337/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          data: {
            content: comment,
            article: articleId,
            // author field is optional if JWT is used
          },
        }),
      });

      if (!res.ok) throw new Error("Failed to post comment.");

      alert(`Comment posted successfully as ${username}!`);
      setComment("");
      router.push(`/articles/${slug}#comments`);
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div style={{ padding: "50px 20px", textAlign: "center" }}>
        <p>Please <a href="/login">login</a> to post a comment.</p>
      </div>
    );
  }

  return (
    <main style={{ maxWidth: "600px", margin: "50px auto", padding: "20px" }}>
      <h2>Post a Comment</h2>
      <p>Posting as: <strong>{username}</strong></p> {/* ✅ show username */}
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        <textarea
          placeholder="Write your comment here..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={6}
          required
          style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
        />
        <button
          type="submit"
          style={{ padding: "12px", borderRadius: "5px", border: "none", background: "#0070f3", color: "#fff", cursor: "pointer" }}
          disabled={loading}
        >
          {loading ? "Posting..." : "Post Comment"}
        </button>
      </form>
    </main>
  );
}
