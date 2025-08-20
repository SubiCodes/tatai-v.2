import React, { useEffect, useState } from 'react'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

import { ChevronDown } from 'lucide-react'

import useGuideStore from '../../../store/guide.store.jsx';
import useAdminStore from '../../../store/admin.store.jsx';
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
import { useNavigate } from 'react-router-dom';
import useReportStore from '../../../store/report.store.jsx';
import FeedbackCard from '../cards/FeedbackCard.jsx';
import CommentCard from '../cards/CommentCard.jsx';

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

function ViewGuide({ isOpen, onClose, guide, fromViewUser = false, fromReports = false }) {

    const { updatingStatus, updateGuideStatus, getGuideById, deleteGuide, deletingGuide } = useGuideStore();
    const { getGuideByIdFromViewUser, updateGuideStatusFromViewUser, deleteGuideFromViewUser } = useViewUserStore();
    const { reportedGuide, updateGuideStatusFromReport } = useReportStore();
    const { admin } = useAdminStore();

    const [localGuide, setLocalGuide] = useState(null);

    // Get guide from store
    const storeGuide = fromReports
        ? reportedGuide
        : fromViewUser
            ? getGuideByIdFromViewUser(guide?._id)
            : getGuideById(guide?._id);

    // Initialize local state when store guide changes
    useEffect(() => {
        if (storeGuide) {
            setLocalGuide(storeGuide);
        }
    }, [storeGuide]);

    const updateStatus = async (id, status) => {
        if (fromViewUser) {
            await updateGuideStatusFromViewUser(id, status);
        } else if (fromReports) {
            await updateGuideStatusFromReport(id, status)
        } else {
            await updateGuideStatus(id, status)
        }
    }

    // Function to update feedback status in local state
    const latestGuide = localGuide;

    const updateFeedbackStatus = (userId, guideId, hidden) => {
        setLocalGuide(prevGuide => {
            if (!prevGuide || !prevGuide.feedbacks) return prevGuide;

            return {
                ...prevGuide,
                feedbacks: prevGuide.feedbacks.map(feedback =>
                    feedback.userId._id === userId && feedback.guideId === guideId
                        ? { ...feedback, hidden }
                        : feedback
                )
            };
        });
    };


    const navigate = useNavigate();

    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

    //function responsible for deletion
    const handleDelete = () => {
        if (fromViewUser) {
            deleteGuideFromViewUser(latestGuide._id, latestGuide);
        } else {
            deleteGuide(latestGuide._id, latestGuide);
        }
        setIsDeleteConfirmOpen(false);
        onClose();
    };

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

    if (!latestGuide || !latestGuide.posterId) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                <div className="bg-white p-8 rounded shadow">
                    <span>Loading guide details...</span>
                </div>
            </div>
        );
    }

    return (
        <div
            className="fixed inset-0 z-60 flex items-center justify-center overflow-auto"
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
                                src={profileIcons[latestGuide.posterId.profileIcon]}
                                alt="Profile Icon"
                                className="w-18 h-18 rounded-full object-cover"
                            />

                            {/* Title and Info */}
                            <div className="flex flex-col">
                                <h2 className="text-2xl font-semibold text-gray-900 mb-1">{latestGuide.title}</h2>
                                <span className="text-sm text-gray-600 flex flex-row gap-2">
                                    Posted by: <p className="text-gray-800">{`${latestGuide.posterId.firstName} ${latestGuide.posterId.lastName}`}</p>
                                </span>
                                <span className="text-sm text-gray-600 flex flex-row gap-2">
                                    Date posted: <p className="text-gray-800">{new Date(latestGuide.updatedAt).toLocaleDateString()}</p>
                                </span>
                                <span className="text-sm text-gray-600 flex flex-row items-center gap-2">
                                    Status: <span
                                        className={`text-sm font-medium px-2 py-1 rounded-full
                                        ${latestGuide.status === 'pending' && ' text-yellow-700 border-yellow-200'}
                                        ${latestGuide.status === 'accepted' && ' text-green-700 border-green-200'}
                                        ${latestGuide.status === 'rejected' && ' text-red-700 border-red-200'}
                                        `}
                                    >
                                        {latestGuide.status.charAt(0).toUpperCase() + latestGuide.status.slice(1)}
                                    </span>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger className={` ${updatingStatus ? "cursor-not-allowed" : "cursor-pointer"}`}><ChevronDown size={16} /></DropdownMenuTrigger>
                                        <DropdownMenuContent className='bg-white border-gray-400 z-[100]'>
                                            <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                                            <DropdownMenuSeparator className='bg-gray-200' />
                                            <DropdownMenuItem className={`cursor-pointer ${latestGuide.status === 'accepted' && "bg-green-100 text-green-700"}`}
                                                onClick={() => updateStatus(latestGuide._id, 'accepted')}>Accepted</DropdownMenuItem>
                                            <DropdownMenuItem className={`cursor-pointer ${latestGuide.status === 'rejected' && "bg-red-100 text-red-700"}`}
                                                onClick={() => updateStatus(latestGuide._id, 'rejected')}>Rejected</DropdownMenuItem>
                                            <DropdownMenuItem className={`cursor-pointer ${latestGuide.status === 'pending' && "bg-yellow-100 text-yellow-700"}`}
                                                onClick={() => updateStatus(latestGuide._id, 'pending')}>Pending</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </span>
                                {admin._id === latestGuide.posterId._id ? (
                                    <span className="text-sm text-gray-600 flex flex-row gap-2">
                                        Other Actions:
                                        <p className='text-blue-400 cursor-pointer hover:underline' onClick={() => navigate(`/guides/edit-guide/${latestGuide._id}`)}>
                                            Edit Guide
                                        </p>
                                        <p className='text-red-400 cursor-pointer hover:underline' onClick={() => setIsDeleteConfirmOpen(true)}>
                                            Delete Guide
                                        </p>
                                    </span>
                                ) : null}

                            </div>
                        </div>

                        {/* Close Button */}
                        <button
                            onClick={() => { onClose() }}
                            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
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
                        <img src={latestGuide.coverImage?.url} />
                    </div>
                    {/* Description */}
                    <div className='w-full flex flex-col flex-wrap gap-2'>
                        <h1 className='text-xl font-semibold self-start'>Description:</h1>
                        <p className='text-justify'>{latestGuide.description}</p>
                    </div>
                    {/* Tools */}
                    {latestGuide.category !== 'tool' ? (
                        <div className='w-full flex flex-col flex-wrap gap-2'>
                            <h1 className='text-xl font-semibold self-start'>Tools you'll need:</h1>
                            <div className='w-full flex flex-row flex-wrap gap-2'>
                                {latestGuide.tools.map((tool) => (
                                    <span className='flex flex-row items-center justify-center gap-2 text-sm font-medium px-4 py-1 rounded-full border bg-gray/20 text-gray border-gray/50'>
                                        {tool}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ) : (null)}
                    {/* Materials */}
                    {latestGuide.category === 'diy' ? (
                        <div className='w-full flex flex-col flex-wrap gap-2'>
                            <h1 className='text-xl font-semibold self-start'>Materials you'll need:</h1>
                            <div className='w-full flex flex-row flex-wrap gap-2'>
                                {latestGuide.materials}
                            </div>
                        </div>
                    ) : (null)}
                    {/* Procedures */}
                    <div className='w-full flex flex-col flex-wrap gap-2'>
                        <h1 className='text-xl font-semibold self-start'>Procedures:</h1>
                        {latestGuide.stepTitles.map((step, index) => (
                            <div className='flex flex-col gap-2 mb-4 w-full h-auto' key={index}>
                                {/* Procedure Title */}
                                <div className='flex flex-row flex-wrap items-center gap-4'>
                                    <span className='flex flex-row items-center justify-center gap-2 text-xs font-medium w-8 h-8 rounded-full border bg-secondary/20 text-secondary border-secondary/50'>
                                        {index + 1}
                                    </span>
                                    <span className='text-lg font-semibold'>{step}</span>
                                </div>
                                {/* Procedure Media */}
                                <div className="w-full">
                                    {/\.(mp4|webm|ogg|mov)$/i.test(latestGuide.stepMedias[index].url) ? (
                                        <video
                                            controls
                                            className="block w-full max-w-full"
                                            style={{
                                                maxHeight: "500px",
                                                objectFit: "contain",
                                                display: "block",
                                                margin: "0 auto",
                                            }}
                                        >
                                            <source src={latestGuide.stepMedias[index].url} type="video/mp4" />
                                            Your browser does not support the video tag.
                                        </video>
                                    ) : (
                                        <img
                                            src={latestGuide.stepMedias[index].url}
                                            alt={`Step media ${index + 1}`}
                                            className="block w-full max-w-full"
                                            style={{
                                                maxHeight: "500px",
                                                objectFit: "contain",
                                                display: "block",
                                                margin: "0 auto",
                                            }}
                                        />
                                    )}
                                </div>
                                {/* Procedure Description */}
                                <div className="w-full">
                                    <span className='block text-justify'>{latestGuide.stepDescriptions[index]}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* Closing Message */}
                    <div className='w-full flex flex-col flex-wrap gap-2'>
                        <h1 className='text-xl font-semibold self-start'>Closing Message:</h1>
                        <p className='text-justify'>{latestGuide.closingMessage}</p>
                    </div>
                    {/* Additional Links */}
                    <div className="w-full flex flex-col flex-wrap gap-2">
                        <h1 className="text-xl font-semibold self-start">Links:</h1>
                        <p className="text-wrap break-words">
                            {latestGuide.links.split(/(\s+)/).map((part, index) => {
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
                    {/* Feedbacks */}
                    <div className='w-full flex flex-col flex-wrap gap-2'>
                        {latestGuide?.feedbacks && latestGuide.feedbacks.length > 0 ? (
                            latestGuide.feedbacks.map((feedback) => (
                                <div className='w-full flex flex-col flex-wrap mb-2 border-b pb-2 border-gray-300'>
                                    <CommentCard feedback={feedback} fromViewGuide={true} updateFeedbackStatus={updateFeedbackStatus}/>
                                </div>
                            ))
                        ) : (
                            <span>No Feedbacks yet...</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Confirmation Dialog */}
            {isDeleteConfirmOpen && (
                <div
                    className="fixed inset-0 z-60 flex items-center justify-center bg-black/50"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) setIsDeleteConfirmOpen(false);
                    }}
                >
                    <div className="bg-white rounded-lg p-6 shadow-md w-xl flex flex-col gap-4">
                        <h3 className='text-xl font-semibold'>Confirm Deletion</h3>
                        <span className='mb-8'>Are you sure you want to delete "<span className='text-red-400'>{`${guide.title}`}</span>" ?</span>
                        <div className='w-full flex flex-row justify-end gap-2'>
                            <Button className='bg-gray-200 text-black hover:bg-gray-400/80 cursor-pointer' onClick={() => setIsDeleteConfirmOpen(false)}>
                                Cancel
                            </Button>
                            <Button className={`bg-red-400 text-white hover:bg-red-400/80 ${deletingGuide ? "cursor-not-allowed" : "cursor-pointer"}`} disabled={deletingGuide} onClick={handleDelete}>
                                Delete
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ViewGuide