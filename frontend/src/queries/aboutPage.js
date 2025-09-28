import { gql } from "@apollo/client";

export const GET_ABOUT_PAGE = gql`
  query {
    aboutPage {
      navbarLinks { label url }
      title
      bodyContent
      footer
    }
  }
`;