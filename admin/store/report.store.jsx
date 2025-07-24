import { create } from "zustand";
import axios from "axios";

import { toast } from "sonner";

import ToastSuccessful from "../src/components/util/ToastSuccessful.jsx";
import ToastUnsuccessful from "../src/components/util/ToastUnsuccessful";
import ToastPending from "../src/components/util/ToastPending.jsx";

const URI = import.meta.env.VITE_URI;

const useReportStore = create((set) => ({
    reports: [],
    fetchingReports: false,
    fetchReports: async () => {
        set({ fetchingReports: false });
        const toastId = toast.custom((t) => (
            <ToastPending dismiss={() => toast.dismiss(t)} title={"Fetching Reports"} message="This might take a while..." />));
        try {
            const res = await axios.get(`${URI}/api/v1/report`);
            set({ reports: res.data.data });
        } catch (error) {
            console.log("Error fetching reports:", error);
            toast.custom((t) => (
                <ToastUnsuccessful dismiss={() => toast.dismiss(t)} title={"Fetching Reports Unsuccessful"} message={error.response.data.message} />
            ));
            return false;
        } finally {
            set({ fetchingReports: false });
            toast.dismiss(toastId);
        }
    }
}));

export default useReportStore;