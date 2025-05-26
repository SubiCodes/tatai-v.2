import React, { useEffect, useState } from 'react'
import useUserStore from '../../../store/user.store.jsx';
import useAdminStore from '../../../store/admin.store.jsx';

import PulseLoader from "react-spinners/PulseLoader";
import ToastUnsuccessful from '../util/ToastUnsuccessful.jsx';
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { format, getYear, subYears, setYear } from "date-fns";
import { CalendarIcon, Info } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    SelectGroup,
    SelectLabel,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

function AddUserDialog({ isOpen, onClose }) {

    const { addingUser, addUser, fetchingAdminData } = useUserStore();
    const { admin } = useAdminStore();

    const [firstName, setFirstName] = useState('');
    const [firstNameError, setFirstNameError] = useState('');
    const [lastName, setLastName] = useState('');
    const [lastNameError, setLastNameError] = useState('');
    const [date, setDate] = useState(() => subYears(new Date(), 18));
    const [gender, setGender] = useState('');
    const [genderError, setGenderError] = useState('');
    const [role, setRole] = useState('user');
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [password, setPassword] = useState('');
    const [strength, setStrength] = useState('Weak');
    const [passwordError, setPasswordError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    //clear form
    const clearForm = () => {
        setFirstName('');
        setFirstNameError('');
        setLastName('');
        setLastNameError('');
        setDate(subYears(new Date(), 18));
        setGender('');
        setGenderError('');
        setRole('user');
        setEmail('');
        setEmailError('');
        setPassword('');
        setStrength('Weak');
        setPasswordError('');
        setShowPassword(false);
        setConfirmPassword('');
        setConfirmPasswordError('');
        setShowConfirmPassword(false);
        setVisibleMonth(subYears(new Date(), 18));
    };


    const [visibleMonth, setVisibleMonth] = useState(subYears(new Date(), 18))

    const currentYear = new Date().getFullYear()
    const minYear = 1900
    const maxYear = currentYear - 18

    const years = Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i)


    const handleBackdropClick = (e) => {
        // Close dialog when clicking on backdrop
        if (e.target === e.currentTarget) {
            onClose()
        }
    }

    // Handle escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose()
            }
        }

        document.addEventListener('keydown', handleEscape)
        return () => document.removeEventListener('keydown', handleEscape)
    }, [isOpen, onClose])

    // Prevent body scroll when dialog is open
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

    useEffect(() => {
        if (!isOpen) {
            clearForm();
        }
    }, [isOpen]);

    if (!isOpen) return null

    //check password
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

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);
        setStrength(getPasswordStrength(value));
    };

    //validate inputs
    const validateForm = () => {
        let isValid = true;

        // Reset all errors
        setFirstNameError('');
        setLastNameError('');
        setEmailError('');
        setPasswordError('');
        setConfirmPasswordError('');
        setGenderError('');

        // First Name
        if (!firstName.trim()) {
            setFirstNameError('First name is required');
            toast.custom((t) => (
                <ToastUnsuccessful dismiss={() => toast.dismiss(t)} title={"Validation Failed"} message={"First name is required."} />
            ))
            isValid = false;
        }

        // Last Name
        if (!lastName.trim()) {
            setLastNameError('Last name is required');
            toast.custom((t) => (
                <ToastUnsuccessful dismiss={() => toast.dismiss(t)} title={"Validation Failed"} message={"Last name is required."} />
            ))
            isValid = false;
        }

        // Email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.trim()) {
            setEmailError('Email is required');
            toast.custom((t) => (
                <ToastUnsuccessful dismiss={() => toast.dismiss(t)} title={"Validation Failed"} message={"Email is required."} />
            ))
            isValid = false;
        } else if (!emailRegex.test(email)) {
            setEmailError('Invalid email format');
            toast.custom((t) => (
                <ToastUnsuccessful dismiss={() => toast.dismiss(t)} title={"Validation Failed"} message={"Invalid email format."} />
            ))
            isValid = false;
        }

        // Gender
        if (!gender) {
            setGenderError('Gender is required');
            toast.custom((t) => (
                <ToastUnsuccessful dismiss={() => toast.dismiss(t)} title={"Validation Failed"} message={"Gender is required."} />
            ))
            isValid = false;
        }

        // Password
        const hasLetters = /[a-zA-Z]/.test(password);
        const hasNumbers = /\d/.test(password);
        if (!password) {
            setPasswordError('Password is required');
            toast.custom((t) => (
                <ToastUnsuccessful dismiss={() => toast.dismiss(t)} title={"Validation Failed"} message={"Password is required."} />
            ))
            isValid = false;
        } else if (password.length < 8 || !(hasLetters && hasNumbers)) {
            setPasswordError('Password must be at least 8 characters and include letters and numbers');
            toast.custom((t) => (
                <ToastUnsuccessful dismiss={() => toast.dismiss(t)} title={"Validation Failed"} message={"Password must be at least 8 characters and include letters and numbers"} />
            ))
            isValid = false;
        }

        // Confirm Password
        if (!confirmPassword) {
            setConfirmPasswordError('Please confirm your password');
            toast.custom((t) => (
                <ToastUnsuccessful dismiss={() => toast.dismiss(t)} title={"Validation Failed"} message={"Please confirm your password"} />
            ))
            isValid = false;
        } else if (password !== confirmPassword) {
            setConfirmPasswordError('Passwords do not match');
            toast.custom((t) => (
                <ToastUnsuccessful dismiss={() => toast.dismiss(t)} title={"Validation Failed"} message={"Passwords do not match"} />
            ))
            isValid = false;
        }

        return isValid;
    };


    const handleAddUser = async () => {
        console.log("First Name:", firstName);
        console.log("Last Name:", lastName);
        console.log("Date of Birth:", date);
        console.log("Gender: ", gender);
        console.log("Role: ", role);
        console.log("Email: ", email);
        console.log("Password: ", password);
        console.log("Confirm Password: ", confirmPassword);

        const formValidation = validateForm();
        console.log(formValidation);

        if (formValidation) {
            try {
                const userData = { firstName, lastName, birthday: date, gender, role, email, password };
                const res = await addUser(userData);
                console.log("User added successfully:", res);
                if (res) {
                    clearForm();
                }
            } catch (error) {
                console.error("Error during form submission:", error);
            }
        }
    };


    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
            onClick={handleBackdropClick}
        >
            <div className="bg-white rounded-lg shadow-xl max-w-[90vw] md:max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                {fetchingAdminData ? (
                    <div className="flex items-center justify-center h-full">
                        <PulseLoader color="#000000" size={10} />
                        <span className="text-gray-500">Preparing Form</span>
                    </div>
                ) : (
                    <>
                        {/* Header with close button */}
                        <div className="px-6 py-4 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <div className='flex flex-col '>
                                    <h2 className="text-xl font-semibold text-gray-900">Add User</h2>
                                    <span className='text-gray-400 text-sm'>All Fields are required.</span>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Content area  */}
                        <div className="p-6 flex flex-col gap-6">
                            <div className="grid grid-rows-2 md:grid-rows-1 md:grid-cols-2 gap-4">
                                <div className="grid w-full max-w-sm items-center gap-1.5">
                                    <Label htmlFor="firstName">First Name </Label>
                                    <Input type="text" id="firstName" placeholder="Enter First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} className={`${firstNameError.trim() ? "border-red-400" : "border-black"}`} />
                                </div>
                                <div className="grid w-full max-w-sm items-center gap-1.5">
                                    <Label htmlFor="lastName">Last Name </Label>
                                    <Input type="text" id="lastName" placeholder="Enter Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} className={`${lastNameError.trim() ? "border-red-400" : "border-black"}`} />
                                </div>
                            </div>
                            <div className="grid grid-rows-2 md:grid-rows-1 md:grid-cols-2 gap-4">
                                <div className="grid w-full max-w-sm items-center gap-1.5">
                                    <Label htmlFor="firstName">Birthdate </Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full justify-start text-left font-normal",
                                                    !date && "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {date ? format(date, "PPP") : <span>Pick a date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent side="center" className={`flex w-auto flex-col space-y-2 p-2 bg-0 border-0 h-100`} >
                                            <div className='flex flex-row items-center gap-4 bg-white p-2 rounded-md border'>
                                                <h1>Select year</h1>
                                                <Select
                                                    value={getYear(visibleMonth).toString()}
                                                    onValueChange={(year) => {
                                                        const newMonth = setYear(visibleMonth, parseInt(year))
                                                        setVisibleMonth(newMonth)
                                                    }}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select year" />
                                                    </SelectTrigger>
                                                    <SelectContent position="popper" className="bg-white">
                                                        {years.map((year) => (
                                                            <SelectItem key={year} value={year.toString()}>
                                                                {year}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="rounded-md border bg-white">
                                                <Calendar
                                                    mode="single"
                                                    selected={date}
                                                    onSelect={setDate}
                                                    month={visibleMonth}         // controls visible month
                                                    onMonthChange={setVisibleMonth} // syncs when user navigates
                                                    disabled={(d) => d > subYears(new Date(), 18)}
                                                    modifiersClassNames={{
                                                        selected: "bg-secondary text-white",
                                                    }}
                                                />
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                </div>
                                <div className="grid w-full max-w-sm items-center gap-1.5">
                                    <Label htmlFor="lastName">Gender </Label>
                                    <Select value={gender} onValueChange={setGender}>
                                        <SelectTrigger className={`w-full cursor-pointer ${genderError.trim() ? "border-red-400" : "border-black"}`}>
                                            <SelectValue placeholder="Select gender" />
                                        </SelectTrigger>
                                        <SelectContent className={`bg-white`}>
                                            <SelectGroup>
                                                <SelectLabel>Genders</SelectLabel>
                                                <SelectItem value="Male" className="cursor-pointer">Male</SelectItem>
                                                <SelectItem value="Female" className="cursor-pointer">Female</SelectItem>
                                                <SelectItem value="Non-Binary" className="cursor-pointer">Non-Binary</SelectItem>
                                                <SelectItem value="Prefer not to say" className="cursor-pointer">Prefer not to say</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            {admin?.role === 'super admin' && (
                                <div className="flex w-full">
                                    <div className="grid w-full items-center gap-1.5">
                                        <Label htmlFor="lastName">Role </Label>
                                        <Select value={role} onValueChange={setRole}>
                                            <SelectTrigger className="w-full cursor-pointer">
                                                <SelectValue placeholder="Select role" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white">
                                                <SelectGroup>
                                                    <SelectLabel>Roles</SelectLabel>
                                                    <SelectItem value="user">user</SelectItem>
                                                    <SelectItem value="admin">admin</SelectItem>
                                                    <SelectItem value="super admin">super admin</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            )}
                            <div className="flex w-full">
                                <div className="grid w-full items-center gap-1.5">
                                    <Label htmlFor="email">Email </Label>
                                    <Input type="email" id="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} className={`${emailError.trim() ? "border-red-400" : "border-black"}`} />
                                </div>
                            </div>

                            <div className="grid grid-rows-2 md:grid-rows-1 md:grid-cols-2 gap-4">
                                <div className="grid w-full max-w-sm items-center gap-1.5">
                                    <Label htmlFor="firstName">Password</Label>
                                    <Input type={showPassword ? 'text' : 'password'} id="passsword" placeholder="Enter 8 characters with text and number" value={password} onChange={handlePasswordChange} className={`${passwordError.trim() ? "border-red-400" : "border-black"}`} />
                                    <div className="w-full flex items-start space-x-2">
                                        <div className="flex items-center gap-2">
                                            <Info className="text-gray-500" size={12} />
                                            <span className="text-xs text-gray-500">Password strenght:
                                                <span className={`text-sm font-semibold ${strength === 'Weak' ? 'text-red-500' : strength === 'Good' ? 'text-yellow-500' : 'text-green-600'} ml-2`}>{strength}</span>
                                            </span>
                                        </div>
                                        <div className='flex-1' />
                                        <div className="flex items-center space-x-2">
                                            <Checkbox id="terms" className="text-white border border-black data-[state=checked]:bg-secondary" onCheckedChange={(checked) => setShowPassword(!!checked)} />
                                            <label
                                                htmlFor="terms"
                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                            >
                                                Show password
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid w-full max-w-sm items-center gap-1.5">
                                    <Label htmlFor="firstName">Confirm Password</Label>
                                    <Input type={showConfirmPassword ? 'text' : 'password'} id="re-pass" placeholder="Enter 8 characters with text and number" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={`${confirmPasswordError.trim() ? "border-red-400" : "border-black"}`} />
                                    <div className="w-full flex items-start space-x-2">
                                        <div className="flex items-center gap-2">
                                            <Info className="text-gray-500" size={12} />
                                            <span className="text-xs text-gray-500">Please Re-enter Password </span>
                                        </div>
                                        <div className='flex-1' />
                                        <div className="flex items-center space-x-2">
                                            <Checkbox id="terms" className="text-white border border-black data-[state=checked]:bg-secondary" onCheckedChange={(checked) => setShowConfirmPassword(!!checked)} />
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

                            <Button className={`text-white cursor-pointer ${addingUser && "opacity-50 cursor-not-allowed"}`} onClick={handleAddUser}
                                disabled={addingUser}>
                                {!addingUser ? (
                                    <span className='text-base font-semibold'>
                                        Add User
                                    </span>) : (
                                    <PulseLoader color="#ffffff" size={10} />
                                )}

                            </Button>

                        </div>
                    </>)}
            </div>
        </div>
    )
}

export default AddUserDialog