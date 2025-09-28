"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function NewArticlePage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const jwt = localStorage.getItem("jwt");
    if (!jwt) return alert("You must be logged in to post.");

    try {
      const res = await fetch("http://localhost:1337/api/articles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          data: {
            title,
            content,
            slug: title.toLowerCase().replace(/\s+/g, "-"),
            published: false, // article requires superuser approval
          },
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error?.message || "Failed to create article");
      }

      alert("Article submitted for approval!");
      setTitle("");
      setContent("");
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  return (
    <>
      <Navbar />
      <main style={{ padding: "50px 20px", maxWidth: "800px", margin: "0 auto" }}>
        <h1 style={{ marginBottom: "30px", textAlign: "center" }}>Submit a New Article</h1>

        {user ? (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <input
              type="text"
              placeholder="Article Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={{
                padding: "10px",
                fontSize: "1rem",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            />
            <textarea
              placeholder="Article Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              required
              style={{
                padding: "10px",
                fontSize: "1rem",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            />
            <button
              type="submit"
              style={{
                background: "#0070f3",
                color: "white",
                padding: "12px",
                border: "none",
                borderRadius: "5px",
                fontSize: "1rem",
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              Submit
            </button>
          </form>
        ) : (
          <p style={{ textAlign: "center", marginTop: "20px" }}>
            Please <a href="/login" style={{ color: "#0070f3", textDecoration: "underline" }}>login</a> to submit an article.
          </p>
        )}
      </main>
      <Footer />
    </>
  );
}
