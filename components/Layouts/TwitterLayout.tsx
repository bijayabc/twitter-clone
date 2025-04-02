import { useCurrentUser } from '@/hooks/user'
import { CredentialResponse, GoogleLogin } from "@react-oauth/google"
import React, { useCallback, useMemo } from 'react'
import { AiOutlineThunderbolt } from 'react-icons/ai'
import { BiBell, BiBookmark, BiEnvelope, BiHomeCircle, BiSearch } from 'react-icons/bi'
import { BsPeople, BsPerson } from 'react-icons/bs'
import { CgMoreO } from 'react-icons/cg'
import { FaXTwitter } from 'react-icons/fa6'
import { LuSquareSlash } from 'react-icons/lu'
import Image from "next/image";
import toast from 'react-hot-toast'
import { graphqlClient } from '@/clients/api'
import { verifyUserGoogleTokenQuery } from '@/graphql/query/user'
import { useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'

interface SidebarItem {
    title: string,
    icon: JSX.Element,
    link: string
}

interface TwitterLayoutProps {
    children: React.ReactNode
}

const TwitterLayout: React.FC<TwitterLayoutProps> = (props) => {
    const { user } = useCurrentUser()
    const queryClient = useQueryClient()

    const sidebarItems: SidebarItem[] = useMemo(
        () => [
            { title: 'Home', icon: <BiHomeCircle />, link: `/` },
            { title: 'Explore', icon: <BiSearch />, link: `/` },
            { title: 'Notifications', icon: <BiBell />, link: `/` },
            { title: 'Messages', icon: <BiEnvelope />, link: `/` },
            { title: 'Grok', icon: <LuSquareSlash />, link: `/` },
            { title: 'Bookmarks', icon: <BiBookmark />, link: `/` },
            { title: 'Communities', icon: <BsPeople />, link: `/` },
            { title: 'Premium', icon: <FaXTwitter />, link: `/` },
            { title: 'Verified Orgs', icon: <AiOutlineThunderbolt />, link: `/` },
            { title: 'Profile', icon: <BsPerson />, link: user?.id ? `/${user.id}` : "/" },
            { title: 'More', icon: <CgMoreO />, link: `/` }
        ], [user?.id])


    const handleLoginWithGoogle = useCallback(async (cred: CredentialResponse) => {
        const googleToken = cred.credential

        // console.log("Temp Google Credential", googleToken)
        if (!googleToken) {
            toast.error('Google token not found!')
            return
        }

        const { verifyGoogleToken } = await graphqlClient.request(
            verifyUserGoogleTokenQuery, { token: googleToken }
        )

        toast.success('Token successfully verified!')
        console.log("JWTUserToken", verifyGoogleToken)

        if (verifyGoogleToken) {
            window.localStorage.setItem('__twitter_token', verifyGoogleToken)
        }

        // Triggers a refetch to update the query data after new token is set because old data is stale.
        await queryClient.invalidateQueries({ queryKey: ['current-user'] })
    }, [queryClient])

    return (
        <div>
            {/* Body Container */}
            <div className="grid grid-cols-12 h-screen">

                {/* Left Sidebar with menu */}
                <div className="col-span-2 sm:col-span-4">
                    <div className="px-3 pt-3 flex sm:justify-end h-full relative">

                        <div>
                            <div className="w-fit transition-all text-3xl mb-2">
                                <FaXTwitter />
                            </div>

                            <ol>
                                {sidebarItems.map(item => (
                                    <li key={item.title}>
                                        <Link href={item.link} className="flex gap-4 items-center py-2 pl-2 pr-6 my-[3px] rounded-full w-fit cursor-pointer hover:bg-gray-800">
                                            <span className="text-3xl">{item.icon}</span>
                                            <span className="hidden sm:block text-xl">{item.title}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ol>

                            <button className="hidden sm:block text-sm sm:text-lg font-extrabold bg-[#1A8CD8] py-1 sm:p-3 rounded-3xl">
                                Post
                            </button>

                            <button className="block sm:hidden text-lg font-extrabold bg-[#1A8CD8] px-1 py-3 mr-6 rounded-3xl ml-auto">
                                <FaXTwitter />
                            </button>
                        </div>

                        {/* user-info component rendered when an user is logged in*/}
                        {user &&
                            <div className="absolute bottom-5 flex items-center hover:bg-slate-800 p-2 rounded-full bg-slate-700">

                                {/* flex item 1 user image */}
                                <div>
                                    <Image src={user.profileImageURL || '/default-profile-image.jpg'}
                                        width={50}
                                        height={50}
                                        alt="profile-picture"
                                        className="rounded-3xl" />
                                </div>

                                {/* flex item 2 user display name and username */}
                                <div className="hidden sm:block ml-3">
                                    <span>{user.firstName}</span> <span>{user.lastName}</span>
                                </div>

                            </div>
                        }

                    </div>
                </div>

                {/* The overflow-y-auto property on the main feed changes the scrolling property such that 
            when the main feed overflows beyond the screen, only this component will scroll along the 
            y axis, if this property is not used, the whole page will scroll when content overflows */}

                {/* Twitter Main Feed */}
                <div className="col-span-10 sm:col-span-8 lg:col-span-5 border-x-[0.01rem] border-[#2F3336] h-full overflow-y-auto">
                    {props.children}
                </div>

                {/* Right Side bar */}
                <div className="sm:col-span-3 p-5 h-full">
                    {/* Google login component rendered when an user is not logged in*/}
                    {user ?
                        <div className={`w-fit ${user.recommendedUsers && user?.recommendedUsers?.length > 0 && "p-4"} bg-slate-700 rounded-lg`}>
                            {user.recommendedUsers && user?.recommendedUsers?.length > 0 && <p className='text-2xl'>People You May Know</p>}
                            {user?.recommendedUsers?.map(recommendedUser => {
                                return (
                                    <div className='pt-4 flex items-center gap-2' key={recommendedUser?.id}>
                                        <Image src={recommendedUser?.profileImageURL || '/default-profile-image.jpg'}
                                            width={50}
                                            height={50}
                                            alt="profile-picture"
                                            className="rounded-3xl" />
                                        <div>
                                            <div>{recommendedUser?.firstName} {recommendedUser?.lastName}</div>
                                            <Link href={`/${recommendedUser?.id}`} className='bg-white text-black rounded-md px-4'>View</Link>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                        :
                        <div className="w-fit p-5 bg-slate-700 rounded-lg">
                            <p className="text-2xl my-2">New to Twitter?</p>
                            <GoogleLogin onSuccess={handleLoginWithGoogle} />
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default TwitterLayout