import React from 'react'

function GuideCard({ guide }) {
    return (
        <div className="w-full h-auto bg-white shadow-lg rounded-md p-4 flex flex-col gap-4">

            {/* Image Container */}
            <div className="w-full h-48 flex-shrink-0">
                <img
                    src={guide.coverImage?.url}
                    alt="Guide Cover"
                    className="w-full h-full object-cover rounded"
                />
            </div>

            {/* Info Section */}
            <div className="flex flex-col justify-start flex-1">
                <h2 className="text-md font-semibold text-gray-800 line-clamp-2 mb-2">{guide.title}</h2>
                <p className="flex flex-row text-xs gap-2 text-gray-600 line-clamp-3 mb-1"><p className='font-bold'>Posted by:</p>{`${guide.posterId.firstName} ${guide.posterId.lastName}`}</p>
                <div className="flex flex-row gap-2 items-center">
                    <p className="text-xs font-bold text-gray-600">Status:</p>
                    <span
                        className={`text-xs font-medium px-2 py-1 rounded-full border
                        ${guide.status === 'pending' && 'bg-yellow-50 text-yellow-700 border-yellow-200'}
                        ${guide.status === 'accepted' && 'bg-green-50 text-green-700 border-green-200'}
                        ${guide.status === 'rejected' && 'bg-red-50 text-red-700 border-red-200'}
                        `}
                    >
                        {guide.status.charAt(0).toUpperCase() + guide.status.slice(1)}
                    </span>
                </div>
            </div>
        </div>
    );
}

export default GuideCard