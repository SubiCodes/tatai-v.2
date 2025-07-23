import React, { useState } from 'react';

import { Search } from 'lucide-react';

function Reports() {
    const [typeFilter, setTypeFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [isLatestFirst, setIsLatestFirst] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    // Mock data array
    const reportData = [];

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

            {/* Report List Placeholder */}
            <div className="flex-1 overflow-y-auto">
                {/* You can render reportData here later */}
                {reportData.length === 0 && (
                    <p className="text-sm text-gray-500">No reports to show.</p>
                )}
            </div>
        </div>
    );
}

export default Reports;
