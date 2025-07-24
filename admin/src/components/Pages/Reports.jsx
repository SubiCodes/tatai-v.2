import React, { useEffect, useMemo, useState } from 'react';

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

import { DotLoader } from 'react-spinners'
import { Search, Calendar, Ellipsis, Eye, Check } from 'lucide-react';

import useReportStore from '../../../store/report.store.jsx';

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

function Reports() {

    const { reports, fetchingReports, fetchReports } = useReportStore();

    const [typeFilter, setTypeFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [isLatestFirst, setIsLatestFirst] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredReports = useMemo(() => {
        let result = [...reports];

        // Filter by type
        if (typeFilter !== 'all') {
            result = result.filter(report => report.type === typeFilter);
        }

        // Filter by status
        if (statusFilter !== 'all') {
            const isReviewed = statusFilter === 'reviewed';
            result = result.filter(report => report.reviewed === isReviewed);
        }

        // Filter by search query (case-insensitive)
        if (searchQuery.trim() !== '') {
            const query = searchQuery.trim().toLowerCase();
            result = result.filter(report =>
                report.title?.toLowerCase().includes(query) || // if reports have titles
                report.description?.toLowerCase().includes(query) || // or descriptions
                report.type?.toLowerCase().includes(query)
            );
        }

        // Sort by date
        result.sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            return isLatestFirst ? dateB - dateA : dateA - dateB;
        });

        return result;
    }, [reports, typeFilter, statusFilter, searchQuery, isLatestFirst]);

    useEffect(() => {
        fetchReports();
    }, [])

    if (fetchingReports) {
        return (
            <div className='w-full h-full flex flex-col gap-4 items-center justify-center'>
                <DotLoader size={32} />
                <h1>Loading...</h1>
            </div>
        )
    }

    return (
        <div className='w-full h-screen px-2 py-4 md:px-6 md:py-6 flex flex-col'>
            {/* Header */}
            <div className='w-full flex flex-row items-center mb-4'>
                <h1 className='text-2xl text-primary font-bold'>Reports</h1>
                <div className='flex flex-1' />
            </div>

            <div className="mb-6 space-y-4 mt-0">

                {/* Search Bar */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search anything..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                {/* Filter Controls */}
                <div className="flex flex-wrap gap-4 mb-6">
                    {/* Type Filter */}
                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="px-2 py-1 text-xs border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="all">All</option>
                        <option value="feedback">Feedback</option>
                        <option value="guide">Guide</option>
                    </select>

                    {/* Status Filter */}
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-2 py-1 text-xs border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="all">All</option>
                        <option value="reviewed">Reviewed</option>
                        <option value="not_reviewed">Not Reviewed</option>
                    </select>

                    {/* Sort Filter */}
                    <select
                        value={isLatestFirst ? 'latest' : 'oldest'}
                        onChange={(e) => setIsLatestFirst(e.target.value === 'latest')}
                        className="px-2 py-1 text-xs border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="latest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                    </select>
                </div>
            </div>

            {/* TABLE    */}
            <Table className=''>
                <TableHeader>
                    <TableRow className="">
                        <TableHead className="text-lg">Reporter</TableHead>
                        <TableHead className="text-lg">Date Reported</TableHead>
                        <TableHead className="text-lg">Type</TableHead>
                        <TableHead className="text-lg">Reviewed</TableHead>
                        <TableHead className="text-lg">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className="flex-1">
                    {filteredReports.map((report) => (
                        <TableRow key={report._id} className="border-gray-200 h-16 hover:bg-gray-50/80 transition-colors duration-200">
                            {/* Name and Profile */}
                            <TableCell className="max-w-xs">
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="relative">
                                        <img
                                            src={profileIcons[report?.userId?.profileIcon] || profileIcons['empty_profile']}
                                            alt="Profile"
                                            className="w-8 h-8 rounded-full object-cover shrink-0 ring-2 ring-gray-100 shadow-sm"
                                        />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-medium text-gray-900 truncate text-sm">
                                            {`${report?.userId?.email}`}
                                        </p>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell className="text-sm">
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Calendar className="w-4 h-4 text-gray-400" />
                                    <span className="font-mono text-md">
                                        {new Date(report.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </TableCell>
                            <TableCell className="text-sm">
                                <div className="flex items-center gap-2">
                                    <span className={`font-medium text-xs px-2 py-1 rounded-full ${report?.type === 'feedback' && 'bg-blue-50 text-blue-700 border border-blue-200'
                                        } ${report?.type === 'guide' && 'bg-purple-50 text-purple-700 border border-purple-200'
                                        }`}>
                                        {report?.type.toLocaleUpperCase()}
                                    </span>
                                </div>
                            </TableCell>
                            <TableCell className="text-sm">
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${report?.reviewed ? 'bg-green-400' : 'bg-red-400'
                                        }`}></div>

                                    <span className={`font-medium text-xs px-2 py-1 rounded-full ${report?.reviewed
                                        ? 'bg-green-50 text-green-700 border border-green-200'
                                        : 'bg-red-50 text-red-700 border border-red-200'
                                        }`}>
                                        {report?.reviewed ? 'Yes' : 'No'}
                                    </span>
                                </div>
                            </TableCell>
                            <TableCell className="text-sm">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button className="bg-clear hover:bg-clear cursor-pointer">
                                            <Ellipsis />
                                        </Button>
                                    </DropdownMenuTrigger>

                                    <DropdownMenuContent className="w-auto bg-white border border-gray-300">
                                        <DropdownMenuLabel>Reviewed Status</DropdownMenuLabel>
                                        <DropdownMenuSeparator className="bg-gray-200" />

                                        {/* Mark as Reviewed */}
                                        <DropdownMenuItem
                                            className={`flex items-center gap-2 cursor-pointer ${report?.reviewed ? "bg-green-100 text-green-700" : ""
                                                }`}

                                        >
                                            {report?.reviewed && <div className="w-2 h-2 rounded-full bg-green-400" />}
                                            Reviewed
                                        </DropdownMenuItem>

                                        {/* Mark as Not Reviewed */}
                                        <DropdownMenuItem
                                            className={`flex items-center gap-2 cursor-pointer ${report?.reviewed === false ? "bg-red-100 text-red-700" : ""
                                                }`}

                                        >
                                            {report?.reviewed === false && (
                                                <div className="w-2 h-2 rounded-full bg-red-400" />
                                            )}
                                            Not Reviewed
                                        </DropdownMenuItem>

                                        <DropdownMenuSeparator className="bg-gray-200" />
                                        <DropdownMenuLabel>Other</DropdownMenuLabel>

                                        <DropdownMenuItem className="flex items-center gap-2">
                                            <Eye size={16} />
                                            View
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>

            </Table>

        </div>
    );
}

export default Reports;
