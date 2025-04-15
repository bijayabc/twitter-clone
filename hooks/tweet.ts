import { graphqlClient } from "@/clients/api";
import { CreateTweetData } from "@/gql/graphql";
import { createTweetMutation, deleteTweetMutation } from "@/graphql/mutation/tweet";
import { getAllTweetsQuery } from "@/graphql/query/tweet";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { error } from "console";
import toast from "react-hot-toast";

export const useCreateTweet = () => {
    const queryClient = useQueryClient()

    // `mutate` is a default property of the object returned by useMutation().
    // It triggers the mutation function to create a tweet.
    const mutation = useMutation({
        mutationFn: (payload: CreateTweetData) => graphqlClient.request(createTweetMutation, { payload }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["all-tweets"] })
            toast.success("Tweet created successfully")
        },
        onError: (error, variables, context) => {
            toast.error(`Failed to create tweet!`)
        }
    })
    return mutation
}

export const useDeleteTweet = () => {
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: (tweetId: string) => graphqlClient.request(deleteTweetMutation, { tweetId }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["all-tweets"] })
            toast.success("Tweet deleted successfully")
            window.location.reload()
        },
        onError: (error, variables, context) => {
            toast.error(`Failed to delete tweet!`)
        }
    })
    return mutation
}

export const useGetAllTweets = () => {
    const query = useQuery({
        queryKey: ["all-tweets"],
        queryFn: () => {
            return graphqlClient.request(getAllTweetsQuery)
        }
    })

    return { ...query, tweets: query.data?.getAllTweets }
}


