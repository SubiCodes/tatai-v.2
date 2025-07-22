import React from 'react'
import { useParams } from 'react-router-dom';

import { MoveLeft, Briefcase, Sofa, Wrench } from 'lucide-react';

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

function ViewUser() {

    const { id } = useParams();

    return (
        <div className='flex flex-1 flex-col overflow-auto items-center justify-start p-4'>
            {/* HEADER */}
            <div className='w-full items-center hover:cursor-pointer hover:underline flex justify-start gap-2 font-bold text-lg mb-8' onClick={() => window.history.back()}>
                <MoveLeft /> Return to Users
            </div>

            {/* CONTAINER FOR USER INFO, POSTS, COMMENTS */}
            <div className='max-w-full min-w-full md:max-w-xl md:min-w-xl lg:max-w-2xl lg:min-w-2xl xl:max-w-4xl xl:min-w-4xl'>

                {/* USER INFO */}
                <div className='flex flex-row items-center justify-start p-4 border-b border-gray-300'>

                    <div className="flex items-center justify-center">
                        <div className="relative">
                            <img
                                src={profileIcons['empty_profile']}
                                alt="User Icon"
                                className="w-28 h-28 rounded-full object-cover"
                            />
                            {/* Full-width badge */}
                            <div className="absolute bottom-0 left-0 w-full bg-primary py-1 rounded-lg flex items-center justify-center">
                                <span className="text-xs text-white font-semibold">
                                    ADMIN
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className='flex flex-1 flex-col h-full ml-4 lg:ml-12 xl:ml-16 justify-center'>
                        <span className='text-2xl font-bold'>John Doe</span>
                        <span className='text-md'>Member since: May 24, 2024</span>

                        <div className='flex flex-row items-center justify-start gap-4 mt-2'>
                            <div className='flex flex-row items-center justify-start'>
                                <Briefcase className="w-4 h-4 text-primary" />
                                <span className='text-sm font-semibold mr-2 ml-1'>:</span>
                                <span className='text-sm'>10</span>
                            </div>
                            <div className='flex flex-row items-center justify-start'>
                                <Sofa className="w-4 h-4 text-primary" />
                                <span className='text-sm font-semibold mr-2 ml-1'>:</span>
                                <span className='text-sm'>10</span>
                            </div>
                            <div className='flex flex-row items-center justify-start'>
                                <Wrench className="w-4 h-4 text-primary" />
                                <span className='text-sm font-semibold mr-2 ml-1'>:</span>
                                <span className='text-sm'>10</span>
                            </div>

                        </div>
                    </div>

                </div>

            </div>

        </div>
    )
}

export default ViewUser
