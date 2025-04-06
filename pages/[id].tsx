import { useRouter } from 'next/router'
import TwitterLayout from "@/components/Layouts/TwitterLayout"
import type { GetServerSideProps, NextPage } from "next"
import { BsArrowLeftShort } from "react-icons/bs"
import Image from "next/image"
import FeedCard from "@/components/feedCard"
import { Tweet, User } from "@/gql/graphql"
import { graphqlClient } from '@/clients/api'
import { getUserByIdQuery } from '@/graphql/query/user'
import { useCurrentUser } from '@/hooks/user'
import { useCallback } from 'react'
import { followUserMutation, unfollowUserMutation } from '@/graphql/mutation/user'
import { useQueryClient } from '@tanstack/react-query'

interface ServerProps {
    userInfo?: User
}

// The data returned from getServerSideProps function below is automatically injected into the page component as props.
const UserProfilePage: NextPage<ServerProps> = (props) => {
    const router = useRouter();
    const { user: currentUser } = useCurrentUser()
    console.log("current user: ", currentUser)
    const queryClient = useQueryClient()

    const handleFollowUser = useCallback(async () => {
        if (!props.userInfo?.id) return;

        try {
            await graphqlClient.request(followUserMutation, { to: props.userInfo.id });
        } catch (error) {
            console.error("Error following user:", error);
        }
        queryClient.invalidateQueries({ queryKey: ["current-user"] })
        router.reload()
    }, [props.userInfo?.id, queryClient, router]);

    const handleUnfollowUser = useCallback(async () => {
        if (!props.userInfo?.id) return;

        try {
            await graphqlClient.request(unfollowUserMutation, { to: props.userInfo.id });
        } catch (error) {
            console.error("Error unfollowing user:", error);
        }
        queryClient.invalidateQueries({ queryKey: ["current-user"] })
        router.reload()
    }, [props.userInfo?.id, queryClient, router]);

    return (
        <div>
            <TwitterLayout>
                {/* Profile page */}
                <div>
                    {/* Nav bar */}
                    <nav className="flex items-center gap-4 px-2">
                        <BsArrowLeftShort className="text-2xl hover:bg-gray-800 rounded-full" 
                            onClick={() => router.back()}
                        />
                        <div>
                            <p className="text-xl font-semibold">{props.userInfo?.firstName} {props.userInfo?.lastName}</p>
                            <p className="text-sm opacity-70">{props.userInfo?.tweets?.length} posts</p>
                        </div>
                    </nav>

                    {/* Cover Image and profile picture */}
                    <div className="relative">
                        <div id="cover-image" className="h-[10em] bg-gray-600">
                            {/* cover image goes here */}
                        </div>

                        {props.userInfo?.profileImageURL &&
                            <Image src={props.userInfo?.profileImageURL}
                                alt="user-image" height={100} width={100}
                                className="rounded-full absolute bottom-[-3em] left-4" />}
                    </div>

                    {/* User Info */}
                    <div className="px-4 border-b border-[#2F3336] flex justify-between">
                        <div>
                            <p className="mt-16 text-xl font-semibold">{props.userInfo?.firstName} {props.userInfo?.lastName}</p>
                            <p className="text-sm opacity-70">{props.userInfo?.following?.length} Following {props.userInfo?.followers?.length} Followers</p>
                        </div>
                        <div>
                            {/* Don't show follow or unfollow button if it is the root user's profile page */}
                            {currentUser?.id != props.userInfo?.id &&
                                // Renders either "Follow" or "Unfollow" button based on whether the current user is in the followers list
                                (props.userInfo?.followers?.some(follower => follower?.id == currentUser?.id) ?
                                    <button className="mt-16 text-md font-bold bg-white text-black py-2 px-4 rounded-full hover:bg-slate-300"
                                        onClick={handleUnfollowUser}>
                                        Unfollow
                                    </button> :
                                    <button className="mt-16 text-md font-bold bg-white text-black py-2 px-4 rounded-full hover:bg-slate-300"
                                        onClick={handleFollowUser}>
                                        Follow
                                    </button>)
                            }
                        </div>
                    </div>

                    {/* User Tweets */}
                    {props.userInfo?.tweets?.map(tweet => {
                        return <FeedCard key={tweet?.id} data={tweet as Tweet} />
                    })}


                </div>
            </TwitterLayout>
        </div>
    )
}

export const getServerSideProps: GetServerSideProps<ServerProps> = async (context) => {
    const id = context.query.id as string | undefined

    if (!id) return { notFound: true, props: { userInfo: undefined } }

    // A bug is causing the user's tweets to only return with firstName, lastName, profileImageURL'
    const userInfo = await graphqlClient.request(getUserByIdQuery, { id })

    if (!userInfo.getUserById) return { notFound: true }

    return {
        props: {
            userInfo: userInfo.getUserById as User
        }
    }
}

export default UserProfilePage
