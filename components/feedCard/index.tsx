import React, { useCallback } from 'react'
import Image from 'next/image'
import { FaRegHeart, FaRegComment, FaRetweet, FaRegBookmark } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { IoMdStats } from "react-icons/io";
import { GoUpload } from "react-icons/go";
import { Tweet } from '@/gql/graphql';
import Link from 'next/link';
import { useDeleteTweet } from '@/hooks/tweet';
import { useCurrentUser } from '@/hooks/user';
// import { useDeleteTweet } from '@/hooks/tweet';

interface FeedCardProps {
    data: Tweet
}

const handleCreatedAt = (createdAt: string) => {
    // Check if createdAt is a numeric timestamp (From Redis). If so, convert it to a number before creating a Date.
    // Otherwise, assume it's an ISO date string (from Postgres via GraphQL) and pass it directly.
    const createdDate = new Date(
        /^\d+$/.test(createdAt) ? Number(createdAt) : createdAt
    );  

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
    const { user: currentUser } = useCurrentUser()
    const {data} = props
    const {mutate} = useDeleteTweet()

    const handleDelete = useCallback(() => {
        mutate(data.id)
    }, [mutate, data.id])

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
                    <div className='flex items-center justify-between w-full'>
                        <div>
                            <Link href={`/${data.author?.id}`}>
                                <span className="font-semibold mr-2 hover:opacity-70">{data.author?.firstName} {data.author?.lastName}</span>
                            </Link>

                            <span className="opacity-50">{handleCreatedAt(data.createdAt)}</span>
                        </div>
                        {currentUser?.id == data.author?.id && 
                            <div className="p-1 rounded-full hover:bg-red-600 hover:text-white transition cursor-pointer"
                            onClick={handleDelete}>
                            <MdDeleteOutline className="w-5 h-5" />
                        </div>
                        }
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
                            <span> 0 </span> 
                        </div>

                        <div className='flex items-center gap-1'> 
                        <   span className='p-2 rounded-full hover:bg-gray-800'> <FaRetweet /> </span> 
                            <span> 0 </span> 
                        </div>

                        <div className='flex items-center gap-1'> 
                            <span className='p-2 rounded-full hover:bg-gray-800'> <FaRegHeart /> </span>
                            <span> 0 </span> 
                        </div>

                        <div className='flex items-center gap-1'>
                            <span className='p-2 rounded-full hover:bg-gray-800'> <IoMdStats /> </span>  
                            <span> 0 </span> 
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