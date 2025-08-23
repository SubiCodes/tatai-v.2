import { create } from "zustand";
import axios from "axios";

import { toast } from "sonner";

import ToastSuccessful from "../src/components/util/ToastSuccessful.jsx";
import ToastUnsuccessful from "../src/components/util/ToastUnsuccessful";
import ToastPending from "../src/components/util/ToastPending.jsx";

const URI = import.meta.env.VITE_URI;

const useDashboardStore = create((set) => ({
    fetchingDashboardData: false,
    dashboardData: null,
    fetchDashboardData: async () => {
        set({ fetchingDashboardData: true });
        const toastId = toast.custom((t) => (
            <ToastPending dismiss={() => toast.dismiss(t)} title={"Fetching Dashboard Data"} message="Please wait..." />));
        try {
            const res = await axios.get(`${URI}/api/v1/dashboardAdmin`);
            console.log(res.data);
            set({ dashboardData: res.data });
            toast.custom((t) => (
                <ToastSuccessful dismiss={() => toast.dismiss(t)} title={"Fetch Successful!"} message="Dashboard Data Fetched Successfully" />
            ));
        } catch (error) {
            console.log("Error fetching dashboard data:", error);
            toast.custom((t) => (
                <ToastUnsuccessful dismiss={() => toast.dismiss(t)} title={"Fetching Dashboard Data Failed"} message={error.response?.data?.message || error.message} />
            ));
            return false;
        } finally {
            set({ fetchingDashboardData: false });
            toast.dismiss(toastId);
        }
    }
}));

export default useDashboardStore;   