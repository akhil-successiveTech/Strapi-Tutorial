import { gql } from "@apollo/client";

export const GET_ARTICLES = gql`
  query Articles($filters: ArticleFiltersInput) {
      articles(filters: $filters) {
      title
      publishedAt
      published
      content
      coverImage {
        size
      }
      excerpt
      comments {
        content
        date
        createdAt
      }
    }
  }
`;

export const GET_ARTICLE_BY_SLUG = gql`
  query GetArticleBySlug($filters: ArticleFiltersInput) {
    articles(filters: $filters) {
      title
      slug
      documentId
      content
      excerpt
      publishedAt
      coverImage {
        url
      }
      comments {
        content
        createdAt
        date
      }
    }
  }
`;
