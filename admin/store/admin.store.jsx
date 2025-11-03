import { create } from "zustand";
import axios from "axios";

import { toast } from "sonner";

import ToastSuccessful from "../src/components/util/ToastSuccessful.jsx";
import ToastUnsuccessful from "../src/components/util/ToastUnsuccessful";
import ToastPending from "../src/components/util/ToastPending.jsx";

const getAdminData = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_URI}/api/v1/profileAdmin/admin`, {
            withCredentials: true,
        });
        useAdminStore.setState({ admin: response.data.data });
    } catch (error) {
        console.error("Error fetching admin data:", error);
        toast.custom((t) => (
            <ToastUnsuccessful dismiss={() => toast.dismiss(t)} title={"Error Fetching Admin Data"} message={error.response?.data?.message || error.message} />));
    }
};

const useAdminStore = create((set) => ({
    admin: null,
    isLoggingIn: false,
    updatingIcon: false,
    updatingProfile: false,
    updatingPassword: false,
    sendingResetPasswordLink: false,
    checkingResetTokenValidity: true,
    resettingPassword: false,
    logIn: async (email, password, navigate, forceLogin = false) => {
        set({ isLoggingIn: true })
        try {
            const response = await axios.post(`${import.meta.env.VITE_URI}/api/v1/authAdmin/signin`, {
                email,
                password,
                forceLogin
            }, {
                withCredentials: true
            });

            if (response.data.success) {
                console.log("Login successful:", response.data);
                await getAdminData();
                navigate('/dashboard');
                toast.custom((t) => (
                    <ToastSuccessful dismiss={() => toast.dismiss(t)} title={"Login Successful"} message={response.data.message} />
                ))
                return { success: true };
            };
        } catch (error) {
            console.error("Error during login:", error);
            const errorMessage = error.response?.data?.message || "An error occurred during login";
            const isAccountInUse = error.response?.data?.accountInUse || false;
            
            if (!isAccountInUse) {
                toast.custom((t) => (
                    <ToastUnsuccessful 
                        dismiss={() => toast.dismiss(t)} 
                        title={"Login Unsuccessful"} 
                        message={errorMessage} 
                    />
                ))
            }
            
            return { success: false, accountInUse: isAccountInUse, message: errorMessage };
        } finally {
            set({ isLoggingIn: false })
        }
    },
    checkCookie: async (navigate) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_URI}/api/v1/authAdmin/cookie`, {
                withCredentials: true
            });
            if (response.data.authenticated) {
                await getAdminData();
                navigate('/dashboard');
            }
        } catch (error) {
            console.error("Error checking cookie:", error);
        }
    },
    sendResetPasswordLink: async (email) => {
        set({ sendingResetPasswordLink: true });
        const toastId = toast.custom((t) => (
            <ToastPending dismiss={() => toast.dismiss(t)} title={"Sending link"} message="This might take a while..." />));
        try {
            const response = await axios.post(`${import.meta.env.VITE_URI}/api/v1/authAdmin/password`, { email });
            toast.custom((t) => (
                <ToastSuccessful dismiss={() => toast.dismiss(t)} title={"Reset Password Link Sent"} message={response.data.message} />
            ));
            return true;
        } catch (error) {
            console.error("Error sending reset password link:", error);
            toast.custom((t) => (
                <ToastUnsuccessful dismiss={() => toast.dismiss(t)} title={"Sending link unsuccessful"} message={error.response.data.message} />
            ));
            return false;
        } finally {
            set({ sendingResetPasswordLink: false });
            toast.dismiss(toastId);
        }
    },
    checkResetTokenValidity: async (token, navigate) => {
        set({ checkingResetTokenValidity: true });
        try {
            console.log(`${import.meta.env.VITE_URI}/api/v1/authAdmin/password/${token}`);
            const res = await axios.post(`${import.meta.env.VITE_URI}/api/v1/authAdmin/password/${token}`);
            console.log(res.data.message);
            return true;
        } catch (error) {
            console.error("Error checking reset token validity:", error);
            toast.custom((t) => (
                <ToastUnsuccessful dismiss={() => toast.dismiss(t)} title={"Invalid reset token!"} message={error.response.data.message} />
            ));
            navigate('/');
        }
    },
    resetPassword: async (token, newPassword, navigate) => {
        set({resettingPassword: true})
        const toastId = toast.custom((t) => (
            <ToastPending dismiss={() => toast.dismiss(t)} title={"Resetting Password"} message="This might take a while..." />));
        try {
            const response = await axios.post(`${import.meta.env.VITE_URI}/api/v1/authAdmin/reset/${token}`, { newPassword });
            toast.custom((t) => (
                <ToastSuccessful dismiss={() => toast.dismiss(t)} title={"Password Reset Successful"} message={response.data.message} />
            ));
            navigate('/');
            return true;
        } catch (error) {
            console.error("Error resetting password:", error);
            toast.custom((t) => (
                <ToastUnsuccessful dismiss={() => toast.dismiss(t)} title={"An errror has occured!"} message={error.response.data.message} />
            ));
        } finally{
            set({resettingPassword: false});
            toast.dismiss(toastId);
        }
    },
    updateIcon: async (icon, id, admin) => {
        set({ updatingIcon: true });
        const toastId = toast.custom((t) => (
            <ToastPending dismiss={() => toast.dismiss(t)} title={"Changing icon"} message="This might take a while..." />));
        try {
            const response = await axios.post(`${import.meta.env.VITE_URI}/api/v1/profileAdmin/icon/${id}`, { icon });
            admin.profileIcon = icon;
            toast.custom((t) => (
                <ToastSuccessful dismiss={() => toast.dismiss(t)} title={"Icon Update Successful"} message={response.data.message} />
            ))
        } catch (error) {
            console.log("Error updating icon:", error);
            toast.custom((t) => (
                <ToastUnsuccessful dismiss={() => toast.dismiss(t)} title={"Icon Update Unsuccessful"} message={error.response.data.message} />
            ))
        } finally {
            set({ updatingIcon: false });
            toast.dismiss(toastId);
        }
    },
    updateProfile: async (data, id) => {
        set({ updatingProfile: true });
        const toastId = toast.custom((t) => (
            <ToastPending dismiss={() => toast.dismiss(t)} title={"Updating profile"} message="This might take a while..." />));
        try {
            const response = await axios.post(`${import.meta.env.VITE_URI}/api/v1/profileAdmin/admin/${id}`, { data });
            set({ admin: response.data.data });
            toast.custom((t) => (
                <ToastSuccessful dismiss={() => toast.dismiss(t)} title={"Profile Update Successful"} message={response.data.message} />
            ))
        } catch (error) {
            console.log("Error updating icon:", error);
            toast.custom((t) => (
                <ToastUnsuccessful dismiss={() => toast.dismiss(t)} title={"Profile Update Unsuccessful"} message={error.response.data.message} />
            ))
        } finally {
            set({ updatingProfile: false });
            toast.dismiss(toastId);
        }
    },

    updatePassword: async (data, id) => {
        set({ updatingPassword: true });
        const toastId = toast.custom((t) => (
            <ToastPending dismiss={() => toast.dismiss(t)} title={"Updating password"} message="This might take a while..." />));
        try {
            const response = await axios.post(`${import.meta.env.VITE_URI}/api/v1/profileAdmin/password/${id}`, data);
            toast.custom((t) => (
                <ToastSuccessful dismiss={() => toast.dismiss(t)} title={"Password Update Successful"} message={response.data.message} />
            ));
            return response.data.message;
        } catch (error) {
            console.log("Error updating password:", error);
            toast.custom((t) => (
                <ToastUnsuccessful dismiss={() => toast.dismiss(t)} title={"Password Update Unsuccessful"} message={error.response.data.message} />
            ));
            return error.response.data.message;
        } finally {
            set({ updatingPassword: false });
            toast.dismiss(toastId);
        }
    },

}));

export default useAdminStore;
export { getAdminData };