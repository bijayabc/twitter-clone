import localFont from "next/font/local";
import React, { useCallback, useEffect, useState } from "react";
import {CredentialResponse, GoogleLogin} from "@react-oauth/google"
import { BiBell, BiBookmark, BiEnvelope, BiHomeCircle, BiSearch, BiImage } from "react-icons/bi";
import {FaXTwitter} from "react-icons/fa6"
import { LuSquareSlash } from "react-icons/lu";
import { BsPeople, BsPerson } from "react-icons/bs";
import { AiOutlineThunderbolt } from "react-icons/ai";
import { CgMoreO } from "react-icons/cg";
import FeedCard from "@/components/feedCard";
import { graphqlClient } from "@/clients/api";
import { verifyUserGoogleTokenQuery } from "@/graphql/query/user";
import toast from "react-hot-toast";
import { useCurrentUser } from "@/hooks/user";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useCreateTweet, useGetAllTweets } from "@/hooks/tweet";
import { Tweet } from "@/gql/graphql";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function Home() {

  const {user} = useCurrentUser()
  const {tweets} = useGetAllTweets()
  const {mutate} = useCreateTweet()
  const [content, setContent] = useState("")

  const queryClient = useQueryClient()

  // add ' ,video/* ' to the accept attribute to also accept videos
  const handleImageClick = useCallback( () => {
    const input = document.createElement('input')
    input.setAttribute('type', 'file')
    input.setAttribute('accept', 'image/*')
    input.click()
  }, [])

  const handleCreateTweet = useCallback((e: React.FormEvent) => {
    if (content.trim() === "") {
      toast.error("Tweet content cannot be empty!");
      return;
    }
    try {
      mutate({ content });
      setContent(""); // Reset content after successful tweet
    } catch (error) {
      toast.error("Failed to create tweet!");
    }
  }, [content, mutate])

  const handleLoginWithGoogle = useCallback(async(cred: CredentialResponse) => {
    const googleToken = cred.credential

    // console.log("Temp Google Credential", googleToken)
    if (!googleToken) {
      toast.error('Google token not found!')
      return
    }

    const { verifyGoogleToken } = await graphqlClient.request(
      verifyUserGoogleTokenQuery, {token: googleToken}
    )

    toast.success('Token successfully verified!')
    console.log("JWTUserToken", verifyGoogleToken)

    if (verifyGoogleToken) {
      window.localStorage.setItem('__twitter_token', verifyGoogleToken)
    }

    // Triggers a refetch to update the query data after new token is set because old data is stale.
    await queryClient.invalidateQueries({queryKey: ['current-user']})
  }, [queryClient])

  interface sidebarItem {
    title: string,
    icon: React.ReactNode
  }

  const sidebarItems: sidebarItem[] = [{title: 'Home', icon: <BiHomeCircle />}, {title: 'Explore', icon: <BiSearch />}, {title: 'Notifications',icon: <BiBell />}, {title: 'Messages',icon: <BiEnvelope />}, {title: 'Grok',icon: <LuSquareSlash />}, {title: 'Bookmarks',icon: <BiBookmark />}, {title: 'Communities',icon: <BsPeople />}, {title: 'Premium',icon: <FaXTwitter />}, {title: 'Verified Orgs',icon: <AiOutlineThunderbolt />}, {title: 'Profile',icon: <BsPerson />}, {title: 'More',icon: <CgMoreO />}]

  return (
    <>
      {/* Body Container */}
      <div className="grid grid-cols-12 h-screen">

        {/* Left Sidebar with menu */}
        <div className="col-span-4">

          <div className="ml-[52%] px-3 pt-3 h-full relative">

            <div className="w-fit transition-all text-3xl mb-2"> <FaXTwitter /> </div>

            <ol>
            {sidebarItems.map(item => (
              <li key={item.title} className="flex gap-4 items-center py-2 pl-2 pr-6 my-[3px] rounded-full w-fit cursor-pointer hover:bg-gray-800">
                <span className="text-3xl">{item.icon}</span>
                <span className="text-xl font-">{item.title}</span>
              </li>
            ))}
            </ol>

            <button className="text-lg font-extrabold bg-[#1A8CD8] w-[90%] py-3 rounded-3xl"> 
              Post 
            </button>

            {/* user-info component rendered when an user is logged in*/}
          {user && 
            <div className="absolute bottom-5 flex w-[80%] hover:bg-slate-800 p-2 rounded-full">

              {/* flex item 1 user image */}
              <div>
                <Image src={user.profileImageURL || '/default-profile-image.jpg'} 
                width={50} 
                height={50} 
                alt="profile-picture"
                className="rounded-3xl"/>
              </div>

              {/* flex item 2 user display name and username */}
              <div className="ml-3">
                <span>{user.firstName}</span> <span>{user.lastName}</span>
                <p>@barshabc</p>
              </div>

            </div>
          }

          </div>
        </div>

        {/* The overflow-y-auto property on the main feed changes the scrolling property such that 
        when the main feed overflows beyond the screen, only this component will scroll along the 
        y axis, if this property is not used, the whole page will scroll when content overflows */}

        {/* Twitter Main Feed */}
        <div className="col-span-4 border-x-[0.01rem] border-[#2F3336] h-full overflow-y-auto">

          {/* Create a tweet */}
          <div className='border-t-[1px] border-[#2F3336] grid grid-cols-12 cursor-pointer py-3 px-4'>
            {/* Profile Image */}
            <div className="col-span-1">
              {user?.profileImageURL && 
                <Image 
                src= {user?.profileImageURL}
                alt="profile-pic" width={40} height={40}
                className='rounded-full'/>
              }
            </div>

            {/* Body */}
            <div className="col-span-11">
              <textarea name="tweet" id="tweet"
                className="text-xl bg-transparent w-full pt-2 pl-1 focus:outline-none resize-none border-b border-b-slate-700"
                placeholder="Share your thoughts..."
                rows={3}
                value={content}
                onChange={e => setContent(e.target.value)}
              ></textarea>

              <div className="flex justify-between items-center py-1">
                <div className="hover:bg-gray-800 p-2 rounded-full">
                  <BiImage className="text-xl" onClick={handleImageClick}/>
                </div>
                <button 
                onClick={handleCreateTweet}
                className="text-md font-bold bg-[#1A8CD8] w-fit py-1 px-3 rounded-3xl"> 
                  Post 
                </button>
              </div>

            </div>
          </div>

          {/* Load all the tweets */}
          {
            tweets?.map(tweet => <FeedCard key={tweet?.id} data={tweet as Tweet}/>)
          }

        </div>

        {/* Right Side bar */}
        <div className="col-span-4 p-5 h-full">
          {/* Google login component rendered when an user is not logged in*/}
          {!user && 
          <div className="border w-fit p-5 bg-slate-700 rounded-lg">
            <p className="text-2xl my-2">New to Twitter?</p>
            <GoogleLogin onSuccess={handleLoginWithGoogle}/>
          </div>}
        </div>
      </div>
    </>
  )
}
