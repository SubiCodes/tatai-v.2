import React, { useEffect, useState } from 'react'

import { PulseLoader } from "react-spinners";

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

import { Button } from '@/components/ui/button';

import useAdminStore from '../../../store/admin.store.jsx'

function ChangeIcon({ isOpen, onClose }) {


    const { admin, updateIcon, updatingIcon } = useAdminStore();

    const [activeIcon, setActiveIcon] = useState(admin.profileIcon);


    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            setActiveIcon(admin.profileIcon);
            onClose()
        }
    }

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                setActiveIcon(admin.profileIcon);
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
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
            onClick={handleBackdropClick}
        >
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto relative z-10">
                {/* Header with close button */}
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-900">Edit Profile Icon</h2>
                        <button
                            onClick={() => {setActiveIcon(admin.profileIcon);onClose()}}
                            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Content area - you can add your content here */}
                <div className="flex-1 grid grid-cols-3 md:grid-cols-4 space-y-4 p-2 place-items-center">
                    {Object.keys(profileIcons).map((icon, index) => (
                        icon === 'empty_profile' ? null : (
                            <div key={index} className={`w-16 h-16 md:w-16 md:h-16 flex items-center justify-center rounded-full cursor-pointer ${activeIcon === icon ? "bg-secondary" : "bg-gray-200"}`}
                                onClick={() => { setActiveIcon(icon) }}>
                                <img src={profileIcons[icon]} alt={icon} className="w-14 h-14 md:w-14 md:h-14 rounded-full object-contain" />
                            </div>
                        )
                    ))}
                </div>

                <div className='w-full px-2 py-2'>
                    <Button className={`w-full text-white ${updatingIcon ? "cursor-not-allowed bg-primary/50" : "cursor-pointer"} `} onClick={() => { updateIcon(activeIcon, admin._id, admin) }} disabled={updatingIcon}>
                        {updatingIcon ? <PulseLoader size={12} color='#fff' /> : "Change Icon"}
                    </Button>
                </div>

            </div>
        </div>
    )
}

export default ChangeIcon