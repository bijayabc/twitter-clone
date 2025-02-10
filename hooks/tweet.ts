import { graphqlClient } from "@/clients/api";
import { CreateTweetData } from "@/gql/graphql";
import { createTweetMutation } from "@/graphql/mutation/tweet";
import { getAllTweetsQuery } from "@/graphql/query/tweet";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useCreateTweet = () => {
    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: (payload: CreateTweetData) => graphqlClient.request(createTweetMutation, {payload}),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["all-tweets"] })
            toast.success("Tweet Created Successfully")
        },
        onError: (error, variables, context) => toast.error("Failed to create tweet!")
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

    return {...query, tweets: query.data?.getAllTweets}
}


