"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ArticleDetailPage() {
  const { slug } = useParams();
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
        `http://localhost:1337/api/articles?filters[slug][$eq]=${slug}&populate=comments.user`
      );
      const data = await res.json();
      if (data.data.length > 0) {
        const art = { id: data.data[0].id, ...data.data[0].attributes };
        setArticle(art);
        setComments(art.comments || []);
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

  if (!article) return <p>Loading...</p>;

  return (
    <>
      <Navbar />
      <main style={{ padding: "50px 20px" }}>
        <h1>{article.title}</h1>
        <p>{article.content}</p>

        <section style={{ marginTop: "40px" }}>
          <h2>Comments</h2>
          {comments.length === 0 && <p>No comments yet.</p>}
          <ul>
            {comments.map((comment) => (
              <li key={comment.id}>
                <strong>{comment.user?.username || "Anonymous"}:</strong> {comment.text}
              </li>
            ))}
          </ul>

          {user && (
            <>
              {!showCommentBox && (
                <button
                  onClick={() => setShowCommentBox(true)}
                  style={{
                    background: "#0070f3",
                    color: "#fff",
                    border: "none",
                    padding: "8px 14px",
                    borderRadius: "5px",
                    marginTop: "10px",
                    cursor: "pointer",
                  }}
                >
                  Add Comment
                </button>
              )}
              {showCommentBox && (
                <div style={{ marginTop: "20px" }}>
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write your comment..."
                    style={{ width: "100%", padding: "10px" }}
                  />
                  <button
                    onClick={handleAddComment}
                    style={{
                      marginTop: "10px",
                      background: "#0070f3",
                      color: "#fff",
                      border: "none",
                      padding: "8px 14px",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    Post Comment
                  </button>
                </div>
              )}
            </>
          )}

          {!user && <p style={{ marginTop: "20px" }}>Please <a href="/login">login</a> to comment.</p>}
        </section>
      </main>
      <Footer />
    </>
  );
}
