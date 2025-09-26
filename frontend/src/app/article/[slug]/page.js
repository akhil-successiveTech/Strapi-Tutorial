"use client";

import { useQuery, useMutation, gql } from "@apollo/client";
import { useParams } from "next/navigation";
import { useState } from "react";

// 🔹 Query to get article + comments
const GET_ARTICLE = gql`
  query GetArticle($slug: String!) {
    articles(filters: { slug: { eq: $slug } }) {
      data {
        id
        attributes {
          title
          content
          slug
          comments {
            data {
              id
              attributes {
                authorName
                content
                email
                date
              }
            }
          }
        }
      }
    }
  }
`;

// 🔹 Mutation to create comment
const CREATE_COMMENT = gql`
  mutation CreateComment(
    $authorName: String!
    $content: String!
    $email: String!
    $date: DateTime!
    $articleId: ID!
  ) {
    createComment(
      data: {
        authorName: $authorName
        content: $content
        email: $email
        date: $date
        article: $articleId
      }
    ) {
      data {
        id
        attributes {
          authorName
          content
          email
          date
        }
      }
    }
  }
`;

export default function ArticlePage() {
  const { slug } = useParams();
  const { data, loading, error, refetch } = useQuery(GET_ARTICLE, {
    variables: { slug },
  });

  const [createComment] = useMutation(CREATE_COMMENT);
  const [form, setForm] = useState({
    authorName: "",
    email: "",
    content: "",
  });

  if (loading) return <p>Loading article...</p>;
  if (error) return <p>Error loading article.</p>;

  const article = data?.articles?.data[0];
  if (!article) return <p>No article found.</p>;

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createComment({
      variables: {
        authorName: form.authorName,
        email: form.email,
        content: form.content,
        date: new Date().toISOString(),
        articleId: article.id,
      },
    });
    setForm({ authorName: "", email: "", content: "" });
    refetch(); // refresh comments
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>{article.attributes.title}</h1>
      <p>{article.attributes.content}</p>

      <h2>Comments</h2>
      <ul>
        {article.attributes.comments?.data?.map((c) => (
          <li key={c.id}>
            <strong>{c.attributes.authorName}</strong> ({c.attributes.email}) –{" "}
            {new Date(c.attributes.date).toLocaleDateString()}
            <p>{c.attributes.content}</p>
          </li>
        ))}
      </ul>

      <h3>Leave a Comment</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={form.authorName}
          onChange={(e) => setForm({ ...form, authorName: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <textarea
          placeholder="Comment"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          required
        />
        <button type="submit">Post Comment</button>
      </form>
    </div>
  );
}
