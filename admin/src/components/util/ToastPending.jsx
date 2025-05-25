import React from 'react'
import { X } from 'lucide-react'

function ToastSuccessful({dismiss, title, message}) {
    return (
        <div
            className="bg-pending text-white px-4 py-3 rounded shadow-md flex justify-between items-center"
            onClick={() => dismiss()}
        >
            <div className='bg-pending'>
                <p className="font-bold">{title}</p>
                <p className="text-white text-sm">{message}</p>
            </div>
            <button
                className="ml-6 text-gray-200 rounded cursor-pointer"
                onClick={() => {
                    dismiss()
                }}
            >
                <X />
            </button>
        </div>
    )
}

export default ToastSuccessful