import React, { useEffect } from 'react'

function ConfirmChangeRole({ isOpen, onClose, body, handleConfirm }) {

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
            onClick={handleBackdropClick}
        >
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto relative z-10">
                {/* Header with close button */}
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-start justify-between">
                        <h2 className="text-xl font-semibold text-gray-900">Are you sure?</h2>
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

                <div className="px-6 py-5 bg-white rounded-xl shadow-md border border-gray-100 max-w-md mx-auto">
                    {/* Message Body */}
                    <h1 className="text-gray-800 text-base md:text-lg mb-6 text-start">
                        {body}
                    </h1>

                    {/* Button Group */}
                    <div className="flex justify-end gap-3">
                        <button
                            className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-150"
                            onClick={() => console.log("Cancelled")}
                        >
                            Cancel
                        </button>

                        <button
                            onClick={handleConfirm}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all duration-150 shadow-sm"
                        >
                            Confirm
                        </button>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default ConfirmChangeRole
