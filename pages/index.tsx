import Image from "next/image";
import localFont from "next/font/local";
import React, { useCallback } from "react";
import {CredentialResponse, GoogleLogin} from "@react-oauth/google"
import { BiBell, BiBookmark, BiEnvelope, BiHomeCircle, BiSearch } from "react-icons/bi";
import {FaXTwitter} from "react-icons/fa6"
import { LuSquareSlash } from "react-icons/lu";
import { BsPeople, BsPerson } from "react-icons/bs";
import { AiOutlineThunderbolt } from "react-icons/ai";
import { CgMoreO } from "react-icons/cg";
import FeedCard from "@/components/feedCard";
import { graphqlClient } from "@/clients/api";
import { verifyUserGoogleTokenQuery } from "@/graphql/query/user";
import toast from "react-hot-toast";

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

  const handleLoginWithGoogle = useCallback(async(cred: CredentialResponse) => {
    const googleToken = cred.credential

    if (!googleToken) {
      toast.error('Google token not found!')
      return
    }

    const { verifyGoogleToken } = await graphqlClient.request(
      verifyUserGoogleTokenQuery, {token: googleToken}
    )

    toast.success('Token successfully verified!')
    console.log(verifyGoogleToken)

    if (verifyGoogleToken) {
      window.localStorage.setItem('__twitter_token', googleToken)
    }

  }, [])

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

          <div className="ml-[52%] px-3 pt-3">

            <div className="w-fit transition-all text-3xl mb-2"> <FaXTwitter /> </div>

            <ol>
            {sidebarItems.map(item => (
              <li key={item.title} className="flex gap-4 items-center py-3 pl-2 pr-6 my-[3px] rounded-full w-fit cursor-pointer hover:bg-gray-800">
                <span className="text-3xl">{item.icon}</span>
                <span className="text-xl font-">{item.title}</span>
              </li>
            ))}
            </ol>

            <button className="text-lg font-extrabold bg-[#1A8CD8] w-[90%] py-3 rounded-3xl"> 
              Post 
            </button>
          
          </div>
        </div>


        {/* Twitter Main Feed */}
        <div className="col-span-4 border-x-[0.01rem] border-[#2F3336]">
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
        </div>

        {/* Right Side bar */}
        <div className="col-span-4 p-5">
          <div className="border w-fit p-5 bg-slate-700 rounded-lg">
            <p className="text-2xl my-2">New to Twitter?</p>
            <GoogleLogin onSuccess={handleLoginWithGoogle}/>
          </div>
        </div>
      </div>
    </>
  );
}
