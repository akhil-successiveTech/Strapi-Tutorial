import { gql } from "@apollo/client";

export const GET_FOOTER = gql`
  query {
    homePage {
      footer
    }
  }
`;
