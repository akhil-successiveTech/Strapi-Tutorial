"use client"
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import Link from "next/link";

const GET_ARTICLES = gql`
  query {
    articles(sort: "publishedAt:desc", pagination: { limit: 10 }) {
      data {
        id
        attributes {
          title
          slug
          content
          category {
            data {
              attributes {
                name
                slug
              }
            }
          }
        }
      }
    }
  }
`;

export default function Home() {
  const { loading, error, data } = useQuery(GET_ARTICLES);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <div>
      <h1>Latest Articles</h1>
      {data.articles.data.map((article) => (
        <div key={article.id} style={{ marginBottom: "20px" }}>
          <Link href={`/articles/${article.attributes.slug}`}>
            <h2>{article.attributes.title}</h2>
          </Link>
          <p>Category: {article.attributes.category.data?.attributes.name}</p>
        </div>
      ))}

      <div>
        <Link href="/login">Login</Link> | <Link href="/signup">Signup</Link>
      </div>
    </div>
  );
}
