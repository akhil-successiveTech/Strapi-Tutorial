"use client";

import { useQuery, useMutation, gql } from "@apollo/client";
import { useEffect, useState } from "react";

// Query to fetch all pending articles
const GET_PENDING_ARTICLES = gql`
  query {
    articles(filters: { isApproved: { eq: false } }) {
      data {
        id
        attributes {
          title
          content
          createdAt
        }
      }
    }
  }
`;

// Mutation to approve and publish article
const APPROVE_ARTICLE = gql`
  mutation ApproveArticle($id: ID!) {
    updateArticle(
      id: $id
      data: { isApproved: true, publishedAt: "${new Date().toISOString()}" }
    ) {
      data {
        id
        attributes {
          isApproved
          publishedAt
        }
      }
    }
  }
`;

export default function PendingArticles() {
  const { data, loading, error, refetch } = useQuery(GET_PENDING_ARTICLES);
  const [approveArticle] = useMutation(APPROVE_ARTICLE);
  const [user, setUser] = useState(null);

  // Check for superuser in localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  if (!user || !user.isSuperUser) {
    return <p style={{ textAlign: "center", marginTop: "20px" }}>Access denied. Superuser only.</p>;
  }

  if (loading) return <p>Loading pending articles...</p>;
  if (error) return <p>Error loading articles</p>;

  const handleApprove = async (id) => {
    if (!confirm("Approve and publish this article?")) return;
    await approveArticle({ variables: { id } });
    refetch(); // refresh the list
  };

  return (
    <div style={{ padding: "40px", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center", marginBottom: "30px" }}>Pending Articles for Approval</h1>

      {data.articles.data.length === 0 && <p>All articles are approved!</p>}

      {data.articles.data.map((article) => (
        <div
          key={article.id}
          style={{
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "20px",
            marginBottom: "15px",
          }}
        >
          <h2>{article.attributes.title}</h2>
          <p>{article.attributes.content}</p>
          <p style={{ fontSize: "0.85rem", color: "#666" }}>
            Submitted on: {new Date(article.attributes.createdAt).toLocaleString()}
          </p>
          <button
            onClick={() => handleApprove(article.id)}
            style={{
              background: "green",
              color: "white",
              padding: "10px 15px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              marginTop: "10px",
            }}
          >
            Approve & Publish
          </button>
        </div>
      ))}
    </div>
  );
}
