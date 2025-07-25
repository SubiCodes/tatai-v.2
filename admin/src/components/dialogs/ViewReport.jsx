import React, { useEffect, useState } from 'react'

import {
    MoonLoader
} from "react-spinners";
import FeedbackCard from '../cards/FeedbackCard.jsx'
import GuideCard from '../cards/GuideCard.jsx'

import useReportStore from '../../../store/report.store'
import ViewGuide from './ViewGuide.jsx';

const ReportField = ({ label, value, multiline = false }) => (
    <div className="w-full flex flex-row items-center gap-2">
        <p className="text-sm text-gray-500">{label}: </p>
        <p className={`text-base text-gray-800 font-medium ${multiline ? "whitespace-pre-wrap break-words" : ""}`}>
            {value || "—"}
        </p>
    </div>
);

function ViewReport({ isOpen, onClose, reportId }) {

    const { report, fetchingReport, fetchReport, fetchReportedGuide, reportedGuide } = useReportStore();

    const [openViewGuide, setOpenViewGuide] = useState(false);

    const getReportDetails = async () => {
        if (reportId) {
            await fetchReport(reportId);
            console.log("Report details fetched for ID:", report?.guideId);
        }
    };

    const getReportedGuideData = async () => {
        await fetchReportedGuide(report?.guideId)
        setOpenViewGuide(true);
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

            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto relative z-10"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
            >
                {/* Header */}
                <div className='w-full flex-col px-6 py-4 border-b border-gray-200 flex items-start justify-between sticky gap-2 top-0 bg-white z-20'>
                    <div className="flex w-full items-center justify-between">
                        <h2 className="text-2xl font-semibold text-gray-800">Viewing Report</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <div className=''>
                        <p className='text-sm text-gray-500'>Report ID: {report?._id}</p>
                    </div>
                </div>


                {/* Body */}
                <div className="w-full px-6 py-4 min-h-[200px]">
                    {fetchingReport ? (
                        <div className="flex flex-col items-center justify-center gap-4 mt-12">
                            <MoonLoader size={32} />
                            <span className="text-gray-600">Fetching report data...</span>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-2">
                            <ReportField label="Reported by" value={report?.userId?.email} />
                            <ReportField label="Report Date" value={new Date(report?.createdAt).toLocaleDateString()} />
                            <ReportField label="Type" value={report?.type?.toUpperCase()} />
                            <ReportField label="Description" value={report?.description} multiline />

                            {report?.type === 'feedback' && (
                                <FeedbackCard feedback={report.feedbackId} />
                            )}
                            {report?.type === 'guide' && report?.guideId && (
                                <GuideCard guide={report.guideId} onClick={() => getReportedGuideData()} />
                            )}
                        </div>
                    )}
                </div>
            </div>
             <ViewGuide
                isOpen={openViewGuide}
                onClose={() => setOpenViewGuide(false)}
                guide={reportedGuide} 
            />
        </div>
    )
}

export default ViewReport
