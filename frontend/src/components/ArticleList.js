"use client";

import { useQuery, gql } from "@apollo/client";
import Link from "next/link";

const GET_ARTICLES = gql`
  query GetArticles {
    articles {
      data {
        id
        attributes {
          title
          slug
        }
      }
    }
  }
`;

export default function ArticleList() {
  const { data, loading, error } = useQuery(GET_ARTICLES);

  if (loading) return <p>Loading articles...</p>;
  if (error) return <p>Error loading articles</p>;

  return (
    <div>
      <h2>All Articles</h2>
      <ul>
        {data.articles.data.map((article) => (
          <li key={article.id}>
            <Link href={`/article/${article.attributes.slug}`}>
              {article.attributes.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
