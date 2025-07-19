import React from 'react'

import { SyncLoader } from "react-spinners";
import { Search } from 'lucide-react';
import FeedbackCard from '../cards/FeedbackCard';

import useFeedbackStore from '../../../store/feedback.store'
import { useEffect } from 'react';
import { useState } from 'react';


function Feedbacks() {

  const { feedbacks, fetchingFeedbacks, fetchFeedbacks } = useFeedbackStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [shownStatus, setShownStatus] = useState('all'); //all | hidden | !hidden
  const [isLatestFirst, setIsLatestFirst] = useState(true);

  const filteredFeedbacks = feedbacks
    ?.filter((f) => {
      const name = `${f.userId?.firstName ?? ''} ${f.userId?.lastName ?? ''}`.toLowerCase();
      const email = f.userId?.email?.toLowerCase() ?? '';
      const comment = f.comment?.toLowerCase() ?? '';
      const query = searchQuery.toLowerCase();

      const matchesSearch = name.includes(query) || email.includes(query) || comment.includes(query);

      const matchesStatus =
        shownStatus === 'all' ||
        (shownStatus === 'hidden' && f.hidden) ||
        (shownStatus === 'shown' && !f.hidden);

      return matchesSearch && matchesStatus;
    })
    ?.sort((a, b) => {
      const dateA = new Date(a.updatedAt);
      const dateB = new Date(b.updatedAt);
      return isLatestFirst ? dateB - dateA : dateA - dateB;
    });

  useEffect(() => {
    fetchFeedbacks();
  }, [])

  if (fetchingFeedbacks) {
    return (
      <div className='w-full h-screen flex flex-col items-center justify-center gap-4'>
        <SyncLoader size={12} />
        <p className='text-lg text-gray-500'>Loading feedbacks</p>
      </div>
    );
  }

  return (
    <div className='w-full h-screen px-2 py-4 md:px-6 md:py-6 flex flex-col'>

      {/* Header */}
      <div className='w-full flex flex-row items-center mb-4'>
        <h1 className='text-2xl text-primary font-bold'>Feedbacks</h1>
        <div className='flex flex-1' />
      </div>

      {/* Filters */}
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
          {/* Status Filter */}
          <select
            value={shownStatus}
            onChange={(e) => setShownStatus(e.target.value)}
            className="px-2 py-1 text-xs border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Feedbacks</option>
            <option value="hidden">Hidden Feedbacks</option>
            <option value="shown">Visible Feedbacks</option>
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

      {/* Scrollable feedback list */}
      <div className='flex-1 overflow-y-auto flex flex-col gap-4'>
        {filteredFeedbacks?.map((feedback) => (
          <FeedbackCard key={feedback._id} feedback={feedback} />
        ))}
      </div>

    </div>

  )
}

export default Feedbacks
