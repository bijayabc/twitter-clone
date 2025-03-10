import React, { useCallback, useState } from "react";
import toast from "react-hot-toast";
import { useCurrentUser } from "@/hooks/user";
import { useCreateTweet, useGetAllTweets } from "@/hooks/tweet";
import { Tweet } from "@/gql/graphql";
import TwitterLayout from "@/components/Layouts/TwitterLayout";
import FeedCard from "@/components/feedCard";
import { BiImage } from "react-icons/bi";
import Image from "next/image";
import { GetServerSideProps } from "next";
import { graphqlClient } from "@/clients/api";
import { getAllTweetsQuery } from "@/graphql/query/tweet";

interface HomeProps {
  tweets: Tweet[]
}

export default function Home(props: HomeProps) {

  const {user} = useCurrentUser()
  const {mutate} = useCreateTweet()
  const [content, setContent] = useState("")

  

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

  return (
    <div>
      <TwitterLayout>
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
                    props.tweets?.map(tweet => <FeedCard key={tweet?.id} data={tweet as Tweet}/>)
                }
      </TwitterLayout>
    </div>
  )
}

// Render tweets server side by using getServerSideProps
export const getServerSideProps: GetServerSideProps<HomeProps> = async(context) => {
  const tweets = await graphqlClient.request(getAllTweetsQuery)
  return {
    props: {
      tweets: tweets.getAllTweets as Tweet[]
    }
  }
}