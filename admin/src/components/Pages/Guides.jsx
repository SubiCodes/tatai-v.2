import React, { useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

import ViewGuide from '../dialogs/ViewGuide.jsx';

import { Button } from '@/components/ui/button'
import { Skeleton } from "@/components/ui/skeleton"
import { Search } from 'lucide-react';

import GuideCard from '../cards/GuideCard.jsx'
import useGuideStore from '../../../store/guide.store.jsx';

function Guides() {
    const navigate = useNavigate();
    const { fetchGuides, fetchingGuides, guides } = useGuideStore();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [guideToOpen, setGuideToOpen] = useState(null);

    // State variables for Guides filtering
    const [searchQuery, setSearchQuery] = useState('');
    const [shownStatus, setShownStatus] = useState('all'); // 'all', 'accepted', 'rejected', 'pending'
    const [shownCategory, setShownCategory] = useState('all'); // 'all', 'tool', 'repair'
    const [sortBy, setSortBy] = useState('date-newest'); // 'title', 'date-newest', 'date-oldest'

    // Filtering and sorting logic
    const filteredAndSortedGuides = useMemo(() => {
        let filtered = guides;

        // Search filter (searches in title, poster firstName, and poster lastName)
        if (searchQuery.trim()) {
            const query = searchQuery.trim().toLowerCase();
            filtered = filtered.filter(guide =>
                guide.title.toLowerCase().includes(query) ||
                guide.posterId.firstName.toLowerCase().includes(query) ||
                guide.posterId.lastName.toLowerCase().includes(query)
            );
        }

        // Status filter
        if (shownStatus !== 'all') {
            filtered = filtered.filter(guide =>
                guide.status.toLowerCase() === shownStatus.toLowerCase()
            );
        }

        // Category filter
        if (shownCategory !== 'all') {
            filtered = filtered.filter(guide =>
                guide.category.toLowerCase() === shownCategory.toLowerCase()
            );
        }

        // Sort the filtered results
        const sorted = [...filtered].sort((a, b) => {
            switch (sortBy) {
                case 'title':
                    return a.title.toLowerCase().localeCompare(b.title.toLowerCase());

                case 'date-newest':
                    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();

                case 'date-oldest':
                    return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();

                default:
                    return 0;
            }
        });

        return sorted;
    }, [guides, searchQuery, shownStatus, shownCategory, sortBy]);

    const openDialog = (guide) => {
        setGuideToOpen(guide);
        setIsDialogOpen(true);
    };
    const closeDialog = () => setIsDialogOpen(false);

    useEffect(() => {
        fetchGuides();
    }, [])

    return (
        <div className='w-full h-full px-2 py-4 md:px-6 md:py-6 flex flex-col gap-4 overflow-auto'>

            {/* Header */}
            <div className='w-full flex flex-row'>
                <h1 className='text-2xl text-primary font-bold '>
                    Guides
                </h1>
                <div className='flex-1' />
                <Button className='text-white cursor-pointer' onClick={() => { navigate('/guides/add-guide') }}>
                    Add Guide
                </Button>
            </div>

            <div className="mb-6 space-y-4 mt-0">
                {/* Search Bar */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search by title or poster name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        disabled={fetchingGuides}
                        className={`${fetchingGuides && "cursor-not-allowed"} w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    />
                </div>

                {/* Filter Controls */}
                <div className="flex gap-4 flex-wrap">
                    {/* Status Filter */}
                    <select
                        value={shownStatus}
                        onChange={(e) => setShownStatus(e.target.value)}
                        disabled={fetchingGuides}
                        className={`${fetchingGuides ? "cursor-not-allowed" : "cursor-pointer"} px-0 py-1 text-xs border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    >
                        <option value="all">All Status</option>
                        <option value="accepted">Accepted</option>
                        <option value="rejected">Rejected</option>
                        <option value="pending">Pending</option>
                    </select>

                    {/* Category Filter */}
                    <select
                        value={shownCategory}
                        onChange={(e) => setShownCategory(e.target.value)}
                        disabled={fetchingGuides}
                        className={`${fetchingGuides ? "cursor-not-allowed" : "cursor-pointer"} px-0 py-1 text-xs border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    >
                        <option value="all">All Categories</option>
                        <option value="tool">Tool</option>
                        <option value="repair">Repair</option>
                        <option value="diy">DIY</option>
                    </select>

                    {/* Sort Filter */}
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        disabled={fetchingGuides}
                        className={`${fetchingGuides ? "cursor-not-allowed" : "cursor-pointer"} px-0 py-1 text-xs border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    >
                        <option value="date-newest">Newest Updated</option>
                        <option value="date-oldest">Oldest Updated</option>
                        <option value="title">Sort by Title</option>
                    </select>
                </div>
            </div>

            {/* Guides Here */}
            {fetchingGuides ? (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 w-full">
                    {[...Array(12)].map((_, index) => (
                        <div key={index} className="flex flex-row gap-4 w-full">
                            <Skeleton className="h-[125px] w-[100px] sm:w-[180px] md:w-[160px] rounded-xl bg-gray-200" />
                            <div className="flex flex-col w-full space-y-2">
                                <Skeleton className="h-4 w-full bg-gray-200" />
                                <Skeleton className="h-2 w-3/4 bg-gray-200" />
                                <Skeleton className="h-2 w-1/2 bg-gray-200" />
                                <Skeleton className="h-4 w-3/4 bg-gray-200" />
                                <Skeleton className="h-4 w-1/3 bg-gray-200" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 w-full">
                    {filteredAndSortedGuides.map((guide, index) => (
                        <GuideCard
                            key={guide._id || index}
                            guide={guide}
                            onClick={() => openDialog(guide)} // pass the clicked guide
                        />
                    ))}
                </div>

            )}
            <ViewGuide
                isOpen={isDialogOpen}
                onClose={closeDialog}
                guide={guideToOpen}
            />
        </div>
    )
}

export default Guides