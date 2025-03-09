import { graphql } from "../../gql"

export const verifyUserGoogleTokenQuery = graphql(`#graphql
    query verifyUserGoogleToken($token: String!) {
        verifyGoogleToken(token: $token)
    }
    `)


export const getCurrentUserQuery = graphql(`#graphql
    query GetCurrentUser {
        getCurrentUser {
            id
            profileImageURL
            lastName
            firstName
            email
            tweets {
                id
                content
                createdAt
                author {
                    firstName
                    lastName
                    profileImageURL
                }
            }
        }
    }
`)

export const getUserByIdQuery = graphql(`#graphql
    query GetUserById($id: ID!) {
  getUserById(id: $id) {
    id
    firstName
    lastName
    email
    profileImageURL
    tweets {
      id
      content
      imageURL
      createdAt
      author {
            firstName
            lastName
            profileImageURL
        }
    }
  }
}
`)