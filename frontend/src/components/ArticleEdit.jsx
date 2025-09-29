"use client";

import { useQuery, useMutation, gql } from "@apollo/client";
import { useState, useEffect } from "react";

// Query to fetch a single article
const GET_ARTICLE = gql`
  query GetArticle($id: ID!) {
    article(id: $id) {
      data {
        id
        attributes {
          title
          content
          isApproved
          publishedAt
        }
      }
    }
  }
`;

// Mutation to update article content
const UPDATE_ARTICLE = gql`
  mutation UpdateArticle($id: ID!, $title: String!, $content: String!) {
    updateArticle(id: $id, data: { title: $title, content: $content }) {
      data {
        id
        attributes {
          title
          content
          isApproved
          publishedAt
        }
      }
    }
  }
`;

// Mutation to approve article (sets isApproved: true and optionally publishedAt)
const APPROVE_ARTICLE = gql`
  mutation ApproveArticle($id: ID!) {
    updateArticle(id: $id, data: { isApproved: true, publishedAt: "${new Date().toISOString()}" }) {
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

export default function ArticleEdit({ id }) {
  const { data, loading, error, refetch } = useQuery(GET_ARTICLE, {
    variables: { id },
  });
  const [updateArticle] = useMutation(UPDATE_ARTICLE);
  const [approveArticle] = useMutation(APPROVE_ARTICLE);

  const [form, setForm] = useState({ title: "", content: "" });

  useEffect(() => {
    if (data?.article?.data) {
      setForm({
        title: data.article.data.attributes.title,
        content: data.article.data.attributes.content,
      });
    }
  }, [data]);

  if (loading) return <p>Loading article...</p>;
  if (error) return <p>Error loading article</p>;

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateArticle({
      variables: { id, title: form.title, content: form.content },
    });
    alert("Article updated!");
    refetch();
  };

  const handleApprove = async () => {
    if (!confirm("Are you sure you want to approve and publish this article?")) return;
    await approveArticle({ variables: { id } });
    alert("Article approved and published!");
    refetch();
  };

  const { isApproved, publishedAt } = data.article.data.attributes;

  return (
    <div style={{ padding: "20px" }}>
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <h2>Edit Article</h2>
        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
          style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
        />
        <textarea
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          required
          rows={8}
          style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
        />
        <button type="submit" style={{ marginRight: "10px" }}>Save</button>
      </form>

      {/* Superuser Approval Section */}
      {!isApproved && (
        <button
          onClick={handleApprove}
          style={{
            background: "green",
            color: "white",
            padding: "10px 15px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Approve & Publish
        </button>
      )}

      {isApproved && publishedAt && (
        <p style={{ color: "green" }}>This article is approved and published.</p>
      )}
    </div>
  );
}
