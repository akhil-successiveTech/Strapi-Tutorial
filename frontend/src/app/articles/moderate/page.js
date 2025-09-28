"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ApproveArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    async function fetchArticles() {
      const res = await fetch("http://localhost:1337/api/articles?filters[published][$eq]=false");
      const data = await res.json();
      setArticles(data.data);
    }

    fetchArticles();
  }, []);

  const handleApprove = async (id) => {
    const jwt = localStorage.getItem("jwt");
    if (!jwt) return;

    try {
      const res = await fetch(`http://localhost:1337/api/articles/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          data: { published: true },
        }),
      });

      if (!res.ok) throw new Error("Failed to approve");
      alert("Article approved!");
      setArticles(articles.filter((a) => a.id !== id));
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  if (user?.role?.type !== "super-admin") {
    return (
      <>
        <Navbar />
        <main style={{ padding: "50px 20px" }}>
          <h1>Access Denied</h1>
          <p>You must be a super user to approve articles.</p>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main style={{ padding: "50px 20px" }}>
        <h1>Approve Articles</h1>
        {articles.length === 0 ? (
          <p>No pending articles.</p>
        ) : (
          articles.map((article) => (
            <div key={article.id} style={{ border: "1px solid #ccc", padding: "15px", marginBottom: "15px" }}>
              <h2>{article.attributes.title}</h2>
              <p>{article.attributes.content}</p>
              <button
                onClick={() => handleApprove(article.id)}
                style={{ background: "green", color: "white", border: "none", padding: "8px 14px", borderRadius: "5px" }}
              >
                Approve
              </button>
            </div>
          ))
        )}
      </main>
      <Footer />
    </>
  );
}
