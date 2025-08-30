import React, { useEffect, useState, useMemo } from 'react'

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

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

import { Search, Dot, UserLock, ShieldUser, User, Mail, Shield, Calendar, UserCheck, Ellipsis, Eye } from 'lucide-react'
import { SyncLoader } from "react-spinners";

import useUserStore from '../../../store/user.store.jsx'
import { useNavigate } from 'react-router-dom'
import useAdminStore from '../../../store/admin.store'

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

function UserTable() {

    const navigate = useNavigate();

    const { users, fetchUsers, fetchingUsers, updateUserStatus, updateUserRole } = useUserStore();
    const { admin } = useAdminStore();

    const [searchQuery, setSearchQuery] = useState('');
    const [shownUserRole, setShownUserRole] = useState('all'); // 'all', 'admin', 'user', 'super admin'
    const [sortBy, setSortBy] = useState('name'); // date latest to oldest, vice versa
    const [shownStatus, setShownStatus] = useState('all'); // 'all', 'active', 'restricted', 'banned', 'unverified'

    const [rowPerPage, setRowPerPage] = useState(10);
    const [startIndex, setStartIndex] = useState(0);
    const [endIndex, setEndIndex] = useState(rowPerPage);

    const filteredAndSortedUsers = useMemo(() => {
        let filtered = users;

        // Search filter (searches in firstName, lastName, and email)
        if (searchQuery.trim()) {
            const query = searchQuery.trim().toLowerCase();
            filtered = filtered.filter(user =>
                user.firstName.toLowerCase().includes(query) ||
                user.lastName.toLowerCase().includes(query) ||
                user.email.toLowerCase().includes(query)
            );
        }

        // Role filter
        if (shownUserRole !== 'all') {
            filtered = filtered.filter(user => user.role === shownUserRole);
        }

        // Status filter
        if (shownStatus !== 'all') {
            // Map your status values to match the data
            const statusMap = {
                'verified': 'Verified',
                'unverified': 'Unverified',
                'banned': 'Banned',
                'restricted': 'Restricted' // Add this if you have restricted users
            };

            filtered = filtered.filter(user =>
                user.status === statusMap[shownStatus] || user.status.toLowerCase() === shownStatus
            );
        }

        // Sort the filtered results
        const sorted = [...filtered].sort((a, b) => {
            switch (sortBy) {
                case 'name': {
                    const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
                    const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
                    return nameA.localeCompare(nameB);
                }

                case 'date-newest':
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();

                case 'date-oldest':
                    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();

                default:
                    return 0;
            }
        });

        return sorted;
    }, [users, searchQuery, shownUserRole, shownStatus, sortBy]);

    const totalPages = Math.ceil(filteredAndSortedUsers.length / rowPerPage);
    const currentPage = startIndex / rowPerPage + 1;
    const isFirstPage = currentPage === 1;
    const isLastPage = currentPage === totalPages;

    const handlePrevious = () => {
        if (!isFirstPage) {
            setStartIndex(startIndex - rowPerPage);
            setEndIndex(endIndex - rowPerPage);
        }
    };

    const handleNext = () => {
        if (!isLastPage) {
            setStartIndex(startIndex + rowPerPage);
            setEndIndex(endIndex + rowPerPage);
        }
    };
    const getUsers = async () => {
        try {
            fetchUsers();
        } catch (error) {
            console.log(error);
        }
    };




    useEffect(() => {
        getUsers();
    }, []);


    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;

            if (width < 768) {
                setRowPerPage(3);
            } else if (width < 1400) {
                setRowPerPage(4);
            } else if (width < 1800) {
                setRowPerPage(5);
            } else {
                setRowPerPage(7);
            }
        };

        handleResize(); // Initial check
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        setStartIndex(0);
        setEndIndex(rowPerPage);
    }, [filteredAndSortedUsers.length, rowPerPage]);

    if (fetchingUsers) {
        return (
            <div className='flex-1 flex items-center justify-center'>
                <SyncLoader />
            </div>
        );
    }

    return (
        <>
            <div className="flex flex-col min-h-full py-0 md:py-2">

                <div className="mb-6 space-y-4 mt-0">
                    {/* Search Bar */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* Filter Controls */}
                    <div className="flex gap-4 flex-wrap">
                        {/* Role Filter */}
                        <select
                            value={shownUserRole}
                            onChange={(e) => setShownUserRole(e.target.value)}
                            className="px-0 py-1 text-xs  border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="all">All Roles</option>
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                            <option value="super admin">Super Admin</option>
                        </select>

                        {/* Status Filter */}
                        <select
                            value={shownStatus}
                            onChange={(e) => setShownStatus(e.target.value)}
                            className="px-0 py-1 text-xs  border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="all">All Status</option>
                            <option value="verified">Verified</option>
                            <option value="unverified">Unverified</option>
                            <option value="banned">Banned</option>
                            <option value="restricted">Restricted</option>
                        </select>

                        {/* Sort Filter */}
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-0 py-1 text-xs  border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="name">Sort by Name</option>
                            <option value="date-newest">Newest First</option>
                            <option value="date-oldest">Oldest First</option>
                        </select>
                    </div>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow className="">
                            <TableHead className="text-lg">Fullname</TableHead>
                            <TableHead className="text-lg">Email</TableHead>
                            <TableHead className="text-lg">Status</TableHead>
                            <TableHead className="text-lg">Role</TableHead>
                            <TableHead className="text-lg">Joined</TableHead>
                            <TableHead className="text-lg">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="flex-1">
                        {filteredAndSortedUsers.slice(startIndex, endIndex).map((user) => (
                            <TableRow key={user._id} className="border-gray-200 h-16 hover:bg-gray-50/80 transition-colors duration-200">
                                {/* Name and Profile */}
                                <TableCell className="max-w-xs">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="relative">
                                            <img
                                                src={profileIcons[user.profileIcon] || profileIcons['empty_profile']}
                                                alt="Profile"
                                                className="w-8 h-8 rounded-full object-cover shrink-0 ring-2 ring-gray-100 shadow-sm"
                                            />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-medium text-gray-900 truncate text-sm">
                                                {`${user?.firstName} ${user?.lastName}`}
                                            </p>
                                        </div>
                                    </div>
                                </TableCell>

                                {/* Email */}
                                <TableCell className="text-sm">
                                    <div className="flex items-center gap-2">
                                        <Mail className="w-4 h-4 text-gray-400" />
                                        <span className="text-gray-600 truncate max-w-xs">{user?.email}</span>
                                    </div>
                                </TableCell>

                                {/* Status */}
                                <TableCell className="text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${user?.status === 'Unverified' && "bg-yellow-400"
                                            } ${user?.status === 'Verified' && "bg-green-400"
                                            } ${user?.status === 'Restricted' && "bg-orange-400"
                                            } ${user?.status === 'Banned' && "bg-red-400"
                                            }`}></div>
                                        <span className={`font-medium text-xs px-2 py-1 rounded-full ${user?.status === 'Unverified' && "bg-yellow-50 text-yellow-700 border border-yellow-200"
                                            } ${user?.status === 'Verified' && "bg-green-50 text-green-700 border border-green-200"
                                            } ${user?.status === 'Restricted' && "bg-orange-50 text-orange-700 border border-orange-200"
                                            } ${user?.status === 'Banned' && "bg-red-50 text-red-700 border border-red-200"
                                            }`}>
                                            {user?.status}
                                        </span>
                                    </div>
                                </TableCell>

                                {/* Role */}
                                <TableCell className="text-sm">
                                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium text-xs border ${user?.role === 'user' && "bg-blue-50 text-blue-700 border-blue-200"
                                        } ${user?.role === 'admin' && "bg-purple-50 text-purple-700 border-purple-200"
                                        } ${user?.role === 'super admin' && "bg-indigo-50 text-indigo-700 border-indigo-200"
                                        }`}>
                                        <span className="text-current">
                                            {user?.role === 'user' ? <User className="w-3 h-3" /> : null}
                                            {user?.role === 'admin' ? <UserCheck className="w-3 h-3" /> : null}
                                            {user?.role === 'super admin' ? <Shield className="w-3 h-3" /> : null}
                                        </span>
                                        <span className="capitalize">{user?.role}</span>
                                    </div>
                                </TableCell>

                                {/* Created Date */}
                                <TableCell className="text-sm">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Calendar className="w-4 h-4 text-gray-400" />
                                        <span className="font-mono text-xs">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </TableCell>
                                {/* Actions */}
                                <TableCell className="text-sm">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button className="bg-clear hover:bg-clear cursor-pointer"><Ellipsis /></Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="w-auto bg-white">
                                            {((user?.role !== 'user') && admin?.role !== 'super admin') ? null : (
                                                <>
                                                    <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                                                    <DropdownMenuSeparator className='bg-gray-200' />
                                                    <DropdownMenuItem className={`cursor-pointer ${user?.status === 'Unverified' && "bg-orange-100 text-orange-700"}`}
                                                        onClick={() => updateUserStatus(user?._id, 'Unverified', users)}>Unverified</DropdownMenuItem>
                                                    <DropdownMenuItem className={`cursor-pointer ${user?.status === 'Verified' && "bg-green-100 text-green-700"}`}
                                                        onClick={() => updateUserStatus(user?._id, 'Verified', users)}>Verified</DropdownMenuItem>
                                                    <DropdownMenuItem className={`cursor-pointer ${user?.status === 'Restricted' && "bg-yellow-100 text-yellow-700"}`}
                                                        onClick={() => updateUserStatus(user?._id, 'Restricted', users)}>Restricted</DropdownMenuItem>
                                                    <DropdownMenuItem className={`cursor-pointer ${user?.status === 'Banned' && "bg-red-100 text-red-700"}`}
                                                        onClick={() => updateUserStatus(user?._id, 'Banned', users)}>Banned</DropdownMenuItem>
                                                    {admin?.role === 'super admin' && (
                                                        <>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuLabel>Promote / Demote</DropdownMenuLabel>
                                                            <DropdownMenuItem>
                                                                {user?.role !== 'admin' ? (
                                                                    <Button className='bg-secondary text-white cursor-pointer' onClick={() => updateUserRole(user?._id, 'admin', users)}>
                                                                        Promote to Admin
                                                                    </Button>
                                                                ) : (
                                                                    <Button className='bg-red-400 text-white hover:bg-red-500 cursor-pointer' onClick={() => updateUserRole(user?._id, 'user', users)}>
                                                                        Demote to User
                                                                    </Button>
                                                                )}
                                                            </DropdownMenuItem>
                                                        </>
                                                    )}
                                                </>
                                            )}

                                            <DropdownMenuLabel>Other</DropdownMenuLabel>
                                            <DropdownMenuItem onClick={() => navigate(`/users/${user._id}`)}>
                                                <Eye />
                                                View
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <div className='flex-1' />

                <Pagination className="self-end">
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                onClick={handlePrevious}
                                className={`bg-white rounded-md border border-gray-300 w-24 flex items-center justify-center ${isFirstPage ? "opacity-50 cursor-not-allowed pointer-events-none" : "cursor-pointer hover:bg-gray-50"
                                    }`}
                            />
                        </PaginationItem>

                        {/* Optional: Add page numbers */}
                        <PaginationItem>
                            <span className="px-4 py-2 text-sm text-gray-700">
                                Page {currentPage} of {totalPages}
                            </span>
                        </PaginationItem>

                        <PaginationItem>
                            <PaginationNext
                                onClick={handleNext}
                                className={`bg-white rounded-md border border-gray-300 w-24 flex items-center justify-center ${isLastPage ? "opacity-50 cursor-not-allowed pointer-events-none" : "cursor-pointer hover:bg-gray-50"
                                    }`}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </>
    )
}

export default UserTable