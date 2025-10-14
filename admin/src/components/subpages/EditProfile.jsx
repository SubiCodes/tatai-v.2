import React, { useEffect, useState } from 'react'

import empty_profile from '../../assets/images/profile-icons/empty_profile.png'
import boy_1 from '../../assets/images/profile-icons/boy_1.png'
import boy_2 from '../../assets/images/profile-icons/boy_2.png'
import boy_3 from '../../assets/images/profile-icons/boy_3.png'
import boy_4 from '../../assets/images/profile-icons/boy_4.png'
import girl_1 from '../../assets/images/profile-icons/girl_1.png'
import girl_2 from '../../assets/images/profile-icons/girl_2.png'
import girl_3 from '../../assets/images/profile-icons/girl_3.png'
import girl_4 from '../../assets/images/profile-icons/girl_4.png'
import lgbt_1 from '../../assets/images/profile-icons/lgbt_1.png'
import lgbt_2 from '../../assets/images/profile-icons/lgbt_2.png'
import lgbt_3 from '../../assets/images/profile-icons/lgbt_3.png'
import lgbt_4 from '../../assets/images/profile-icons/lgbt_4.png'

const profileIcons = {
    'empty_profile': empty_profile,
    'boy_1': boy_1,
    'boy_2': boy_2,
    'boy_3': boy_3,
    'boy_4': boy_4,
    'girl_1': girl_1,
    'girl_2': girl_2,
    'girl_3': girl_3,
    'girl_4': girl_4,
    'lgbt_1': lgbt_1,
    'lgbt_2': lgbt_2,
    'lgbt_3': lgbt_3,
    'lgbt_4': lgbt_4
};

import useAdminStore from '../../../store/admin.store.jsx'
import { getAdminData } from '../../../store/admin.store.jsx';

import ChangeIcon from '../dialogs/ChangeIcon.jsx'

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
import { toast } from "sonner";
import ToastUnsuccessful from "../util/ToastUnsuccessful.jsx";

import { Pencil } from "lucide-react";


