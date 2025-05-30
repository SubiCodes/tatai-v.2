import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

import ViewGuide from '../dialogs/ViewGuide.jsx';

import { Button } from '@/components/ui/button'
import { Skeleton } from "@/components/ui/skeleton"

import GuideCard from '../cards/GuideCard.jsx'
import useGuideStore from '../../../store/guide.store.jsx';

function Guides() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [guideToOpen, setGuideToOpen] = useState(null);

    const openDialog = (guide) => {
        setGuideToOpen(guide);
        setIsDialogOpen(true);
    };
    const closeDialog = () => setIsDialogOpen(false);

    const navigate = useNavigate();
    const { fetchGuides, fetchingGuides, guides } = useGuideStore();

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
                    {guides.map((guide, index) => (
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