"use client";
import { useState, useEffect } from "react";

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
          },
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error?.message || "Failed to create article");
      }

      alert("Article submitted for approval! Only superuser can publish.");
      setTitle("");
      setContent("");
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  return (
    <main className="px-5 py-12 max-w-3xl mx-auto">
      <h1 className="mb-8 text-center text-3xl font-bold text-gray-800">
        Submit a New Article
      </h1>

      {user ? (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5 bg-white p-6 rounded-lg shadow-md"
        >
          <input
            type="text"
            placeholder="Article Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <textarea
            placeholder="Article Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
            required
            className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-medium transition"
          >
            Submit
          </button>
        </form>
      ) : (
        <p className="text-center mt-6 text-gray-700">
          Please{" "}
          <a href="/login" className="text-blue-600 underline">
            login
          </a>{" "}
          to submit an article.
        </p>
      )}
    </main>
  );
}
