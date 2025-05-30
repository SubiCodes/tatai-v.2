import React, { useEffect } from 'react'

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

function ViewGuide({ isOpen, onClose, guide }) {
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose()
        }
    }

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose()
            }
        }

        document.addEventListener('keydown', handleEscape)
        return () => document.removeEventListener('keydown', handleEscape)
    }, [isOpen, onClose])

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }

        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    if (!isOpen) return null

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center overflow-auto"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
            onClick={handleBackdropClick}
        >
            <div className="bg-white rounded-lg shadow-xl min-w-[92%] max-h-[90vh] md:min-w-4xl mx-4 sm:max-w-full md:max-w-4xl overflow-y-auto relative z-10">
                {/* Header with close button */}
                <div className="px-6 py-4 border-b border-gray-200 bg-white sticky top-0 z-20">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-row gap-4 items-center">
                            {/* Profile Icon */}
                            <img
                                src={profileIcons[guide.posterId.profileIcon]}
                                alt="Profile Icon"
                                className="w-18 h-18 rounded-full object-cover"
                            />

                            {/* Title and Info */}
                            <div className="flex flex-col">
                                <h2 className="text-2xl font-semibold text-gray-900 mb-1">{guide.title}</h2>
                                <span className="text-sm text-gray-600 flex flex-row gap-2">
                                    Posted by: <p className="text-gray-800">{`${guide.posterId.firstName} ${guide.posterId.lastName}`}</p>
                                </span>
                                <span className="text-sm text-gray-600 flex flex-row gap-2">
                                    Date posted: <p className="text-gray-800">{new Date(guide.updatedAt).toLocaleDateString()}</p>
                                </span>
                            </div>
                        </div>

                        {/* Close Button */}
                        <button
                            onClick={() => { onClose() }}
                            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer hidden sm:hidden md:inline"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Contents Go Here */}
                <div className='w-full flex flex-col p-4 gap-8'>

                    {/* Cover Image */}
                    <div className='w-full flex flex-col items-center justify-between'>
                        <img src={guide.coverImage?.url} />
                    </div>
                    {/* Description */}
                    <div className='w-full flex flex-col flex-wrap gap-2'>
                        <h1 className='text-xl font-semibold self-start'>Description:</h1>
                        <p className='text-justify'>{guide.description}</p>
                    </div>
                    {/* Tools */}
                    {guide.category !== 'tool' ? (
                        <div className='w-full flex flex-col flex-wrap gap-2'>
                            <h1 className='text-xl font-semibold self-start'>Tools you'll need:</h1>
                            <div className='w-full flex flex-row flex-wrap gap-2'>
                                {guide.tools.map((tool) => (
                                    <span className='flex flex-row items-center justify-center gap-2 text-sm font-medium px-4 py-1 rounded-full border bg-gray/20 text-gray border-gray/50'>
                                        {tool}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ) : (null)}
                    {/* Materials */}
                    {guide.category === 'diy' ? (
                        <div className='w-full flex flex-col flex-wrap gap-2'>
                            <h1 className='text-xl font-semibold self-start'>Materials you'll need:</h1>
                            <div className='w-full flex flex-row flex-wrap gap-2'>
                                {guide.materials}
                            </div>
                        </div>
                    ) : (null)}
                    {/* Procedures */}
                    <div className='w-full flex flex-col flex-wrap gap-2'>
                        <h1 className='text-xl font-semibold self-start'>Procedures:</h1>
                        {guide.stepTitles.map((step, index) => (
                            <div className='flex flex-col gap-2 mb-4' key={index}>
                                {/* Procedure Title */}
                                <div className='flex flex-row flex-wrap items-center gap-4'>
                                    <span className='flex flex-row items-center justify-center gap-2 text-xs font-medium w-8 h-8 rounded-full border bg-secondary/20 text-secondary border-secondary/50'>
                                        {index + 1}
                                    </span>
                                    <span>{step}</span>
                                </div>
                                {/* Procedure Media */}
                                <div>
                                    <img src={guide.stepMedias[index].url} />
                                </div>
                                {/* Procedure Description */}
                                <div>
                                    <span className='text-justify'>{guide.stepDescriptions[index]}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* Closing Message */}
                    <div className='w-full flex flex-col flex-wrap gap-2'>
                        <h1 className='text-xl font-semibold self-start'>Closing Message:</h1>
                        <p className='text-justify'>{guide.closingMessage}</p>
                    </div>
                    {/* Additional Links */}
                    <div className="w-full flex flex-col flex-wrap gap-2">
                        <h1 className="text-xl font-semibold self-start">Links:</h1>
                        <p className="text-wrap break-words">
                            {guide.links.split(/(\s+)/).map((part, index) => {
                                const urlRegex = /(https?:\/\/[^\s]+)/;
                                if (urlRegex.test(part)) {
                                    const displayUrl = part.length > 50 ? part.substring(0, 50) + '...' : part;
                                    return (
                                        <>
                                            <a
                                                key={index}
                                                href={part}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:underline break-words"
                                                title={part}
                                            >
                                                {displayUrl}
                                            </a>
                                            <br />
                                        </>
                                    );
                                }
                                return part;
                            })}
                        </p>
                    </div>

                </div>

            </div>
        </div>
    )
}

export default ViewGuide