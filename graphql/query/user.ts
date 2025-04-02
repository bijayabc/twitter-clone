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
            recommendedUsers {
                id
                firstName
                lastName
                profileImageURL
            }
            tweets {
                id
                content
                createdAt
                imageURL
                author {
                    firstName
                    lastName
                    profileImageURL
                }
            }
            followers {
                id
                firstName
                lastName
                profileImageURL
            }
            following {
                id
                firstName
                lastName
                profileImageURL
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
    recommendedUsers {
        id
        firstName
        lastName
        profileImageURL
    }
    tweets {
      id
      content
      imageURL
      createdAt
      author {
            id
            email
            firstName
            lastName
            profileImageURL
        }
    }
    followers {
        id
        firstName
        lastName
        profileImageURL
    }
    following {
        id
        firstName
        lastName
        profileImageURL
    }
  }
}
`)

