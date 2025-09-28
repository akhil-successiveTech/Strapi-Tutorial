import { gql } from "@apollo/client";

export const GET_CONTACT_PAGE = gql`
  query {
    contactPage {
      navbarLinks { label url }
      title
      bodyContent
      footer
    }
  }
`;
