import { useRouter } from 'next/router'
import TwitterLayout from "@/components/Layouts/TwitterLayout"
import type { GetServerSideProps, NextPage } from "next"
import { BsArrowLeftShort } from "react-icons/bs"
import Image from "next/image"
import FeedCard from "@/components/feedCard"
import { Tweet, User } from "@/gql/graphql"
import { graphqlClient } from '@/clients/api'
import { getUserByIdQuery } from '@/graphql/query/user'

interface ServerProps {
    userInfo? : User
}

// The data returned from getServerSideProps function below is automatically injected into the page component as props.
const UserProfilePage: NextPage<ServerProps> = (props) => {
    const router = useRouter();

    return (
        <div>
            <TwitterLayout>
                {/* Profile page */}
                <div>
                    {/* Nav bar */}
                    <nav className="flex items-center gap-4 px-2">
                        <BsArrowLeftShort className="text-2xl" />
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
                    <div className="px-4 border-b border-[#2F3336]">
                        <p className="mt-16 text-xl font-semibold">{props.userInfo?.firstName} {props.userInfo?.lastName}</p>
                        <p className="text-sm opacity-70">X Following Y Followers</p>
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

export const getServerSideProps: GetServerSideProps<ServerProps> = async(context) => {
    const id = context.query.id as string | undefined

    if (!id) return { notFound: true, props: {userInfo: undefined} }

    const userInfo = await graphqlClient.request(getUserByIdQuery, { id })

    if (!userInfo.getUserById) return {notFound: true}

    return {
        props: {
            userInfo: userInfo.getUserById as User
        }
    }
}

export default UserProfilePage
