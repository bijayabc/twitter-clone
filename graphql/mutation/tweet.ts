import { graphql } from "@/gql";

export const createTweetMutation = graphql(`#graphql
    mutation CreateMutation($payload: createTweetData!) {
        createTweet(payload: $payload) {
            id
        }
    }
`)

export const deleteTweetMutation = graphql(`#graphql
    mutation DeleteMutation($tweetId: ID!) {
        deleteTweet(tweetId: $tweetId) {
            content
            id
            imageURL
            author {
                id
            }
    }
}
`)