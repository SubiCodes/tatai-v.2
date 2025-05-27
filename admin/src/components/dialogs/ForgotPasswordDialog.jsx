import React, { useEffect, useState } from 'react'

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

import useAdminStore from '../../../store/admin.store.jsx'
import ToastUnsuccessful from '../util/ToastUnsuccessful'

function ForgotPasswordDialog({ isOpen, onClose }) {

    const { sendResetPasswordLink, sendingResetPasswordLink } = useAdminStore();

    const [email, setEmail] = useState('');

    const handleSubmit = async () => {
        if (!email) {
             toast.custom((t) => (
                <ToastUnsuccessful dismiss={() => toast.dismiss(t)} title={"Invalid field"} message="Please fill in your email." />));
            return;
        };
        const result = await sendResetPasswordLink(email);
        if (result) {
            setEmail('');
            onClose();
        }
    }

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
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-900">Forgot Password?</h2>
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

                <div className='w-full flex flex-col px-6 py-4 gap-4'>
                    <span className='text-gray-700 text-base text-justify'>
                        Enter you registered email and we will send you a link to reset your password.
                    </span>
                    <div className='flex flex-col gap-2'>
                        <div className="grid w-full max-w-full items-center gap-1.5">
                            <Label htmlFor="email">Email</Label>
                            <Input type="email" id="email" placeholder="Enter email..." className={`h-10`} value={email} onChange={(e) => {setEmail(e.target.value)}}/>
                        </div>
                        <Button className={`text-white ${sendingResetPasswordLink ? "bg-primary/50 cursor-not-allowed" : "cursor-pointer"}`}
                        disabled={sendingResetPasswordLink} onClick={handleSubmit}>
                            Submit request
                        </Button>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default ForgotPasswordDialog