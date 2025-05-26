import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAdminStore from '../../../store/admin.store.jsx'

import logo from '../../assets/images/monoclewithname.png'

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { X } from "lucide-react"

import { PulseLoader } from "react-spinners";

function Login() {

    const navigate = useNavigate();

    const { isLoggingIn, logIn, checkCookie } = useAdminStore();

    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const checkFields = () => {
        let isValid = true;
        setEmailError('');
        setPasswordError('');
        try {
            if (!email) {
                setEmailError('Email is required');
                isValid = false;
            };
            if (!password) {
                setPasswordError('Email is required');
                isValid = false;
            };
            return isValid;
        } catch (error) {
            console.error("Error checking fields:", error);
        }
    };

    const handleLogin = async () => {
        const res = await logIn(email, password, navigate);
        console.log(res);
    };

    const handleSubmit = () => {
        if (checkFields()) {
            handleLogin();
        } else {
            toast.custom((t) => (
                <div
                    className="bg-error text-white px-4 py-3 rounded shadow-md flex justify-between items-center"
                    onClick={() => toast.dismiss(t)}
                >
                    <div className='bg-error'>
                        <p className="font-bold">Unsuccessful Login</p>
                        <p className="text-white text-sm">Please fill all the fields</p>
                    </div>
                    <button
                        className="ml-6 text-gray-200 rounded cursor-pointer"
                        onClick={() => {
                            toast.dismiss(t)
                        }}
                    >
                        <X />
                    </button>
                </div>
            ))
        }
    };

    useEffect(() => {
        checkCookie(navigate);
    }, [])

    return (
        <div className="w-screen h-screen grid grid-rows-1 md:grid-rows-1 md:grid-cols-2">
            {/* div 1 */}
            <div className="flex items-center justify-center bg-gray-100 hidden md:flex">
                <img src={logo} alt="Monocle Logo" className='w-1/2 h-1/2 object-contain' />
            </div>

            {/* div 2 */}
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <div className='w-full h-2/3 border-l-[1px] border-gray-400 flex flex-col gap-4 items-center justify-center py-4'>
                    <img src={logo} alt="Monocle Logo" className='w-1/2 h-1/2 md:hidden object-contain' />
                    <div className='w-3/4 flex flex-col items-center md:items-start'>
                        <h1 className='text-3xl text-primary font-bold mb-4'>Welcome Admin!</h1>
                    </div>

                    <div className='w-3/4 flex flex-col items-center md:items-start'>
                        <div className="grid w-3/4 max-w-md items-center gap-1.5">
                            <Label htmlFor="email" className="text-lg">Email</Label>
                            <Input type="email" id="email" placeholder="Enter Email" value={email} onChange={(e) => setEmail(e.target.value)} className={`${emailError.trim() ? "border-red-400" : "border-black"}`} />
                        </div>
                    </div>

                    <div className='w-3/4 flex flex-col gap-4 items-center md:items-start'>
                        <div className="grid w-3/4 max-w-md items-center gap-1.5">
                            <Label htmlFor="email" className="text-lg">Password</Label>
                            <Input type={showPassword ? "text" : "password"} id="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} className={`${passwordError.trim() ? "border-red-400" : "border-black"}`} />
                        </div>
                        <div className="w-3/4 flex items-start space-x-2">
                            <Checkbox id="terms" className="text-white border border-black data-[state=checked]:bg-secondary" onCheckedChange={(checked) => setShowPassword(!!checked)} />
                            <label
                                htmlFor="terms"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Show password
                            </label>
                        </div>
                    </div>

                    <div className='w-3/4 flex flex-col items-center md:items-start'>
                        <Button className={`w-3/4 max-w-md text-white cursor-pointer flex items-center justify-center bg-primary hover:bg-primary/90 transition-colors duration-200 ${isLoggingIn && "opacity-50 cursor-not-allowed"}`}
                            disabled={isLoggingIn}
                            onClick={() => handleSubmit()}>
                            {!isLoggingIn ? (
                                <span className='text-base font-semibold'>
                                    Sign in
                                </span>) : (
                                <PulseLoader color="#ffffff" size={10} />
                            )}

                        </Button>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Login