function EditProfile() {
    const { admin, updateProfile, updatingProfile } = useAdminStore();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const openDialog = () => setIsDialogOpen(true);
    const closeDialog = () => setIsDialogOpen(false);

    const eighteenYearsAgo = subYears(new Date(), 18);
    const parsedBirthday = admin?.birthday ? new Date(admin.birthday) : null;
    const [visibleMonth, setVisibleMonth] = useState(parsedBirthday || eighteenYearsAgo);

    const [firstName, setFirstName] = useState(admin?.firstName);
    const [firstNameError, setFirstNameError] = useState(false);
    const [lastName, setLastName] = useState(admin?.lastName);
    const [lastNameError, setLastNameError] = useState(false);
    const [birthday, setBirthday] = useState(parsedBirthday);
    const [gender, setGender] = useState(admin?.gender);

    const currentYear = getYear(new Date());
    const years = Array.from({ length: 100 }, (_, i) => currentYear - i).filter(
        (year) => year <= getYear(eighteenYearsAgo)
    );

    const handleUpdateProfile = () => {
        let valid = true;
        setFirstNameError(false);
        setLastNameError(false);

        const nameRegex = /^[A-Za-z.-]+$/;

        if (!firstName.trim()) {
            toast.custom((t) => (
                <ToastUnsuccessful
                    dismiss={() => toast.dismiss(t)}
                    title={"Invalid Fields"}
                    message={"First Name cannot be empty!"}
                />
            ));
            setFirstNameError(true);
            valid = false;
        } else if (!nameRegex.test(firstName.trim())) {
            toast.custom((t) => (
                <ToastUnsuccessful
                    dismiss={() => toast.dismiss(t)}
                    title={"Invalid Fields"}
                    message={"First Name can only contain letters, periods, or dashes!"}
                />
            ));
            setFirstNameError(true);
            valid = false;
        }

        if (!lastName.trim()) {
            toast.custom((t) => (
                <ToastUnsuccessful
                    dismiss={() => toast.dismiss(t)}
                    title={"Invalid Fields"}
                    message={"Last Name cannot be empty!"}
                />
            ));
            setLastNameError(true);
            valid = false;
        } else if (!nameRegex.test(lastName.trim())) {
            toast.custom((t) => (
                <ToastUnsuccessful
                    dismiss={() => toast.dismiss(t)}
                    title={"Invalid Fields"}
                    message={"Last Name can only contain letters, periods, or dashes!"}
                />
            ));
            setLastNameError(true);
            valid = false;
        }

        if (valid) {
            const data = { firstName: firstName, lastName: lastName, birthday: birthday, gender: gender }
            updateProfile(data, admin._id);
        }
    }

    useEffect(() => { getAdminData() }, [])
    return (
        <div className='w-full h-full flex flex-col gap-4 items-center justify-center '>
            {/* Profile by User */}
            <div className='w-full flex items-center justify-center md:w-1/3'>
                <div className='relative w-22 h-22 md:w-28 md:h-28 lg:w-34 lg:h-34'>
                    {/* Profile image container */}
                    <div className='w-full h-full rounded-full bg-gray-300 flex items-center justify-center'>
                        <img
                            src={profileIcons[admin?.profileIcon]}
                            className='w-20 h-20 md:w-26 md:h-26 lg:w-32 lg:h-32 rounded-full'
                            alt="Profile"
                        />
                    </div>
                    {/* Pencil button */}
                    <button
                        type="button"
                        className='absolute bottom-1 right-1 p-1 md:p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition cursor-pointer'
                        onClick={openDialog}
                    >
                        <Pencil className="w-4 h-4 md:w-6 md:h-6 text-gray-700" />
                    </button>
                </div>
            </div>

            <div className='w-full flex flex-col items-center justify-center gap-2 md:gap-2'>
                <div className="grid w-full max-w-sm lg:max-w-lg items-center gap-1.5 cursor-not-allowed">
                    <Label htmlFor="email">Email</Label>
                    <Input type="email" placeholder="Email" disabled={true} value={admin?.email} />
                </div>
                <div className="grid w-full max-w-sm lg:max-w-lg items-center gap-1.5">
                    <Label>First Name</Label>
                    <Input type="text" placeholder="Enter first name" value={firstName} onChange={(e) => setFirstName(e.target.value)} className={`${firstNameError && "border-red-400"}`} />
                </div>
                <div className="grid w-full max-w-sm lg:max-w-lg items-center gap-1.5">
                    <Label>Last Name</Label>
                    <Input type="text" placeholder="Enter last name" value={lastName} onChange={(e) => setLastName(e.target.value)} className={`${lastNameError && "border-red-400"}`} />
                </div>
                <div className="flex flex-col md:flex-row w-full max-w-sm lg:max-w-lg gap-2 md:gap-2">
                    {/* Birthdate */}
                    <div className="flex-1 grid items-center gap-1.5">
                        <Label htmlFor="birthday">Birthdate</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !birthday && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {birthday ? format(birthday, "PPP") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent side="center" className="flex w-auto flex-col space-y-2 p-2 bg-0 border-0 h-100">
                                <div className="flex flex-row items-center gap-4 bg-white p-2 rounded-md border">
                                    <h1>Select year</h1>
                                    <Select
                                        value={getYear(visibleMonth).toString()}
                                        onValueChange={(year) => {
                                            const newMonth = setYear(visibleMonth, parseInt(year));
                                            setVisibleMonth(newMonth);
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
                                        selected={birthday}
                                        onSelect={setBirthday}
                                        month={visibleMonth}
                                        onMonthChange={setVisibleMonth}
                                        disabled={(date) => date > eighteenYearsAgo}
                                        modifiersClassNames={{
                                            selected: "bg-secondary text-white",
                                        }}
                                    />
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>

                    {/* Gender */}
                    <div className="flex-1 grid items-center gap-1.5">
                        <Label htmlFor="gender">Gender</Label>
                        <Select value={gender} onValueChange={setGender}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
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

                <div className="grid w-full max-w-sm lg:max-w-lg items-center gap-1.5 cursor-not-allowed mt-2">
                    <Button className={`text-white cursor-pointer`}
                        onClick={handleUpdateProfile} disabled={updatingProfile}>
                        Save Changes
                    </Button>
                </div>

            </div>
            <ChangeIcon
                isOpen={isDialogOpen}
                onClose={closeDialog}
            />
        </div>
    )
}

export default EditProfile