import React from 'react'
import Image from 'next/image'
import { FaRegHeart, FaRegComment, FaRetweet, FaRegBookmark } from "react-icons/fa";
import { IoMdStats } from "react-icons/io";
import { GoUpload } from "react-icons/go";
import { Tweet } from '@/gql/graphql';
import Link from 'next/link';

interface FeedCardProps {
    data: Tweet
}

const handleCreatedAt = (createdAt: string) => {
    // const createdDate = new Date(Number(createdAt)); 
    // removed the number part because redis returns strings not dates unlike values stored in postgres db
    const createdDate = new Date(createdAt);
    const now = new Date()
    const difference = now.getTime() - createdDate.getTime()

    // Convert the difference to different time units
    const seconds = Math.floor(difference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30); // Approximate months (30 days)
    const years = Math.floor(months / 12); // Approximate years (12 months)

    // Create a human-readable string based on the difference
    if (years > 0) {
        return createdDate.toLocaleDateString();
    } else if (months > 0) {
        return createdDate.toLocaleDateString(undefined, { month: 'short', day: '2-digit' });
    } else if (days > 0) {
        return `${days}d`;
    } else if (hours > 0) {
        return `${hours}h`;
    } else if (minutes > 0) {
        return `${minutes}m`;
    } else if (seconds > 0) {
        return `${seconds}s`;
    } else {
        return 'Just now';
    }
}

const FeedCard: React.FC<FeedCardProps> = (props) => {
    const {data} = props

    return (
        <>
            {/* FeedCard */}
            <div className='border-t-[1px] border-[#2F3336] grid grid-cols-12 cursor-pointer py-3 px-4'>
                {/* div for profile pic */}
                {data.author?.profileImageURL && <div className="col-span-1">
                    <Image 
                    src= {data.author?.profileImageURL} 
                    alt="profile-pic" width={40} height={40}
                    className='rounded-3xl'/>
                </div>}

                {/* div for content */}
                <div className="col-span-11 flex flex-col items-start pl-1">
                    {/* tweet header */}
                    <div>
                        <Link href={`/${data.author?.id}`}>
                            <span className="font-semibold mr-2">{data.author?.firstName} {data.author?.lastName}</span>
                        </Link>

                        <span className="opacity-50">{handleCreatedAt(data.createdAt)}</span>
                    </div>

                    {/* tweet body */}
                    <div>
                        {data.content}
                        {data.imageURL && < Image src={data.imageURL} alt={'tweet-image'} height={400} width={400}/>}
                    </div>

                    {/* tweet interaction icons */}
                    <div className='flex items-center justify-between w-full mt-2 opacity-50'>
                        <div className='flex items-center gap-1'> 
                            <span className='p-2 rounded-full hover:bg-gray-800'> <FaRegComment /> </span> 
                            <span> 397 </span> 
                        </div>

                        <div className='flex items-center gap-1'> 
                        <   span className='p-2 rounded-full hover:bg-gray-800'> <FaRetweet /> </span> 
                            <span> 4K </span> 
                        </div>

                        <div className='flex items-center gap-1'> 
                            <span className='p-2 rounded-full hover:bg-gray-800'> <FaRegHeart /> </span>
                            <span> 22K </span> 
                        </div>

                        <div className='flex items-center gap-1'>
                            <span className='p-2 rounded-full hover:bg-gray-800'> <IoMdStats /> </span>  
                            <span> 2.5M </span> 
                        </div>

                        <div>
                            <span className='p-1 rounded-full hover:bg-gray-800'> <FaRegBookmark className='inline-block '/> </span>
                            <span className='p-1 rounded-full hover:bg-gray-800'> < GoUpload className='inline-block'/> </span>
                        </div>
                        
                    </div>
                </div>
            </div>
        </>
    )
}

export default FeedCard