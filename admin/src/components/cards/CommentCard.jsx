import React from 'react'

import { Ellipsis } from 'lucide-react'

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

function CommentCard() {
    return (
        <div className='w-full h-full flex flex-col px-4 gap-4 justify-center'>

            {/* Icon Name Email Action */}
            <div className='w-full flex flex-row gap-2 items-center'>
                {/* Profile Image */}
                <div className='h-full w-auto'>
                    <img src={profileIcons['empty_profile']} className='h-12 w-12' />
                </div>
                {/* Name and Email */}
                <div className='flex flex-col flex-1'>
                    <h1 className='text-base font-semibold'>Tatai User</h1>
                    <p className='text-gray-400 text-md'>tataiuser@gmail.com</p>
                </div>
                {/* Actions */}
                <div className='h-full flex items-center justify-center'>
                    <span className='text-gray-600 cursor-pointer'>
                        <Ellipsis />
                    </span>
                </div>
            </div>

            {/* Comment */}
            <div className="w-full flex flex-wrap">
                <span className="line-clamp-3">
                    This guide is so good that it melts my bones. Thanks a lot for posting this and as always keep up the good work.
                </span>
            </div>

            {/* Date */}
            <div className='w-full flex flex-wrap'>
                <span className='text-gray-500'>
                    12:33 AM 11/05/2003
                </span>
            </div>

        </div>
    )
}

export default CommentCard