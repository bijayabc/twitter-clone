import {graphql} from "../../gql"

export const getAllTweetsQuery = graphql(`#graphql

    query GetAllTweets {
        getAllTweets {
            content
            id
            imageURL
            author {
                firstName
                lastName
                profileImageURL
                id
            }
            createdAt
        }
}`)