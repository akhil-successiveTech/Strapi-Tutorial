import { gql } from "@apollo/client";

export const GET_HOME_PAGE = gql`
  query {
    homePage {
      navbarLinks {
        label
        url
      }
      Hero {
        heroTitle
        heroSubtitle
        heroImage {
          url
        }
      }
      ctaButtons {
        label
        url
      }
      bodyContent
      footer
    }
  }
`;

