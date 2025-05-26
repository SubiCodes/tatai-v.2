import { create } from "zustand";
import axios from "axios";

import { toast } from "sonner";

import ToastSuccessful from "../src/components/util/ToastSuccessful.jsx";
import ToastUnsuccessful from "../src/components/util/ToastUnsuccessful";

const getAdminData = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_URI}/api/v1/userAdmin/admin`, {
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
    logIn: async (email, password, navigate) => {
        set({ isLoggingIn: true })
        try {
            const response = await axios.post(`${import.meta.env.VITE_URI}/api/v1/authAdmin/signin`, {
                email,
                password
            }, {
                withCredentials: true
            });

            if (response.data.success) {
                console.log("Login successful:", response.data);
                await getAdminData();
                navigate('/dashboard');
                toast.custom((t) => (
                    <ToastSuccessful dismiss={() => toast.dismiss(t)} title={"Login Successful"} message={"Welcome Admin!"} />
                ))
                return true;
            };
        } catch (error) {
            console.error("Error during login:", error);
            toast.custom((t) => (
                <ToastUnsuccessful dismiss={() => toast.dismiss(t)} title={"Login Unsuccessful"} message={error.response.data.message} />
            ))
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
    }
}));

export default useAdminStore;
export { getAdminData };