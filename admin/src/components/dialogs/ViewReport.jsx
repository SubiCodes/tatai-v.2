import React, { useEffect } from 'react'

import {
    MoonLoader
} from "react-spinners";

import useReportStore from '../../../store/report.store'

function ViewReport({ isOpen, onClose, reportId }) {

    const { report, fetchingReport, fetchReport } = useReportStore();

    const getReportDetails = async () => {
        if (reportId) {
            await fetchReport(reportId);
            console.log("Report details fetched for ID:", reportId);
        }
    }

    useEffect(() => {
        getReportDetails();
    }, [reportId])

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose()
        }
    }

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
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
            onClick={handleBackdropClick}>

            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto relative z-10">
                {/* Header with close button */}
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-900">Viewing Report</h2>
                        <button
                            onClick={() => { onClose() }}
                            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className='w-full min-h-[200px]'>

                    {fetchingReport ? (
                        <div className='flex flex-1 flex-col items-center justify-center gap-4 min-h-full mt-12'>
                            <MoonLoader size={32}/>
                            <span className='text-gray-600'>Fetching report data...</span>
                        </div>
                    ) : (
                        <span>REPORT HERE</span>
                    )}

                </div>
            </div>

        </div>
    )
}

export default ViewReport
