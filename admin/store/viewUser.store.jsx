import { create } from "zustand";
import axios from "axios";

import ToastUnsuccessful from "../src/components/util/ToastUnsuccessful";
import ToastSuccessful from "../src/components/util/ToastSuccessful";
import ToastPending from "../src/components/util/ToastPending";
import { toast } from "sonner";

const useViewUserStore = create((set) => ({
    userData: null,
    fetchingUserData: false,
    fetchUserData: async (id) => {
        set({ fetchingUserData: true });
        const toastId = toast.custom((t) => (
            <ToastPending dismiss={() => toast.dismiss(t)} title={"Fetching user data"} message="This might take a while..." />));
        try {
            const res = await axios.get(`${import.meta.env.VITE_URI}/api/v1/viewUserAdmin/${id}`);
            set({ userData: res.data });
            return res.data;
        } catch (error) {
            console.error("Error fetching user data:", error);
            toast.custom((t) => (
                <ToastUnsuccessful dismiss={() => toast.dismiss(t)} title={"User Data Fetch Unsuccessful"} message={error.response.data.message} />
            ));
            return false;
        } finally {
            set({ fetchingUserData: false });
            toast.dismiss(toastId);
        }
    }
}));

export default useViewUserStore;