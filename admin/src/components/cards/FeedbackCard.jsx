import React from 'react'

import { Ellipsis, EyeOff, Eye } from 'lucide-react'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import empty_profile from '../../assets/images/profile-icons/empty_profile.png'
import boy_1 from '../../assets/images/profile-icons/boy_1.png'
import boy_2 from '../../assets/images/profile-icons/boy_2.png'
import boy_3 from '../../assets/images/profile-icons/boy_3.png'
import boy_4 from '../../assets/images/profile-icons/boy_4.png'
import girl_1 from '../../assets/images/profile-icons/girl_1.png'
import girl_2 from '../../assets/images/profile-icons/girl_2.png'
import girl_3 from '../../assets/images/profile-icons/girl_3.png'
import girl_4 from '../../assets/images/profile-icons/girl_4.png'
import lgbt_1 from '../../assets/images/profile-icons/lgbt_1.png'
import lgbt_2 from '../../assets/images/profile-icons/lgbt_2.png'
import lgbt_3 from '../../assets/images/profile-icons/lgbt_3.png'
import lgbt_4 from '../../assets/images/profile-icons/lgbt_4.png'

import useFeedbackStore from '../../../store/feedback.store'

const profileIcons = {
    'empty_profile': empty_profile,
    'boy_1': boy_1,
    'boy_2': boy_2,
    'boy_3': boy_3,
    'boy_4': boy_4,
    'girl_1': girl_1,
    'girl_2': girl_2,
    'girl_3': girl_3,
    'girl_4': girl_4,
    'lgbt_1': lgbt_1,
    'lgbt_2': lgbt_2,
    'lgbt_3': lgbt_3,
    'lgbt_4': lgbt_4
};

function FeedbackCard({ feedback, fromLatestFeedback = false }) {

    const { editFeedback } = useFeedbackStore();

    const handleEditFeedback = async (hidden) => {
        await editFeedback(feedback?.userId?._id, feedback?.guideId, hidden, fromLatestFeedback);
    }

    return (
        <div className='h-fit border-[1px] border-gray-200  bg-white shadow-lg elevated rounded-lg flex flex-col py-2 px-4 gap-4 justify-center'>

            {/* Icon Name Email Action */}
            <div className='w-full flex flex-row gap-2 items-center'>
                {/* Profile Image */}
                <div className='h-full w-auto'>
                    <img src={profileIcons[feedback?.userId?.profileIcon ?? 'empty_profile']} className='h-12 w-12' />
                </div>
                {/* Name and Email */}
                <div className='flex flex-col flex-1'>
                    <h1 className='text-base font-semibold'>{feedback?.userId?.firstName} {feedback?.userId?.lastName}</h1>
                    <p className='text-gray-400 text-md'>{feedback?.userId?.email}</p>
                </div>
                {/* Actions */}
                <div className='h-full flex items-center justify-center'>
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <span className='text-gray-600 cursor-pointer'>
                                <Ellipsis />
                            </span>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className='bg-white border border-gray-400'>
                            <DropdownMenuLabel>Hide Comment</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                {!feedback?.hidden ? (
                                    <span className='text-red-400 flex flex-row items-center justify-center gap-2 cursor-pointer' onClick={() => handleEditFeedback(true)}><EyeOff /> Hide</span>
                                ) : (
                                    <span className='text-gray-600 flex flex-row items-center justify-center gap-2 cursor-pointer' onClick={() => handleEditFeedback(false)}><Eye /> Show</span>
                                )}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                </div>
            </div>

            {/* Comment */}
            <div className={`w-full flex flex-wrap`}>
                <span className={`line-clamp-3 ${feedback?.hidden ? 'text-gray-400' : 'text-gray-800'}`}>
                    {feedback?.comment}
                </span>
            </div>

            {/* Date */}
            <div className='w-full flex flex-wrap'>
                <span className='text-gray-500'>
                    {new Date(feedback?.updatedAt).toLocaleDateString('en-US', {
                        month: 'short', // "Mar"
                        day: '2-digit', // "04"
                        year: 'numeric' // "2004"
                    })}
                </span>
            </div>

        </div>
    )
}

export default FeedbackCard