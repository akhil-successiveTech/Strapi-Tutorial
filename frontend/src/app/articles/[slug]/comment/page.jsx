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
      const articleRes = await fetch(
        `http://localhost:1337/api/articles?filters[slug][$eq]=${slug}`
      );
      const articleData = await articleRes.json();
      const articleId = articleData?.[0]?.id;
      if (!articleId) throw new Error("Article not found.");

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
            username,
            isApproved: false,
          },
        }),
      });

      if (!res.ok) throw new Error("Failed to post comment.");

      alert(
        "Comment submitted successfully! It will appear once approved by the admin."
      );
      setComment("");
      router.push(`/articles`);
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <p className="text-base sm:text-lg text-gray-700">
          Please{" "}
          <a href="/login" className="text-blue-600 hover:underline font-medium">
            login
          </a>{" "}
          to post a comment.
        </p>
      </div>
    );
  }

  return (
    <main className="max-w-xl mx-auto my-12 px-4 sm:px-6">
      <h2 className="text-2xl sm:text-3xl font-semibold mb-4 text-gray-900 text-center">
        Post a Comment
      </h2>
      <p className="text-gray-600 mb-6 text-center">
        Posting as: <span className="font-medium text-gray-900">{username}</span>
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <textarea
          placeholder="Write your comment here..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={6}
          required
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 text-sm sm:text-base resize-none"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-70"
          disabled={loading}
        >
          {loading ? "Posting..." : "Submit for Approval"}
        </button>
      </form>
    </main>
  );
}
