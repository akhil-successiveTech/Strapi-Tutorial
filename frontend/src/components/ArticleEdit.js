"use client";

import { useQuery, useMutation, gql } from "@apollo/client";
import { useState, useEffect } from "react";

const GET_ARTICLE = gql`
  query GetArticle($id: ID!) {
    article(id: $id) {
      data {
        id
        attributes {
          title
          content
        }
      }
    }
  }
`;

const UPDATE_ARTICLE = gql`
  mutation UpdateArticle($id: ID!, $title: String!, $content: String!) {
    updateArticle(id: $id, data: { title: $title, content: $content }) {
      data {
        id
        attributes {
          title
          content
        }
      }
    }
  }
`;

export default function ArticleEdit({ id }) {
  const { data, loading, error } = useQuery(GET_ARTICLE, {
    variables: { id },
  });
  const [updateArticle] = useMutation(UPDATE_ARTICLE);

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
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Edit Article</h2>
      <input
        type="text"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        required
      />
      <textarea
        value={form.content}
        onChange={(e) => setForm({ ...form, content: e.target.value })}
        required
      />
      <button type="submit">Save</button>
    </form>
  );
}
