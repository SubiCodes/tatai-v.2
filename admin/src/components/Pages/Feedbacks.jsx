import React from 'react'

import { SyncLoader } from "react-spinners";
import CommentCard from '../cards/CommentCard';
import FeedbackCard from '../cards/FeedbackCard';

import useFeedbackStore from '../../../store/feedback.store'
import { useEffect } from 'react';


function Feedbacks() {

  const { feedbacks, fetchingFeedbacks, fetchFeedbacks } = useFeedbackStore();

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

      {/* Scrollable feedback list */}
      <div className='flex-1 overflow-y-auto flex flex-col gap-4'>
        {feedbacks?.map((feedback) => (
          <FeedbackCard key={feedback._id} feedback={feedback} />
        ))}
      </div>

    </div>

  )
}

export default Feedbacks
