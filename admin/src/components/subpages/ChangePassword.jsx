import React, { useState } from 'react'

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { toast } from 'sonner'
import { Info } from 'lucide-react'
import ToastUnsuccessful from '../util/ToastUnsuccessful.jsx'

import useAdminStore from '../../../store/admin.store.jsx'

function ChangePassword() {

  const [strength, setStrength] = useState('Weak');

  //Password Checker
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

  const { admin, updatePassword, updatingPassword } = useAdminStore();

  const [currentPassword, setCurrentPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [currentPasswordError, setCurrentPasswordError] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [newPasswordError, setNewPasswordError] = useState(false);

  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);

  const clear = () => {
    setCurrentPassword("");
    setShowCurrentPassword(false);
    setCurrentPasswordError(false);

    setNewPassword("");
    setShowNewPassword(false);
    setNewPasswordError(false);

    setConfirmPassword("");
    setShowConfirmPassword(false);
    setConfirmPasswordError(false);
  };

  const handleNewPasswordChange = (e) => {
    const value = e.target.value;
    setNewPassword(value);
    setStrength(getPasswordStrength(value));
  };


  const handleChangePassword = async () => {
    console.log("Current Password: ", currentPassword);
    console.log("New Password: ", newPassword);

    setCurrentPasswordError(false);
    setNewPasswordError(false);
    setConfirmPasswordError(false);

    const data = { currentPassword: currentPassword, newPassword: newPassword };

    let valid = true;

    if (!currentPassword.trim()) {
      setCurrentPasswordError(true);
      toast.custom((t) => (<ToastUnsuccessful dismiss={() => toast.dismiss(t)} title={"Validation Failed"} message={"Current password required."} />))
      valid = false;
    }
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

    if (valid) {
      console.log("Admin ID: ", admin);
      const result = await updatePassword(data, admin._id);
      if (result === "Current password input does not match with your current password.") {
        setCurrentPasswordError(true);
        return
      }
      clear();
    }
  }

  return (
    <div className='w-full h-full flex flex-col items-center justify-center gap-0'>
      <div className="grid w-full max-w-md items-start gap-1.5 mb-2">
        <h1 className='text-start font-bold text-2xl'>Current Password</h1>
      </div>

      <div className="grid w-full max-w-md items-center gap-1.5 mb-2">
        <Label htmlFor="email">Password</Label>
        <Input type={`${!showCurrentPassword ? 'password' : 'text'}`} placeholder="Enter your current password..." className={`${currentPasswordError && "border-red-400"}`}
          onChange={(e) => { setCurrentPassword(e.target.value) }} value={currentPassword}/>
        <div className='w-full max-w-md flex flex-row items-center gap-2'>
          <div className='flex-1' />
          <Checkbox id="terms" className="text-white border border-black data-[state=checked]:bg-secondary" onCheckedChange={() => setShowCurrentPassword(!showCurrentPassword)} />
          <label
            htmlFor="terms"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Show password
          </label>
        </div>
      </div>

      <div className="grid w-full max-w-md items-start gap-1.5 mb-4">
        <h1 className='text-start font-bold text-2xl'>New Password</h1>
        <span className='text-sm text-gray-500'>Password must contain 8 characters with alphanumeric contents.</span>
      </div>

      <div className="grid w-full max-w-md items-center gap-1.5 mb-2">
        <Label htmlFor="email">Password</Label>
        <Input type={`${!showNewPassword ? 'password' : 'text'}`} placeholder="Enter your new password..." className={`${newPasswordError && "border-red-400"}`}
          onChange={handleNewPasswordChange} value={newPassword}/>
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

      <div className="grid w-full max-w-md items-center gap-1.5 mb-6">
        <Label htmlFor="email">Password</Label>
        <Input type={`${!showConfirmPassword ? 'password' : 'text'}`} placeholder="Confirm your password..." className={`${confirmPasswordError && "border-red-400"}`}
          onChange={(e) => { setConfirmPassword(e.target.value) }} value={confirmPassword}/>
        <div className='w-full max-w-md flex flex-row items-center gap-2'>
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

      <div className="grid w-full max-w-md items-center gap-1.5">
        <Button className={`text-white  ${updatingPassword ? 'cursor-not-allowed bg-primary/50' : 'cursor-pointer'}`}
          onClick={handleChangePassword}
          disabled={updatingPassword}>
          Change Password
        </Button>
      </div>
    </div>
  )
}

export default ChangePassword