import {graphql} from "../../gql"

export const getAllTweetsQuery = graphql(`#graphql

    query GetAllTweets {
        getAllTweets {
            content
            id
            imageURL
            author {
                email
                id
                firstName
                lastName
                profileImageURL
            }
            createdAt
        }
    }
`)

export const getPresignedURLForTweetQuery = graphql(`#graphql
    query Query($imageName: String!, $imageType: String!) {
        getPresignedURLForTweet(imageName: $imageName, imageType: $imageType)
    }
`)