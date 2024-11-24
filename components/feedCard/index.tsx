import React from 'react'
import Image from 'next/image'
import { FaRegHeart, FaRegComment, FaRetweet, FaRegBookmark } from "react-icons/fa";
import { IoMdStats } from "react-icons/io";
import { GoUpload } from "react-icons/go";


const FeedCard: React.FC = () => {
    return (
        <>
            {/* FeedCard */}
            <div className='border-t-[1px] border-[#2F3336] grid grid-cols-12 cursor-pointer py-3 px-4'>
                {/* div for profile pic */}
                <div className="col-span-1">
                    <Image 
                    src= "https://i.guim.co.uk/img/media/fe1e34da640c5c56ed16f76ce6f994fa9343d09d/0_174_3408_2046/master/3408.jpg?width=1200&height=1200&quality=85&auto=format&fit=crop&s=67773a9d419786091c958b2ad08eae5e" 
                    alt="profile-pic" width={40} height={40}
                    className='rounded-3xl'/>
                </div>

                {/* div for content */}
                <div className="col-span-11 flex flex-col items-start pl-1">
                    {/* tweet header */}
                    <div>
                        <span className="font-semibold mr-2">Elon Musk</span>
                        <span className="opacity-50">@elonmusk · 6h</span>
                    </div>

                    {/* tweet body */}
                    <div>
                        I’m hearing via allies that federal government unions are scrambling to update their collective bargaining agreements to avoid getting fired. The prospect of being asked to return to the office 5 days per week like most working Americans apparently has them “in tears.”
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