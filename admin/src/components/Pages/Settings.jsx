import React, { useState } from 'react'
import EditProfile from '../subpages/EditProfile.jsx';
import ChangePassword from '../subpages/ChangePassword.jsx';

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"

import { Edit, LockKeyhole, User2Icon } from 'lucide-react';

function Settings() {
    const [activePage, setActivePage] = useState('profile');
    return (
        <div className='w-full h-full px-2 py-4 md:px-6 md:py-6 flex flex-col gap-4 overflow-auto'>
            {/* Header */}
            <div className='w-full'>
                <h1 className='text-2xl text-primary font-bold '>
                    {`${activePage === 'profile' ? "Update Profile" : "Change Password"}`}
                </h1>
            </div>

            {/* Active Page */}
            <div className='w-full h-full flex flex-col gap-4'>
                <div className='flex-1'>
                    {activePage === 'profile' ? <EditProfile/> : <ChangePassword/>}
                </div>
                <Pagination>
                    <PaginationContent>
                        <PaginationItem className={`border rounded-lg cursor-pointer ${activePage === 'profile' ? 'bg-primary text-white border-primary' : 'text-gray-500 bg-white'}`}>
                            <PaginationLink onClick={() => setActivePage('profile')}><User2Icon/></PaginationLink>
                        </PaginationItem>
                        <PaginationItem className={`border rounded-lg cursor-pointer ${activePage !== 'profile' ? 'bg-primary text-white border-primary' : 'text-gray-500 bg-white'}`}>
                            <PaginationLink onClick={() => setActivePage('password')}><LockKeyhole/></PaginationLink>
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    )
}

export default Settings