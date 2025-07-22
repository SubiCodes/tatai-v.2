import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';

import { MoveLeft, Briefcase, Sofa, Wrench } from 'lucide-react';
import { DotLoader } from 'react-spinners'

import GuideCard from '../cards/GuideCard.jsx';

import useViewUserStore from '../../../store/viewUser.store.jsx';

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

    const { userData, fetchUserData, fetchingUserData } = useViewUserStore();

    const [viewing, setViewing] = useState('guides');

    useEffect(() => {
        if (id) {
            fetchUserData(id);
        }
    }, [id]);

    return (
        <div className='flex flex-1 flex-col overflow-auto items-center justify-start p-4'>
            {/* HEADER */}
            <div
                className='w-full items-center hover:cursor-pointer hover:underline flex justify-start gap-2 font-bold text-lg mb-8'
                onClick={() => window.history.back()}
            >
                <MoveLeft /> Return to Users
            </div>

            {fetchingUserData ? (
                <div className='w-full h-full flex flex-col gap-4 items-center justify-center'>
                    <DotLoader size={32} />
                    <h1>Loading...</h1>
                </div>
            ) : (
                // CONTAINER FOR USER INFO, POSTS, COMMENTS
                <div className='max-w-full min-w-full md:max-w-xl md:min-w-xl lg:max-w-2xl lg:min-w-2xl xl:max-w-4xl xl:min-w-4xl'>
                    {/* USER INFO */}
                    <div className='flex flex-row items-center justify-start p-4 border-b border-gray-300'>
                        <div className="flex items-center justify-center">
                            <div className="relative">
                                <img
                                    src={profileIcons[userData?.user?.profileIcon ?? 'empty_profile']}
                                    alt="User Icon"
                                    className="w-28 h-28 rounded-full object-cover"
                                />
                                {/* Full-width badge */}
                                <div className="absolute bottom-0 left-0 w-full bg-primary py-1 rounded-lg flex items-center justify-center">
                                    <span className="text-xs text-white font-semibold">
                                        {userData?.user?.role.toLocaleUpperCase()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className='flex flex-1 flex-col h-full ml-4 lg:ml-12 xl:ml-16 justify-center'>
                            <span className='text-2xl font-bold'>{userData?.user?.firstName ?? 'Username'} {userData?.user?.lastName ?? 'Not Found'}</span>
                            <span className='text-md'>
                                Member since:{' '}
                                {userData?.user?.createdAt
                                    ? new Date(userData.user.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })
                                    : '—'}
                            </span>

                            <div className='flex flex-row items-center justify-start gap-4 mt-2'>
                                <div className='flex flex-row items-center justify-start'>
                                    <Briefcase className="w-4 h-4 text-primary" />
                                    <span className='text-sm font-semibold mr-2 ml-1'>:</span>
                                    <span className='text-sm'>{userData?.count?.repair}</span>
                                </div>
                                <div className='flex flex-row items-center justify-start'>
                                    <Sofa className="w-4 h-4 text-primary" />
                                    <span className='text-sm font-semibold mr-2 ml-1'>:</span>
                                    <span className='text-sm'>{userData?.count?.diy}</span>
                                </div>
                                <div className='flex flex-row items-center justify-start'>
                                    <Wrench className="w-4 h-4 text-primary" />
                                    <span className='text-sm font-semibold mr-2 ml-1'>:</span>
                                    <span className='text-sm'>{userData?.count?.tool}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* USER GUIDES || User Fedbacks*/}

                    {/* GUIDE / FEEDBACKS FILTER */}
                    <div className='w-full grid grid-cols-2 py-2'>
                        <div className={`flex items-center justify-center cursor-pointer border-b ${viewing === 'guides' ? 'border-b-2 border-secondary' : 'border-gray-400'} py-2`} onClick={() => setViewing('guides')}>
                            <span className={`text-lg font-semibold ${viewing === 'guides' ? 'text-primary' : 'text-gray-400'} `}>Guides</span>
                        </div>
                        <div className={`flex items-center justify-center cursor-pointer border-b ${viewing === 'comments' ? 'border-b-2 border-secondary' : 'border-gray-400'} py-2`} onClick={() => setViewing('comments')}>
                            <span className={`text-lg font-semibold ${viewing === 'comments' ? 'text-primary' : 'text-gray-400'} `}>Comments</span>
                        </div>
                    </div>

                    {/* USER GUIDES */}

                    {viewing === 'guides' && (
                        <div className='min-w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4'>
                            {userData?.guides?.length > 0 ? (
                                userData.guides.map((guide) => (
                                    <div className='w-full'>
                                        <GuideCard guide={guide} />
                                    </div>
                                ))
                            ) : (
                                <span className='text-xl font-lg'>No guides posted.</span>
                            )}
                        </div>

                    )}
                </div>
            )}
        </div>
    );
};

export default ViewUser;