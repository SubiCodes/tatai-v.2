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
        set({ fetchingReports: true });
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
    },
    report: null,
    fetchingReport: false,
    fetchReport: async ( id ) => {
        set({ fetchingReport: true });
        const toastId = toast.custom((t) => (
            <ToastPending dismiss={() => toast.dismiss(t)} title={"Fetching Report"} message="This might take a while..." />));
        try {
            const res = await axios.get(`${URI}/api/v1/report/${id}`);
            console.log("fetched report: ", res.data.data);
            set({ report: res.data.data });
        } catch (error) {
            console.log("Error fetching report:", error);
            toast.custom((t) => (
                <ToastUnsuccessful dismiss={() => toast.dismiss(t)} title={"Fetching Report Unsuccessful"} message={error.response.data.message} />
            ));
            return false;
        } finally {
            set({ fetchingReport: false });
            toast.dismiss(toastId);
        }
    },
    updatingReportStatus: false,
    updateReportStatus: async (id, reviewed) => {
        set({ updatingReportStatus: true });
        const toastId = toast.custom((t) => (
            <ToastPending dismiss={() => toast.dismiss(t)} title={"Updating Report Status"} message="This might take a while..." />));
        try {
            const res = await axios.put(`${URI}/api/v1/report/${id}`, { reviewed });
            set((state) => ({
                reports: state.reports.map((report) =>
                    report._id === id ? { ...report, reviewed: res.data.data.reviewed } : report
                )
            }));
            toast.custom((t) => (
                <ToastSuccessful dismiss={() => toast.dismiss(t)} title={"Report Status Updated"} message={res.data.message} />
            ));
        } catch (error) {
            console.log("Error updating report:", error);
            toast.custom((t) => (
                <ToastUnsuccessful dismiss={() => toast.dismiss(t)} title={"Updating Report Unsuccessful"} message={error.response.data.message} />
            ));
        } finally {
            set({ updatingReportStatus: false });
            toast.dismiss(toastId);
        }
    }
}));

export default useReportStore;