"use client";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import ArticleList from "@/components/ArticleList";

const GET_ARTICLES = gql`
  query Articles {
    articles {
      id
      content
      title
      slug
      publishedAt
      updatedAt
      excerpt
      category {
        name
      }
    }
  }
`;

export default function ArticlesPage() {
  const { loading, error, data } = useQuery(GET_ARTICLES);
  const user = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user")) : null;

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div style={{ padding: "20px 50px" }}>
      <h1>Latest Articles</h1>
      <ArticleList articles={data.articles} user={user} />
    </div>
  );
}
