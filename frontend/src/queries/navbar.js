import { gql } from "@apollo/client";

export const GET_NAVBAR_LINKS = gql`
  query {
    homePage {
      navbarLinks {
        label
        url
      }
    }
  }
`;
