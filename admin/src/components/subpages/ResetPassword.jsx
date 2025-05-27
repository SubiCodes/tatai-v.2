import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { RiseLoader } from 'react-spinners';

import useAdminStore from '../../../store/admin.store';

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { toast } from 'sonner'
import { Info } from 'lucide-react'

import ToastUnsuccessful from '../util/ToastUnsuccessful.jsx'

function ResetPassword() {

    const navigate = useNavigate();
    const { token } = useParams();

    const { checkResetTokenValidity, checkingResetTokenValidity, resetPassword, resettingPassword } = useAdminStore();

    const [strength, setStrength] = useState('Weak');


    const getPasswordStrength = (pwd) => {
        const hasLetters = /[a-zA-Z]/.test(pwd);
        const hasNumbers = /\d/.test(pwd);
        const hasSymbols = /[^a-zA-Z0-9]/.test(pwd);

        if (pwd.length < 8 || !(hasLetters && hasNumbers)) {
            return 'Weak';
        } else if (hasLetters && hasNumbers && !hasSymbols) {
            return 'Good';
        } else if (hasLetters && hasNumbers && hasSymbols) {
            return 'Strong';
        }
    };


    const [newPassword, setNewPassword] = useState("");
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [newPasswordError, setNewPasswordError] = useState(false);

    const [confirmPassword, setConfirmPassword] = useState("");
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [confirmPasswordError, setConfirmPasswordError] = useState(false);

    const handleNewPasswordChange = (e) => {
        const value = e.target.value;
        setNewPassword(value);
        setStrength(getPasswordStrength(value));
    };

    const handleResetPassword = () => {
        console.log("NEW: ", newPassword);
        console.log("CONFIRM: ", confirmPassword);
        let valid = true;
        if (!newPassword.trim()) {
            setNewPasswordError(true);
            toast.custom((t) => (<ToastUnsuccessful dismiss={() => toast.dismiss(t)} title={"Validation Failed"} message={"New password required."} />))
            valid = false;
        }
        if (strength === 'Weak') {
            setNewPasswordError(true);
            toast.custom((t) => (<ToastUnsuccessful dismiss={() => toast.dismiss(t)} title={"Validation Failed"} message={"Password must contain  characters containing letters and number."} />))
            valid = false;
        }
        if (!confirmPassword.trim()) {
            setConfirmPasswordError(true);
            toast.custom((t) => (<ToastUnsuccessful dismiss={() => toast.dismiss(t)} title={"Validation Failed"} message={"Please confirm your password."} />))
            valid = false;
        }
        if (newPassword.trim() !== confirmPassword.trim()) {
            setConfirmPasswordError(true);
            setNewPasswordError(true);
            toast.custom((t) => (<ToastUnsuccessful dismiss={() => toast.dismiss(t)} title={"Validation Failed"} message={"New password and confirmation does not match."} />))
            valid = false;
        }
        if (!valid) return;
        resetPassword(token, newPassword, navigate);
    }

    useEffect(() => {
        checkResetTokenValidity(token, navigate);
    }, [])

    if (checkingResetTokenValidity) {
        <div className='flex justify-center items-center h-screen'>
            <h1 className='text-2xl font-bold text-primary'>Checking Token Validity...</h1>
            <RiseLoader color="#36d7b7" size={15} />
        </div>
    }
    return (
        <div className='flex justify-center items-center h-screen bg-gray-200'>
            <div className='bg-white rounded-lg shadow-lg flex flex-col gap-2 py-4 w-full md:w-lg'>
                <div className='w-full flex items-center justify-center p-2'>
                    <h1 className='text-2xl font-bold'>Reset Password</h1>
                </div>
                <div className='w-full h-[1px] bg-gray-300' />

                <div className='w-full flex justify-center items-center p-2 px-4'>
                    <span className='text-gray-700 text-justify'>
                        Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character.
                    </span>
                </div>


                <div className=' w-full flex justify-center items-center p-2 px-4'>
                    <div className="grid w-full items-center gap-1.5 mb-2">
                        <Label htmlFor="email">Password</Label>
                        <Input type={`${!showNewPassword ? 'password' : 'text'}`} placeholder="Enter your new password..." className={`${newPasswordError && "border-red-400"}`}
                            onChange={handleNewPasswordChange} value={newPassword} />
                        <div className="w-full flex items-start space-x-2">
                            <div className="flex items-center gap-2">
                                <Info className="text-gray-500" size={12} />
                                <span className="text-xs text-gray-500">Password strenght:
                                    <span className={`text-sm font-semibold ${strength === 'Weak' ? 'text-red-500' : strength === 'Good' ? 'text-yellow-500' : 'text-green-600'} ml-2`}>{strength}</span>
                                </span>
                            </div>
                            <div className='flex-1' />
                            <div className="flex items-center space-x-2">
                                <Checkbox id="terms" className="text-white border border-black data-[state=checked]:bg-secondary" onCheckedChange={(checked) => setShowNewPassword(!!checked)} />
                                <label
                                    htmlFor="terms"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Show password
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <div className=' w-full flex justify-center items-center p-2 px-4'>
                    <div className="grid w-full items-center gap-1.5 mb-6">
                        <Label htmlFor="email">Confirm Password</Label>
                        <Input type={`${!showConfirmPassword ? 'password' : 'text'}`} placeholder="Confirm your password..." className={`${confirmPasswordError && "border-red-400"}`}
                            onChange={(e) => { setConfirmPassword(e.target.value) }} value={confirmPassword} />
                        <div className='w-full flex flex-row items-center gap-2'>
                            <div className="flex items-center gap-2">
                                <Info className="text-gray-500" size={12} />
                                <span className="text-xs text-gray-500">
                                    Please confirm your new password.
                                </span>
                            </div>
                            <div className='flex-1' />
                            <Checkbox id="terms" className="text-white border border-black data-[state=checked]:bg-secondary" onCheckedChange={() => setShowConfirmPassword(!showConfirmPassword)} />
                            <label
                                htmlFor="terms"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Show password
                            </label>
                        </div>
                    </div>
                </div>

                <div className='w-full flex justify-center items-center p-2 px-4'>
                    <Button className={`w-full text-white ${resettingPassword ? "bg-primary/50 cursor-not-allowed" : "cursor-pointer"}`} onClick={handleResetPassword} disabled={resettingPassword}>
                        Reset Password
                    </Button>
                </div>

            </div>
        </div>
    )
}

export default ResetPassword